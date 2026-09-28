// Camada de serviço que fala com a API REST do Clique Saúde.
// Em dev, essa API é simulada pelo json-server a partir de db.json,
// mas o "contrato" (rotas e formato dos dados) segue o que já existe
// hoje no backend Flask real (ver docs/documentacao-tecnica.html do
// sistema anterior): /api/medicos, /api/agendar, /api/minhas_consultas...
import { sha256 } from "../utils/hash";

const BASE_URL = "http://localhost:3001";

async function tratarResposta(resposta) {
  if (!resposta.ok) {
    throw new Error(`Erro na API: ${resposta.status}`);
  }
  return resposta.json();
}

// GET /api/medicos?especialidade=...
export async function buscarMedicos(especialidade) {
  const url = especialidade && especialidade !== "Todas"
    ? `${BASE_URL}/medicos?especialidade=${encodeURIComponent(especialidade)}`
    : `${BASE_URL}/medicos`;
  const resposta = await fetch(url);
  return tratarResposta(resposta);
}

// GET /api/medicos/:id
export async function buscarMedico(id) {
  const resposta = await fetch(`${BASE_URL}/medicos/${id}`);
  return tratarResposta(resposta);
}

// GET /api/horarios/:medico_id
export async function buscarHorariosDoMedico(medicoId) {
  const resposta = await fetch(`${BASE_URL}/horarios_disponiveis?medico_id=${medicoId}`);
  return tratarResposta(resposta);
}

// GET /api/especialidades
export async function buscarEspecialidades() {
  const medicos = await buscarMedicos();
  return [...new Set(medicos.map((m) => m.especialidade))];
}

// POST /login — replica a verificação por hash SHA-256 do backend real
export async function login(email, senha) {
  const senhaHash = await sha256(senha);
  const resposta = await fetch(`${BASE_URL}/usuarios?email=${encodeURIComponent(email)}`);
  const usuarios = await tratarResposta(resposta);
  const usuario = usuarios.find((u) => u.senha === senhaHash);
  if (!usuario) {
    throw new Error("E-mail ou senha inválidos.");
  }
  return { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo };
}

// POST /cadastro
export async function cadastrarPaciente({ nome, email, senha }) {
  const existentes = await fetch(`${BASE_URL}/usuarios?email=${encodeURIComponent(email)}`).then(tratarResposta);
  if (existentes.length > 0) {
    throw new Error("E-mail já cadastrado.");
  }
  const senhaHash = await sha256(senha);
  const resposta = await fetch(`${BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha: senhaHash, tipo: "paciente" }),
  });
  return tratarResposta(resposta);
}

// GET /api/minhas_consultas (aqui filtrado por paciente_id no client, já que
// o json-server não tem sessão de servidor)
export async function buscarConsultasDoPaciente(pacienteId) {
  const resposta = await fetch(`${BASE_URL}/consultas?paciente_id=${pacienteId}&_sort=data,hora`);
  return tratarResposta(resposta);
}

export async function buscarTodasConsultas() {
  const resposta = await fetch(`${BASE_URL}/consultas?_sort=data,hora`);
  return tratarResposta(resposta);
}

// POST /api/agendar — verifica disponibilidade antes de criar, como no backend real
export async function agendarConsulta({ pacienteId, medicoId, data, hora, observacoes }) {
  const ocupadas = await fetch(
    `${BASE_URL}/consultas?medico_id=${medicoId}&data=${data}&hora=${hora}&status=Agendado`
  ).then(tratarResposta);

  if (ocupadas.length > 0) {
    throw new Error("Esse horário já foi reservado. Escolha outro.");
  }

  const resposta = await fetch(`${BASE_URL}/consultas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paciente_id: pacienteId,
      medico_id: medicoId,
      data,
      hora,
      status: "Agendado",
      observacoes: observacoes || "",
    }),
  });
  return tratarResposta(resposta);
}

// POST /api/cancelar_consulta/:id
export async function cancelarConsulta(id) {
  const resposta = await fetch(`${BASE_URL}/consultas/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Cancelado" }),
  });
  return tratarResposta(resposta);
}
