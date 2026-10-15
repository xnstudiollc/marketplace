"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FieldMessage, TextField, describedBy, fieldBox } from "@/components/checkout/Field";
import { PaymentFields } from "@/components/checkout/PaymentFields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LISTING_TYPE_META } from "@/lib/categories";
import { checkoutSchema, createOrderId, type CheckoutValues, type Order } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import type { ListingTypeId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { cartTotals, type CartItem } from "@/store/cart";
import { SITE } from "@/lib/site";

const DETAIL_LABEL: Partial<Record<ListingTypeId, { label: string; hint: string }>> = {
  currency: { label: "Character name", hint: "Include the server or realm if the game has one." },
  items: { label: "In-game username", hint: "The account the item should be traded or gifted to." },
  services: { label: "Account or character name", hint: "The seller confirms login details with you in the order chat." },
};

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`checkout-step-${step}`} className="glass rounded-2xl p-5 sm:p-6">
      <h2 id={`checkout-step-${step}`} className="mb-4 flex items-center gap-3 text-[1.0625rem] font-semibold text-fg">
        <span className="grid size-7 place-items-center rounded-full border border-line-strong font-mono text-xs" aria-hidden>
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CheckoutForm({ items, onPlaced }: { items: CartItem[]; onPlaced: (order: Order) => void }) {
  const needing = items.filter((i) => i.needsDeliveryDetails);
  const { total, subtotal, fee } = cartTotals(items);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      characters: needing.map(() => ""),
      notes: "",
      payment: "card",
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      terms: false,
    },
  });
  const payment = useWatch({ control, name: "payment" });

  const onSubmit = async (values: CheckoutValues) => {
    await wait(1200);
    onPlaced({ id: createOrderId(), email: values.email, payment: values.payment, items, subtotal, fee, total });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" aria-busy={isSubmitting}>
      <Section step={1} title="Contact">
        <TextField
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          label="Email"
          placeholder="you@example.com"
          hint="We send the receipt and order chat link here."
          icon={<Mail className="size-4 shrink-0 text-fg-subtle" aria-hidden />}
          error={errors.email?.message}
          {...register("email")}
        />
      </Section>

      <Section step={2} title="Delivery details">
        <div className="space-y-4">
          {needing.map((item, i) => {
            const copy = DETAIL_LABEL[item.type] ?? { label: "Delivery name", hint: "Where the seller should deliver." };
            const meta = LISTING_TYPE_META[item.type];
            return (
              <TextField
                key={item.id}
                id={`character-${i}`}
                autoComplete="off"
                label={
                  <>
                    {copy.label}
                    <span className="mt-0.5 block truncate text-xs font-normal text-fg-subtle">
                      <span style={{ color: meta.accent }}>{meta.label}</span> · {item.title}
                    </span>
                  </>
                }
                hint={copy.hint}
                error={errors.characters?.[i]?.message}
                {...register(`characters.${i}`)}
              />
            );
          })}
          {needing.length === 0 && (
            <p className="text-sm text-fg-muted">Nothing to fill in: codes and account details arrive in your order chat.</p>
          )}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="flex items-baseline justify-between text-[0.8125rem] font-medium text-fg">
              Notes for the seller <span className="text-xs font-normal text-fg-subtle">Optional</span>
            </label>
            <div className={cn(fieldBox, "items-stretch py-2")}>
              <textarea
                id="notes"
                rows={3}
                placeholder="Preferred trade time, platform, anything else the seller should know."
                aria-invalid={Boolean(errors.notes)}
                aria-describedby={describedBy("notes", errors.notes?.message)}
                className="field-sizing-content min-h-16 w-full resize-none bg-transparent text-base text-fg outline-none placeholder:text-fg-subtle sm:text-[0.9375rem]"
                {...register("notes")}
              />
            </div>
            <FieldMessage id="notes" error={errors.notes?.message} />
          </div>
        </div>
      </Section>

      <Section step={3} title="Payment">
        <PaymentFields control={control} register={register} errors={errors} payment={payment} />
      </Section>

      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <Checkbox
                id="terms"
                ref={field.ref}
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errors.terms)}
                aria-describedby={describedBy("terms", errors.terms?.message)}
                className="mt-0.5 size-5"
              />
            )}
          />
          <div className="space-y-1">
            <label htmlFor="terms" className="text-sm text-fg-muted">
              I agree to the demo terms and understand that {SITE.name} holds payment until I confirm delivery.
            </label>
            <FieldMessage id="terms" error={errors.terms?.message} />
          </div>
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-5 w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Placing order…
            </>
          ) : (
            <>
              <Lock className="size-4" aria-hidden /> Place order · <span className="tabular">{formatPrice(total)}</span>
            </>
          )}
        </Button>
        <p className="sr-only" aria-live="polite">
          {isSubmitting ? "Placing your order" : ""}
        </p>
      </div>
    </form>
  );
}
