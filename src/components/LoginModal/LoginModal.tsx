"use client";

import { useModal } from '@/context/ModalContext';
import styles from './LoginModal.module.css';
import { IoClose } from "react-icons/io5";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginModal() {
  const router = useRouter();
  // ✨ 1. Pega APENAS a função 'closeModal' do nosso contexto genérico
  const { closeModal } = useModal();

  // Estado interno do formulário (continua o mesmo)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        setError(result.error || 'Credenciais inválidas. Tente novamente.');
        setIsLoading(false);
      } else if (result?.ok) {
        // Sucesso!
        setIsLoading(false);
        closeModal(); // ✨ 2. Usa a função correta para fechar o modal
        router.refresh(); // Atualiza a página para refletir o estado de login
      }
    } catch (e) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      setIsLoading(false);
    }
  };

  // ✨ 3. REMOVIDO: A linha 'if (!isLoginModalOpen) return null;' é removida.
  // A visibilidade agora é controlada pelo ModalProvider.

  // O componente agora retorna apenas o conteúdo do modal.
  // O fundo escuro (overlay) e a animação são controlados pelo Drawer no ModalContext.
  return (
    <div className={styles.modalContent}>
      <div className={styles.header}>
        <h2 className={styles.title}>Identificação</h2>
        <button className={styles.closeButton} onClick={closeModal} aria-label="Fechar modal">
          <IoClose size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} placeholder=" " />
          <label htmlFor="email" className={styles.label}>E-mail</label>
        </div>
        
        <div className={styles.inputGroup}>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} placeholder=" " />
          <label htmlFor="password" className={styles.label}>Senha</label>
        </div>

        <Link href="/login?view=forgot-password" onClick={closeModal} className={styles.link}>
          Esqueceu a sua senha?
        </Link>
        
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Acessando...' : 'Acessar'}
        </button>
      </form>

      <p className={styles.alternativeAction}>
        Não tem uma conta?{' '}
        <Link href="/login?view=register" onClick={closeModal} className={styles.link}>
          Registre-se
        </Link>
      </p>
    </div>
  );
}