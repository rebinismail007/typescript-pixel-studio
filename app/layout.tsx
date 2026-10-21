import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Team Pulse - survey dashboard", description: "A TypeScript and Next.js survey portfolio demo." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
