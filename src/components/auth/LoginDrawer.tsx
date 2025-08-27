'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import styles from './LoginDrawer.module.css';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

export function LoginDrawer() {
  const router = useRouter();
  const { closeModal } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setIsLoading(false);
    } else if (result?.ok) {
      closeModal();
      router.refresh();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Identificação</h1>
      </div>

      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Já possue uma conta?</h2>
            <p className={styles.requiredFields}>Campos Obrigatórios*</p>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email*</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className={styles.input} 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Senha*</label>
            <div className={styles.passwordWrapper}>
              <input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className={styles.input} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className={styles.togglePasswordButton}
              >
                {showPassword ? <IoEyeOutline />: <IoEyeOffOutline/> }
              </button>
            </div>
          </div>
          
          <Link href="/login?view=forgot-password" onClick={closeModal} className={styles.forgotPasswordLink}>
            Esqueceu sua senha?
          </Link>

          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          
               <div className={styles.alternativeSection}>
              <p className={styles.sectionTitle}>
                Ainda não possue uma conta?
              </p>
              <Link href="/login?view=register" onClick={closeModal} className={styles.registerButton}>
                Criar conta
              </Link>
            </div>
        </form>
      </div>
    </div>
  );
}