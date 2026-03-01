import { useState } from 'react';
import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';
import './ContentPage.css';

type Tab = 'metas' | 'algoritmo';

export default function PostCardiacArrestCarePage() {
  const [activeTab, setActiveTab] = useState<Tab>('metas');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'metas', label: 'Metas e Alvos' },
    { key: 'algoritmo', label: 'Algoritmo' },
  ];

  return (
    <div className="algo-page">
      <Navbar title="Cuidados pós PCR" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🫀</span>
        <h1 className="algo-page-title">Cuidados pós PCR</h1>
        <span className="algo-page-case">Pós-Ressuscitação — Retorno da Circulação Espontânea (RCE)</span>
      </header>

      <div className="content-tabs" style={{ '--tab-accent': '#1565c0' } as React.CSSProperties}>
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
        {activeTab === 'metas' && <MetasTab />}
        {activeTab === 'algoritmo' && <AlgoritmoTab />}
      </div>
    </div>
  );
}

function MetasTab() {
  return (
    <>
      <div className="content-alert content-alert--info">
        <span className="content-alert-icon">📋</span>
        <div>
          <div className="content-alert-title">Objetivos Pós-RCE</div>
          <div className="content-alert-text">
            O manejo pós-PCR visa otimizar a perfusão tecidual, proteger o cérebro e tratar a causa
            da PCR. Abordar sistematicamente: via aérea, hemodinâmica, temperatura, causas reversíveis.
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-header">
          <div className="content-section-icon">🎯</div>
          <div>
            <div className="content-section-title">Metas e Alvos Terapêuticos</div>
            <div className="content-section-subtitle">Baseado nas diretrizes AHA / SAVA</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Parâmetro</th>
                <th>Meta / Alvo</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>PAS</strong></td>
                <td>≥ 90 mmHg (PAM ≥ 65 mmHg)</td>
                <td>Vasopressor se necessário (Norepinefrina)</td>
              </tr>
              <tr>
                <td><strong>SpO₂</strong></td>
                <td>94 – 99%</td>
                <td>Evitar hiperóxia (FiO₂ ≤ necessária)</td>
              </tr>
              <tr>
                <td><strong>PaCO₂</strong></td>
                <td>35 – 45 mmHg</td>
                <td>Evitar hipo/hipercapnia</td>
              </tr>
              <tr>
                <td><strong>Temperatura</strong></td>
                <td>32 – 36°C (TTM)</td>
                <td>Iniciar precocemente em comatosos</td>
              </tr>
              <tr>
                <td><strong>Glicemia</strong></td>
                <td>140 – 180 mg/dL</td>
                <td>Evitar hipoglicemia (≤ 70 mg/dL)</td>
              </tr>
              <tr>
                <td><strong>ECG 12 derivações</strong></td>
                <td>Imediato pós-RCE</td>
                <td>Se STEMI → ICP de emergência</td>
              </tr>
              <tr>
                <td><strong>Débito Urinário</strong></td>
                <td>≥ 0,5 mL/kg/h</td>
                <td>Marcador de perfusão tecidual</td>
              </tr>
              <tr>
                <td><strong>Lactato</strong></td>
                <td>Tendência de queda</td>
                <td>Clearance de lactato como guia</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#1565c0' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🌡️</div>
          <div>
            <div className="content-section-title">Controle Direcionado de Temperatura (TTM)</div>
            <div className="content-section-subtitle">Para pacientes comatosos após RCE</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Indicação:</strong> pacientes que não seguem comandos após RCE</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Temperatura alvo:</strong> 32°C a 36°C — manter por ≥ 24 horas</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Métodos:</strong> dispositivos de resfriamento de superfície ou intravascular</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Reaquecimento:</strong> lento, 0,25°C/h — evitar febre por 72h</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Evitar hipertermia:</strong> febre &gt;37,7°C é prejudicial no pós-PCR</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#e94560' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🔍</div>
          <div>
            <div className="content-section-title">Investigar e Tratar a Causa</div>
            <div className="content-section-subtitle">H's e T's — Causas Reversíveis</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>ECG 12 derivações:</strong> se supra de ST → cateterismo de emergência</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>TC de crânio:</strong> se suspeita de AVC</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Angiotomografia de tórax:</strong> se suspeita de TEP</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Laboratório:</strong> gasometria, eletrólitos, lactato, troponina, toxicológico</span>
          </div>
        </div>
      </div>
    </>
  );
}

