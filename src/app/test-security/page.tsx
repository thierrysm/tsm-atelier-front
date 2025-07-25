// app/test-security/page.tsx
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './TestSecurity.module.css'; // Criaremos este arquivo a seguir

// Definindo um tipo para o estado dos resultados para melhor organização
type ResultState = {
  public: string | null;
  user: string | null;
  admin: string | null;
};

export default function TestSecurityPage() {
  const { data: session, status } = useSession();
  const [results, setResults] = useState<ResultState>({
    public: null,
    user: null,
    admin: null,
  });
  const [loading, setLoading] = useState<keyof ResultState | null>(null);

  // Função genérica para fazer as chamadas à API
  const fetchEndpoint = async (endpoint: keyof ResultState) => {
    setLoading(endpoint);
    setResults(prev => ({ ...prev, [endpoint]: 'Carregando...' }));

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/test/${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Adiciona o token de autorização se o endpoint não for público e a sessão existir
    if (endpoint !== 'public' && session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    try {
      const response = await fetch(url, { headers });
      const data = await response.text(); // A resposta é uma string simples

      if (!response.ok) {
        // Se a resposta for um erro (ex: 401, 403), mostra uma mensagem de acesso negado
        throw new Error(`Acesso Negado (Status: ${response.status})`);
      }
      
      setResults(prev => ({ ...prev, [endpoint]: data }));

    } catch (error: any) {
      setResults(prev => ({ ...prev, [endpoint]: error.message || 'Falha ao buscar recurso.' }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Página de Teste de Segurança</h1>
        
        <div className={styles.sessionStatus}>
          <strong>Status da Sessão:</strong> 
          {status === 'loading' && <span> Carregando...</span>}
          {status === 'authenticated' && <span className={styles.success}> Autenticado como {session.user?.name} (Roles: {session.user?.roles?.join(', ')})</span>}
          {status === 'unauthenticated' && <span className={styles.error}> Não Autenticado</span>}
        </div>

        {/* --- Card de Teste Público --- */}
        <div className={styles.card}>
          <h2>1. Recurso Público</h2>
          <p>Qualquer um pode acessar este endpoint, logado ou não.</p>
          <button onClick={() => fetchEndpoint('public')} disabled={loading === 'public'}>
            {loading === 'public' ? 'Testando...' : 'Testar /api/v1/test/public'}
          </button>
          {results.public && (
            <pre className={styles.result}>{results.public}</pre>
          )}
        </div>

        {/* --- Card de Teste de Usuário --- */}
        <div className={styles.card}>
          <h2>2. Recurso de Usuário (Role: CUSTOMER)</h2>
          <p>Apenas usuários autenticados com a role 'CUSTOMER' podem acessar.</p>
          <button 
            onClick={() => fetchEndpoint('user')} 
            disabled={status !== 'authenticated' || loading === 'user'}
          >
            {loading === 'user' ? 'Testando...' : 'Testar /api/v1/test/user'}
          </button>
          {results.user && (
            <pre className={`${styles.result} ${results.user.includes('Negado') ? styles.error : ''}`}>
              {results.user}
            </pre>
          )}
        </div>
        
        {/* --- Card de Teste de Admin --- */}
        <div className={styles.card}>
          <h2>3. Recurso de Admin (Role: ADMIN)</h2>
          <p>Apenas usuários autenticados com a role 'ADMIN' podem acessar.</p>
          <button 
            onClick={() => fetchEndpoint('admin')} 
            disabled={status !== 'authenticated' || loading === 'admin'}
          >
             {loading === 'admin' ? 'Testando...' : 'Testar /api/v1/test/admin'}
          </button>
          {results.admin && (
            <pre className={`${styles.result} ${results.admin.includes('Negado') ? styles.error : ''}`}>
              {results.admin}
            </pre>
          )}
        </div>

      </div>
    </main>
  );
}