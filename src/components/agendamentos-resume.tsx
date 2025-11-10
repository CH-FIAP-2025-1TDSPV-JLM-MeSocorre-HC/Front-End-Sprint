import type { Agendamento } from "../types/agendamentos";

interface AgendamentosResumeProps {
  agendamentos: Agendamento[];
  removeAgendamento: (id: number) => void; // função para atualizar o estado local após DELETE
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR");
}

function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function AgendamentosResume({ agendamentos, removeAgendamento }: AgendamentosResumeProps) {
  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente remover este agendamento?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_CHALLENGE}/agendamentos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar agendamento");

      // atualiza a lista local após remover
      removeAgendamento(id);
    } catch (error) {
      console.error(error);
      alert("Não foi possível remover o agendamento.");
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {agendamentos.map((agendamento) => (
        <div
          key={agendamento.id}
          className="flex bg-gray-100 rounded-xl min-h-20 w-full"
        >
          <div className="basis-full rounded-s-xl p-4">
            <h2 className="font-bold text-[#009aa1] text-2xl mb-2">{agendamento.nomeConsulta}</h2>
            <div className="text-gray-600">
              <p className="mt-auto">
                <span className="font-semibold">Profissional:</span> {agendamento.nomeProfissional}
              </p>
              <p>
                <span className="font-semibold">Médico:</span> {agendamento.medico}
              </p>

              {agendamento.tipo === "EXAME" && agendamento.resultadoExame && (
                <p>
                  <span className="font-semibold">Resultado:</span> {agendamento.resultadoExame}
                </p>
              )}

              {agendamento.tipo === "ONLINE" && agendamento.link && (
                <p>
                  <span className="font-semibold">Link:</span>{" "}
                  <a
                    href={agendamento.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Acessar consulta
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-100 p-4 basis-128 rounded-xl flex flex-col items-center justify-center text-gray-600">
            <p className="mb-2">
              <span className="font-semibold text-[#009aa1]">Data:</span> {formatDate(agendamento.dataHora)}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-[#009aa1]">Horário:</span> {formatTime(agendamento.dataHora)}
            </p>
            <button
              onClick={() => handleDelete(agendamento.id)}
              className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
