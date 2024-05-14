import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";
import LayoutProvider from "@/providers/layout-provider";
import { Analytics } from "@vercel/analytics/react";
import { getSEOTags } from "@/lib/seo";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export const metadata = getSEOTags();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} antialiased`}>
        <ThemeProvider>
          <SessionProvider>
            <ModalProvider />
            <LayoutProvider>{children}</LayoutProvider>
            <Analytics />
            <Toaster richColors position="bottom-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
