import { useState } from 'react';
import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';
import './ContentPage.css';

type Tab = 'diagnostico' | 'prevencao' | 'tratamento';

export default function LocalAnestheticToxicityPage() {
  const [activeTab, setActiveTab] = useState<Tab>('diagnostico');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'diagnostico', label: 'Diagnóstico' },
    { key: 'prevencao', label: 'Prevenção' },
    { key: 'tratamento', label: 'Tratamento' },
  ];

  return (
    <div className="algo-page">
      <Navbar title="Intoxicação por Anestésico Local" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🧪</span>
        <h1 className="algo-page-title">Intoxicação por Anestésico Local</h1>
        <span className="algo-page-case">LAST — Local Anesthetic Systemic Toxicity</span>
      </header>

      {/* Tabs */}
      <div className="content-tabs" style={{ '--tab-accent': '#00897b' } as React.CSSProperties}>
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

      {/* Content */}
      <div className="content-body" key={activeTab}>
        {activeTab === 'diagnostico' && <DiagnosticoTab />}
        {activeTab === 'prevencao' && <PrevencaoTab />}
        {activeTab === 'tratamento' && <TratamentoTab />}
      </div>
    </div>
  );
}

function DiagnosticoTab() {
  return (
    <>
      <div className="content-alert content-alert--warning">
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Apresentação Progressiva</div>
          <div className="content-alert-text">
            A intoxicação por anestésicos locais segue uma progressão típica: primeiro sinais no SNC,
            depois manifestações cardiovasculares. A apresentação pode ser atípica e imprevisível.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#00897b' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🧠</div>
          <div>
            <div className="content-section-title">Sinais do SNC (Precoces)</div>
            <div className="content-section-subtitle">Aparecem primeiro — limiares mais baixos</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Gosto metálico na boca e dormência perioral</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Zumbido (tinnitus) e alterações visuais</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Agitação, confusão mental, tonturas</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Tremores e abalos musculares</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Convulsões tônico-clônicas generalizadas</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Perda de consciência e coma</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#e94560' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">❤️</div>
          <div>
            <div className="content-section-title">Sinais Cardiovasculares (Tardios)</div>
            <div className="content-section-subtitle">Indicam maior gravidade — risco de PCR</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Hipertensão e taquicardia (fase inicial excitatória)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Hipotensão progressiva e bradicardia</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Arritmias ventriculares (TV/FV) — marcador de gravidade</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Alargamento de QRS e prolongamento de PR</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Assistolia e colapso cardiovascular</span>
          </div>
        </div>
      </div>

      <div className="content-alert content-alert--danger">
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">Atenção: Bupivacaína</div>
          <div className="content-alert-text">
            A bupivacaína é o anestésico local com maior cardiotoxicidade. Pode causar PCR refratária
            com relação SNC:CV muito próxima, ou seja, os sinais cardiovasculares podem surgir
            quase simultaneamente aos do SNC.
          </div>
        </div>
      </div>
    </>
  );
}

