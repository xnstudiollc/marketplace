"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setEmail("");
    toast.success("You're on the list", { description: "Demo only: no email will be sent." });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-2">
      <label htmlFor="newsletter-email" className="text-[0.8125rem] font-medium text-fg">
        Weekly deals, no spam
      </label>
      <div className="flex gap-2">
        <div className="glass-subtle flex h-11 flex-1 items-center gap-2 rounded-xl px-3 focus-within:border-brand/60">
          <Mail className="size-4 text-fg-subtle" aria-hidden />
          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "newsletter-error" : undefined}
            className="h-full w-full min-w-0 bg-transparent text-fg outline-none placeholder:text-fg-subtle"
          />
        </div>
        <Button type="submit" variant="secondary">
          Subscribe
        </Button>
      </div>
      {error && (
        <p id="newsletter-error" className="text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
