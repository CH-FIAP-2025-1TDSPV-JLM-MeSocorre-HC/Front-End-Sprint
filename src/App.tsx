import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from './components/layout';
import type { Teleconsulta as TeleconsultaType } from "./types/teleconsulta";
import type { Agendamento as AgendamentoType} from "./types/agendamentos"
import { lazy, Suspense, useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Fallback } from "./components/fallback";
import { Loading } from "./components/loading";

const Home = lazy(() =>
  import("./pages/home").then((m) => ({default: m.Home})))

const NovoAgendamento = lazy(() =>
  import("./pages/novo-agendamento").then((m) => ({default: m.NovoAgendamento})))

const MeusResultados = lazy(() =>
  import("./pages/meus-resultados").then((m) => ({default: m.MeusResultados})))

const Receitas = lazy(() =>
  import("./pages/receitas").then((m) => ({default: m.Receitas})))

const Teleconsulta = lazy(() =>
  import("./pages/teleconsulta").then((m) => ({default: m.Teleconsulta})))

const NovaTeleconsulta = lazy(() =>
  import("./pages/nova-teleconsulta").then((m) => ({default: m.NovaTeleconsulta})))

const TeleconsultaDetails = lazy(() =>
  import("./pages/teleconsulta-details").then((m) => ({default: m.TeleconsultaDetails})))

const Contato = lazy(() =>
  import("./pages/contato").then((m) => ({default: m.Contato})))

const Sobre = lazy(() =>
  import("./pages/sobre").then((m) => ({default: m.Sobre})))

const QuemSomos = lazy(() =>
  import("./pages/quem-somos").then((m) => ({default: m.QuemSomos})))

const Ajuda = lazy(() =>
  import("./pages/ajuda").then((m) => ({default: m.Ajuda})))

const NotFound = lazy(() =>
  import("./pages/not-found").then((m) => ({default: m.NotFound})))

function App() {
  const [teleconsultas, setTeleconsultas] = useState<TeleconsultaType[]>([]);
  const [agendamentos, setAgendamentos] = useState<AgendamentoType[]>([]);

  const addTeleconsulta = useCallback((nova: TeleconsultaType) => {
    setTeleconsultas((prev) => [...prev, nova]);
  }, []);

  const removeTeleconsulta = useCallback((id: string) => {
    setTeleconsultas((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addAgendamento = useCallback((nova: AgendamentoType) => {
    setAgendamentos((prev) => [...prev, nova]);
  }, []);

  const removeAgendamento = useCallback((id: number) => {
    setAgendamentos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={Fallback} >
        <Suspense fallback={<Loading />} >
          <Routes>
            <Route path="/" element={<Layout />}>

              <Route index
                element={<Home
                agendamentos={agendamentos}
                removeAgendamentos={removeAgendamento}
              />} />

              <Route
                path="/agendamentos/novo-agendamento"
                element={<NovoAgendamento 
                agendamentos={agendamentos}
                onAdd={addAgendamento}
              />} />

              <Route path="/meus-resultados" element={<MeusResultados />} />

              <Route path="/receitas" element={<Receitas/>} />

              <Route
                path="/teleconsultas"
                element={<Teleconsulta
                teleconsultas={teleconsultas}
                removeTeleconsulta={removeTeleconsulta}
              />} />
              <Route
                path="/teleconsultas/nova-teleconsulta" 
                element={<NovaTeleconsulta 
                teleconsultas={teleconsultas} 
                onAdd={addTeleconsulta}
              />} />
              <Route path="/agendamentos/:id" />

              <Route path="/teleconsultas/:id" element={<TeleconsultaDetails teleconsultas={teleconsultas}/>}/>

              <Route path="/ajuda" element={<Ajuda />} />
              
              <Route path="/contato" element={<Contato />} />

              <Route path="/sobre" element={<Sobre/>} />

              <Route path="/quem-somos" element={<QuemSomos />} />

              <Route path="*" element={<NotFound />}/>
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
