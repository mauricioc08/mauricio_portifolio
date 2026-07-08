# 🔥 Setup do Firebase — Portfólio Admin

Guia para criar e configurar o Firebase que vai alimentar o painel de admin.
Tudo aqui usa o **plano gratuito (Spark)** — que **não pausa por inatividade**.
Leva ~10 minutos. Faça uma vez.

---

## 1. Criar o projeto

1. Acesse <https://console.firebase.google.com> e faça login com sua conta Google.
2. Clique em **"Adicionar projeto"** (ou "Create a project").
3. Nome sugerido: `mauricio-portfolio`.
4. **Desative** o Google Analytics (não é necessário) → **Criar projeto**.

---

## 2. Registrar o app Web

1. No painel do projeto, clique no ícone **`</>`** (Web) para adicionar um app.
2. Apelido: `portfolio-web`. **Não** marque "Firebase Hosting" agora.
3. Clique em **Registrar app**.
4. Vai aparecer um bloco `const firebaseConfig = { ... }`. **Copie esse objeto** —
   é o que você me envia (pode ser público, veja a nota de segurança no fim).

Exemplo do que você vai copiar:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "mauricio-portfolio.firebaseapp.com",
  projectId: "mauricio-portfolio",
  storageBucket: "mauricio-portfolio.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
};
```

---

## 3. Ativar Authentication (login de admin)

1. Menu lateral → **Build → Authentication → Get started**.
2. Aba **Sign-in method** → habilite **Email/Password** → **Save**.
3. Aba **Users** → **Add user**:
   - Email: o seu email de admin.
   - Senha: uma senha forte (guarde num gerenciador).
4. Depois de criar, **copie o "User UID"** dessa linha (uma string tipo
   `a1b2c3d4...`). É o que garante que só VOCÊ edita. Me envie também.

---

## 4. Ativar Firestore (banco de dados)

1. Menu → **Build → Firestore Database → Create database**.
2. Escolha **Start in production mode** (as regras seguras entram depois).
3. Location: `southamerica-east1` (São Paulo) ou a mais próxima → **Enable**.

> As Security Rules corretas eu te entrego prontas em `firebase/firestore.rules`
> para colar na aba **Rules**.

---

## 5. Imagens dos projetos → Cloudinary (não Firebase Storage)

O Firebase Storage passou a exigir plano pago (Blaze) em projetos novos. Para
manter tudo **grátis**, o upload de imagens usa o **Cloudinary** (plano free).
Siga o [`CLOUDINARY_SETUP.md`](CLOUDINARY_SETUP.md) — leva ~3 min.

> Você NÃO precisa ativar o Storage no Firebase.

---

## 6. Onde colocar (`.env.local`)

Copie o `.env.example` para `.env.local` e preencha com os valores dos passos acima:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ADMIN_UID=...            # User UID do passo 3.4
```

Para as **escritas** (painel admin), também é preciso a **service account**
(Admin SDK): Firebase Console → Configurações do projeto → **Contas de serviço**
→ **Gerar nova chave privada**. Cole o JSON em UMA linha em
`FIREBASE_SERVICE_ACCOUNT_KEY` (privado, nunca commitar).

---

## 🔒 Nota de segurança (importante)

- **É normal e seguro** a `firebaseConfig` (incluindo a `apiKey`) ficar no
  código do front-end. Ela **não** é uma senha — só identifica seu projeto.
- A segurança de verdade vem das **Security Rules**: leitura é pública, mas
  **escrita exige estar logado com o seu UID de admin**. Ninguém edita nada sem
  ser você, e isso é validado nos servidores do Google — não no navegador.
- Sua **senha de admin nunca** aparece no código.
