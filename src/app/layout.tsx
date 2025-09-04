import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {SidebarApp} from "@/components/sidebar/sidebar-app";
import { ThemeProvider } from "@/components/theme-provider"
import {TRPCProvider} from "@/components/trpc-provider";
import {SiteHeader} from "@/components/site-header";
import {NextIntlClientProvider} from "next-intl";
import {getLocale} from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edura",
  description: "A Homework Tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
      <html lang={locale} suppressHydrationWarning>
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <TRPCProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
              <NextIntlClientProvider>
                  <SidebarProvider
                      style={
                          {
                              "--sidebar-width": "calc(var(--spacing) * 72)",
                              "--header-height": "calc(var(--spacing) * 12)",
                          } as React.CSSProperties
                      }
                  >
                      <SidebarApp/>
                      <SidebarInset>
                          <SiteHeader/>
                          <main>
                              {children}
                          </main>
                      </SidebarInset>
                  </SidebarProvider>
              </NextIntlClientProvider>
          </ThemeProvider>
      </TRPCProvider>
      </body>
      </html>
  );
}
