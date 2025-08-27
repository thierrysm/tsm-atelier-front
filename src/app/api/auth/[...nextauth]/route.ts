import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

// Interface para a resposta completa do seu backend
interface BackendUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciais inválidas ou não fornecidas.');
        }

        try {
          const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            headers: { 'Content-Type': 'application/json' }
          });

          // Se a resposta NÃO for OK (ex: 401, 403, 500), entramos neste bloco.
          if (!res.ok) {
            // PONTO-CHAVE: Verificamos o tipo de conteúdo da resposta de erro.
            const contentType = res.headers.get('content-type');
            
            // Se a resposta de erro for um JSON, sabemos que é um erro controlado pelo nosso backend.
            if (contentType && contentType.includes('application/json')) {
              const errorData = await res.json();
              // Lançamos a mensagem de erro específica vinda do backend.
              throw new Error(errorData.message || 'Falha na autenticação');
            } else {
              // Se a resposta NÃO for JSON (ex: uma página de erro HTML de um erro 500),
              // evitamos o crash e lançamos uma mensagem de erro genérica e segura.
              throw new Error(`O servidor retornou um erro inesperado (Status: ${res.status}).`);
            }
          }
          
          // Se a resposta for OK (200), prosseguimos normalmente.
          const user: BackendUser = await res.json();

          if (user && user.accessToken) {
            const decodedToken: { exp: number } = jwtDecode(user.accessToken);
            const expirationTime = decodedToken.exp * 1000;

            // Mapeia e retorna o objeto User completo para o NextAuth
            return {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.username,
              roles: user.roles,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
              accessTokenExpires: expirationTime,
            };
          }

          return null;

        } catch (error: any) {
          // Ele vai capturar os erros que lançamos acima.
          if (error instanceof TypeError && error.message.includes('fetch failed')) {
            console.error('Erro de Conexão com a API Backend:', error);
            throw new Error('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
          }
          // Repassa o erro (seja o da API ou o genérico).
          throw error; 
        }
      }
    })
  ],
  // O restante da configuração (callbacks, session, pages, etc.) permanece o mesmo.
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as any).roles;
        token.accessToken = user.accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = (user as any).accessTokenExpires;
      }
      // Lógica de refresh token iria aqui...
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.roles = token.roles;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
