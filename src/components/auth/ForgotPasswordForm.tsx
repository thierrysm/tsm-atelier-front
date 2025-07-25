'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/login/Login.module.css';
import { customFetch } from '@/lib/fetcher';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await customFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSuccess('Se o e-mail estiver cadastrado, enviaremos as instruções para recuperação.');
    } catch (err: any) {
      setError('Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Recuperar a Senha de Acesso</h1>
      <p className={styles.subtitle}>Enviaremos um e-mail com instruções para recuperá-la</p>
      
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

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

      <button type="submit" disabled={isLoading} className={styles.submitButton}>
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>

      <p className={styles.alternativeAction}>
        Lembrou a senha?{' '}
        <Link href="/login" className={styles.link}>Faça login</Link>
      </p>
    </form>
  );
}