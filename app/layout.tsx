import type React from "react";
import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";
import LayoutProvider from "@/providers/layout-provider";
import { Analytics } from "@vercel/analytics/react";
import { getSEOTags } from "@/lib/seo";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ShadcnUIToaster } from "@/components/ui/toaster";
import ModalProvider from "@/providers/modal-provider";
import { auth } from "@/auth";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import SessionProvider from "@/providers/session-provider";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { initializeApp } from "@/lib/init";
import { Suspense } from "react";

// Initialize the app on the server side
if (typeof window === "undefined") {
  initializeApp();
}

export const metadata = getSEOTags();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', 'G-KPM9TH05ML');
            `,
          }}
        />

        {/* Google Ads Tag - Script */}
        <Script
          id="google-ads-tag"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-16792090934"
        />

        {/* Google Ads Tag - Configuration */}
        <Script
          id="google-ads-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16792090934');
            `,
          }}
        />
      </head>
      <body className={`antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-KPM9TH05ML"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Ads (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=AW-16792090934"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ThemeProvider>
          <SessionProvider session={session}>
            <ModalProvider />
            <Suspense>
              <LayoutProvider>{children}</LayoutProvider>
            </Suspense>
            <Analytics />
            <Toaster richColors position="top-right" />
            <ShadcnUIToaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
