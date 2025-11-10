import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { AgendamentosSchema, type AgendamentosFormData } from "../schemas/agendamentos-schema";
import type { Agendamento } from "../types/agendamentos";

export function AgendamentosRemarcar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const agendamento = location.state?.agendamento as Agendamento | undefined;

  const [tipoSelecionado, setTipoSelecionado] = useState<string>(agendamento?.tipo || "");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AgendamentosFormData>({
    resolver: zodResolver(AgendamentosSchema),
  });

  useEffect(() => {
    if (agendamento) {
      const [data, hora] = agendamento.dataHora.split("T");
      reset({
        nomeConsulta: agendamento.nomeConsulta,
        tipo: agendamento.tipo,
        medico: agendamento.medico,
        nomeProfissional: agendamento.nomeProfissional,
        data,
        hora,
        link: agendamento.link,
        tipoExame: agendamento.tipoExame,
        resultadoExame: agendamento.resultadoExame,
      });
      setTipoSelecionado(agendamento.tipo);
    }
  }, [agendamento, reset]);

  const profissionais = [
    { nome: "Dr. João Silva", especialidade: "Cardiologia" },
    { nome: "Dra. Maria Lima", especialidade: "Cardiologia" },
    { nome: "Dr. Carlos Souza", especialidade: "Dermatologia" },
    { nome: "Dra. Ana Costa", especialidade: "Dermatologia" },
    { nome: "Dr. Pedro Alves", especialidade: "Ortopedia" },
    { nome: "Dra. Luiza Martins", especialidade: "Ortopedia" },
  ];

  const especialidades = Array.from(new Set(profissionais.map(p => p.especialidade)));
  const especialidadeSelecionada = watch("medico");
  const profissionaisFiltrados = especialidadeSelecionada
    ? profissionais.filter(p => p.especialidade === especialidadeSelecionada)
    : [];

  async function onSubmit(data: AgendamentosFormData) {
    console.log("✅ onSubmit disparou:", data);
    try {
      const agendamentoAtualizado: Agendamento = {
        ...agendamento!,
        tipo: data.tipo as "PRESENCIAL" | "ONLINE" | "EXAME",
        dataHora: `${data.data}T${data.hora}`,
        nomeConsulta: data.nomeConsulta,
        nomeProfissional: data.nomeProfissional,
        medico: data.medico,
        link: data.link,
        tipoExame: data.tipoExame,
        resultadoExame: data.resultadoExame,
      };

      const response = await fetch(`${import.meta.env.VITE_API_CHALLENGE}/agendamentos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoAtualizado),
      });

      if (!response.ok) throw new Error("Erro ao remarcar agendamento");

      alert("Agendamento remarcado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Não foi possível remarcar o agendamento.");
    }
  }

  console.log("🧩 Erros atuais do form:", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-xl p-4 flex flex-col gap-3 mb-5 w-4/5">
      <h2 className="text-2xl font-bold text-[#0077c8] mb-3">Remarcar Agendamento</h2>

      <label htmlFor="nomeConsulta">Nome da Consulta</label>
      <input type="text" id="nomeConsulta" className="border rounded p-2" {...register("nomeConsulta")} />
      {errors.nomeConsulta && <p className="text-red-500">{errors.nomeConsulta.message}</p>}

      <label htmlFor="tipo">Tipo</label>
      <select
        id="tipo"
        className="border rounded p-2"
        {...register("tipo")}
        onChange={(e) => setTipoSelecionado(e.target.value)}
        value={tipoSelecionado}
      >
        <option value="">Selecione o tipo</option>
        <option value="PRESENCIAL">PRESENCIAL</option>
        <option value="ONLINE">ONLINE</option>
        <option value="EXAME">EXAME</option>
      </select>
      {errors.tipo && <p className="text-red-500">{errors.tipo.message?.toString()}</p>}

      <label htmlFor="medico">Especialidade</label>
      <select id="medico" className="border rounded p-2" {...register("medico")}>
        <option value="">Selecione a especialidade</option>
        {especialidades.map((esp) => (
          <option key={esp} value={esp}>{esp}</option>
        ))}
      </select>
      {errors.medico && <p className="text-red-500">{errors.medico.message}</p>}

      <label htmlFor="nomeProfissional">Profissional</label>
      <select id="nomeProfissional" className="border rounded p-2" {...register("nomeProfissional")}>
        <option value="">Selecione o profissional</option>
        {profissionaisFiltrados.map((p) => (
          <option key={p.nome} value={p.nome}>{p.nome}</option>
        ))}
      </select>
      {errors.nomeProfissional && <p className="text-red-500">{errors.nomeProfissional.message}</p>}

      {tipoSelecionado === "ONLINE" && (
        <>
          <label htmlFor="link">Link da consulta</label>
          <input type="url" id="link" className="border rounded p-2" {...register("link")} />
          {errors.link && <p className="text-red-500">{errors.link.message}</p>}
        </>
      )}

      {tipoSelecionado === "EXAME" && (
        <>
          <label htmlFor="tipoExame">Tipo de Exame</label>
          <input type="text" id="tipoExame" className="border rounded p-2" {...register("tipoExame")} />

          <label htmlFor="resultadoExame">Resultado do Exame</label>
          <input type="text" id="resultadoExame" className="border rounded p-2" {...register("resultadoExame")} />
        </>
      )}

      <label htmlFor="data">Data</label>
      <input type="date" id="data" className="border rounded p-2" {...register("data")} />
      {errors.data && <p className="text-red-500">{errors.data.message}</p>}

      <label htmlFor="hora">Hora</label>
      <input type="time" id="hora" className="border rounded p-2" {...register("hora")} />
      {errors.hora && <p className="text-red-500">{errors.hora.message}</p>}

      <button
        type="submit"
        className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition"
      >
        Confirmar Remarcação
      </button>
    </form>
  );
}
