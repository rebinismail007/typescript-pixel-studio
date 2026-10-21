import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Pixel Studio | Rebin Ismail", description: "A tiny 16 by 16 pixel drawing playground." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
