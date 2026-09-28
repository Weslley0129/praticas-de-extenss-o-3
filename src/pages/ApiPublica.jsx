import { useEffect, useState } from "react";
import EstadoCarregamento from "../components/EstadoCarregamento";
import { buscarPosts } from "../services/jsonPlaceholderApi";

// Requisito "Integração com APIs RESTful": consumo de uma API pública
// (JSONPlaceholder), independente da API do Clique Saúde.
function ApiPublica() {
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const dados = await buscarPosts(6);
        if (ativo) setPosts(dados);
      } catch {
        if (ativo) setErro("Não foi possível buscar dados do JSONPlaceholder agora.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1>Demonstração: API pública (JSONPlaceholder)</h1>
        <p>
          Prática isolada de integração REST com <code>fetch</code> + <code>async/await</code>, sem
          relação com os dados do Clique Saúde — só para cumprir o requisito da atividade.
        </p>
      </div>

      {erro && <EstadoCarregamento tipo="erro" mensagem={erro} />}

      {carregando ? (
        <EstadoCarregamento mensagem="Buscando posts em jsonplaceholder.typicode.com..." />
      ) : (
        <div className="lista">
          {posts.map((post) => (
            <article key={post.id} className="cartao">
              <h3 style={{ margin: "0 0 6px", textTransform: "capitalize" }}>{post.title}</h3>
              <p style={{ margin: 0, color: "var(--text-muted)" }}>{post.body}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApiPublica;
