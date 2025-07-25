// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/context/ModalContext";
import { ReactNode } from "react";

// O componente recebe os 'children' para poder envolver o restante da aplicação
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </SessionProvider>
  );
}