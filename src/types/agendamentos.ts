export interface Agendamento {
  id: number;
  tipo: "PRESENCIAL" | "ONLINE" | "EXAME";
  dataHora: string; // ISO string
  nomeConsulta: string;
  nomeProfissional: string; // vem do banco, selecionado via label
  medico: string;
  pacienteId: number;
  link?: string; // para agendamentos online
  tipoExame?: string; // para exames
  resultadoExame?: string; // para exames
}
