import type { Metadata } from "next";
// ✨ As importações de 'next/font' foram removidas ✨
import "./globals.css";
import { Providers } from "./providers";
import { ModalProvider } from "@/context/ModalContext";
import HeaderWrapper from "@/components/Header/HeaderWrapper";

// ✨ As constantes 'geistSans' e 'geistMono' foram removidas ✨

export const metadata: Metadata = {
  title: "TSM Atelier",
  description: "Atelier de alta costura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      {/* ✨ As classes de fonte foram removidas do body ✨ */}
      <body>
        <Providers>
           <ModalProvider>
            <HeaderWrapper />
               {children}
          </ModalProvider>
        </Providers>
      </body>
    </html>
  );
}