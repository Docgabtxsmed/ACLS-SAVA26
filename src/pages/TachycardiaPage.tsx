import { useState } from 'react';
import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import ArrhythmiaCardComponent from '../components/ArrhythmiaCard';
import ArrhythmiaModal from '../components/ArrhythmiaModal';
import DosePanel from '../components/DosePanel';
import { arrhythmiaData, ArrhythmiaData } from '../data/arrhythmiaData';
import './AlgoPage.css';

export default function TachycardiaPage() {
  const [selectedArrhythmia, setSelectedArrhythmia] = useState<ArrhythmiaData | null>(null);

  const getByCategory = (cat: string) => arrhythmiaData.filter((a) => a.category === cat);

  const openModal = (arrhythmia: ArrhythmiaData) => setSelectedArrhythmia(arrhythmia);

  const renderTerminalItem = (arrhythmia: ArrhythmiaData, sub = false) => (
    <div
      key={arrhythmia.id}
      className={`tree-terminal-item ${sub ? 'tree-terminal-item--sub' : ''}`}
      onClick={() => openModal(arrhythmia)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openModal(arrhythmia)}
    >
      {arrhythmia.icon} {arrhythmia.name}
      {arrhythmia.abbreviation && ` (${arrhythmia.abbreviation})`}
    </div>
  );

  return (
    <div className="algo-page">
      <Navbar title="Taquiarritmias" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">⚡</span>
        <h1 className="algo-page-title">Algoritmo de Taquiarritmias</h1>
        <span className="algo-page-case">Taquicardia com Pulso no Adulto — ACLS</span>
      </header>

      {/* ═══════════════════════════════════════════════════════
          FLOWCHART 1 — ACLS CLINICAL ALGORITHM (with sidebar)
         ═══════════════════════════════════════════════════════ */}
      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Step 1: Assess */}
          <FlowchartNode
            type="action"
            title="AVALIAR SINAIS E SINTOMAS"
            items={[
              'FC tipicamente > 150 bpm se taquiarritmia',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Step 2: Identify and Treat */}
          <FlowchartNode
            type="critical"
            title="IDENTIFICAR E TRATAR CAUSA SUBJACENTE"
            items={[
              'Manter via aérea patente; auxiliar ventilação se necessário',
              'Se hipoxêmico, administrar oxigênio',
              'Monitoração cardíaca para identificar ritmo',
              'Monitorar PA e oximetria de pulso',
              'Acesso IV',
              'ECG de 12 derivações se disponível',
              'Considerar causas toxicológicas e hipóxia',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Step 3: Persistent tachyarrhythmia? */}
          <FlowchartNode
            type="action"
            title="TAQUIARRITMIA PERSISTENTE CAUSANDO:"
            items={[
              'Hipotensão?',
              'Alteração aguda do estado mental?',
              'Sinais de choque?',
              'Dor torácica?',
              'Insuficiência cardíaca aguda?',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Decision Branch */}
          <div className="flowchart-branch">
            {/* YES → Unstable */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">SIM</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="CARDIOVERSÃO ELÉTRICA SINCRONIZADA"
                items={[
                  'Considerar sedação',
                  'Se QRS estreito regular: 50-100J',
                  'Se QRS estreito irregular: 120-200J bifásica',
                  'Se QRS largo regular: 100J',
                  'Se QRS largo irregular: não sincronizar (dose de desfibrilação)',
                ]}
              />
            </div>

            {/* NO → Stable → QRS width decision */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">NÃO</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="decision"
                title="QRS ALARGADO? (≥ 0,12 seg)"
                items={[
                  'Avaliar largura e regularidade do QRS',
                ]}
              />
              <FlowchartArrow direction="down" />

              {/* Sub-branch: Wide vs Narrow */}
              <div className="flowchart-branch">
                {/* Wide QRS */}
                <div className="flowchart-branch-path">
                  <span className="flowchart-branch-label flowchart-branch-label--yes">SIM — QRS Largo</span>
                  <FlowchartArrow direction="down" />
                  <FlowchartNode
                    type="warning"
                    title="QRS LARGO"
                    items={[
                      'Considerar adenosina apenas se regular e monomórfico',
                      'Considerar infusão de antiarrítmico',
                      'Considerar consulta especialista',
                    ]}
                  />
                </div>

                {/* Narrow QRS */}
                <div className="flowchart-branch-path">
                  <span className="flowchart-branch-label flowchart-branch-label--no">NÃO — QRS Estreito</span>
                  <FlowchartArrow direction="down" />
                  <FlowchartNode
                    type="info"
                    title="QRS ESTREITO"
                    items={[
                      'Manobra vagal',
                      'Adenosina (se regular)',
                      'β-Bloqueador ou Bloqueador de canal de cálcio',
                      'Considerar consulta',
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar — Doses */}
        <aside className="flowchart-sidebar">
          <DosePanel
            title="Cardioversão Elétrica Sincronizada"
            accentColor="#e67e22"
            items={[
              { label: 'QRS estreito regular', detail: '50 a 100J' },
              { label: 'QRS estreito irregular', detail: 'Bifásica 120-200J ou Monofásica 200J' },
              { label: 'QRS largo regular', detail: '100J' },
              { label: 'QRS largo irregular', detail: 'Dose de desfibrilação (NÃO sincronizada)' },
            ]}
          />
          <DosePanel
            title="Drogas Antiarrítmicas"
            accentColor="#5b6abf"
            items={[
              { label: 'Adenosina IV', detail: 'Dose inicial: 6 mg IV rápido em bolus seguido de flush com SF. Segunda dose: 12 mg se necessário' },
              { label: 'Amiodarona IV', detail: 'Dose inicial: 150 mg em 10 min. Repetir se TV recorrente. Manutenção: 1 mg/min por 6 horas' },
              { label: 'Procainamida IV', detail: '20-50 mg/min até supressão da arritmia, hipotensão ou QRS alargado > 50%. Máx: 17 mg/kg' },
              { label: 'Sotalol IV', detail: '100 mg (1,5 mg/kg) em 5 minutos. Evitar se QT prolongado' },
              { label: 'Magnésio IV', detail: '2g em bolus (indicado para Torsades de Pointes)' },
              { label: 'Lidocaína IV', detail: '1-1,5 mg/kg IV. Alternativa para TV monomórfica' },
            ]}
          />
        </aside>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FLOWCHART 2 — CLASSIFICATION TREE
         ═══════════════════════════════════════════════════════ */}
      <div className="section-separator">
        <h2>🌳 Classificação das Taquicardias</h2>
      </div>

      <div className="classification-tree">
        {/* Root */}
        <div className="tree-root">Taquicardias</div>
        <div className="tree-connector" />

        {/* QRS branches horizontal connector */}
        <div className="tree-h-connector">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="tree-connector" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="tree-connector" />
          </div>
        </div>

        {/* Two main QRS branches */}
        <div className="tree-qrs-branches">

          {/* ── LEFT: QRS Estreito ── */}
          <div className="tree-qrs-branch">
            <div className="tree-qrs-node">QRS estreito (&lt; 120 ms)</div>
            <div className="tree-connector" />
            <div className="tree-rr-node">Intervalo RR</div>
            <div className="tree-connector" />

            <div className="tree-h-connector" style={{ width: '100%' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="tree-connector" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="tree-connector" />
              </div>
            </div>

            <div className="tree-rr-branches">
              {/* Regular */}
              <div className="tree-rr-branch">
                <span className="tree-rr-label tree-rr-label--regular">Regular</span>
                <div className="tree-connector" />
                <div className="tree-terminal">
                  {renderTerminalItem(getByCategory('narrow-regular')[0])} {/* Taq sinusal */}
                  <div className="tree-terminal-item" style={{ cursor: 'default', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', marginTop: '4px' }}>
                    TSVP:
                  </div>
                  {renderTerminalItem(getByCategory('narrow-regular')[1], true)} {/* TRN */}
                  {renderTerminalItem(getByCategory('narrow-regular')[2], true)} {/* TRAV */}
                  {renderTerminalItem(getByCategory('narrow-regular')[3])} {/* Flutter */}
                  {renderTerminalItem(getByCategory('narrow-regular')[4])} {/* TA focal */}
                  {renderTerminalItem(getByCategory('narrow-regular')[5])} {/* Juncional */}
                </div>
              </div>

              {/* Irregular */}
              <div className="tree-rr-branch">
                <span className="tree-rr-label tree-rr-label--irregular">Irregular</span>
                <div className="tree-connector" />
                <div className="tree-terminal">
                  {getByCategory('narrow-irregular').map((a) => renderTerminalItem(a))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: QRS Alargado ── */}
          <div className="tree-qrs-branch">
            <div className="tree-qrs-node">QRS alargado (&gt; 120 ms)</div>
            <div className="tree-connector" />
            <div className="tree-rr-node">Intervalo RR</div>
            <div className="tree-connector" />

            <div className="tree-h-connector" style={{ width: '100%' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="tree-connector" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="tree-connector" />
              </div>
            </div>

            <div className="tree-rr-branches">
              {/* Regular (monomórfica) */}
              <div className="tree-rr-branch">
                <span className="tree-rr-label tree-rr-label--regular-mono">Regular (monomórfica)</span>
                <div className="tree-connector" />
                <div className="tree-terminal">
                  {getByCategory('wide-regular').map((a) => renderTerminalItem(a))}
                </div>
              </div>

              {/* Irregular (polimórfica) */}
              <div className="tree-rr-branch">
                <span className="tree-rr-label tree-rr-label--irregular-poly">Irregular (polimórfica)</span>
                <div className="tree-connector" />
                <div className="tree-terminal">
                  {getByCategory('wide-irregular').map((a) => renderTerminalItem(a))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="tree-legend">
          <div className="tree-legend-title">Legenda</div>
          <div className="tree-legend-items">
            <span className="tree-legend-item"><strong>TSVP:</strong> Taquicardia supraventricular paroxística</span>
            <span className="tree-legend-item"><strong>TRN:</strong> Taquicardia por reentrada nodal</span>
            <span className="tree-legend-item"><strong>TRAV:</strong> Taquicardia por reentrada atrioventricular</span>
            <span className="tree-legend-item"><strong>BAV:</strong> Bloqueio atrioventricular</span>
            <span className="tree-legend-item"><strong>TV:</strong> Taquicardia ventricular</span>
            <span className="tree-legend-item"><strong>TSV:</strong> Taquicardia supraventricular</span>
            <span className="tree-legend-item"><strong>FA:</strong> Fibrilação atrial</span>
            <span className="tree-legend-item"><strong>TdP:</strong> Torsades de Pointes</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════
          ARRHYTHMIA CARDS
         ═══════════════════════════════ */}
      <section className="arrhy-cards-section">
        <h2 className="arrhy-cards-section-title">
          <span className="arrhy-cards-section-line" />
          Clique para ver detalhes
          <span className="arrhy-cards-section-line" />
        </h2>
        <div className="arrhy-cards-grid">
          {arrhythmiaData.map((arrhythmia, i) => (
            <ArrhythmiaCardComponent
              key={arrhythmia.id}
              arrhythmia={arrhythmia}
              onClick={() => openModal(arrhythmia)}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════
          MODAL
         ═══════════════════════════════ */}
      {selectedArrhythmia && (
        <ArrhythmiaModal
          arrhythmia={selectedArrhythmia}
          onClose={() => setSelectedArrhythmia(null)}
        />
      )}
    </div>
  );
}
