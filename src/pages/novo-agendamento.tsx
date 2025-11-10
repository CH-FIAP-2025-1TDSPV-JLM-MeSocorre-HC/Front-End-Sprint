import { useState } from "react";
import { AgendamentosForm } from "../components/agendamentos-form";
import type { Agendamento } from "../types/agendamentos";
import { useNavigate } from "react-router-dom";

export function NovoAgendamento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onAdd(agendamento: Agendamento) {
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
        <AgendamentosForm onAdd={onAdd} />
      )}
    </div>
  );
}
