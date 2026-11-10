"use client";

/**
 * Booking request → WhatsApp, the official 9WERKS booking workflow.
 * Nothing is submitted to a server. The visitor's details are composed into a
 * WhatsApp message to the official number; they send it, and the crew replies
 * to confirm. The confirmation panel says so plainly.
 *
 * Validation runs synchronously inside the submit event so WhatsApp opens
 * within the user's gesture (iOS Safari blocks pop-ups opened after an await).
 */
import { Suspense, useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Copy, Phone, RotateCcw } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/forms/Field";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { resolveService, services } from "@/content/services";
import { contact } from "@/content/site";
import { composeMessage, formatDateForMessage, whatsappUrl } from "@/lib/whatsapp";
import { isWeekendDate, workshopToday } from "@/lib/hours";
import { PHONE_ERROR, isValidPhone, nameField } from "@/lib/validation";
import { cn } from "@/lib/cn";

const OTHER = "other";
const TIMES = [
  { value: "any", label: "Any time" },
  { value: "morning", label: "Morning (9 AM – 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 – 4 PM)" },
  { value: "evening", label: "Evening (4 – 9 PM, weekdays)" },
] as const;
const WEEKEND_ERROR = "On Saturdays and Sundays we're open 9:00 AM – 12:00 PM — choose Morning or Any time.";

const schema = z
  .object({
    name: nameField,
    phone: z.string().trim().min(1, "Please enter your phone number.").refine(isValidPhone, PHONE_ERROR),
    car: z.string().trim().min(2, "Please enter your car's make and model.").max(80, "Please keep this under 80 characters."),
    service: z.string().min(1, "Please choose a service."),
    date: z.string(),
    time: z.string(),
    notes: z.string().trim().max(1500, "Please keep this under 1,500 characters."),
  })
  .superRefine((v, ctx) => {
    if (v.date && v.date < workshopToday()) {
      ctx.addIssue({ code: "custom", path: ["date"], message: "Please choose today or a later date." });
    }
    if (v.date && isWeekendDate(v.date) && (v.time === "afternoon" || v.time === "evening")) {
      ctx.addIssue({ code: "custom", path: ["time"], message: WEEKEND_ERROR });
    }
  });

type Values = z.infer<typeof schema>;

const serviceOptions = [...services.map((s) => ({ value: s.slug, label: s.title })), { value: OTHER, label: "Other / not sure" }];

function serviceLabel(value: string) {
  return value === OTHER ? "Other / not sure" : (services.find((s) => s.slug === value)?.title ?? value);
}

function compose(v: Values) {
  return composeMessage("Hi 9WERKS, I'd like to book a service.", [
    { label: "Name", value: v.name },
    { label: "Phone", value: v.phone },
    { label: "Car", value: v.car },
    { label: "Service", value: serviceLabel(v.service) },
    { label: "Preferred date", value: v.date ? formatDateForMessage(v.date) : "" },
    { label: "Preferred time", value: TIMES.find((t) => t.value === v.time && t.value !== "any")?.label ?? "" },
    { label: "Notes", value: v.notes },
  ]);
}

/** Pre-selects the service from ?service=<slug|legacy id> (needs a Suspense boundary in static export). */
function ServiceFromQuery({ onService }: { onService: (slug: string) => void }) {
  const params = useSearchParams();
  const requested = params.get("service");
  useEffect(() => {
    const s = resolveService(requested);
    if (s) onService(s.slug);
  }, [requested, onService]);
  return null;
}

