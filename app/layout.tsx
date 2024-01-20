import { Figtree } from "next/font/google";
import "./globals.css";

import Sidebar from "@/components/sidebar";

const figtree = Figtree({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Spotify Reimagined",
  description: "Listen to music!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.className}>
      <body className="bg-background text-foreground">
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
