// Replica no front-end o mesmo hash usado no backend Flask (hashlib.sha256),
// só para fins de demonstração — em produção a verificação de senha é 100% server-side.
export async function sha256(texto) {
  const dados = new TextEncoder().encode(texto);
  const bufferHash = await crypto.subtle.digest("SHA-256", dados);
  return Array.from(new Uint8Array(bufferHash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
