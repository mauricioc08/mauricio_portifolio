<h1 align="center">Portfólio — Mauricio Cassiano 💻</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" />
</p>

---

## 💻 Sobre

Portfólio pessoal de Mauricio Cassiano, Desenvolvedor FullStack. Construído em
**Next.js (App Router) + TypeScript + Tailwind CSS**, com visual **dark elegante
e glassmorphism**, tema claro/escuro, dois idiomas (PT/EN) e um **painel de admin**
para editar o conteúdo sem mexer no código.

## ✨ Recursos

- ⚡ **Next.js 16 App Router** — Server Components + ISR (SEO forte, conteúdo do Firestore renderizado no servidor).
- 🎨 **Tema dark/light** com toggle e persistência, sem flash.
- 🌐 **Bilíngue PT/EN** com Context de i18n.
- 🖥️ **Hero terminal animado** (assinatura visual), respeitando `prefers-reduced-motion`.
- 🔐 **Painel `/admin`** — edita projetos, experiência e textos, com **upload de imagem** (Cloudinary).
- 🛡️ **Escrita segura** — via API Routes com **Firebase Admin SDK** (chave secreta só no servidor); leitura pública.
- ♿ **Acessível** e **responsivo** (mobile-first).

## 🗂️ Estrutura

```
src/
  app/
    layout.tsx           # fontes, tema, i18n, metadata
    page.tsx             # home (Server Component, lê do Firestore + fallback)
    admin/               # painel protegido por login
    api/                 # projects / experience / content (Admin SDK)
    sitemap.ts robots.ts
  components/site/        # Header, Hero, About, Experience, Projects, Skills, Contact, Footer
  components/admin/       # LoginForm, AdminPanel, abas CRUD, upload
  components/ui/          # Button, Tag, ThemeToggle, LangToggle, icons
  lib/
    firebase/            # client (Auth), admin (SDK), data (leitura server), auth-guard
    i18n/                # dicionário PT/EN + context
    theme.tsx cloudinary.ts admin-api.ts
  data/                  # fallback local (projects, experience)
  types/                 # interfaces TypeScript
firebase/firestore.rules # regras (leitura pública, escrita só admin)
```

## 🚀 Rodando localmente

```bash
pnpm install
cp .env.example .env.local   # preencha os valores (veja abaixo)
pnpm dev                     # http://localhost:3000
```

## 🔑 Variáveis de ambiente (`.env.local`)

- `NEXT_PUBLIC_FIREBASE_*` — config pública do Firebase (Auth + projeto).
- `NEXT_PUBLIC_ADMIN_UID` — seu UID de admin.
- `NEXT_PUBLIC_CLOUDINARY_*` — cloud name + upload preset (unsigned).
- `FIREBASE_SERVICE_ACCOUNT_KEY` — **privada** (JSON da service account, em uma linha). Nunca commitar.

Guias detalhados: [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md) e [`CLOUDINARY_SETUP.md`](CLOUDINARY_SETUP.md).

## ☁️ Deploy (Vercel)

1. Importe o repositório na Vercel.
2. Adicione as variáveis de ambiente (as mesmas do `.env.local`) em Project Settings → Environment Variables.
3. Deploy. O `FIREBASE_SERVICE_ACCOUNT_KEY` vai como variável **de servidor** (não `NEXT_PUBLIC`).

## ✏️ Editando o conteúdo

Acesse `/admin`, faça login e edite Projetos / Experiência / Textos. No primeiro
acesso (banco vazio), clique em **"Importar meus dados atuais"** para migrar o
fallback de `src/data/` para o Firestore.

---

<table>
  <tr>
    <td><img src="https://github.com/mauricioc08.png" width="100px" /></td>
    <td>Feito por <a href="https://github.com/mauricioc08">Mauricio Cassiano.</a></td>
  </tr>
</table>
