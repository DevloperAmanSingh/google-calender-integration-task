import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Calendar Sync App",
  description: "Google Calendar Sync App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
