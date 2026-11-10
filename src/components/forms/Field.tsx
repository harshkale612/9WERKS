/**
 * Editorial form fields — hairline underline inputs with visible labels,
 * hints and errors wired for assistive technology. Designed for
 * react-hook-form: spread `register("name")` into the field (React 19 passes
 * `ref` as a prop).
 *
 *   <TextField label="Full name" required error={errors.name?.message} {...register("name")} />
 */
import type { ComponentPropsWithRef, ReactNode } from "react";
import { CircleAlert, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

export const fieldIds = (id: string) => ({ hint: `${id}-hint`, error: `${id}-error` });

function FieldShell({ id, label, required, hint, error, className, children }: FieldShellProps) {
  const ids = fieldIds(id);
  return (
    <div className={cn("group/field relative", className)}>
      <label htmlFor={id} className="label-lg flex items-baseline gap-2 text-fg-muted transition-colors group-focus-within/field:text-fg">
        {label}
        {required ? (
          <span className="text-accent-text" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="label normal-case tracking-normal text-fg-subtle">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={ids.hint} className="mt-2 text-sm text-fg-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={ids.error} className="mt-2 flex items-start gap-2 text-sm text-error" role="alert">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}
    </div>
  );
}

const control =
  "mt-2 block w-full rounded-none border-0 border-b border-line-strong bg-transparent px-0 py-3 text-lg text-fg placeholder:text-fg-subtle/70 transition-[border-color] duration-300 focus:border-accent focus:outline-none focus-visible:outline-none aria-invalid:border-error";

function describedBy(id: string, hint?: ReactNode, error?: string) {
  const ids = fieldIds(id);
  return [error ? ids.error : null, hint && !error ? ids.hint : null].filter(Boolean).join(" ") || undefined;
}

type TextFieldProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
} & Omit<ComponentPropsWithRef<"input">, "id" | "className">;

export function TextField({ id, label, hint, error, required, className, ...input }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <input
        id={id}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={control}
        {...input}
      />
    </FieldShell>
  );
}

type TextAreaProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
} & Omit<ComponentPropsWithRef<"textarea">, "id" | "className">;

export function TextAreaField({ id, label, hint, error, required, className, rows = 4, ...textarea }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, "min-h-28 resize-y leading-relaxed")}
        {...textarea}
      />
    </FieldShell>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
} & Omit<ComponentPropsWithRef<"select">, "id" | "className" | "children">;

export function SelectField({ id, label, hint, error, required, className, options, placeholder, ...select }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(control, "cursor-pointer appearance-none pr-10 [&>option]:bg-ink-900 [&>option]:text-ivory")}
          {...select}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-fg-muted" strokeWidth={1.5} />
      </div>
    </FieldShell>
  );
}
