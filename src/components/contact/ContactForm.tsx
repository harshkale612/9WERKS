"use client";

/**
 * Contact form → WhatsApp (or email). Nothing is sent to a server: the
 * message is composed in the browser and handed to WhatsApp / the mail app,
 * where the visitor sends it themselves.
 *
 * Validation runs synchronously inside the submit event so WhatsApp can open
 * within the user's gesture (iOS Safari blocks pop-ups opened after an await).
 */
import { useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { TextAreaField, TextField } from "@/components/forms/Field";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { composeMessage, mailtoUrl, whatsappUrl } from "@/lib/whatsapp";
import { PHONE_ERROR, isValidPhone, nameField } from "@/lib/validation";
import { contact } from "@/content/site";

const schema = z.object({
  name: nameField,
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || isValidPhone(v), PHONE_ERROR),
  subject: z.string().trim().max(120, "Please keep the subject under 120 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail (at least 10 characters).")
    .max(1500, "Please keep your message under 1,500 characters."),
});

type Values = z.infer<typeof schema>;

function compose(v: Values) {
  return composeMessage("Hi 9WERKS, I have a question.", [
    { label: "Name", value: v.name },
    { label: "Phone", value: v.phone },
    { label: "Subject", value: v.subject },
    { label: "Message", value: v.message },
  ]);
}

export function ContactForm() {
  const { register, getValues, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { name: "", phone: "", subject: "", message: "" },
  });
  const { errors } = formState;
  const [sent, setSent] = useState<{ url: string; mail: string; opened: boolean } | null>(null);
  const statusRef = useRef<HTMLHeadingElement>(null);

  /** Validate synchronously; on failure show errors and focus the first invalid field. */
  const validate = (): Values | null => {
    const parsed = schema.safeParse(getValues());
    if (parsed.success) return parsed.data;
    // Let RHF mark the form submitted, render errors and focus the first invalid field.
    void handleSubmit(() => {})();
    return null;
  };

  const onWhatsApp = (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (!v) return;
    const text = compose(v);
    const url = whatsappUrl(text);
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    setSent({ url, mail: mailtoUrl(v.subject || "Question for 9WERKS", text), opened: Boolean(win) });
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const onEmail = () => {
    const v = validate();
    if (!v) return;
    window.location.href = mailtoUrl(v.subject || "Question for 9WERKS", compose(v));
  };

  if (sent) {
    return (
      <div className="border border-line-strong p-6 sm:p-10" role="status" aria-live="polite">
        <p className="label text-accent-text">Message ready</p>
        <h3 ref={statusRef} tabIndex={-1} className="mt-4 font-display text-display-sm outline-none">
          {sent.opened ? "WhatsApp is open with your message" : "Your message is ready for WhatsApp"}
        </h3>
        <p className="mt-4 text-fg-muted text-pretty">
          {sent.opened
            ? "Tap Send in WhatsApp to deliver it — the crew will get back to you as soon as possible."
            : "Your browser blocked the new tab. Use the button below to open WhatsApp, then tap Send."}
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
          <a href={sent.mail} className="inline-flex min-h-12 items-center justify-center gap-3 border border-line-strong px-6 text-[0.75rem] font-[560] uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent">
            <Mail aria-hidden="true" className="size-4" strokeWidth={1.5} /> Send by email instead
          </a>
          <Button variant="ghost" onClick={() => setSent(null)}>
            Edit message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onWhatsApp} aria-label="Contact 9WERKS" className="space-y-9">
      <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-8">
        <TextField id="c-name" label="Full name" required autoComplete="name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
        <TextField id="c-phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" error={errors.phone?.message} {...register("phone")} />
      </div>
      <TextField id="c-subject" label="Subject" placeholder="e.g. Quote for brake pads" error={errors.subject?.message} {...register("subject")} />
      <TextAreaField id="c-message" label="Message" required rows={5} placeholder="How can we help?" error={errors.message?.message} {...register("message")} />
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Button type="submit" size="lg" icon={<WhatsAppIcon className="size-4" />}>
          Send on WhatsApp
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={onEmail} icon={<Mail aria-hidden="true" className="size-4" strokeWidth={1.5} />}>
          Email instead
        </Button>
      </div>
      <p className="text-sm text-fg-subtle text-pretty">
        Opens WhatsApp (or your email app) with your message filled in — nothing is stored on this website. Prefer to talk? Call{" "}
        <a href={contact.phone.href} className="tabular text-fg underline decoration-line-strong underline-offset-4">
          {contact.phone.display}
        </a>
        .
      </p>
    </form>
  );
}