function AlgoritmoTab() {
  return (
    <div className="flowchart-layout" style={{ maxWidth: '900px' }}>
      <div className="flowchart-main">
        <FlowchartNode
          type="start"
          title="RETORNO DA CIRCULAÇÃO ESPONTÂNEA (RCE)"
          items={['Pulso palpável, PA mensurável']}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="action"
          title="VIA AÉREA E VENTILAÇÃO"
          stepNumber={1}
          items={[
            'Confirmar/assegurar via aérea avançada (IOT)',
            'Capnografia contínua — manter EtCO₂ 35-45 mmHg',
            'SpO₂ alvo 94-99% — titular FiO₂',
            'Evitar hiperventilação',
          ]}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="action"
          title="OTIMIZAÇÃO HEMODINÂMICA"
          stepNumber={2}
          items={[
            'Aferir PA — meta PAS ≥ 90 mmHg',
            'Acesso venoso central se ainda não obtido',
            'Cristaloide IV — bolus se hipotenso',
            'Vasopressor: Norepinefrina se refratário a volume',
            'Considerar ecocardiograma point-of-care',
          ]}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="critical"
          title="ECG 12 DERIVAÇÕES"
          stepNumber={3}
          items={[
            'Realizar IMEDIATAMENTE',
          ]}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="decision"
          title="SUPRA DE ST (STEMI)?"
        />

        <FlowchartArrow direction="down" />

        <div className="flowchart-branch">
          <div className="flowchart-branch-path">
            <span className="flowchart-branch-label flowchart-branch-label--yes">SIM — STEMI</span>
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="critical"
              title="CATETERISMO DE EMERGÊNCIA"
              items={[
                'ICP primária — porta-balão < 90 min',
                'Ativar hemodinâmica',
                'Antiagregação e anticoagulação',
              ]}
            />
          </div>
          <div className="flowchart-branch-path">
            <span className="flowchart-branch-label flowchart-branch-label--no">NÃO — Sem STEMI</span>
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="action"
              title="INVESTIGAR OUTRAS CAUSAS"
              items={[
                'Causas não cardíacas (TEP, AVC, intoxicação)',
                'Considerar cateterismo mesmo sem STEMI',
              ]}
            />
          </div>
        </div>

        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="decision"
          title="PACIENTE SEGUE COMANDOS?"
        />

        <FlowchartArrow direction="down" />

        <div className="flowchart-branch">
          <div className="flowchart-branch-path">
            <span className="flowchart-branch-label flowchart-branch-label--no">NÃO — Comatoso</span>
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="critical"
              title="CONTROLE DE TEMPERATURA (TTM)"
              stepNumber={4}
              items={[
                'Alvo: 32-36°C por ≥ 24 horas',
                'Iniciar precocemente',
                'Reaquecimento lento (0,25°C/h)',
                'Evitar febre por 72h',
              ]}
            />
          </div>
          <div className="flowchart-branch-path">
            <span className="flowchart-branch-label flowchart-branch-label--yes">SIM — Consciente</span>
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="action"
              title="MANTER NORMOTERMIA"
              items={[
                'Prevenir febre',
                'Monitorização neurológica',
              ]}
            />
          </div>
        </div>

        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="info"
          title="CUIDADOS CONTÍNUOS EM UTI"
          stepNumber={5}
          items={[
            'Monitorar perfusão: lactato, SvO₂, débito urinário',
            'Glicemia 140-180 mg/dL',
            'Neuroprognóstico ≥ 72h após normotermia',
            'EEG se comatoso persistente',
            'Suporte multiorgânico conforme necessidade',
          ]}
        />
      </div>

      <aside className="flowchart-sidebar">
        <DosePanel
          title="Vasopressores / Inotrópicos"
          accentColor="#1565c0"
          items={[
            { label: 'Norepinefrina', detail: '0,1–0,5 μg/kg/min IV' },
            { label: 'Epinefrina', detail: '0,1–0,5 μg/kg/min IV' },
            { label: 'Dobutamina', detail: '2–20 μg/kg/min IV' },
            { label: 'Dopamina', detail: '5–20 μg/kg/min IV' },
          ]}
        />
        <DosePanel
          title="Metas Ventilatórias"
          accentColor="#4caf50"
          items={[
            { label: 'SpO₂', detail: '94–99%' },
            { label: 'PaCO₂', detail: '35–45 mmHg' },
            { label: 'EtCO₂', detail: '35–45 mmHg' },
            { label: 'FiO₂', detail: 'Menor necessária (evitar hiperóxia)' },
          ]}
        />
        <DosePanel
          title="TTM — Temperatura"
          accentColor="#e67e22"
          items={[
            { label: 'Alvo', detail: '32–36°C' },
            { label: 'Duração', detail: '≥ 24 horas' },
            { label: 'Reaquecimento', detail: '0,25°C/hora' },
            { label: 'Evitar febre', detail: 'Por ≥ 72 horas' },
          ]}
        />
      </aside>
    </div>
  );
}
