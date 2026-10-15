import { z } from "zod";
import type { CartItem } from "@/store/cart";

export const PAYMENT_METHODS = ["card", "wallet", "crypto"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function luhnValid(digits: string): boolean {
  if (!/^\d{12,19}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** `now` is passed in so validation reads the clock only when the form is submitted. */
export function expiryValid(value: string, now: Date): boolean {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export const formatCardNumber = (raw: string) =>
  raw
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

export function formatExpiry(raw: string, previous: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits.length === 2 && raw.length > previous.length ? `${digits} / ` : digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export const checkoutSchema = z
  .object({
    email: z.string().trim().min(1, "Enter your email address.").pipe(z.email("Enter a valid email address.")),
    characters: z.array(
      z.string().trim().min(2, "Enter the name the seller should deliver to.").max(32, "Keep it under 32 characters."),
    ),
    notes: z.string().max(500, "Keep notes under 500 characters."),
    payment: z.enum(PAYMENT_METHODS),
    cardName: z.string(),
    cardNumber: z.string(),
    expiry: z.string(),
    cvc: z.string(),
    terms: z.boolean().refine((v) => v, "Accept the terms to place your order."),
  })
  .superRefine((v, ctx) => {
    if (v.payment !== "card") return;
    if (v.cardName.trim().length < 2) ctx.addIssue({ code: "custom", path: ["cardName"], message: "Enter the name on the card." });
    if (!luhnValid(v.cardNumber.replace(/\s/g, ""))) {
      ctx.addIssue({ code: "custom", path: ["cardNumber"], message: "That card number does not look right." });
    }
    if (!expiryValid(v.expiry, new Date())) {
      ctx.addIssue({ code: "custom", path: ["expiry"], message: "Use MM / YY, and a date that has not passed." });
    }
    if (!/^\d{3,4}$/.test(v.cvc)) ctx.addIssue({ code: "custom", path: ["cvc"], message: "Enter the 3 or 4 digit code." });
  });

export type CheckoutValues = z.infer<typeof checkoutSchema>;

export interface Order {
  id: string;
  email: string;
  payment: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  fee: number;
  total: number;
}

export const ORDER_KEY = "vaultline-order";
const ORDER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Called from the submit handler only, never during render. */
export function createOrderId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return `VL-${Array.from(bytes, (b) => ORDER_ALPHABET[b % ORDER_ALPHABET.length]).join("")}`;
}