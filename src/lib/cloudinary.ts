"use client";

// Upload de imagem para o Cloudinary (unsigned) — sem backend nem segredo.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryEnabled = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export function uploadToCloudinary(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!cloudinaryEnabled) {
    return Promise.reject(new Error("Cloudinary não configurado (.env)."));
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET as string);

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
