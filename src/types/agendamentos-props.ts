import type { Agendamento } from "./agendamentos";

export interface AgendamentosProps {
    agendamentos: Agendamento[];
    removeAgendamentos: (id: number) => void;
}