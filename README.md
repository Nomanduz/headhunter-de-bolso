# 🎯 Headhunter de Bolso

> **Consultoria de carreira instantânea, prática e acionável.**
> Identifique suas habilidades, descubra seu nível profissional (Júnior / Pleno / Sênior) e receba recomendações personalizadas de cargos e cursos — em menos de 10 minutos.

🌐 **App publicado:** https://growth-scan-io.lovable.app
🛠️ **Editor Lovable:** https://lovable.dev/projects/6260329e-1d47-4253-b495-8bd44d735791

---

## 📖 Sobre o projeto

O **Headhunter de Bolso** é uma aplicação web full-stack que combina um questionário guiado com análise de IA para mapear o perfil profissional de qualquer usuário. O fluxo é simples:

1. **Cadastro rápido** — apenas nome e e-mail/senha.
2. **Apresentação inicial** — vídeo curto explicando como funciona.
3. **10 perguntas abertas** — sobre habilidades, experiências e aspirações.
4. **Análise por IA** — Gemini 2.5 Flash interpreta as respostas e gera um diagnóstico estruturado.
5. **Resultado visual** — mapa de habilidades, nível geral, vagas compatíveis e cursos sugeridos.
6. **Histórico no perfil** — todos os mapeamentos ficam salvos para acompanhamento da evolução.

> *"Tudo o que a mente do homem pode conceber e acreditar, ela pode alcançar."* — Napoleon Hill

---

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| 🔐 **Autenticação** | Email/senha com auto-confirmação para acesso imediato. |
| 🎬 **Tela de apresentação** | Espaço para vídeo introdutório (~1 min). |
| 📝 **Questionário guiado** | 10 perguntas abertas, com auto-save por pergunta e barra de progresso. |
| 🤖 **Análise por IA** | Edge Function chama Lovable AI Gateway (Gemini 2.5 Flash) com structured output via tool calling. |
| 📊 **Mapa de Habilidades** | Habilidades classificadas por categoria (Comportamental / Técnica / Pessoal), nível (J/P/S) e demanda de mercado. |
| 💼 **Recomendações de cargos** | 3 a 5 vagas compatíveis com justificativa baseada nas evidências. |
| 🎓 **Cursos sugeridos** | 3 a 5 cursos curtos (<40h) para acelerar a próxima fase. |
| 👤 **Perfil com histórico** | Lista de todos os mapeamentos realizados pelo usuário. |
| 📱 **Mobile-first** | Layout totalmente responsivo, otimizado para smartphones. |

---

## 🎨 Design System — *Velvet Navigator*

Direção visual editorial e sofisticada inspirada em revistas de carreira premium.

