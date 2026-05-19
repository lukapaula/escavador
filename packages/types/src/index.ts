import { z } from "zod";

export const legalBasisSchema = z.enum([
  "CONSENT",
  "LEGITIMATE_INTEREST",
  "CONTRACT_EXECUTION",
  "LEGAL_OBLIGATION",
  "RIGHTS_EXERCISE",
  "PUBLIC_POLICY"
]);

export const providerNameSchema = z.enum([
  "ESCAVADOR",
  "BRASIL_API",
  "RECEITAWS",
  "CNJ_DATAJUD",
  "INTERNAL"
]);

export const targetTypeSchema = z.enum(["PERSON", "COMPANY", "PROCESS_CASE"]);

export const searchRequestSchema = z.object({
  targetType: targetTypeSchema,
  targetId: z.coerce.number().optional(),
  provider: providerNameSchema,
  queryType: z.string().min(2),
  queryValue: z.string().min(2),
  purpose: z.string().min(10),
  legalBasis: legalBasisSchema,
  lgpdJustification: z.string().min(20)
});

export const personCreateSchema = z.object({
  fullName: z.string().min(3),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  source: z.string().optional(),
  purpose: z.string().min(10),
  legalBasis: legalBasisSchema,
  consentFileUrl: z.string().url().optional(),
  notes: z.string().optional()
});

export const companyCreateSchema = z.object({
  legalName: z.string().min(3),
  tradeName: z.string().optional(),
  cnpj: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional()
});

export const monitoringCreateSchema = z.object({
  entityType: targetTypeSchema,
  entityId: z.coerce.number(),
  frequency: z.enum(["HOURLY", "DAILY", "WEEKLY", "MONTHLY"]),
  provider: providerNameSchema,
  webhookUrl: z.string().url().optional()
});

export type LegalBasis = z.infer<typeof legalBasisSchema>;
export type ProviderName = z.infer<typeof providerNameSchema>;
export type SearchRequestInput = z.infer<typeof searchRequestSchema>;
export type PersonCreateInput = z.infer<typeof personCreateSchema>;
export type CompanyCreateInput = z.infer<typeof companyCreateSchema>;
export type MonitoringCreateInput = z.infer<typeof monitoringCreateSchema>;

export type NormalizedPerson = {
  name: string;
  document?: string;
  source: string;
  rawId?: string;
  riskHints?: string[];
};

export type NormalizedCompany = {
  legalName: string;
  tradeName?: string;
  cnpj?: string;
  status?: string;
  address?: Record<string, unknown>;
  partners?: Record<string, unknown>[];
  source: string;
};

export type NormalizedProcessCase = {
  caseNumber: string;
  court?: string;
  courtState?: string;
  instance?: string;
  caseClass?: string;
  subject?: string;
  area?: string;
  secrecyLevel?: number;
  parties?: unknown[];
  lawyers?: unknown[];
  provider: ProviderName;
};

export type NormalizedMovement = {
  movementDate?: string;
  movementType?: string;
  title: string;
  description?: string;
  provider: ProviderName;
  rawPayload?: unknown;
};
