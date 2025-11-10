import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AgendamentosList } from "../components/agendamentos-list";
import type { Agendamento } from "../types/agendamentos";

interface HomeProps {
  agendamentos: Agendamento[];
  removeAgendamentos: (id: number) => void;
}

export function Home({ removeAgendamentos }: HomeProps) {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAgendamentos() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_CHALLENGE}/agendamentos`);
                if (!response.ok) throw new Error("Erro ao buscar agendamentos");
                const data: Agendamento[] = await response.json();
                setAgendamentos(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchAgendamentos();
    }, []);

    if (loading) return (
        <div>
            <h1 className="titulo">Meus Agendamentos</h1>
            <p>Carregando agendamentos...</p>
        </div>
    );

    return (
        <div>
            <h1 className="titulo">Meus Agendamentos</h1>
            <div className="flex flex-col items-center">
                <Link
                    to="/agendamentos/novo-agendamento"
                    className="bg-[#0077c8] p-2 rounded-lg text-white mb-4"
                >
                    Novo Agendamento
                </Link>
                <AgendamentosList
                    agendamentos={agendamentos}
                    removeAgendamentos={(id) => setAgendamentos((prev) => prev.filter(a => a.id !== id))}
                />

            </div>
        </div>
    );
}
