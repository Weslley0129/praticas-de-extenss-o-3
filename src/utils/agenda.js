const ORDEM_DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function paraMinutos(horario) {
  const [h, m] = horario.split(":").map(Number);
  return h * 60 + m;
}

function agruparPorDia(horariosFixos) {
  const mapa = new Map();
  for (const { dia_semana: dia, horario } of horariosFixos) {
    if (!mapa.has(dia)) mapa.set(dia, new Set());
    mapa.get(dia).add(horario);
  }
  const grupos = [];
  for (const dia of ORDEM_DIAS) {
    if (mapa.has(dia)) {
      grupos.push({ dia, horarios: [...mapa.get(dia)].sort() });
    }
  }
  return grupos;
}

function formatarFaixasHorario(horariosOrdenados) {
  const faixas = [];
  let inicio = horariosOrdenados[0];
  let anterior = horariosOrdenados[0];

  for (let i = 1; i < horariosOrdenados.length; i++) {
    const atual = horariosOrdenados[i];
    if (paraMinutos(atual) - paraMinutos(anterior) === 60) {
      anterior = atual;
    } else {
      faixas.push([inicio, anterior]);
      inicio = atual;
      anterior = atual;
    }
  }
  faixas.push([inicio, anterior]);
  return faixas.map(([a, b]) => (a === b ? a : `${a} às ${b}`)).join(" e ");
}

function formatarDias(dias) {
  if (dias.length === 1) return dias[0];

  const indices = dias.map((dia) => ORDEM_DIAS.indexOf(dia));
  const contiguo = indices.every((indice, i) => i === 0 || indice === indices[i - 1] + 1);

  if (contiguo) {
    return `${dias[0]} a ${dias[dias.length - 1].toLowerCase()}`;
  }
  return dias.length === 2
    ? dias.join(" e ")
    : `${dias.slice(0, -1).join(", ")} e ${dias[dias.length - 1]}`;
}

/** Resume a agenda fixa de um médico numa frase curta, agrupando dias com o mesmo horário. */
export function resumirAgendaSemanal(horariosFixos) {
  const grupos = agruparPorDia(horariosFixos);
  if (grupos.length === 0) return "";

  const assinatura = (horarios) => horarios.join(",");
  const primeiraAssinatura = assinatura(grupos[0].horarios);
  const uniforme = grupos.every((g) => assinatura(g.horarios) === primeiraAssinatura);

  if (uniforme) {
    const dias = formatarDias(grupos.map((g) => g.dia));
    const faixas = formatarFaixasHorario(grupos[0].horarios);
    return `${dias}, horários disponíveis: ${faixas}.`;
  }

  return grupos.map((g) => `${g.dia}: ${g.horarios.join(", ")}`).join(" · ");
}

export { agruparPorDia };
