import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutProvider from "@/providers/layout-provider";
import { ToastProvider } from "@/providers/toast-provider";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { getServerSession } from "next-auth";
import Provider from "@/providers/client-provider";
import { authOptions } from "@/lib/auth-options";
import { Analytics } from "@vercel/analytics/react";
import { baseUrl } from "./sitemap";
import { getSEOTags } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-ibmplex",
});

export const metadata = getSEOTags();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <Provider session={session}>
      <html lang="en">
        <body className={`${nunitoSans.variable} antialiased`}>
          <ThemeProvider>
            <ToastProvider />
            <LayoutProvider>{children}</LayoutProvider>
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </Provider>
  );
}
