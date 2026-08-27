import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TicketProvider } from "@/context/TicketContext";

export const metadata: Metadata = {
  title: "JRBTC-TECH | Gestão de Chamados Técnicos de TI",
  description: "Plataforma Full-Stack PWA de Service Desk e Atendimento Especializado de TI para empresas.",
  manifest: "/manifest.json",
  icons: { icon: "/logo-jrbtc.svg", apple: "/logo-jrbtc.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <AuthProvider>
          <TicketProvider>
            {children}
          </TicketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
