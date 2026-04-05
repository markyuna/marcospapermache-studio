import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export function getResendFromEmail() {
  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL environment variable");
  }

  return from;
}

export function getResendToEmail() {
  const to = process.env.RESEND_TO_EMAIL;

  if (!to) {
    throw new Error("Missing RESEND_TO_EMAIL environment variable");
  }

  return to;
}