function PrevencaoTab() {
  return (
    <>
      <div className="content-section" style={{ '--item-accent': '#00897b' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">💉</div>
          <div>
            <div className="content-section-title">Doses Máximas Recomendadas</div>
            <div className="content-section-subtitle">Respeitar limites por peso corporal</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Anestésico Local</th>
                <th>Sem Adrenalina</th>
                <th>Com Adrenalina</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lidocaína</td>
                <td>4,5 mg/kg</td>
                <td>7 mg/kg</td>
              </tr>
              <tr>
                <td>Bupivacaína</td>
                <td>2 mg/kg</td>
                <td>3 mg/kg</td>
              </tr>
              <tr>
                <td>Ropivacaína</td>
                <td>3 mg/kg</td>
                <td>3,5 mg/kg</td>
              </tr>
              <tr>
                <td>Levobupivacaína</td>
                <td>2 mg/kg</td>
                <td>3 mg/kg</td>
              </tr>
              <tr>
                <td>Prilocaína</td>
                <td>6 mg/kg</td>
                <td>8 mg/kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#4caf50' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🛡️</div>
          <div>
            <div className="content-section-title">Medidas Preventivas</div>
            <div className="content-section-subtitle">Reduzir o risco de injeção intravascular</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Aspiração antes da injeção — repetir a cada 3-5 mL</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Injeção lenta e fracionada (não exceder 0,15 mL/kg/min)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Uso de ultrassom para guiar bloqueios regionais</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Dose-teste com adrenalina (epinefrina 1:200.000 — 15 μg)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Usar menor dose e concentração efetiva possível</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Monitorização contínua durante e após o bloqueio (mínimo 30 min)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Manter comunicação verbal com o paciente durante o procedimento</span>
          </div>
        </div>
      </div>

      <div className="content-alert content-alert--info">
        <span className="content-alert-icon">📋</span>
        <div>
          <div className="content-alert-title">Checklist de Segurança</div>
          <div className="content-alert-text">
            Ter sempre disponível na sala: emulsão lipídica 20% (Intralipid®), material de via aérea,
            drogas vasoativas e desfibrilador. Verificar disponibilidade ANTES de iniciar o bloqueio.
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
          <div className="content-alert-title">Prioridade: Emulsão Lipídica 20%</div>
          <div className="content-alert-text">
            A emulsão lipídica a 20% (Intralipid®) é o tratamento específico da LAST.
            Deve ser administrada precocemente — não esperar a PCR para iniciar.
          </div>
        </div>
      </div>

      <div className="flowchart-layout" style={{ maxWidth: '900px' }}>
        <div className="flowchart-main">
          <FlowchartNode
            type="start"
            title="SINAIS DE INTOXICAÇÃO POR AL"
            items={['Pedir ajuda', 'Interromper injeção do AL']}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="action"
            title="MANEJO INICIAL DAS VIAS AÉREAS"
            stepNumber={1}
            items={[
              'Garantir via aérea patente',
              'Oferecer O₂ a 100%',
              'Evitar hipóxia e acidose (agravam toxicidade)',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="critical"
            title="INICIAR EMULSÃO LIPÍDICA 20%"
            stepNumber={2}
            items={[
              'Bolus: 1,5 mL/kg em 2–3 minutos',
              'Infusão: 0,25 mL/kg/min',
              'Pode repetir bolus 1-2x se instável',
              'Dose máxima: 12 mL/kg',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="decision"
            title="CONVULSÕES?"
          />
          <FlowchartArrow direction="down" label="SIM" />
          <FlowchartNode
            type="action"
            title="TRATAR CONVULSÕES"
            stepNumber={3}
            items={[
              'Benzodiazepínicos (Midazolam 0,05–0,1 mg/kg IV)',
              'Evitar Propofol em paciente instável',
              'Considerar succinilcolina para IOT (não trata convulsão)',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="decision"
            title="COLAPSO CARDIOVASCULAR / PCR?"
          />
          <FlowchartArrow direction="down" label="SIM" />
          <FlowchartNode
            type="critical"
            title="RCP MODIFICADA"
            stepNumber={4}
            items={[
              'Iniciar compressões torácicas',
              'Epinefrina em doses REDUZIDAS (≤1 μg/kg)',
              'EVITAR: Vasopressina, bloq. canais de cálcio, β-bloqueadores',
              'EVITAR: Lidocaína e outros anestésicos locais',
              'Manter emulsão lipídica em infusão',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="warning"
            title="CONSIDERAR CEC / ECMO"
            items={[
              'Se PCR refratária ao tratamento convencional + lipídico',
              'Acionar equipe de cirurgia cardíaca precocemente',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="info"
            title="MONITORIZAÇÃO PÓS-EVENTO"
            items={[
              'Manter em UTI por no mínimo 2–6 horas (mais se bupivacaína)',
              'Monitorar recorrência (redistribuição do AL)',
              'Manter infusão de lipídica por 15 min após estabilização',
            ]}
          />
        </div>

        <aside className="flowchart-sidebar">
          <DosePanel
            title="Emulsão Lipídica 20%"
            accentColor="#00897b"
            items={[
              { label: 'Bolus', detail: '1,5 mL/kg IV em 1 min' },
              { label: 'Infusão', detail: '0,25 mL/kg/min IV' },
              { label: 'Repetir bolus', detail: 'Até 2x se instável (a cada 5 min)' },
              { label: 'Dose máxima', detail: '12 mL/kg em 60 minutos' },
            ]}
          />
          <DosePanel
            title="Anticonvulsivantes"
            accentColor="#5b6abf"
            items={[
              { label: 'Midazolam', detail: '0,05–0,1 mg/kg IV' },
              { label: 'Diazepam', detail: '0,1–0,2 mg/kg IV' },
              { label: 'Propofol', detail: 'EVITAR se instabilidade hemodinâmica' },
            ]}
          />
          <DosePanel
            title="⚠️ Medicações a EVITAR"
            accentColor="#e94560"
            items={[
              { label: 'Epinefrina altas doses', detail: 'Usar ≤1 μg/kg' },
              { label: 'Vasopressina', detail: 'Contraindicada' },
              { label: 'β-bloqueadores', detail: 'Contraindicados' },
              { label: 'Bloq. canais de Ca²⁺', detail: 'Contraindicados' },
              { label: 'Lidocaína IV', detail: 'Contraindicada — é AL!' },
            ]}
          />
        </aside>
      </div>
    </>
  );
}
