Claro, Carlos! Vou trazer novamente o \*\*README completo\*\* que você pode usar no repositório. Basta copiar este conteúdo para um arquivo chamado `README.md` dentro da pasta do projeto \*\*headhunter-de-bolso\*\*.  



\---



\# 🎯 Headhunter de Bolso



> \*\*Consultoria de carreira instantânea, prática e acionável.\*\*  

> Identifique suas habilidades, descubra seu nível profissional (Júnior / Pleno / Sênior) e receba recomendações personalizadas de cargos, cursos e até oportunidades freelance — em menos de 10 minutos.



🌐 \*\*App publicado:\*\* \[https://growth-scan-io.lovable.app](https://growth-scan-io.lovable.app)  

🛠️ \*\*Editor Lovable:\*\* \[https://lovable.dev/projects/6260329e-1d47-4253-b495-8bd44d735791](https://lovable.dev/projects/6260329e-1d47-4253-b495-8bd44d735791)  



\---



\## 📖 Sobre o projeto



O \*\*Headhunter de Bolso\*\* é uma aplicação web full‑stack que combina um questionário guiado com análise de IA para mapear o perfil profissional de qualquer usuário. O fluxo é simples:



1\. \*\*Cadastro rápido\*\* — apenas nome e e‑mail.  

2\. \*\*Apresentação inicial\*\* — vídeo curto explicando como funciona.  

3\. \*\*10 perguntas abertas\*\* — sobre habilidades, experiências e aspirações.  

4\. \*\*Análise por IA\*\* — interpreta as respostas e gera um diagnóstico estruturado.  

5\. \*\*Resultado visual\*\* — mapa de habilidades, nível geral, vagas compatíveis, cursos sugeridos e oportunidades freelance.  

6\. \*\*Histórico no perfil\*\* — todos os mapeamentos ficam salvos para acompanhamento da evolução.  



> \*"Tudo o que a mente do homem pode conceber e acreditar, ela pode alcançar."\* — Napoleon Hill  



\---



\## ✨ Funcionalidades



| Feature | Descrição |

|---|---|

| 🔐 \*\*Autenticação\*\* | Email para acesso imediato. |

| 🎬 \*\*Tela de apresentação\*\* | Vídeo introdutório (\~1 min). |

| 📝 \*\*Questionário guiado\*\* | 10 perguntas abertas, com auto‑save e barra de progresso. |

| 🤖 \*\*Análise por IA\*\* | Interpretação estruturada das respostas. |

| 📊 \*\*Mapa de Habilidades\*\* | Classificação por categoria (Comportamental / Técnica / Pessoal), nível (J/P/S) e demanda de mercado. |

| 💼 \*\*Recomendações de cargos\*\* | 3 a 5 vagas compatíveis com justificativa. |

| 🎓 \*\*Cursos sugeridos\*\* | 3 a 5 cursos curtos (<40h). |

| 👤 \*\*Perfil com histórico\*\* | Lista de todos os mapeamentos realizados. |

| 📱 \*\*Mobile-first\*\* | Layout responsivo. |

| 🌍 \*\*Freelance \& Autônomo\*\* | Sugestão de plataformas (Workana, 99Freelas, Fiverr, GetNinjas) e canais de conteúdo (Instagram, TikTok, LinkedIn, YouTube). |



\---



\## 🎨 Design System — \*Velvet Navigator\*



\- \*\*Paleta:\*\* Navy profundo, dourado champagne, cinzas neutros.  

\- \*\*Tipografia:\*\* DM Serif Display (títulos) + Inter (corpo).  

\- \*\*Tokens semânticos:\*\* variáveis HSL em `index.css` e `tailwind.config.ts`.  

\- \*\*Gradientes \& sombras:\*\* `--gradient-gold`, `--shadow-elegant`.



\---



\## 🧱 Stack técnica



| Camada | Tecnologia |

|---|---|

| \*\*Frontend\*\* | React 18 + Vite 5 + TypeScript 5 |

| \*\*Estilo\*\* | Tailwind CSS v3 + shadcn/ui |

| \*\*Roteamento\*\* | React Router v6 |

| \*\*Estado/Data\*\* | TanStack Query + Supabase |

| \*\*Backend\*\* | Lovable Cloud (Supabase gerenciado) |

| \*\*Banco\*\* | Postgres com RLS |

| \*\*Auth\*\* | Supabase Auth |

| \*\*Edge Function\*\* | Deno runtime — `analyze-assessment` |

| \*\*IA\*\* | Lovable AI Gateway → Gemini 2.5 Flash |



\---



\## 📁 Estrutura do projeto



```

.

├── public/

├── src/

│   ├── assets/

│   ├── components/

│   ├── hooks/

│   ├── integrations/

│   ├── lib/

│   ├── pages/

│   ├── index.css

│   ├── App.tsx

│   └── main.tsx

├── supabase/

│   ├── config.toml

│   ├── functions/

│   └── migrations/

├── tailwind.config.ts

├── vite.config.ts

└── package.json

```



\---



\## 🗄️ Modelo de dados



\### `profiles`

\- `id` (uuid, PK)  

\- `full\_name` (text)  

\- `email` (text)  

\- `created\_at` / `updated\_at`  



\### `assessments`

\- `id` (uuid, PK)  

\- `user\_id` (uuid, FK)  

\- `status` (text)  

\- `overall\_level` (text)  

\- `skills` (jsonb)  

\- `jobs` (jsonb)  

\- `courses` (jsonb)  

\- `summary` (text)  

\- `created\_at` / `updated\_at`  



\### `answers`

\- `id` (uuid, PK)  

\- `assessment\_id` (uuid, FK)  

\- `user\_id` (uuid, FK)  

\- `question\_index` (int)  

\- `question\_text` (text)  

\- `answer\_text` (text)  



\---



\## 🚀 Rodando localmente



\### Pré-requisitos

\- Node.js 18+  

\- Conta Lovable Cloud provisionada  



\### Setup

```bash

git clone <seu-repo>

cd headhunter-de-bolso

npm install

npm run dev

```



\---



\## 🗺️ Roadmap



\- \[x] Cadastro / login  

\- \[x] 10 perguntas com auto-save  

\- \[x] Análise IA + resultado estruturado  

\- \[x] Mapa de habilidades visual  

\- \[x] Histórico no perfil  

\- \[x] Mobile responsivo  

\- \[x] Sugestões freelance/autônomo  



\---



\## 📜 Licença



Projeto desenvolvido com \[Lovable](https://lovable.dev). Use livremente como base para seu próprio produto.



\---



\## 🙋 Suporte



\- 📚 \[Docs Lovable](https://docs.lovable.dev)  

\- 💬 \[Discord da comunidade](https://discord.com/channels/1119885301872070706/1280461670979993613)  

\- 🎥 \[Playlist YouTube](https://www.youtube.com/watch?v=9KHLTZaJcR8\&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)  



> \*"Tudo o que a mente do homem pode conceber e acreditar, ela pode alcançar."\* — \*\*Napoleon Hill\*\*



\---



