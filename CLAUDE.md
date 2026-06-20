# Portal Assis Carrer — instruções para agentes

Portal interno da **Assis Carrer Arquitetura** (escritório em SJC). Não confundir com o
site de marketing estático em `../site`.

## Stack
- **Next.js 16** (App Router, Turbopack) + TypeScript + React 19
- **Tailwind v4** (tokens em `src/app/globals.css`)
- **Supabase** — Auth, Postgres (RLS), Storage. Projeto `assiscarrer-portal`
  (ref `ezmhrnbtbwtarvucdton`, org Profix, região `sa-east-1`)
- Ícones `lucide-react`, gráficos `recharts`

## Comandos
```bash
npm run dev      # localhost:3000
npm run build    # valida tipos + build
```

## Acesso / papéis
- 3 papéis: `admin` (tudo + gestão de usuários), `marketing` (CRM, propostas, analytics,
  relatórios, whatsapp), `arquiteta` (área de trabalho).
- Matriz de acesso em `src/lib/constants.ts` (`ACCESS_MATRIX` / `canAccess`).
- Guarda no servidor: `requireProfile()` / `requireRole()` em `src/lib/auth.ts`.
- Sessão renovada em `src/proxy.ts` (Next 16 usa `proxy`, não `middleware`).
- **Admin inicial:** `gabriel.amaral@credix.finance` (senha definida fora do repositório;
  trocar em Administração → Minha senha). Criado via SQL direto em `auth.users` + `auth.identities`.

## Banco
- Tabelas: `profiles, leads, proposals, projects, project_updates, tasks, reports, integrations`.
- RLS ativo em todas. Helpers SQL: `app_role()`, `is_admin()`.
- Trigger `prevent_role_change` impede não-admin mudar papel; libera contexto server-side
  (quando `auth.uid()` é nulo).
- Tipos gerados em `src/lib/types/database.ts` (regenerar após mudança de schema).
- Buckets storage: `project-images`, `avatars` (públicos p/ leitura).

## Estrutura
- `src/app/(portal)/*` — área autenticada (layout com Sidebar). `src/app/login` — público.
- `src/components` — UI compartilhada. `src/lib` — clients, auth, constants, utils, types.

## Integrações (env em `.env.local`)
- GA4 Data API + Google Ads API (analytics), Google Drive (projetos). Tokens a preencher.
- WhatsApp: planejado p/ fase futura.

## Convenções
- UI e textos em **pt-BR**. Cores da marca: navy `#1c2d40`, terracota `#a96d3e`, areia `#f5f0eb`.
