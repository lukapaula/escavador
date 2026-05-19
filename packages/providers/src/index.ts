import type {
  NormalizedCompany,
  NormalizedMovement,
  NormalizedPerson,
  NormalizedProcessCase
} from "@legalops/types";

export type ProviderRequestContext = {
  purpose: string;
  legalBasis: string;
  justification: string;
  requestedBy: string;
  correlationId: string;
};

export type ProviderPage<T> = {
  data: T[];
  nextPage?: string | number | null;
  raw?: unknown;
};

export interface LegalDataProvider {
  searchPerson(query: string, context: ProviderRequestContext): Promise<ProviderPage<NormalizedPerson>>;
  searchCompany(query: string, context: ProviderRequestContext): Promise<ProviderPage<NormalizedCompany>>;
  searchProcess(caseNumber: string, context: ProviderRequestContext): Promise<NormalizedProcessCase | null>;
  getMovements(caseNumber: string, context: ProviderRequestContext): Promise<ProviderPage<NormalizedMovement>>;
  monitorCase(caseNumber: string, webhookUrl: string, context: ProviderRequestContext): Promise<{ externalId?: string; raw?: unknown }>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly statusCode?: number,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
