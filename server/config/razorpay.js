import { env } from "./env.js";
import { emailConfigured } from "./email.js";
import { ApiError } from "../utils/validation.js";

export const paymentMode = () => env.payment.mode;
export const liveReady = () =>
  Boolean(
    env.payment.keyId &&
    env.payment.keySecret &&
    env.payment.webhookSecret &&
    env.ownerEmail &&
    emailConfigured(),
  );
export const paymentConfig = () => ({
  mode: paymentMode(),
  liveReady: liveReady(),
  keyId: paymentMode() === "live" && liveReady() ? env.payment.keyId : "",
  currency: "INR",
  demoNotice:
    "Simulated test only. No money moves; no real Razorpay verification occurs.",
});
export async function razorpay(path, opts = {}) {
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    ...opts,
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.payment.keyId}:${env.payment.keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    signal: AbortSignal.timeout(12000),
  });
  const data = await response.json();
  if (!response.ok)
    throw new ApiError(
      502,
      "The payment gateway could not process this request. Try again later.",
    );
  return data;
}
