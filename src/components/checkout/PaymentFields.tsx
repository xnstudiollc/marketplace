"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bitcoin, Check, CreditCard, Lock, Wallet } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { TextField } from "@/components/checkout/Field";
import { formatCardNumber, formatExpiry, type CheckoutValues, type PaymentMethod } from "@/lib/checkout";
import { cn } from "@/lib/utils";

const METHODS: { id: PaymentMethod; label: string; description: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Card", description: "Visa, Mastercard and more", icon: CreditCard },
  { id: "wallet", label: "Wallet balance", description: "Pay from your Vaultline balance", icon: Wallet },
  { id: "crypto", label: "Crypto", description: "Settle with a supported coin", icon: Bitcoin },
];

export function PaymentFields({
  control,
  register,
  errors,
  payment,
}: {
  control: Control<CheckoutValues>;
  register: UseFormRegister<CheckoutValues>;
  errors: FieldErrors<CheckoutValues>;
  payment: PaymentMethod;
}) {
  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name="payment"
        render={({ field }) => (
          <RadioGroupPrimitive.Root
            value={field.value}
            onValueChange={(v) => field.onChange(v as PaymentMethod)}
            aria-label="Payment method"
            className="grid gap-2 sm:grid-cols-3"
          >
            {METHODS.map(({ id, label, description, icon: Icon }) => {
              const checked = field.value === id;
              return (
                <RadioGroupPrimitive.Item
                  key={id}
                  value={id}
                  className={cn(
                    "relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:flex-col sm:gap-2",
                    checked ? "border-brand bg-brand/10" : "glass-subtle hover:border-line-strong",
                  )}
                >
                  <Icon className={cn("size-5 shrink-0", checked ? "text-brand-2" : "text-fg-muted")} strokeWidth={1.75} aria-hidden />
                  <span className="min-w-0 pr-6 sm:pr-0">
                    <span className="block text-sm font-semibold text-fg">{label}</span>
                    <span className="block text-xs text-fg-subtle">{description}</span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-3 right-3 grid size-5 place-items-center rounded-full border",
                      checked ? "border-brand bg-brand text-white" : "border-line-strong",
                    )}
                  >
                    {checked && <Check className="size-3" strokeWidth={3} />}
                  </span>
                </RadioGroupPrimitive.Item>
              );
            })}
          </RadioGroupPrimitive.Root>
        )}
      />

      <AnimatePresence initial={false} mode="wait">
        {payment === "card" ? (
          <motion.div
            key="card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4 pt-1">
              <TextField
                id="card-name"
                label="Name on card"
                autoComplete="cc-name"
                className="col-span-2"
                error={errors.cardName?.message}
                {...register("cardName")}
              />
              <Controller
                control={control}
                name="cardNumber"
                render={({ field }) => (
                  <TextField
                    id="card-number"
                    label="Card number"
                    className="col-span-2"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    icon={<CreditCard className="size-4 shrink-0 text-fg-subtle" aria-hidden />}
                    error={errors.cardNumber?.message}
                    hint="Try 4242 4242 4242 4242."
                    name={field.name}
                    ref={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                  />
                )}
              />
              <Controller
                control={control}
                name="expiry"
                render={({ field }) => (
                  <TextField
                    id="card-expiry"
                    label="Expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    error={errors.expiry?.message}
                    name={field.name}
                    ref={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(formatExpiry(e.target.value, field.value))}
                  />
                )}
              />
              <TextField
                id="card-cvc"
                label="CVC"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
                placeholder="123"
                error={errors.cvc?.message}
                {...register("cvc")}
              />
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="other"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-subtle flex items-center gap-2 rounded-xl p-3.5 text-sm text-fg-muted"
          >
            <Lock className="size-4 shrink-0 text-fg-subtle" aria-hidden />
            {payment === "wallet"
              ? "Your demo wallet always has enough balance. Nothing is charged."
              : "You would see a payment address after placing the order. This demo skips that step."}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
