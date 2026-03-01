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
      <Navbar title="Adult Bradycardia with Pulse" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🐌</span>
        <h1 className="algo-page-title">Adult Bradycardia with Pulse Algorithm</h1>
        <span className="algo-page-case">ACLS Cases 7</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Step 1: Assess */}
          <FlowchartNode
            type="action"
            title="ASSESS SIGNS/SYMPTOMS"
            items={[
              'Heart rate typically <50 beats per minute if bradyarrhythmia',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Step 2: Identify and Treat */}
          <FlowchartNode
            type="critical"
            title="IDENTIFY AND TREAT UNDERLYING CAUSE"
            items={[
              'Maintain patent airway; assist breathing if necessary',
              'If hypoxemic, administer oxygen',
              'Cardiac monitor to identify rhythm',
              'Monitor blood pressure and pulse oximetry',
              'IV access',
              'Assess 12-lead ECG',
              'Consider possible hypoxic and toxicologic causes',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Step 3: Persistent Bradyarrhythmia? */}
          <FlowchartNode
            type="action"
            title="PERSISTENT BRADYARRHYTHMIA CAUSING:"
            items={[
              'Hypotension?',
              'Acutely altered mental status?',
              'Signs of shock?',
              'Chest pain?',
              'Acute heart failure?',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Decision Branch */}
          <div className="flowchart-branch">
            {/* YES → Treat */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">YES</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="ATROPINE"
                items={[
                  'See Doses/Details panel',
                  'IF ATROPINE INEFFECTIVE:',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="warning"
                title="SECOND-LINE TREATMENTS"
                items={[
                  'Transcutaneous pacing',
                  'OR Dopamine infusion: 5 to 20 mcg/kg per minute',
                  'OR Epinephrine infusion: 2 to 10 mcg per minute',
                ]}
              />
            </div>

            {/* NO → Monitor */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">NO</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="MONITOR AND OBSERVE"
                items={[
                  'Continue monitoring',
                  'Reassess as needed',
                ]}
              />
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <aside className="flowchart-sidebar">
          <DosePanel
            title="Ventilation/Oxygenation"
            accentColor="#4a8c5c"
            items={[
              { label: 'Ventilation', detail: 'Avoid excessive ventilation. Start at 10 to 12 breaths/min and titrate to target ETCO2 of 35 to 40 mmHg' },
            ]}
          />
          <DosePanel
            title="Doses/Details"
            accentColor="#5b6abf"
            items={[
              { label: 'Atropine IV Dose', detail: 'Initial dose of 1 mg bolus. Repeat every 3 to 5 minutes up to 3 mg max dose.' },
              { label: 'Dopamine IV Infusion', detail: '5 to 20 mcg/kg per minute. Titrate to patient response; taper slowly.' },
              { label: 'Epinephrine IV Infusion', detail: '2 to 10 mcg per minute.' },
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
