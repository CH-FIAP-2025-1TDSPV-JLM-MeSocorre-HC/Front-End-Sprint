import type { Agendamento } from "../types/agendamentos";
import { AgendamentosResume } from "./agendamentos-resume";

interface AgendamentosListProps {
  agendamentos: Agendamento[];
  removeAgendamentos: (id: number) => void;
}

export function AgendamentosList({ agendamentos, removeAgendamentos }: AgendamentosListProps) {
  return (
    <AgendamentosResume 
      agendamentos={agendamentos} 
      removeAgendamento={removeAgendamentos} 
    />
  );
}
