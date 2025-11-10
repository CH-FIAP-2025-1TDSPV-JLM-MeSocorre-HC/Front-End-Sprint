import type { Agendamento } from "../types/agendamentos";
interface AgendamentosCardProps {
  agendamento: Agendamento;
}

export function AgendamentosCard({ agendamento }: AgendamentosCardProps) {
  const [data, horaCompleta] = agendamento.dataHora.split("T");
  const hora = horaCompleta.substring(0, 5);

  return (
    <div className="bg-white shadow rounded-lg p-4 w-3/5">
      <h2>{agendamento.tipo}</h2>
      <p>Data: {data}</p>
      <p>Horário: {hora}</p>
      <p>Especialidade: {agendamento.medico}</p>
      <p>Profissional: {agendamento.nomeProfissional}</p>
    </div>
  );
}
