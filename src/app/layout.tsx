import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TicketProvider } from "@/context/TicketContext";

export const metadata: Metadata = {
  title: "JRBC TECH | Sustentação de TI & Service Desk",
  description: "JRBC TECH TECNOLOGIA LTDA — Gestão Avançada de Chamados Técnicos, Servidores Dell, Switches Cisco e Suporte N1/N2/N3 em Palmas - TO.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#00e676",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-JRBCTECH2026";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#05080f] text-slate-100 antialiased min-h-screen">
        {/* Google Analytics GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <AuthProvider>
          <TicketProvider>
            {children}
          </TicketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
