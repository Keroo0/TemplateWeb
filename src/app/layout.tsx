import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mauapalau",
  description: "Platform jasa custom template web untuk kebutuhan personal dan bisnis."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
