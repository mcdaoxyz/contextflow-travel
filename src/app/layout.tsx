import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "ContextFlow Travel", description: "Travel planning assistant with itinerary generation, visa docs, and destination research." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="antialiased">{children}</body></html>);
}
