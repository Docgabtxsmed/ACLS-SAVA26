import { useState } from 'react';
import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';
import './ContentPage.css';

type Tab = 'diagnostico' | 'classificacao' | 'tratamento';

export default function AnaphylaxisPage() {
  const [activeTab, setActiveTab] = useState<Tab>('diagnostico');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'diagnostico', label: 'Diagnóstico' },
    { key: 'classificacao', label: 'Classificação' },
    { key: 'tratamento', label: 'Tratamento' },
  ];

  return (
    <div className="algo-page">
      <Navbar title="Anafilaxia" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🔴</span>
        <h1 className="algo-page-title">Anafilaxia</h1>
        <span className="algo-page-case">Reação Anafilática — Emergência Imediata</span>
      </header>

      <div className="content-tabs" style={{ '--tab-accent': '#c62828' } as React.CSSProperties}>
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
        {activeTab === 'classificacao' && <ClassificacaoTab />}
        {activeTab === 'tratamento' && <TratamentoTab />}
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
          <div className="content-alert-title">Diagnóstico Clínico — Ação Imediata</div>
          <div className="content-alert-text">
            A anafilaxia é uma reação de hipersensibilidade sistêmica grave, potencialmente fatal.
            O diagnóstico é CLÍNICO e o tratamento deve ser iniciado IMEDIATAMENTE.
            A demora na administração de epinefrina é o principal fator associado à mortalidade.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#c62828' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🔍</div>
          <div>
            <div className="content-section-title">Critérios Diagnósticos</div>
            <div className="content-section-subtitle">Provável quando ≥1 critério presente</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">1.</span>
            <span><strong>Início agudo</strong> (minutos a horas) de sintomas envolvendo pele/mucosas (urticária, angioedema, prurido, flushing) + ≥1 dos seguintes: comprometimento respiratório OU hipotensão/sinais de hipoperfusão</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">2.</span>
            <span><strong>Exposição a alérgeno provável</strong> + envolvimento de ≥2 sistemas: pele/mucosas, respiratório, cardiovascular, gastrointestinal</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">3.</span>
            <span><strong>Hipotensão arterial</strong> após exposição a alérgeno CONHECIDO para o paciente</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#e67e22' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🫁</div>
          <div>
            <div className="content-section-title">Manifestações por Sistema</div>
            <div className="content-section-subtitle">A pele é acometida em ~90% dos casos</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Sistema</th>
                <th>Manifestações</th>
                <th>Frequência</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Pele/Mucosas</strong></td>
                <td>Urticária, angioedema, prurido, flushing, eritema</td>
                <td>~90%</td>
              </tr>
              <tr>
                <td><strong>Respiratório</strong></td>
                <td>Dispneia, sibilância, estridor, edema de glote, broncoespasmo</td>
                <td>~70%</td>
              </tr>
              <tr>
                <td><strong>Cardiovascular</strong></td>
                <td>Hipotensão, taquicardia, síncope, choque distributivo, PCR</td>
                <td>~45%</td>
              </tr>
              <tr>
                <td><strong>Gastrointestinal</strong></td>
                <td>Dor abdominal, náuseas, vômitos, diarreia</td>
                <td>~45%</td>
              </tr>
              <tr>
                <td><strong>Neurológico</strong></td>
                <td>Tontura, confusão, sensação de morte iminente</td>
                <td>~15%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-alert content-alert--warning">
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Atenção: Anafilaxia sem Pele</div>
          <div className="content-alert-text">
            Em ~10% dos casos, a anafilaxia pode se apresentar SEM manifestações cutâneas,
            especialmente no perioperatório. Hipotensão refratária + broncoespasmo durante anestesia
            deve levantar suspeita de anafilaxia mesmo sem urticária.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#1565c0' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">💊</div>
          <div>
            <div className="content-section-title">Principais Agentes Causadores</div>
            <div className="content-section-subtitle">Contexto perioperatório e emergência</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Perioperatório:</strong> Bloqueadores neuromusculares (principal), antibióticos, látex, clorexidina, contrastes iodados</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Alimentos:</strong> Amendoim, nozes, leite, ovo, frutos do mar, trigo</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Medicamentos:</strong> AINEs, antibióticos (penicilinas, cefalosporinas), opioides</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Venenos:</strong> Himenópteros (abelha, vespa, formiga)</span>
          </div>
        </div>
      </div>
    </>
  );
}

