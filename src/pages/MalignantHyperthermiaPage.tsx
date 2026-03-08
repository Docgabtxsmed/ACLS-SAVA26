import { useState } from 'react';
import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';
import './ContentPage.css';

type Tab = 'diagnostico' | 'prevencao' | 'tratamento' | 'pos';

export default function MalignantHyperthermiaPage() {
  const [activeTab, setActiveTab] = useState<Tab>('diagnostico');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'diagnostico', label: 'Diagnóstico' },
    { key: 'prevencao', label: 'Prevenção' },
    { key: 'tratamento', label: 'Tratamento' },
    { key: 'pos', label: 'Cuidados Pós' },
  ];

  return (
    <div className="algo-page">
      <Navbar title="Hipertermia Maligna" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🌡️</span>
        <h1 className="algo-page-title">Hipertermia Maligna</h1>
        <span className="algo-page-case">Emergência Anestésica — Crise Hipermetabólica</span>
      </header>

      <div className="content-tabs" style={{ '--tab-accent': '#d84315' } as React.CSSProperties}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`content-tab ${activeTab === tab.key ? 'content-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content-body" key={activeTab}>
        {activeTab === 'diagnostico' && <DiagnosticoTab />}
        {activeTab === 'prevencao' && <PrevencaoTab />}
        {activeTab === 'tratamento' && <TratamentoTab />}
        {activeTab === 'pos' && <PosProcedimentoTab />}
      </div>
    </div>
  );
}

function DiagnosticoTab() {
  return (
    <>
      <div className="content-alert content-alert--danger">
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">Diagnóstico Clínico</div>
          <div className="content-alert-text">
            A Hipertermia Maligna é uma emergência anestésica rara, com mortalidade que pode chegar
            a 70% se não tratada. O diagnóstico é CLÍNICO e deve ser suspeitado precocemente.
            A hipertermia em si pode ser um sinal TARDIO.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#ff9800' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">⚡</div>
          <div>
            <div className="content-section-title">Sinais Precoces</div>
            <div className="content-section-subtitle">Primeiro indicador — alta suspeição clínica</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Espasmo masseterino</strong> após succinilcolina — sinal de alerta clássico</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Aumento inexplicável do EtCO₂</strong> — sinal mais precoce e sensível</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Taquicardia sinusal inexplicada</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Taquipneia (em paciente em ventilação espontânea)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Rigidez muscular generalizada</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Acidose respiratória e metabólica mista</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#e94560' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🔥</div>
          <div>
            <div className="content-section-title">Sinais Tardios</div>
            <div className="content-section-subtitle">Indicam crise já instalada — maior gravidade</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Hipertermia</strong> — aumento &gt;1°C a cada 5 min (pode chegar a &gt;43°C)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Rabdomiólise — CK elevada, mioglobinúria</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Hipercalemia severa — risco de arritmias</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Coagulação intravascular disseminada (CIVD)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Insuficiência renal aguda</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Arritmias ventriculares e PCR</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-header">
          <div className="content-section-icon">🔬</div>
          <div>
            <div className="content-section-title">Exames Laboratoriais</div>
            <div className="content-section-subtitle">Confirmar e acompanhar gravidade</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Exame</th>
                <th>Alteração Esperada</th>
                <th>Importância</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gasometria</td>
                <td>Acidose mista (↓pH, ↑PaCO₂, ↓BE)</td>
                <td>Precoce</td>
              </tr>
              <tr>
                <td>Potássio (K⁺)</td>
                <td>Hipercalemia</td>
                <td>Risco de arritimia</td>
              </tr>
              <tr>
                <td>CK (Creatinofosfoquinase)</td>
                <td>Elevação marcada (&gt;10.000 U/L)</td>
                <td>Rabdomiólise</td>
              </tr>
              <tr>
                <td>Mioglobina urinária</td>
                <td>Positiva — urina escura</td>
                <td>Lesão renal</td>
              </tr>
              <tr>
                <td>Lactato</td>
                <td>Elevado</td>
                <td>Hipoperfusão</td>
              </tr>
              <tr>
                <td>Coagulograma</td>
                <td>Alargamento (CIVD)</td>
                <td>Tardio</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PrevencaoTab() {
  return (
    <>
      <div className="content-section" style={{ '--item-accent': '#d84315' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">⚗️</div>
          <div>
            <div className="content-section-title">Agentes Desencadeantes</div>
            <div className="content-section-subtitle">Devem ser EVITADOS em pacientes suscetíveis</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Anestésicos inalatórios halogenados:</strong> Sevoflurano, Desflurano, Isoflurano, Halotano</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Succinilcolina</strong> (bloqueador neuromuscular despolarizante)</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#4caf50' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">✅</div>
          <div>
            <div className="content-section-title">Agentes Seguros</div>
            <div className="content-section-subtitle">Podem ser utilizados sem risco de desencadear crise</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Propofol, Etomidato, Cetamina, Barbitúricos</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Opioides (Fentanil, Remifentanil, Morfina)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Óxido Nitroso (N₂O)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Benzodiazepínicos (Midazolam, Diazepam)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Bloqueadores neuromusculares não-despolarizantes (Rocurônio, Atracúrio)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Anestésicos locais — são SEGUROS para HM</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#1565c0' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">📋</div>
          <div>
            <div className="content-section-title">Preparo da Máquina de Anestesia</div>
            <div className="content-section-subtitle">Para paciente sabidamente suscetível</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">1.</span>
            <span>Remover vaporizadores do aparelho</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">2.</span>
            <span>Trocar circuito e cal sodada</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">3.</span>
            <span>Fazer flush com O₂ a 10 L/min por pelo menos 20 minutos</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">4.</span>
            <span>Ter Dantrolene disponível e reconstituído</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">5.</span>
            <span>Planejar anestesia total intravenosa (TIVA)</span>
          </div>
        </div>
      </div>

      <div className="content-alert content-alert--warning">
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Anamnese Familiar</div>
          <div className="content-alert-text">
            Sempre questionar história pessoal e familiar de: complicações anestésicas inexplicadas,
            morte súbita perioperatória, miopatias (Doença do Core Central, King-Denborough).
            A HM tem herança autossômica dominante com penetrância variável.
          </div>
        </div>
      </div>
    </>
  );
}

function TratamentoTab() {
  return (
    <>
      <div className="content-alert content-alert--danger">
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">Dantrolene é o Tratamento Específico</div>
          <div className="content-alert-text">
            O Dantrolene sódico é o ÚNICO tratamento específico da HM. A mortalidade cai de ~70% para
            menos de 5% com tratamento precoce. Iniciar IMEDIATAMENTE ao suspeitar de crise.
          </div>
        </div>
      </div>

      <div className="flowchart-layout" style={{ maxWidth: '900px' }}>
        <div className="flowchart-main">
          <FlowchartNode
            type="start"
            title="SUSPEITA DE HIPERTERMIA MALIGNA"
            items={['↑EtCO₂, taquicardia, rigidez, espasmo masseterino']}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="critical"
            title="PEDIR AJUDA — CHAMAR EQUIPE"
            stepNumber={1}
            items={[
              'Designar pessoa para preparar Dantrolene',
              'Uma pessoa por tarefa — dividir funções',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="action"
            title="INTERROMPER AGENTES DESENCADEANTES"
            stepNumber={2}
            items={[
              'Desligar halogenados imediatamente',
              'NÃO perder tempo trocando máquina/circuito',
              'Hiperventilar com O₂ 100% a 10 L/min',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="critical"
            title="ADMINISTRAR DANTROLENE"
            stepNumber={3}
            items={[
              'Dose: 2,5 mg/kg IV em bolus rápido',
              'Diluir cada frasco (20mg) em 60 mL de água destilada',
              'Repetir a cada 5 min até controle dos sintomas',
              'Dose máxima: 10 mg/kg (pode ser ultrapassada se necessário)',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="action"
            title="RESFRIAMENTO ATIVO"
            stepNumber={4}
            items={[
              'SF 0,9% gelado IV (sem Ringer Lactato)',
              'Compressas de gelo em axilas, virilha, pescoço',
              'Lavagem gástrica e vesical com SF gelado',
              'Meta: T° < 38°C — interromper quando atingir (evitar hipotermia)',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="action"
            title="TRATAR HIPERCALEMIA"
            stepNumber={5}
            items={[
              'Gluconato de Cálcio 30 mg/kg IV',
              'Glicose + Insulina (0,5g/kg + 0,15 U/kg)',
              'Bicarbonato de sódio (1–2 mEq/kg)',
              'Monitorar ECG continuamente',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="action"
            title="SUPORTE E MONITORIZAÇÃO"
            stepNumber={6}
            items={[
              'Manter diurese ≥ 2 mL/kg/h (manitol/furosemida)',
              'Coletar gasometria, K⁺, CK, coagulograma seriados',
              'Pressão Arterial Invasiva e acesso venoso central',
              'Sondagem vesical — avaliar coloração da urina',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="info"
            title="ENCAMINHAR PARA UTI"
            items={[
              'Monitorização por no mínimo 72 horas',
              'Dantrolene de manutenção: 1 mg/kg IV 6/6h por 24-48h',
              'Risco de recrudescência em até 20% dos casos',
            ]}
          />
        </div>

        <aside className="flowchart-sidebar">
          <DosePanel
            title="Dantrolene Sódico"
            accentColor="#d84315"
            items={[
              { label: 'Dose inicial', detail: '2,5 mg/kg IV em bolus' },
              { label: 'Repetir', detail: 'A cada 5 min se sintomas persistem' },
              { label: 'Dose máxima', detail: '10 mg/kg (ou até controle)' },
              { label: 'Manutenção', detail: '1 mg/kg IV 6/6h por 24-48h' },
              { label: 'Diluição', detail: '20 mg em 60 mL água destilada' },
            ]}
          />
          <DosePanel
            title="Hipercalemia"
            accentColor="#e67e22"
            items={[
              { label: 'Gluconato de Ca²⁺', detail: '30 mg/kg IV' },
              { label: 'Insulina + Glicose', detail: '0,15 U/kg + 0,5 g/kg' },
              { label: 'NaHCO₃', detail: '1–2 mEq/kg IV' },
            ]}
          />
          <DosePanel
            title="Resfriamento"
            accentColor="#1565c0"
            items={[
              { label: 'SF 0,9% gelado', detail: 'IV em acesso calibroso' },
              { label: 'Alvo', detail: 'T° < 38°C' },
              { label: 'NÃO USAR', detail: 'Ringer Lactato (contém K⁺)' },
            ]}
          />
        </aside>
      </div>
    </>
  );
}

function PosProcedimentoTab() {
  return (
    <>
      <div className="content-alert content-alert--warning">
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Risco de Recrudescência</div>
          <div className="content-alert-text">
            A recrudescência (retorno da crise) ocorre em até 20% dos casos, geralmente nas primeiras
            24-48 horas. Monitorização intensiva em UTI é mandatória.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#d84315' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🏥</div>
          <div>
            <div className="content-section-title">Monitorização em UTI</div>
            <div className="content-section-subtitle">Mínimo 72 horas de observação</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Monitorização contínua de temperatura — intervalo horário</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>ECG contínuo — vigilância para arritmias</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Gasometria arterial seriada (2/2h nas primeiras 12h)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>CK sérica a cada 6-8h (pico esperado em 12-24h)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Eletrólitos (K⁺, Ca²⁺) a cada 4-6h</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Coagulograma seriado — rastrear CIVD</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Débito urinário horário — manter ≥ 2 mL/kg/h</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#1565c0' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">💊</div>
          <div>
            <div className="content-section-title">Terapia de Manutenção</div>
            <div className="content-section-subtitle">Manter Dantrolene e suporte</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Dantrolene:</strong> 1 mg/kg IV a cada 6h por 24-48h (mínimo)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Hidratação vigorosa para proteção renal</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Alcalinização da urina se mioglobinúria (NaHCO₃)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Manter normotermia — evitar hipotermia iatrogênica</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#7b1fa2' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">👨‍👩‍👧‍👦</div>
          <div>
            <div className="content-section-title">Seguimento e Aconselhamento</div>
            <div className="content-section-subtitle">Investigação familiar obrigatória</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Encaminhar para centro de referência em HM</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Teste de contratura in vitro com cafeína-halotano (padrão-ouro)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Investigação genética (gene RYR1 — receptor de rianodina)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Aconselhamento dos familiares de primeiro grau</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Fornecer cartão de identificação de suscetibilidade a HM</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Notificar no prontuário e sistema hospitalar</span>
          </div>
        </div>
      </div>
    </>
  );
}
