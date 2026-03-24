import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pancardia Multisuperspecility Hospital CRM",
  description: "CRM dashboard for Pancardia Multisuperspecility Hospital lead tracking, follow-up management, and testimonials."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
