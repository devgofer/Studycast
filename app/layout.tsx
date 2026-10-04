import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studycast — Learn it. Read it. Listen to it.",
  description:
    "Turn one learning topic into a structured course with clear explanations you can read or listen to.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
