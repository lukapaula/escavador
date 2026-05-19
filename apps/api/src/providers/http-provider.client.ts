import { ProviderError } from "@legalops/providers";

export class HttpProviderClient {
  constructor(
    private readonly provider: string,
    private readonly baseUrl: string,
    private readonly defaultHeaders: Record<string, string> = {}
  ) {}

  async request<T>(path: string, init: RequestInit = {}, attempts = 3): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const response = await fetch(url, {
        ...init,
        headers: {
          "content-type": "application/json",
          ...this.defaultHeaders,
          ...(init.headers ?? {})
        }
      });
      if (response.status === 429 && attempt < attempts) {
        const retryAfter = Number(response.headers.get("retry-after") ?? 2);
        await this.sleep(retryAfter * 1000);
        continue;
      }
      if (response.status >= 500 && attempt < attempts) {
        await this.sleep(500 * attempt);
        continue;
      }
      if (!response.ok) {
        throw new ProviderError(await response.text(), this.provider, response.status, Number(response.headers.get("retry-after")));
      }
      return (await response.json()) as T;
    }
    throw new ProviderError("Falha após tentativas de retry", this.provider);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
