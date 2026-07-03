// ============================================================
// Config do Firebase (PÚBLICA — pode ficar no front, veja
// FIREBASE_SETUP.md, seção "Nota de segurança").
//
// >>> PREENCHA com os dados que você copiou do Firebase Console. <<<
// Enquanto os placeholders não forem trocados, `firebaseEnabled` fica
// false e o site usa APENAS os dados locais (fallback) — nada quebra.
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyBPWABppetC4v6kqq8vB3hkigESsmfm3Ts",
  authDomain: "portifolio-1af31.firebaseapp.com",
  projectId: "portifolio-1af31",
  storageBucket: "portifolio-1af31.firebasestorage.app",
  messagingSenderId: "199692649702",
  appId: "1:199692649702:web:b40df4af90249a9571e727",
};

// UID do seu usuário admin (Authentication → Users → User UID).
// Usado no painel para conferir que quem logou é você. A regra de verdade
// que bloqueia escrita de terceiros está nas Security Rules (servidor).
export const ADMIN_UID = "0ONJnhFcYvPQsjhh9Ykzcv4AZM23";

// Versão do SDK via CDN (modular, ESM).
export const FIREBASE_SDK_VERSION = "10.12.2";

// true quando a config foi realmente preenchida.
export const firebaseEnabled = !Object.values(firebaseConfig).some(
  (v) => v === "COLE_AQUI" || !v
);

// ============================================================
// Cloudinary — upload de imagens dos projetos (plano free).
// Usa "unsigned upload preset": o navegador envia direto, sem backend
// nem segredo exposto. Veja CLOUDINARY_SETUP.md.
// ============================================================
export const cloudinaryConfig = {
  cloudName: "e0k7dxoe",
  uploadPreset: "portfolio_unsigned", // preset unsigned criado no Cloudinary
  folder: "", // deixe "" (sua conta usa Dynamic folders; o preset define a pasta)
};

// só é considerado configurado quando o preset foi realmente preenchido.
export const cloudinaryEnabled =
  !!cloudinaryConfig.cloudName &&
  !!cloudinaryConfig.uploadPreset &&
  cloudinaryConfig.uploadPreset !== "COLE_AQUI";
