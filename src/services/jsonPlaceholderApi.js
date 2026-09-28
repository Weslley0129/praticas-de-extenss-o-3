// Integração com uma API pública real (JSONPlaceholder), conforme pedido no
// requisito "Integração com APIs RESTful" da atividade.
const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function buscarPosts(limite = 6) {
  const resposta = await fetch(`${BASE_URL}/posts?_limit=${limite}`);
  if (!resposta.ok) throw new Error(`Erro na API: ${resposta.status}`);
  return resposta.json();
}
