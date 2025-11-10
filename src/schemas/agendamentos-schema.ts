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

  // Campos opcionais que só são obrigatórios dependendo do tipo
  link: z.string().url('O link precisa ser uma URL válida').optional().nullable(),
  tipoExame: z.string().optional().nullable(),
  resultadoExame: z.string().optional().nullable(),
})
.superRefine((data, ctx) => {
  if (data.tipo === 'ONLINE' && !data.link) {
    ctx.addIssue({
      path: ['link'],
      code: z.ZodIssueCode.custom,
      message: 'O link é obrigatório para consultas online!',
    });
  }

  if (data.tipo === 'EXAME' && !data.tipoExame) {
    ctx.addIssue({
      path: ['tipoExame'],
      code: z.ZodIssueCode.custom,
      message: 'O tipo de exame é obrigatório!',
    });
  }

  if (data.tipo === 'EXAME' && !data.resultadoExame) {
    ctx.addIssue({
      path: ['resultadoExame'],
      code: z.ZodIssueCode.custom,
      message: 'O resultado do exame é obrigatório!',
    });
  }
});

export type AgendamentosFormData = z.infer<typeof AgendamentosSchema>;
