// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * O objeto Session, como é exposto para o cliente.
   */
  interface Session {
    accessToken?: string;
    error?: "RefreshAccessTokenError"; // Campo para sinalizar erro de refresh
    user: {
      id: string;
      roles: string[];
    } & DefaultSession["user"];
  }

  /**
   * O objeto User, como é retornado pela função `authorize`.
   */
  interface User {
    id: string;
    roles?: string[];
    accessToken: string;
    // Adicionamos o refreshToken que vem do backend
    refreshToken: string;
    // Adicionamos o tempo de expiração do accessToken
    accessTokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  /**
   * O conteúdo do token JWT da sessão.
   */
  interface JWT {
    id: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: "RefreshAccessTokenError";
  }
}
