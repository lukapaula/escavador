# LegalOps Compliance

Sistema interno enterprise para RH, Compliance, auditoria e monitoramento processual, inspirado em plataformas de dados jurídicos, mas desenhado para uso corporativo com LGPD, rastreabilidade e análise humana obrigatória.

## Princípios

- Não faz scraping ilegal, bypass de captcha, invasão, quebra de TOS ou acesso a sistemas privados.
- Usa APIs oficiais, licenciadas ou públicas permitidas: Escavador API, BrasilAPI, ReceitaWS e conector preparado para CNJ DataJud.
- Toda consulta exige finalidade, base legal LGPD e justificativa.
- Toda consulta, exportação, visualização sensível e relatório gera trilha de auditoria.
- Logs de auditoria têm hash encadeado para verificação de integridade.
- O sistema apoia análise humana e não realiza decisão automática de contratação.

## Arquitetura

```text
apps/
  web/        Next.js 15, React, TypeScript, TailwindCSS, shadcn-style UI
  api/        NestJS, Prisma, BullMQ, Puppeteer, Winston-ready logging
packages/
  ui/         utilitários e componentes compartilháveis
  database/   Prisma schema, migrations e seeds
  types/      contratos e validações Zod
  providers/  interface LegalDataProvider
  auth/       permissões e helpers RBAC
  logger/     Winston estruturado
infra/
  nginx/      reverse proxy
```

## Módulos

AUTH, DASHBOARD, PESSOAS, EMPRESAS, CONSULTAS, PROCESSOS, MONITORAMENTO, ALERTAS, RELATÓRIOS, AUDITORIA, COMPLIANCE, CONFIGURAÇÕES, WEBHOOKS e INTEGRAÇÕES.

## APIs

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/dashboard`
- `GET|POST /api/persons`
- `GET|POST /api/companies`
- `GET|POST /api/searches`
- `GET|POST /api/monitorings`
- `GET /api/process-cases`
- `GET /api/process-cases/:id`
- `GET /api/alerts`
- `PATCH /api/alerts/:id`
- `GET /api/audit-logs`
- `POST /api/reports/generate`
- `POST /api/webhooks/:provider`

## Providers

A camada abstrata está em `packages/providers/src/index.ts`:

```ts
interface LegalDataProvider {
  searchPerson()
  searchCompany()
  searchProcess()
  getMovements()
  monitorCase()
}
```

Implementações:

- Escavador: bearer token, retry, rate limit handling, paginação e normalização.
- BrasilAPI: CNPJ, CEP, bancos e feriados.
- ReceitaWS: CNPJ e quadro societário.
- CNJ DataJud: conector enterprise desacoplado, preparado para API key.

## Banco

O schema Prisma cobre usuários, pessoas, empresas, consultas, processos, movimentações, monitoramentos, alertas, relatórios, audit logs, webhooks, refresh tokens e credenciais de integração.

Recursos de compliance:

- AES-256-GCM para CPF/CNPJ e credenciais.
- SHA-256 para hashes de CPF/CNPJ, movimentações e audit trail.
- Mascaramento de CPF/CNPJ via `EncryptionService`.
- Soft delete, anonimização e retenção planejada.
- Bloqueio de consulta sem finalidade, base legal e justificativa.
- Bloqueio de detalhes de segredo de justiça por perfil.

## Jobs BullMQ

Filas criadas:

- `sync-process-movements`
- `refresh-company-data`
- `refresh-person-data`
- `generate-alerts`
- `sync-monitorings`

## Setup local

1. Copie `.env.example` para `.env`.
2. Preencha `ESCAVADOR_API_KEY`, `JWT_SECRET`, `ENCRYPTION_KEY` e demais integrações.
3. Instale dependências:

```bash
npm install
```

4. Gere Prisma e aplique migração:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Suba a stack:

```bash
docker compose up --build
```

Web: `http://localhost:3000`  
API: `http://localhost:4000/api`

Usuário seed:

- Email: `admin@legalops.local`
- Senha: `ChangeMe123!`

## Segurança

- JWT com refresh token persistido por hash.
- RBAC por perfil e permissões JSONB.
- 2FA opcional modelado.
- Helmet, CORS controlado e validação Zod.
- Segregação por perfil para dados sensíveis.
- Relatórios PDF com disclaimer LGPD e responsável.

## Observação de produção

Antes de produção, configure S3 real para persistir PDFs, segredos em vault corporativo, rotação de chaves formal, política de retenção por tenant, observabilidade centralizada e contrato/licença de uso com cada provider jurídico.
