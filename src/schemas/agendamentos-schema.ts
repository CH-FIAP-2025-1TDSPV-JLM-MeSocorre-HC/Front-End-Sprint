import { z } from 'zod';

export const AgendamentosSchema = z.object({
  tipo: z.enum(['PRESENCIAL', 'ONLINE', 'EXAME'], {
    error: 'O tipo de agendamento é obrigatório!',
  }),
  nomeConsulta: z.string().nonempty('O nome da consulta é obrigatório!'),
  data: z.string().nonempty('A data é obrigatória!'),
  hora: z.string().nonempty('O horário é obrigatório!'),
  medico: z.string().nonempty('O nome do médico é obrigatório!'),
  nomeProfissional: z.string().nonempty('O nome do profissional é obrigatório!'),
  link: z.string().url('O link precisa ser uma URL válida').optional(), // apenas para ONLINE
  tipoExame: z.string().optional(), // apenas para EXAME
  resultadoExame: z.string().optional(), // apenas para EXAME
});

export type AgendamentosFormData = z.infer<typeof AgendamentosSchema>;