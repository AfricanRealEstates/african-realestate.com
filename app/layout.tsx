import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";
import LayoutProvider from "@/providers/layout-provider";
import { Analytics } from "@vercel/analytics/react";
import { getSEOTags } from "@/lib/seo";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import { auth } from "@/auth";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import SessionProvider from "@/providers/session-provider";
import { cn } from "@/lib/utils";

export const metadata = getSEOTags();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  // if (!user) redirect("/");

  // const value = {
  //   user: session.user,
  //   session,
  // };
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
      <body className={`antialiased`}>
        <ThemeProvider>
          <SessionProvider session={session}>
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
