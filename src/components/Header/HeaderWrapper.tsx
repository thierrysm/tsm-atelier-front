'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { useEffect } from 'react';

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Lista de rotas onde o header NÃO deve aparecer
  const noHeaderRoutes = ['/login', '/register', '/forgot-password'];

  // Verifica se a rota atual é a página de produto
  const isProductPage = pathname.startsWith('/produto');

  // Determina se o offset deve ser aplicado
  const shouldHaveOffset = !isProductPage && !noHeaderRoutes.includes(pathname);

  // Efeito para adicionar/remover a classe do body
  useEffect(() => {
    if (shouldHaveOffset) {
      document.body.classList.add('has-header-offset');
    } else {
      document.body.classList.remove('has-header-offset');
    }

    // Função de limpeza para remover a classe quando o componente for desmontado
    return () => {
      document.body.classList.remove('has-header-offset');
    };
  }, [shouldHaveOffset]); // O efeito depende apenas desta condição


  // Se a rota atual estiver na lista, não renderiza nada (retorna null)
  if (noHeaderRoutes.includes(pathname)) {
    return null;
  }

  // Caso contrário, renderiza o Header normal
  return <Header />;
}

// Este componente wrapper permite usar o hook usePathname (que é um Client Component)
// sem transformar o RootLayout em um Client Component, mantendo a otimização do Next.js.