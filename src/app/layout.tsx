import type { Metadata, Viewport } from "next";
import { Tiro_Bangla, Hind_Siliguri, Baloo_Da_2 } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./globals.css";

const tiroBangla = Tiro_Bangla({
  subsets: ["bengali"],
  weight: ["400"],
  variable: "--font-tiro-bangla",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

const balooDa2 = Baloo_Da_2({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo-da-2",
});

export const metadata: Metadata = {
  title: "আমার নোট",
  description: "আপনার চিন্তার জন্য একটি নির্মল জায়গা।",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// IMPORTANT: Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${tiroBangla.variable} ${hindSiliguri.variable} ${balooDa2.variable} font-tiro-bangla`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
