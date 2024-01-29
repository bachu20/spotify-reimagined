import { Figtree } from "next/font/google";
import "./globals.css";

import React from "react";
import Sidebar from "@/components/sidebar";
import SuperbaseProvider from "@/providers/supabase";
import UserProvider from "@/providers/user";
import ModalProvider from "@/providers/modal";
import ToasterProvider from "@/providers/toaster";

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
    <React.StrictMode>
      <html lang="en" className={figtree.className}>
        <body className="bg-background text-foreground">
          <ToasterProvider />
          <SuperbaseProvider>
            <UserProvider>
              <ModalProvider />
              <Sidebar>{children}</Sidebar>
            </UserProvider>
          </SuperbaseProvider>
        </body>
      </html>
    </React.StrictMode>
  );
}
