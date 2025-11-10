export interface Agendamento {
  id: number;
  tipo: "PRESENCIAL" | "ONLINE" | "EXAME";
  dataHora: string; // ISO string
  nomeConsulta: string;
  nomeProfissional: string; // vem do banco, selecionado via label
  medico: string;
  pacienteId: number;
  link?: string | null; // para agendamentos online
  tipoExame?: string | null; // para exames
  resultadoExame?: string | null; // para exames
}
