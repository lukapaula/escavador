import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalOps Compliance",
  description: "Sistema interno para RH, Compliance e monitoramento processual"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
