<h1 align="center">Portfólio — Mauricio Cassiano 💻</h1>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

<h4 align="center"><a href="#">Confira o projeto aqui</a></h4>

---

## 💻 Sobre

Portfólio pessoal de Mauricio Cassiano, Desenvolvedor FullStack. Site estático,
**sem build e sem dependências** — apenas HTML, CSS e JavaScript (ES modules).
Design **dark elegante com glassmorphism**, tema claro/escuro, dois idiomas
(PT/EN) e conteúdo dos projetos desacoplado em arquivos de dados.

## ✨ Recursos

- 🎨 **Tema dark/light** com toggle e persistência (`localStorage`).
- 🌐 **Bilíngue PT/EN** — troca de idioma com re-render e `<html lang>` dinâmico.
- 🖥️ **Hero terminal animado** (assinatura visual), respeitando `prefers-reduced-motion`.
- 🗂️ **Dados desacoplados** — projetos, experiência e textos em `assets/js/data/`.
- ⚡ **Performático** — GIFs (17 MB) substituídos por WebP estáticos (~80 KB),
  imagens com `lazy-load` e `width/height` para evitar layout shift.
- ♿ **Acessível** — HTML semântico, skip-link, foco visível, ARIA e contraste.
- 📄 **Download de CV** e **timeline de experiência**.
- 📱 **Responsivo** (mobile-first) com menu adaptável.
- 🔐 **Painel de admin** (opcional, via Firebase) — edite projetos, textos e
  experiência sem mexer no código, com upload de imagem. Veja abaixo.

## 🔐 Painel de administração (Firebase)

O site funciona 100% estático **sem** o Firebase (usa os dados em
`assets/js/data/` como fallback). Ativando o Firebase, você ganha um painel
protegido por login em **`/admin`** para editar tudo dinamicamente:

- **Projetos** — adicionar, editar, remover, reordenar, com **upload de imagem**.
- **Experiência** — a timeline profissional.
- **Textos das seções** — hero, sobre, contato (PT/EN).

**Segurança:** leitura é pública, mas **escrita exige login como admin** (seu
UID), validado pelas Security Rules nos servidores do Google — não no navegador.
A `firebaseConfig` no front é pública por design (não é senha).

**Como ativar:**
1. Siga o [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md) (auth + banco) e cole a regra
   de `firebase/firestore.rules` no console.
2. Siga o [`CLOUDINARY_SETUP.md`](CLOUDINARY_SETUP.md) para o upload de imagens
   (grátis; substitui o Firebase Storage, que hoje exige plano pago).
3. Preencha `assets/js/firebase/config.js` (Firebase + Cloudinary).
4. No primeiro acesso ao `/admin`, clique em **"Importar meus dados atuais"**
   para migrar o conteúdo de `assets/js/data/` para o banco.

## 🧩 O site é composto por

- **Home** — apresentação + terminal;
- **Sobre mim** — trajetória e stack;
- **Experiência** — timeline profissional;
- **Projetos** — projetos recentes com links;
- **Conhecimentos** — tecnologias;
- **Contato** — canais para falar comigo.

## 🗂️ Estrutura

```
index.html
assets/
  css/style.css              # @layer: reset, tokens, base, components, sections
  js/
    main.js                  # orquestrador
    data/                    # projects.js, experience.js, i18n.js
    modules/                 # render, theme, i18n, nav, hero, reveal, icons
  images/                    # webp otimizados
  cv/                        # currículo em PDF
  _backup/                   # GIFs originais (backup)
```

## 🚀 Rodando localmente

O projeto usa ES modules, então precisa de um servidor local:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## ✏️ Como atualizar o conteúdo

- **Projetos:** edite `assets/js/data/projects.js`.
- **Experiência (timeline):** edite `assets/js/data/experience.js`.
- **Textos PT/EN:** edite `assets/js/data/i18n.js`.
- **Currículo:** substitua `assets/cv/mauricio-cassiano-cv.pdf`.

---

<table>
  <tr>
    <td><img src="https://github.com/mauricioc08.png" width="100px" /></td>
    <td>Feito por <a href="https://github.com/mauricioc08">Mauricio Cassiano.</a></td>
  </tr>
</table>
