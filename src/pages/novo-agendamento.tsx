import { useState } from "react";
import { AgendamentosForm } from "../components/agendamentos-form";
import type { Agendamento } from "../types/agendamentos";
import { useNavigate } from "react-router-dom";

interface NovoAgendamentoProps {
  agendamentos: Agendamento[];
  onAdd: (nova: Agendamento) => void;
}

export function NovoAgendamento({ onAdd }: NovoAgendamentoProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Função que cria o agendamento via API e também atualiza o estado do App
  async function handleAdd(agendamento: Agendamento) {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_CHALLENGE}/agendamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamento),
      });

      if (!response.ok) throw new Error("Erro ao salvar agendamento");

      const data: Agendamento = await response.json();
      console.log("Agendamento criado:", data);

      // Atualiza o estado do App
      onAdd(data);

      navigate("/"); // volta para a Home
    } catch (error) {
      console.error(error);
      alert("Erro ao criar agendamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="titulo">Novo Agendamento</h1>
      {loading ? (
        <p>Salvando agendamento...</p>
      ) : (
        <AgendamentosForm onAdd={handleAdd} />
      )}
    </div>
  );
}
