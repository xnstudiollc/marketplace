import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const fieldBox =
  "glass-subtle flex min-h-11 w-full items-center gap-2 rounded-xl px-3 transition-colors focus-within:border-brand/60 has-[[aria-invalid=true]]:border-danger/70";
export const fieldInput = "h-11 w-full min-w-0 bg-transparent text-base text-fg outline-none placeholder:text-fg-subtle sm:text-[0.9375rem]";

export function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: ReactNode }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="text-[0.8125rem] text-danger">
        {error}
      </p>
    );
  }
  return hint ? (
    <p id={`${id}-hint`} className="text-[0.8125rem] text-fg-subtle">
      {hint}
    </p>
  ) : null;
}

export function describedBy(id: string, error?: string, hint?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function TextField({
  id,
  label,
  error,
  hint,
  icon,
  className,
  optional,
  ...input
}: Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  icon?: ReactNode;
  optional?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-[0.8125rem] font-medium text-fg">
        <span className="min-w-0">{label}</span>
        {optional && <span className="text-xs font-normal text-fg-subtle">Optional</span>}
      </label>
      <div className={fieldBox}>
        {icon}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          className={fieldInput}
          {...input}
        />
      </div>
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
