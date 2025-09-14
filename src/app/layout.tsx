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
import { Toaster } from "@/components/ui/sonner"
import { PostHogProvider } from "@/components/posthog-provider";

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
    <head>
          <meta name="application-name" content="Edura" />
          <meta name="apple-mobile-web-app-title" content="Edura" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <link rel="apple-touch-icon-precomposed" href="/apple-icon.png" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#028877" />
          <meta name="theme-color" content="#028877" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />
    </head>
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
        <PostHogProvider 
          apiKey={process.env.POSTHOG_KEY!}
          apiHost={process.env.POSTHOG_HOST!}
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
                        <Toaster/>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </TRPCProvider>
      </PostHogProvider>
    </body>
    </html>
  );
}
