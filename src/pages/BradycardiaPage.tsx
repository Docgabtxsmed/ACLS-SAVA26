import { useState } from 'react';
import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import BradyarrhythmiaCard from '../components/BradyarrhythmiaCard';
import BradyarrhythmiaModal from '../components/BradyarrhythmiaModal';
import { bradyarrhythmiaData, BradyarrhythmiaData } from '../data/bradyarrhythmiaData';
import './AlgoPage.css';

export default function BradycardiaPage() {
  const [selectedArrhythmia, setSelectedArrhythmia] = useState<BradyarrhythmiaData | null>(null);

  return (
    <div className="algo-page">
      <Navbar title="Bradicardia com Pulso no Adulto" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🐌</span>
        <h1 className="algo-page-title">Algoritmo de Bradicardia com Pulso no Adulto</h1>
        <span className="algo-page-case">Caso 7</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Passo 1: Avaliar */}
          <FlowchartNode
            type="action"
            title="AVALIAR SINAIS/SINTOMAS"
            items={[
              'FC tipicamente <50 bpm se bradiarritmia',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Passo 2: Identificar e Tratar */}
          <FlowchartNode
            type="critical"
            title="IDENTIFICAR E TRATAR CAUSA SUBJACENTE"
            items={[
              'Manter via aérea pérvia; auxiliar ventilação se necessário',
              'Se hipoxêmico, administrar oxigênio',
              'Monitor cardíaco para identificar ritmo',
              'Monitorar PA e oximetria de pulso',
              'Acesso IV',
              'Obter ECG de 12 derivações',
              'Considerar causas hipóxicas e toxicológicas',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Passo 3: Bradiarritmia persistente? */}
          <FlowchartNode
            type="action"
            title="BRADIARRITMIA PERSISTENTE CAUSANDO:"
            items={[
              'Hipotensão?',
              'Alteração aguda do nível de consciência?',
              'Sinais de choque?',
              'Dor torácica?',
              'Insuficiência cardíaca aguda?',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Ramo de Decisão */}
          <div className="flowchart-branch">
            {/* SIM → Tratar */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">SIM</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="ATROPINA"
                items={[
                  'Ver painel de Doses/Detalhes',
                  'SE ATROPINA INEFICAZ:',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="warning"
                title="TRATAMENTOS DE SEGUNDA LINHA"
                items={[
                  'Marca-passo transcutâneo',
                  'OU Dopamina em infusão: 5 a 20 mcg/kg por minuto',
                  'OU Epinefrina em infusão: 2 a 10 mcg por minuto',
                ]}
              />
            </div>

            {/* NÃO → Monitorar */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">NÃO</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="MONITORAR E OBSERVAR"
                items={[
                  'Manter monitorização',
                  'Reavaliar conforme necessário',
                ]}
              />
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <aside className="flowchart-sidebar">
          <DosePanel
            title="Ventilação/Oxigenação"
            accentColor="#4a8c5c"
            items={[
              { label: 'Ventilação', detail: 'Evitar ventilação excessiva. Iniciar com 10 a 12 ventilações/min e titular para ETCO2 alvo de 35 a 40 mmHg' },
            ]}
          />
          <DosePanel
            title="Doses/Detalhes"
            accentColor="#5b6abf"
            items={[
              { label: 'Atropina IV', detail: 'Dose inicial de 1 mg em bolus. Repetir a cada 3 a 5 minutos até dose máxima de 3 mg.' },
              { label: 'Dopamina IV em infusão', detail: '5 a 20 mcg/kg por minuto. Titular conforme resposta do paciente; desmamar lentamente.' },
              { label: 'Epinefrina IV em infusão', detail: '2 a 10 mcg por minuto.' },
            ]}
          />
        </aside>
      </div>

      {/* ══════════════════════════════════════════
          BRADYARRHYTHMIA CARDS SECTION
         ══════════════════════════════════════════ */}
      <div className="section-separator">
        <div className="section-separator-line" />
        <span className="section-separator-text">🫀 Classificação das Bradiarritmias</span>
        <div className="section-separator-line" />
      </div>

      <section className="arrhy-cards-section">
        <h2 className="arrhy-cards-title">Bradiarritmias — Cards Didáticos</h2>
        <p className="arrhy-cards-subtitle">Clique em um card para ver detalhes, achados no ECG e tratamento</p>

        <div className="arrhy-cards-grid">
          {bradyarrhythmiaData.map((arrhythmia, index) => (
            <BradyarrhythmiaCard
              key={arrhythmia.id}
              arrhythmia={arrhythmia}
              onClick={() => setSelectedArrhythmia(arrhythmia)}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedArrhythmia && (
        <BradyarrhythmiaModal
          arrhythmia={selectedArrhythmia}
          onClose={() => setSelectedArrhythmia(null)}
        />
      )}
    </div>
  );
}
