import { getSession } from 'next-auth/react';

// Define uma estrutura de erro customizada para um tratamento mais claro
class HttpError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    // Usa a mensagem de erro vinda do backend, se disponível
    super(data?.message || 'Ocorreu um erro na requisição à API');
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Um wrapper para a API fetch que adiciona funcionalidades essenciais para nosso projeto.
 */
export async function customFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  // Pega a sessão do Auth.js para obter o accessToken
  const session = await getSession();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Adiciona o token de autorização se o usuário estiver logado
  // A tipagem de session pode precisar ser estendida para incluir accessToken
  if ((session as any)?.accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${(session as any).accessToken}`;
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  const response = await fetch(url, mergedOptions);

  // Se a resposta não for OK (status 2xx), lança um erro
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Falha ao processar a resposta de erro da API.',
    }));
    throw new HttpError(response.status, errorData);
  }

  // Se a resposta for OK, mas não tiver corpo (ex: 204 No Content do endpoint de delete)
  if (response.status === 204) {
    return null;
  }

  // Se a resposta for OK e tiver corpo, retorna o JSON
  return await response.json();
}