export const permissions = {
  persons: ["read", "write", "export"],
  companies: ["read", "write", "export"],
  searches: ["create", "read"],
  processCases: ["read", "monitor"],
  alerts: ["read", "write"],
  audit: ["read"],
  reports: ["generate", "read"],
  settings: ["read", "write"]
} as const;

export type PermissionScope = keyof typeof permissions;

export function canAccessSensitiveDocument(role: string): boolean {
  return ["ADMIN", "COMPLIANCE", "AUDITOR"].includes(role);
}
