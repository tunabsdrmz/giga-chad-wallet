import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { monoFont, sansFont } from "@/lib/fonts";
import { PrivyProviders } from "@/components/providers/PrivyProviders";
import { SyncedUserProvider } from "@/components/providers/SyncedUserProvider";
import { StubBanner } from "@/components/dev/StubBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <StubBanner />
        <PrivyProviders>
          <SyncedUserProvider>{children}</SyncedUserProvider>
        </PrivyProviders>
      </body>
    </html>
  );
}