export function BookingForm() {
  const { register, getValues, setValue, handleSubmit, control, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { name: "", phone: "", car: "", service: "", date: "", time: "any", notes: "" },
  });
  const { errors } = formState;
  const [sent, setSent] = useState<{ url: string; text: string; opened: boolean } | null>(null);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const [busy, setBusy] = useState(false);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const statusRef = useRef<HTMLHeadingElement>(null);
  const date = useWatch({ control, name: "date" });
  const prefill = useCallback((slug: string) => setValue("service", slug, { shouldValidate: false }), [setValue]);
  const weekend = Boolean(date && isWeekendDate(date));

  // `min` depends on the visitor's clock; set it after hydration (no server/client mismatch).
  useEffect(() => {
    const id = requestAnimationFrame(() => setMinDate(workshopToday()));
    return () => cancelAnimationFrame(id);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(getValues());
    if (!parsed.success) {
      // Let RHF mark the form submitted, render errors and focus the first invalid field.
      void handleSubmit(() => {})();
      return;
    }
    setBusy(true);
    const text = compose(parsed.data);
    const url = whatsappUrl(text);
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    setSent({ url, text, opened: Boolean(win) });
    setBusy(false);
    setCopied("idle");
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(sent.text);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
  };

  if (sent) {
    return (
      <div className="border border-line-strong p-6 sm:p-10" role="status" aria-live="polite">
        <p className="label text-accent-text">Booking request ready</p>
        <h3 ref={statusRef} tabIndex={-1} className="mt-4 font-display text-display-sm outline-none">
          {sent.opened ? "Your booking request is ready in WhatsApp" : "Your booking request is ready"}
        </h3>
        <p className="mt-5 text-fg text-pretty">
          {sent.opened
            ? "Tap Send in WhatsApp to deliver it."
            : "Your browser blocked the new tab — use the button below to open WhatsApp, then tap Send."}
        </p>
        <p className="mt-3 text-fg-muted text-pretty">
          This is a request, not a confirmed booking. The 9WERKS crew will reply on WhatsApp to confirm your slot.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={sent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-3 bg-bronze px-6 text-[0.75rem] font-[560] uppercase tracking-[0.12em] text-ink-950 transition-colors hover:bg-champagne"
          >
            <WhatsAppIcon className="size-4" /> {sent.opened ? "Open WhatsApp again" : "Open WhatsApp"}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Button variant="secondary" onClick={copy} icon={copied === "done" ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" strokeWidth={1.5} />}>
            {copied === "done" ? "Message copied" : "Copy message"}
          </Button>
          <a href={contact.phone.href} className="inline-flex min-h-12 items-center justify-center gap-3 border border-line-strong px-6 text-[0.75rem] font-[560] uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent">
            <Phone aria-hidden="true" className="size-4" strokeWidth={1.5} /> Call instead
          </a>
          <Button variant="ghost" onClick={() => setSent(null)} icon={<RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.5} />}>
            Edit details
          </Button>
        </div>
        {copied === "failed" && <p className="mt-4 text-sm text-error">Couldn&apos;t copy automatically — please select the message in WhatsApp instead.</p>}
        <details className="mt-8 border-t border-line pt-5">
          <summary className="label cursor-pointer text-fg-muted">Show the message</summary>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm text-fg-muted">{sent.text}</pre>
        </details>
      </div>
    );
  }

  return (
    <form id="booking-form" noValidate onSubmit={onSubmit} aria-label="Book a service" className="space-y-9" aria-busy={busy}>
      <Suspense fallback={null}>
        <ServiceFromQuery onService={prefill} />
      </Suspense>
      <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-8">
        <TextField id="b-name" label="Full name" required autoComplete="name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
        <TextField id="b-phone" label="Phone number" required type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" error={errors.phone?.message} {...register("phone")} />
        <TextField id="b-car" label="Car make and model" required placeholder="e.g. Porsche 911 Carrera" error={errors.car?.message} {...register("car")} />
        <SelectField id="b-service" label="Service" required placeholder="Choose a service" options={serviceOptions} error={errors.service?.message} {...register("service")} />
        <TextField id="b-date" label="Preferred date" type="date" min={minDate} error={errors.date?.message} {...register("date")} />
        <SelectField
          id="b-time"
          label="Preferred time"
          options={TIMES.map((t) => ({ value: t.value, label: t.label }))}
          hint={weekend ? "Weekend hours: 9:00 AM – 12:00 PM." : "Mon – Fri 9 AM – 9 PM · Sat – Sun 9 AM – 12 PM"}
          error={errors.time?.message}
          {...register("time")}
        />
      </div>
      <TextAreaField id="b-notes" label="Additional information" rows={4} placeholder="Noises, warning lights, last service date…" error={errors.notes?.message} {...register("notes")} />

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Button type="submit" size="lg" disabled={busy} icon={<WhatsAppIcon className="size-4" />} className={cn(busy && "cursor-progress")}>
          {busy ? "Opening WhatsApp…" : (<><span className="sm:hidden">Send on WhatsApp</span><span className="hidden sm:inline">Send booking request on WhatsApp</span></>)}
        </Button>
        <a href={contact.phone.href} className="inline-flex min-h-14 items-center justify-center gap-3 border border-line-strong px-8 text-[0.8125rem] font-[560] uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent">
          <Phone aria-hidden="true" className="size-4" strokeWidth={1.5} />
          <span className="tabular">Call {contact.phone.display}</span>
        </a>
      </div>
      <p className="text-sm text-fg-subtle text-pretty">
        This opens WhatsApp with your details filled in — just tap Send. Nothing is stored on this website. The crew will reply to confirm your slot.
      </p>
    </form>
  );
}