- **Paleta:** Navy profundo (`#0F172A`-ish), dourado champagne (`gold`), cinzas neutros.
- **Tipografia:** [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) (títulos) + [Inter](https://fonts.google.com/specimen/Inter) (corpo).
- **Tokens semânticos:** todos os componentes consomem variáveis HSL definidas em `src/index.css` e `tailwind.config.ts` — sem cores hardcoded.
- **Gradientes & sombras:** `--gradient-gold`, `--shadow-elegant` para acentos premium.

---

## 🧱 Stack técnica

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 18 + Vite 5 + TypeScript 5 |
| **Estilo** | Tailwind CSS v3 + shadcn/ui (Radix) |
| **Roteamento** | React Router v6 |
| **Estado/Data** | TanStack Query + Supabase JS Client |
| **Backend** | Lovable Cloud (Supabase gerenciado) |
| **Banco** | Postgres com Row Level Security |
| **Auth** | Supabase Auth (email/password) |
| **Edge Function** | Deno runtime — `analyze-assessment` |
| **IA** | Lovable AI Gateway → `google/gemini-2.5-flash` (sem API key do usuário) |

---

## 📁 Estrutura do projeto

```
.
├── public/                       # Assets estáticos
├── src/
│   ├── assets/                   # Imagens (hero illustration)
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── TopNav.tsx            # Navegação superior responsiva
│   │   ├── MotivationalFooter.tsx# Footer com citação Napoleon Hill
│   │   └── NavLink.tsx
│   ├── hooks/
│   │   └── useAuthGuard.ts       # Proteção de rotas autenticadas
│   ├── integrations/
│   │   └── supabase/             # Client + types (auto-gerados)
│   ├── lib/
│   │   ├── questions.ts          # As 10 perguntas do questionário
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx             # Hero / landing
│   │   ├── Auth.tsx              # Login + cadastro
│   │   ├── Apresentacao.tsx      # Vídeo intro
│   │   ├── Questionario.tsx      # Fluxo de 10 perguntas
│   │   ├── Resultados.tsx        # Dashboard de resultados
│   │   ├── Perfil.tsx            # Histórico de mapeamentos
│   │   └── NotFound.tsx
│   ├── index.css                 # Design tokens (HSL) + utilitários
│   ├── App.tsx                   # Rotas
│   └── main.tsx
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   └── analyze-assessment/   # Edge Function de análise por IA
│   └── migrations/               # Schema versionado
├── tailwind.config.ts            # Tokens estendidos
├── vite.config.ts
└── package.json
```

---

## 🗄️ Modelo de dados

### `profiles`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | = `auth.users.id` |
| `full_name` | text | |
| `email` | text | |
| `created_at` / `updated_at` | timestamptz | |

> Criado automaticamente via trigger `handle_new_user` no signup.

### `assessments`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK → auth.users) | |
| `status` | text | `in_progress` / `completed` |
| `overall_level` | text | `Júnior` / `Pleno` / `Sênior` |
| `skills` | jsonb | array de habilidades |
| `jobs` | jsonb | array de cargos sugeridos |
| `courses` | jsonb | array de cursos |
| `summary` | text | resumo do perfil |
| `created_at` / `updated_at` | timestamptz | |

### `answers`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `assessment_id` | uuid (FK → assessments) | |
| `user_id` | uuid (FK → auth.users) | |
| `question_index` | int | 0–9 |
| `question_text` | text | |
| `answer_text` | text | |

> Constraint única `(assessment_id, question_index)` para suportar upsert / auto-save.

### Row Level Security
Todas as tabelas têm **RLS habilitado** com políticas owner-scoped: cada usuário só lê/escreve registros onde `user_id = auth.uid()`.

---

## 🤖 Edge Function: `analyze-assessment`

**Endpoint:** `POST /functions/v1/analyze-assessment`
**Auth:** obrigatória (JWT validado via `getClaims`).
**Body:** `{ answers: [{ question, answer }, ...] }`

### Como funciona
1. Valida o `Authorization: Bearer <jwt>` — rejeita anônimos para evitar abuso de créditos.
2. Monta o prompt em PT-BR para um headhunter sênior.
3. Chama `https://ai.gateway.lovable.dev/v1/chat/completions` com:
   - Model: `google/gemini-2.5-flash`
   - **Tool calling forçado** (`deliver_assessment`) → garante JSON estruturado e validado.
4. Retorna `{ overall_level, summary, skills[], jobs[], courses[] }`.
5. Trata `429` (rate limit) e `402` (créditos esgotados) com mensagens amigáveis.

> 🔑 **Nenhuma API key do usuário é necessária.** O Lovable AI Gateway é provisionado automaticamente via Lovable Cloud.

---

## 🚀 Rodando localmente

### Pré-requisitos
- Node.js 18+ e npm/bun
- Conta Lovable Cloud já provisionada (este repo já vem conectado)

### Setup

```bash
# 1. Clone e instale
git clone <seu-repo>
cd headhunter-de-bolso
npm install

# 2. Variáveis de ambiente
# O arquivo .env já vem preenchido pelo Lovable Cloud com:
#   VITE_SUPABASE_URL
#   VITE_SUPABASE_PUBLISHABLE_KEY
#   VITE_SUPABASE_PROJECT_ID

# 3. Rodar em dev
npm run dev
# → http://localhost:8080
```

### Build de produção

```bash
npm run build
npm run preview
```

### Tipos do Supabase
Os arquivos em `src/integrations/supabase/{client,types}.ts` e `.env` são **gerados automaticamente** pelo Lovable Cloud. Não edite manualmente.

---

## 🔒 Segurança

Auditoria realizada e correções aplicadas:

- ✅ **RLS** em todas as tabelas com policies `auth.uid() = user_id`.
- ✅ **Edge Function autenticada** — JWT obrigatório, valida `getClaims` antes de chamar a IA.
- ✅ **`SECURITY DEFINER` functions** (`handle_new_user`, `set_updated_at`) com `EXECUTE` revogado de `PUBLIC`/`anon`/`authenticated`. Funcionam apenas como triggers.
- ✅ **Sem secrets no client** — apenas a `anon key` (publishable) é exposta no front, conforme arquitetura Supabase.
- ✅ **Sem roles em `profiles`** — caso roles sejam adicionadas no futuro, devem ir em tabela dedicada `user_roles` + função `has_role()` SECURITY DEFINER.

---

## 🗺️ Roadmap

### MVP (atual)
- [x] Cadastro / login
- [x] 10 perguntas com auto-save
- [x] Análise IA + resultado estruturado
- [x] Mapa de habilidades visual
- [x] Histórico no perfil
- [x] Mobile responsivo

### 90–180 dias
- [ ] Integração com catálogos reais de cursos (Alura, Coursera, etc.) com tracking de cliques
- [ ] Recomendações personalizadas por região/idioma
- [ ] A/B testing de UX no questionário
- [ ] Compartilhamento do mapa de habilidades (link público read-only)
- [ ] Exportar resultado em PDF
- [ ] Notificações de novos mapeamentos sugeridos a cada 6 meses

### KPIs alvo
- Taxa de conclusão do questionário > **70%**
- CTR em cursos sugeridos > **10%**
- Tempo médio do fluxo < **10 min**

---

## ⚠️ Riscos & mitigação

| Risco | Mitigação |
|---|---|
| Ambiguidade nas respostas livres | Prompts de follow-up automático (futuro); `evidence` obrigatório em cada skill |
| Viés do modelo de IA | Revisão humana em amostragem; possibilidade de feedback do usuário |
| Abuso de créditos de IA | Edge Function exige JWT autenticado |
| Custos de IA | Tier `flash` (mais barato) por padrão; fallback gracioso em `402` |

---

## 📜 Licença

Projeto desenvolvido com [Lovable](https://lovable.dev). Use livremente como base para seu próprio produto.

---

## 🙋 Suporte

- 📚 [Docs Lovable](https://docs.lovable.dev)
- 💬 [Discord da comunidade](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 🎥 [Playlist YouTube](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

> *"Tudo o que a mente do homem pode conceber e acreditar, ela pode alcançar."* — **Napoleon Hill**
