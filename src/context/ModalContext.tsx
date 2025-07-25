"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 1. A interface que define as funções que o contexto fornecerá
interface ModalContextType {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  // ✨ 2. ADICIONE ESTE useEffect PARA CONTROLAR O SCROLL ✨
  useEffect(() => {
    if (isOpen) {
      // Quando o drawer abre, adiciona a classe para travar o scroll
      document.body.classList.add('body-no-scroll');
    } else {
      // Quando o drawer fecha, remove a classe para liberar o scroll
      document.body.classList.remove('body-no-scroll');
    }

    // Função de limpeza: garante que a classe seja removida se o componente for desmontado
    return () => {
      document.body.classList.remove('body-no-scroll');
    };
  }, [isOpen]); // Este efeito roda toda vez que o estado 'isOpen' muda

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setModalContent(null);
    }, 400); // Aumentado para corresponder à duração da animação
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Drawer isOpen={isOpen} onClose={closeModal}>
        {modalContent}
      </Drawer>
    </ModalContext.Provider>
  );
}
// 6. O componente Drawer genérico que renderiza o painel
function Drawer({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: ReactNode 
}) {
    // Sempre renderiza o container, mas controla a visibilidade via CSS
    return (
      <div className={`drawer-container ${isOpen ? 'open' : ''}`}>
        <div className="drawer-overlay" onClick={onClose} />
        <div className="drawer-panel">
          <button onClick={onClose} className="close-button" aria-label="Fechar">&times;</button>
          {children}
        </div>
      </div>
    );
  }