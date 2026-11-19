/* layout.js — HTML shell, SEO metadata, the persistent navigation, and the contact footer. */
import MotionDirector from "@/components/ui/MotionDirector";
import "./globals.css";
import "@/styles/tailwind-residual.css";

export const metadata = {
  title: "J.M. Tyre Services | Tyres & Wheel Care in Mulund West",
  description:
    "Find tyres for cars, SUVs, bikes and commercial vehicles, plus fitting, wheel alignment, balancing and puncture repair at J.M. Tyre Services, Mulund West, Mumbai.",
  applicationName: "J.M. Tyre Services",
  openGraph: {
    title: "J.M. Tyre Services — Tyres & Wheel Care in Mulund West",
    description:
      "Ask our local team about tyre fitment, puncture help, alignment and balancing in Mulund West. Call or prepare a WhatsApp enquiry.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>
        {children}
        <MotionDirector />
      </body>
    </html>
  );
}
