import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/auth-context';
import type { Agendamento } from '../types/agendamentos';
import type { NovoAgendamento } from '../types/novo-agendamento';

export function useAgendamentos() {
    const { user } = useContext(AuthContext);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAgendamentos = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/agendamentos/paciente/${user.id}`);
            if (!response.ok) throw new Error('Erro ao buscar agendamentos');
            const data: Agendamento[] = await response.json();
            setAgendamentos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const criarAgendamento = async (novo: NovoAgendamento) => {
        if (!user) return;
        try {
            const response = await fetch('http://localhost:8080/agendamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...novo, pacienteId: user.id }),
            });
            if (!response.ok) throw new Error('Erro ao criar agendamento');
            const criado: Agendamento = await response.json();
            setAgendamentos(prev => [...prev, criado]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchAgendamentos();
    }, [user]);

    return { agendamentos, loading, error, fetchAgendamentos, criarAgendamento };
}
