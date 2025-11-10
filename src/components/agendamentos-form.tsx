import type { Agendamento } from "../types/agendamentos";
import { useForm } from "react-hook-form";
import { AgendamentosSchema, type AgendamentosFormData } from "../schemas/agendamentos-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface AgendamentosFormProps {
  onAdd: (agendamento: Agendamento) => void;
}

// Fetch de profissionais do backend
async function fetchProfissionais(): Promise<string[]> {
  const response = await fetch(`${import.meta.env.VITE_API_CHALLENGE}/profissionais`);
  if (!response.ok) throw new Error("Erro ao buscar profissionais");
  const data = await response.json();
  return data.map((p: any) => p.nome);
}

export function AgendamentosForm({ onAdd }: AgendamentosFormProps) {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AgendamentosFormData>({
    resolver: zodResolver(AgendamentosSchema),
  });

  const tipo = watch("tipo");

  useEffect(() => {
    fetchProfissionais()
      .then(setProfissionais)
      .catch(console.error);
  }, []);

  async function onSubmit(data: AgendamentosFormData) {
    try {
      // Criamos o objeto sem o ID
      const agendamento: Omit<Agendamento, "id"> = {
        tipo: data.tipo as "PRESENCIAL" | "ONLINE" | "EXAME",
        dataHora: `${data.data}T${data.hora}`,
        nomeConsulta: data.nomeConsulta,
        nomeProfissional: data.nomeProfissional,
        medico: data.medico,
        pacienteId: 1, // substituir pelo usuário logado, se houver
        link: data.tipo === "ONLINE" ? data.link : undefined,
        tipoExame: data.tipo === "EXAME" ? data.tipoExame : undefined,
        resultadoExame: data.tipo === "EXAME" ? data.resultadoExame : undefined,
      };

      // Envia para o backend
      const response = await fetch(`${import.meta.env.VITE_API_CHALLENGE}/agendamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamento),
      });

      if (!response.ok) throw new Error("Erro ao criar agendamento");

      const agendamentoCriado: Agendamento = await response.json();

      // Adiciona o objeto com ID retornado
      onAdd(agendamentoCriado);
      reset();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Não foi possível criar o agendamento.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow rounded-xl p-4 flex flex-col gap-3 mb-5 w-4/5"
    >
      <label htmlFor="nomeConsulta">Nome da Consulta</label>
      <input
        type="text"
        id="nomeConsulta"
        placeholder="Nome da consulta"
        className="border rounded p-2"
        {...register("nomeConsulta")}
      />
      {errors.nomeConsulta && <p className="text-red-500">{errors.nomeConsulta.message}</p>}

      <label htmlFor="tipo">Tipo</label>
      <select id="tipo" className="border rounded p-2" {...register("tipo")}>
        <option value="PRESENCIAL">PRESENCIAL</option>
        <option value="ONLINE">ONLINE</option>
        <option value="EXAME">EXAME</option>
      </select>
      {errors.tipo && <p className="text-red-500">{errors.tipo.message}</p>}

      <label htmlFor="data">Data</label>
      <input type="date" id="data" className="border rounded p-2" {...register("data")} />
      {errors.data && <p className="text-red-500">{errors.data.message}</p>}

      <label htmlFor="hora">Horário</label>
      <input type="time" id="hora" className="border rounded p-2" {...register("hora")} />
      {errors.hora && <p className="text-red-500">{errors.hora.message}</p>}

      <label htmlFor="medico">Médico</label>
      <input type="text" id="medico" className="border rounded p-2" {...register("medico")} />
      {errors.medico && <p className="text-red-500">{errors.medico.message}</p>}

      <label htmlFor="nomeProfissional">Profissional</label>
      <select id="nomeProfissional" className="border rounded p-2" {...register("nomeProfissional")}>
        {profissionais.map((profissional) => (
          <option key={profissional} value={profissional}>
            {profissional}
          </option>
        ))}
      </select>
      {errors.nomeProfissional && <p className="text-red-500">{errors.nomeProfissional.message}</p>}

      {/* Campos condicionais */}
      {tipo === "ONLINE" && (
        <>
          <label htmlFor="link">Link da consulta</label>
          <input
            type="url"
            id="link"
            placeholder="https://"
            className="border rounded p-2"
            {...register("link")}
          />
          {errors.link && <p className="text-red-500">{errors.link.message}</p>}
        </>
      )}

      {tipo === "EXAME" && (
        <>
          <label htmlFor="tipoExame">Tipo de Exame</label>
          <input
            type="text"
            id="tipoExame"
            placeholder="Tipo de exame"
            className="border rounded p-2"
            {...register("tipoExame")}
          />
          {errors.tipoExame && <p className="text-red-500">{errors.tipoExame.message}</p>}

          <label htmlFor="resultadoExame">Resultado do Exame</label>
          <input
            type="text"
            id="resultadoExame"
            placeholder="Resultado do exame"
            className="border rounded p-2"
            {...register("resultadoExame")}
          />
          {errors.resultadoExame && <p className="text-red-500">{errors.resultadoExame.message}</p>}
        </>
      )}

      <button
        type="submit"
        className="bg-[#0077c8] text-white px-4 py-2 rounded-xl hover:bg-blue-700"
      >
        Adicionar Agendamento
      </button>
    </form>
  );
}
