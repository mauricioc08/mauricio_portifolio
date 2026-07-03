// Upload de imagem para o Cloudinary (unsigned). Sem backend nem segredo:
// o navegador faz POST direto para a API do Cloudinary usando o upload preset.
import { cloudinaryConfig, cloudinaryEnabled } from "./config.js";

export function isCloudinaryEnabled() {
  return cloudinaryEnabled;
}

/**
 * Envia um File e retorna a URL segura (https) da imagem.
 * @param {File} file
 * @param {(pct:number)=>void} [onProgress]
 * @returns {Promise<string>} secure_url
 */
export function uploadToCloudinary(file, onProgress) {
  if (!cloudinaryEnabled) {
    return Promise.reject(new Error("Cloudinary não configurado (config.js)."));
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", cloudinaryConfig.uploadPreset);
  if (cloudinaryConfig.folder) form.append("folder", cloudinaryConfig.folder);

  // XHR (em vez de fetch) para ter progresso de upload
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.secure_url) {
          resolve(res.secure_url);
        } else {
          reject(new Error(res.error?.message || "Falha no upload."));
        }
      } catch {
        reject(new Error("Resposta inválida do Cloudinary."));
      }
    };
    xhr.onerror = () => reject(new Error("Erro de rede no upload."));
    xhr.send(form);
  });
}
