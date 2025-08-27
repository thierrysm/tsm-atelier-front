'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/app/login/Login.module.css';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Email ou senha inválidos.');
    } else if (result?.ok) {
      router.push('/minha-conta');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Iniciar Sessão</h1>
      {error && <p className={styles.error}>{error}</p>}

      {/* ✨ ESTRUTURA ATUALIZADA PARA O INPUT GROUP ✨ */}
      <div className={styles.inputGroup}>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          placeholder=" " 
        />
        <label htmlFor="email" className={styles.label}>E-mail</label>
      </div>

      {/* ✨ ESTRUTURA ATUALIZADA PARA O INPUT GROUP ✨ */}
      <div className={styles.inputGroup}>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          placeholder=" "
        />
        <label htmlFor="password" className={styles.label}>Senha</label>
      </div>

      <Link href="/login?view=forgot-password" className={styles.forgotPasswordLink}>
        Esqueceu a sua senha?
      </Link>
      
      <button type="submit" disabled={isLoading} className={styles.submitButton}>
        {isLoading ? 'Entrando...' : 'Iniciar Sessão'}
      </button>
      <button 
        type="button" 
        onClick={() => router.push('/login?view=register')} 
        className={styles.registerButton}
      >
        Registre-se
      </button>
    </form>
  );
}