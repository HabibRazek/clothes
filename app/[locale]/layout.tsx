import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '../../i18n/routing';
import {setRequestLocale} from 'next-intl/server';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { SessionProvider } from "@/components/auth/session-provider";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clothes - Mode seconde main de qualité",
  description: "Découvre des milliers d'articles de mode seconde main. Achète et vends tes vêtements préférés sur la plateforme de mode durable #1 en France.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get session for SessionProvider
  const session = await auth();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <NextIntlClientProvider>
            {children}
            <Toaster />
            <SonnerToaster position="top-right" richColors />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