function ClassificacaoTab() {
  return (
    <>
      <div className="content-section">
        <div className="content-section-header">
          <div className="content-section-icon">📊</div>
          <div>
            <div className="content-section-title">Classificação de Gravidade</div>
            <div className="content-section-subtitle">Escala de Ring e Messmer (adaptada)</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Grau</th>
                <th>Pele</th>
                <th>Respiratório</th>
                <th>Cardiovascular</th>
                <th>Gravidade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>I</strong></td>
                <td>Urticária, eritema</td>
                <td>—</td>
                <td>—</td>
                <td style={{ color: '#4caf50' }}>Leve</td>
              </tr>
              <tr>
                <td><strong>II</strong></td>
                <td>Urticária, angioedema</td>
                <td>Tosse, dispneia leve</td>
                <td>Taquicardia, hipotensão leve</td>
                <td style={{ color: '#e67e22' }}>Moderada</td>
              </tr>
              <tr>
                <td><strong>III</strong></td>
                <td>Pode ou não estar presente</td>
                <td>Broncoespasmo, edema de glote</td>
                <td>Choque (PAS {'<'} 90 mmHg)</td>
                <td style={{ color: '#e94560' }}>Grave</td>
              </tr>
              <tr>
                <td><strong>IV</strong></td>
                <td>Pode ou não estar presente</td>
                <td>Parada respiratória</td>
                <td>PCR</td>
                <td style={{ color: '#c62828' }}>PCR / Óbito</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-alert content-alert--danger">
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">Graus III e IV = Epinefrina Imediata</div>
          <div className="content-alert-text">
            Graus III e IV requerem administração imediata de Epinefrina IM. No grau II, a Epinefrina
            também é indicada se houver progressão dos sintomas ou acometimento respiratório.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#c62828' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">⏱️</div>
          <div>
            <div className="content-section-title">Fatores de Risco para Anafilaxia Fatal</div>
            <div className="content-section-subtitle">Identificar pacientes de maior risco</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Asma mal controlada ou grave</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Doença cardiovascular preexistente</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Uso de β-bloqueadores (dificulta resposta à Epinefrina)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Uso de IECAs (potencializa bradicinina)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Mastocitose / Triptase basal elevada</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Atraso na administração de Epinefrina — fator mais importante!</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#7b1fa2' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🔄</div>
          <div>
            <div className="content-section-title">Reação Bifásica</div>
            <div className="content-section-subtitle">Recorrência sem nova exposição ao alérgeno</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Ocorre em até <strong>20%</strong> dos casos</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Geralmente em 4–12 horas (pode ocorrer até 72h)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Justifica observação mínima de 6–12 horas após episódio</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Mais comum em anafilaxia grave e quando Epinefrina foi tardia</span>
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
          <div className="content-alert-title">EPINEFRINA IM = Primeira Linha</div>
          <div className="content-alert-text">
            A Epinefrina intramuscular na face anterolateral da coxa é o tratamento de PRIMEIRA LINHA
            da anafilaxia. NÃO há contraindicação absoluta ao uso de Epinefrina na anafilaxia.
            A via IM é preferida por ser mais segura e rápida que a via IV (que requer diluição).
          </div>
        </div>
      </div>

      <div className="flowchart-layout" style={{ maxWidth: '900px' }}>
        <div className="flowchart-main">
          <FlowchartNode
            type="start"
            title="RECONHECIMENTO DA ANAFILAXIA"
            items={['Clínica compatível + exposição a alérgeno']}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="critical"
            title="REMOVER O AGENTE CAUSADOR"
            stepNumber={1}
            items={[
              'Interromper infusão da droga / agente suspeito',
              'Remover ferrão de inseto (se aplicável)',
              'CHAMAR AJUDA',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="critical"
            title="EPINEFRINA IM"
            stepNumber={2}
            items={[
              'Adulto: 0,3–0,5 mg IM (1:1.000) na coxa anterolateral',
              'Criança: 0,01 mg/kg IM (máx 0,3 mg)',
              'Repetir a cada 5–15 minutos se necessário',
              'NÃO TEM CONTRAINDICAÇÃO ABSOLUTA',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="action"
            title="POSICIONAMENTO"
            stepNumber={3}
            items={[
              'Decúbito dorsal + elevar membros inferiores',
              'Se dispneia: posição sentada',
              'Se vômitos: posição de recuperação lateral',
              'NÃO deixar o paciente em pé (risco de PCR)',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="action"
            title="VIA AÉREA E OXIGÊNIO"
            stepNumber={4}
            items={[
              'O₂ em alto fluxo (10–15 L/min)',
              'Avaliar via aérea — risco de edema de glote',
              'IOT precoce se estridor ou edema progressivo',
              'Considerar cricotireoidostomia se IOT impossível',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="action"
            title="EXPANSÃO VOLÊMICA"
            stepNumber={5}
            items={[
              'SF 0,9% — 1–2 L em bolus rápido (adulto)',
              'Criança: 20 mL/kg em bolus',
              'Repetir conforme necessidade',
              'Pode necessitar de grandes volumes (choque distributivo)',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="decision"
            title="REFRATÁRIO À EPINEFRINA IM?"
          />
          <FlowchartArrow direction="down" label="SIM" />
          <FlowchartNode
            type="critical"
            title="EPINEFRINA IV EM INFUSÃO"
            stepNumber={6}
            items={[
              'Apenas em choque refratário / PCR iminente',
              'Diluir 1 mg em 250 mL SF (4 μg/mL)',
              'Iniciar a 0,1 μg/kg/min — titular conforme resposta',
              'REQUER monitorização contínua',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="action"
            title="ADJUVANTES"
            stepNumber={7}
            items={[
              'Anti-histamínico H1: Difenidramina 25-50 mg IV',
              'Anti-histamínico H2: Ranitidina 50 mg IV',
              'Corticoide: Metilprednisolona 1-2 mg/kg IV',
              'Se broncoespasmo: Salbutamol inalatório',
              'Adjuvantes NÃO substituem Epinefrina!',
            ]}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="info"
            title="OBSERVAÇÃO E SEGUIMENTO"
            items={[
              'Observar por 6–12 horas (risco de reação bifásica)',
              'Prescrever autoinjector de Epinefrina na alta',
              'Encaminhar ao alergista/imunologista',
              'Dosagem de triptase sérica (até 4h do evento)',
            ]}
          />
        </div>

        <aside className="flowchart-sidebar">
          <DosePanel
            title="Epinefrina (Adrenalina)"
            accentColor="#c62828"
            items={[
              { label: 'IM (adulto)', detail: '0,3–0,5 mg (1:1.000) na coxa' },
              { label: 'IM (criança)', detail: '0,01 mg/kg (máx 0,3 mg)' },
              { label: 'Repetir IM', detail: 'A cada 5–15 min se necessário' },
              { label: 'IV (refratário)', detail: '0,1 μg/kg/min em infusão contínua' },
            ]}
          />
          <DosePanel
            title="Expansão Volêmica"
            accentColor="#1565c0"
            items={[
              { label: 'Adulto', detail: 'SF 0,9% 1–2 L em bolus rápido' },
              { label: 'Criança', detail: 'SF 0,9% 20 mL/kg em bolus' },
              { label: 'Repetir', detail: 'Conforme resposta hemodinâmica' },
            ]}
          />
          <DosePanel
            title="Adjuvantes (2ª linha)"
            accentColor="#e67e22"
            items={[
              { label: 'Difenidramina', detail: '25–50 mg IV (anti-H1)' },
              { label: 'Ranitidina', detail: '50 mg IV (anti-H2)' },
              { label: 'Metilprednisolona', detail: '1–2 mg/kg IV' },
              { label: 'Salbutamol', detail: 'NBZ se broncoespasmo' },
              { label: 'Glucagon', detail: '1–5 mg IV se β-bloqueador' },
            ]}
          />
        </aside>
      </div>
    </>
  );
}
