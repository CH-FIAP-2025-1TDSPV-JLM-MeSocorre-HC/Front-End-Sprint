export interface NovoAgendamento {
    tipo: 'PRESENCIAL' | 'ONLINE' | 'EXAME';
    dataHora: string;
    nomeConsulta: string;
    nomeProfissional: string;
    medico: string;
    link?: string;
}