/**
 * Base HTTP Client for Atelier API
 *
 * This client handles:
 * - Base URL configuration
 * - Access Token injection (Authorization Header)
 * - Global error handling (e.g., 429 Too Many Requests, traceId logging)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// In a real application, this should be managed by a robust state manager or context.
// For the stateless JWT approach described, we keep it in memory.
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

export class ApiError extends Error {
  public status: number;
  public traceId?: string;

  constructor(message: string, status: number, traceId?: string) {
    super(message);
    this.status = status;
    this.traceId = traceId;
  }
}

interface FetchOptions extends RequestInit {
  // Add any custom options here
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = \`\${BASE_URL}\${endpoint}\`;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (inMemoryAccessToken) {
    headers.set("Authorization", \`Bearer \${inMemoryAccessToken}\`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle No Content response
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Global error handlers
      if (response.status === 429) {
        // Here we could dispatch an event to trigger a global toast/notification
        console.warn("Muitas tentativas. Por favor, aguarde um minuto.");
      }

      if (response.status === 400 && data.message?.includes("Estoque")) {
        console.warn("Estoque insuficiente.");
      }

      const traceId = data.traceId || response.headers.get("x-trace-id");
      if (traceId) {
        console.error(\`API Error Trace ID: \${traceId}\`);
      }

      throw new ApiError(
        data.message || "Ocorreu um erro na requisição",
        response.status,
        traceId
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or parsing errors
    throw new Error("Erro de conexão com o servidor.");
  }
}
