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
