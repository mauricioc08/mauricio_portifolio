# 🖼️ Setup do Cloudinary — upload de imagens (grátis)

O upload de imagens dos projetos usa o **Cloudinary** (plano gratuito: 25 GB de
armazenamento + 25 GB de banda/mês — muito além de um portfólio). Assim não
precisamos do Firebase Storage, que agora exige plano pago.

O método é **unsigned upload**: o navegador envia a imagem direto para o
Cloudinary usando um "preset" público. Não há backend nem segredo exposto.

Leva ~3 minutos.

---

## 1. Criar conta

1. Acesse <https://cloudinary.com> → **Sign up** (grátis, pode usar o Google).
2. Ao entrar, no Dashboard você verá seu **Cloud name** (algo como `dxxxx123`).
   Anote — é o que você me envia.

---

## 2. Criar um Upload Preset (unsigned)

1. No painel do Cloudinary, vá em **Settings** (engrenagem) → aba **Upload**.
2. Role até **Upload presets** → **Add upload preset**.
3. Configure:
   - **Signing Mode:** selecione **Unsigned** (importante!).
   - **Upload preset name:** deixe o gerado ou coloque `portfolio_unsigned`.
   - (Opcional) **Folder:** `portfolio/projects` para organizar.
4. **Save**.
5. Anote o **nome do preset** — é o que você me envia junto do Cloud name.

---

## 3. (Opcional) Restringir formatos

Ainda no preset, você pode limitar a imagens:
- Em **Allowed formats**: `jpg, png, webp, gif`.
- Em **Incoming Transformation** (opcional): redimensionar para largura máx.
  (ex.: `width=1200,crop=limit`) para economizar banda.

---

## 4. O que me enviar

Cole aqui (ou direto em `assets/js/firebase/config.js`, no objeto
`cloudinaryConfig`):

1. **Cloud name** (passo 1).
2. **Upload preset** (passo 2).

Exemplo do que fica no `config.js`:

```js
export const cloudinaryConfig = {
  cloudName: "dxxxx123",
  uploadPreset: "portfolio_unsigned",
  folder: "portfolio/projects",
};
```

---

## 🔒 Nota de segurança

- O **upload preset unsigned** é feito para ficar público no front — ele só
  permite *enviar* imagens, não apagar nem listar sua conta.
- Nada de segredo (API secret) vai para o código. O API secret do Cloudinary
  **nunca** é usado aqui.
- Se quiser mais controle, dá para ativar moderação/limites no próprio preset.
