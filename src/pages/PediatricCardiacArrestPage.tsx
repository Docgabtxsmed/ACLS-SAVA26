import { useState } from 'react';
import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';
import './ContentPage.css';

type Tab = 'diferencas' | 'sbv' | 'pcr' | 'causas' | 'bradicardia' | 'pos';

export default function PediatricCardiacArrestPage() {
  const [activeTab, setActiveTab] = useState<Tab>('diferencas');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'diferencas', label: 'Diferenças' },
    { key: 'sbv', label: 'SBV' },
    { key: 'pcr', label: 'Algoritmo PCR' },
    { key: 'causas', label: 'Causas Reversíveis' },
    { key: 'bradicardia', label: 'Bradicardia' },
    { key: 'pos', label: 'Pós-PCR' },
  ];

  return (
    <div className="algo-page">
      <Navbar title="PCR em Pediatria" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">👶</span>
        <h1 className="algo-page-title">PCR em Pediatria</h1>
        <span className="algo-page-case">Suporte Avançado de Vida em Pediatria — PALS</span>
      </header>

      <div className="content-tabs" style={{ '--tab-accent': '#7b1fa2' } as React.CSSProperties}>
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
        {activeTab === 'diferencas' && <DiferencasTab />}
        {activeTab === 'sbv' && <SBVTab />}
        {activeTab === 'pcr' && <PCRTab />}
        {activeTab === 'causas' && <CausasTab />}
        {activeTab === 'bradicardia' && <BradicardiaTab />}
        {activeTab === 'pos' && <PosPCRTab />}
      </div>
    </div>
  );
}

function DiferencasTab() {
  return (
    <>
      <div className="content-alert content-alert--warning">
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Diferença Fundamental vs. Adulto</div>
          <div className="content-alert-text">
            No adulto, a maioria das PCRs é de causa cardíaca primária (ritmos chocáveis). Na criança
            é o OPOSTO: a causa predominante é <strong>hipóxia respiratória progressiva</strong>, com ritmos
            não chocáveis (assistolia/AESP) em 80–90% dos casos. A VENTILAÇÃO tem peso maior que no adulto.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#7b1fa2' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">📊</div>
          <div>
            <div className="content-section-title">Epidemiologia</div>
            <div className="content-section-subtitle">Dados do perioperatório pediátrico</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Incidência perioperatória: ~<strong>5 casos por 10.000</strong> anestesias</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Causas principais: obstrução de vias aéreas (laringoespasmo, broncoespasmo), hipovolemia e erros de dose</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Ritmos não chocáveis: <strong>80–90%</strong> dos casos pediátricos</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>FV/TV sem pulso: apenas 10–20% dos casos — infrequentes em pediatria</span>
          </div>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="comparison-card" style={{ '--comp-color': '#7b1fa2' } as React.CSSProperties}>
          <div className="comparison-card-title">⚡ Energia de Desfibrilação</div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Adulto</span>
            <span className="comparison-card-value">200 J (bifásico)</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">1º choque</span>
            <span className="comparison-card-value">2 J/kg</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">2º choque</span>
            <span className="comparison-card-value">4 J/kg (obrigatório dobrar)</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Subsequentes</span>
            <span className="comparison-card-value">≥4 J/kg (máx 10 J/kg ou dose adulto)</span>
          </div>
        </div>

        <div className="comparison-card" style={{ '--comp-color': '#e94560' } as React.CSSProperties}>
          <div className="comparison-card-title">💉 Epinefrina</div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Adulto</span>
            <span className="comparison-card-value">1 mg IV/IO</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Pediatria IV/IO</span>
            <span className="comparison-card-value">10 µg/kg (0,1 mL/kg da sol. 0,1 mg/mL)</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Via ET</span>
            <span className="comparison-card-value">0,1 mg/kg (0,1 mL/kg da sol. 1 mg/mL)</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Dica prática</span>
            <span className="comparison-card-value">100 µg/mL → 1 mL por 10 kg</span>
          </div>
        </div>

        <div className="comparison-card" style={{ '--comp-color': '#1565c0' } as React.CSSProperties}>
          <div className="comparison-card-title">💨 Compressões Torácicas</div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">{'< 1 ano'}</span>
            <span className="comparison-card-value">≥4 cm (⅓ AP), 2 dedos ou 2 polegares</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">1 ano – adolescente</span>
            <span className="comparison-card-value">≥5 cm (⅓ AP), 1–2 mãos</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Adolescente</span>
            <span className="comparison-card-value">5–6 cm, 2 mãos sobrepostas</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Frequência</span>
            <span className="comparison-card-value">100–120/min (igual adulto)</span>
          </div>
        </div>

        <div className="comparison-card" style={{ '--comp-color': '#4caf50' } as React.CSSProperties}>
          <div className="comparison-card-title">🔄 Relação Compressão:Ventilação</div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">1 socorrista</span>
            <span className="comparison-card-value">30:2</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">2 socorristas</span>
            <span className="comparison-card-value">15:2</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">C/ via aérea avançada</span>
            <span className="comparison-card-value">20–30 vent/min (1 a cada 2-3s)</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">FiO₂</span>
            <span className="comparison-card-value">100% durante RCP</span>
          </div>
        </div>

        <div className="comparison-card" style={{ '--comp-color': '#e67e22' } as React.CSSProperties}>
          <div className="comparison-card-title">💊 Amiodarona / Lidocaína</div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Amiodarona (adulto)</span>
            <span className="comparison-card-value">300 mg → 150 mg</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Amiodarona (ped.)</span>
            <span className="comparison-card-value">5 mg/kg (máx 300 mg), até 3x</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Lidocaína (ped.)</span>
            <span className="comparison-card-value">1 mg/kg IV/IO (alternativa)</span>
          </div>
        </div>

        <div className="comparison-card" style={{ '--comp-color': '#00897b' } as React.CSSProperties}>
          <div className="comparison-card-title">📍 Avaliação Inicial</div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">{'Lactente (< 1 ano)'}</span>
            <span className="comparison-card-value">Pulso BRAQUIAL ou femoral</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">{'Criança (> 1 ano)'}</span>
            <span className="comparison-card-value">Pulso carotídeo ou femoral</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Iniciar RCP se</span>
            <span className="comparison-card-value">Sem pulso OU FC {'<'} 60 + má perfusão</span>
          </div>
        </div>
      </div>

      <div className="content-alert content-alert--danger" style={{ marginTop: 'var(--space-lg)' }}>
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">FC {'<'} 60 bpm = Indicação de RCP</div>
          <div className="content-alert-text">
            FC {'<'} 60 bpm com má perfusão periférica = indicação de RCP, MESMO com atividade elétrica
            no monitor (AESP). Não aguarde assistolia para iniciar compressões!
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#1565c0', marginTop: 'var(--space-lg)' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">📞</div>
          <div>
            <div className="content-section-title">Sequência de Acionamento — Diferença Crucial</div>
            <div className="content-section-subtitle">Invertida em relação ao adulto</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Situação</th>
                <th>1º Passo</th>
                <th>2º Passo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>NÃO presenciado</strong></td>
                <td>RCP imediata por 2 min</td>
                <td>Acionar SME / buscar DEA</td>
              </tr>
              <tr>
                <td><strong>Presenciado</strong></td>
                <td>Acionar SME imediatamente</td>
                <td>Iniciar RCP (pode ser cardíaca)</td>
              </tr>
              <tr>
                <td><strong>2 socorristas</strong></td>
                <td>Um inicia RCP</td>
                <td>Outro aciona SME + DEA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-alert content-alert--info" style={{ marginTop: 'var(--space-md)' }}>
        <span className="content-alert-icon">📝</span>
        <div>
          <div className="content-alert-title">Justificativa da inversão</div>
          <div className="content-alert-text">
            A PCR pediátrica não presenciada é quase sempre hipóxica. 2 minutos de RCP com
            ventilações efetivas pode reverter a causa antes do DEA chegar.
          </div>
        </div>
      </div>
    </>
  );
}

function SBVTab() {
  return (
    <>
      <div className="content-alert content-alert--info">
        <span className="content-alert-icon">📝</span>
        <div>
          <div className="content-alert-title">Sequência CAB — Mesma do Adulto</div>
          <div className="content-alert-text">
            <strong>C</strong> — Compressões torácicas (primeira prioridade) → <strong>A</strong> — Abertura
            de vias aéreas → <strong>B</strong> — Boa ventilação de resgate efetiva.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#7b1fa2' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">💓</div>
          <div>
            <div className="content-section-title">Compressões Torácicas por Faixa Etária</div>
            <div className="content-section-subtitle">Técnicas específicas para cada idade</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Parâmetro</th>
                <th>{'< 1 ano'}</th>
                <th>1 ano – adolescente</th>
                <th>Adolescente</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Frequência</strong></td>
                <td>100–120/min</td>
                <td>100–120/min</td>
                <td>100–120/min</td>
              </tr>
              <tr>
                <td><strong>Profundidade</strong></td>
                <td>≥4 cm (⅓ diâm. AP)</td>
                <td>≥5 cm (⅓ diâm. AP)</td>
                <td>5–6 cm</td>
              </tr>
              <tr>
                <td><strong>Técnica (1 socorrista)</strong></td>
                <td>2 dedos (posição central)</td>
                <td>1–2 mãos sobrepostas</td>
                <td>2 mãos sobrepostas</td>
              </tr>
              <tr>
                <td><strong>Técnica (2 socorristas)</strong></td>
                <td>2 polegares + mãos ao redor do tórax</td>
                <td>1–2 mãos sobrepostas</td>
                <td>2 mãos sobrepostas</td>
              </tr>
              <tr>
                <td><strong>Relação CT:Vent</strong></td>
                <td>30:2 (1) | 15:2 (2)</td>
                <td>30:2 (1) | 15:2 (2)</td>
                <td>30:2 (1) | 15:2 (2)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#e94560' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">💨</div>
          <div>
            <div className="content-section-title">Ventilação</div>
            <div className="content-section-subtitle">Mudança ACLS 2020: frequência atualizada</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Com via aérea avançada:</strong> 20–30 vent/min (1 a cada 2-3s), NÃO sincronizadas com compressões</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Sem via aérea avançada:</strong> 15:2 (dois socorristas) ou 30:2 (um socorrista)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>FiO₂: <strong>100%</strong> durante a RCP</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Cada ventilação deve promover elevação visível do tórax — <strong>não mais que isso</strong></span>
          </div>
        </div>
      </div>

      <div className="content-alert content-alert--danger">
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">Evitar Hiperventilação!</div>
          <div className="content-alert-text">
            Ventilação excessiva causa distensão gástrica, broncoaspiração e REDUZ o retorno venoso,
            piorando a perfusão cerebral.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#1565c0' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">⚡</div>
          <div>
            <div className="content-section-title">Desfibrilação — DEA e Pás</div>
            <div className="content-section-subtitle">Diferenças por faixa etária</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>{'< 8 anos'}:</strong> DEA com pás pediátricas (atenuador de carga)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>{'> 8 anos'}:</strong> DEA com pás de adulto</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>{'< 1 ano / < 10 kg'}:</strong> Desfibrilador manual com pás pediátricas</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>{'> 1 ano / > 10 kg'}:</strong> Desfibrilador manual com pás de adulto</span>
          </div>
        </div>
      </div>

      <div className="content-alert content-alert--warning">
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Sem pás pediátricas? Use de adulto!</div>
          <div className="content-alert-text">
            Se as pás pediátricas NÃO estiverem disponíveis, use as de adulto mesmo em lactentes.
            A desfibrilação com carga inadequada é melhor que nenhuma desfibrilação!
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#4caf50' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🫁</div>
          <div>
            <div className="content-section-title">Via Aérea Avançada e Acesso Vascular</div>
            <div className="content-section-subtitle">Particularidades pediátricas</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>IOT ou dispositivo supraglótico: ambos são opções válidas</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Acesso IO:</strong> considerar precocemente se dificuldade no IV periférico (máx 60s ou 3 tentativas)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Capnografia:</strong> obrigatória para confirmar tubo e monitorar qualidade das compressões</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Via aérea avançada e acesso <strong>NÃO devem interromper</strong> as compressões torácicas</span>
          </div>
        </div>
      </div>
    </>
  );
}

function PCRTab() {
  return (
    <div className="flowchart-layout" style={{ maxWidth: '900px' }}>
      <div className="flowchart-main">
        <FlowchartNode
          type="start"
          title="PCR EM PEDIATRIA"
          items={['Sem resposta, sem respiração efetiva, sem pulso']}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="action"
          title="INICIAR RCP"
          stepNumber={1}
          items={[
            'O₂ 100% — garantir ventilação efetiva',
            'Compressões: ⅓ do diâmetro AP do tórax',
            '15:2 (2 socorristas) ou 30:2 (1 socorrista)',
            'Acesso IV/IO',
            'Conectar monitor/desfibrilador',
          ]}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="decision"
          title="RITMO CHOCÁVEL?"
          items={['FV ou TV sem pulso? (10–20% dos casos)']}
        />
        <FlowchartArrow direction="down" />

        <div className="flowchart-branch">
          {/* Shockable */}
          <div className="flowchart-branch-path">
            <span className="flowchart-branch-label flowchart-branch-label--yes">SIM — FV/TV sem pulso</span>
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="critical"
              title="CHOQUE 1"
              stepNumber={2}
              items={['2 J/kg → RCP 2 min']}
            />
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="critical"
              title="CHOQUE 2"
              stepNumber={3}
              items={[
                '4 J/kg (obrigatório dobrar)',
                '→ RCP 2 min + EPINEFRINA 10 µg/kg',
              ]}
            />
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="critical"
              title="CHOQUE 3"
              stepNumber={4}
              items={[
                '≥4 J/kg (máx 10 J/kg)',
                '→ RCP 2 min + AMIODARONA 5 mg/kg',
                'OU Lidocaína 1 mg/kg',
              ]}
            />
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="info"
              title="CHOQUES SEGUINTES"
              items={[
                'Alternar Epinefrina e Antiarrítmico a cada 2 ciclos',
                'Tratar causas reversíveis',
                'Se RCE → cuidados pós-PCR',
              ]}
            />
          </div>

          {/* Non-shockable */}
          <div className="flowchart-branch-path">
            <span className="flowchart-branch-label flowchart-branch-label--no">NÃO — Assistolia/AESP (80–90%)</span>
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="action"
              title="CICLO 1 — RCP 2 MIN"
              stepNumber={5}
              items={[
                'Compressões de alta qualidade',
                'NÃO administrar Epinefrina no 1º ciclo',
              ]}
            />
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="critical"
              title="CICLO 2 — RCP + EPINEFRINA"
              stepNumber={6}
              items={[
                'Epinefrina 10 µg/kg IV/IO',
                'Repetir a cada 3-5 min',
                'Pesquisar causas reversíveis',
              ]}
            />
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="info"
              title="CICLOS SEGUINTES"
              items={[
                'Epinefrina a cada 3-5 min',
                'Tratar causas reversíveis (6Hs e 5Ts + SAVA)',
                'Se ritmo chocável → ir para FV/TV',
                'Se RCE → cuidados pós-PCR',
              ]}
            />
          </div>
        </div>
      </div>

      <aside className="flowchart-sidebar">
        <DosePanel
          title="Medicações — Doses Pediátricas"
          accentColor="#7b1fa2"
          items={[
            { label: 'Epinefrina IV/IO', detail: '10 µg/kg (0,1 mL/kg da sol 0,1 mg/mL)' },
            { label: 'Epinefrina ET', detail: '0,1 mg/kg (0,1 mL/kg da sol 1 mg/mL)' },
            { label: 'Amiodarona', detail: '5 mg/kg IV/IO (máx 300 mg), até 3x' },
            { label: 'Lidocaína', detail: '1 mg/kg IV/IO (alternativa)' },
          ]}
        />
        <DosePanel
          title="Energia — Desfibrilação"
          accentColor="#e94560"
          items={[
            { label: '1º choque', detail: '2 J/kg' },
            { label: '2º choque', detail: '4 J/kg (obrigatório dobrar)' },
            { label: '3º+ choque', detail: '≥4 J/kg (máx 10 J/kg)' },
          ]}
        />
        <DosePanel
          title="Padrão dos Ciclos (Chocável)"
          accentColor="#e67e22"
          items={[
            { label: 'Ciclo 1', detail: 'Choque → RCP 2 min' },
            { label: 'Ciclo 2', detail: 'Choque → RCP + Epinefrina' },
            { label: 'Ciclo 3', detail: 'Choque → RCP + Antiarrítmico' },
            { label: 'Seguintes', detail: 'Alternar Epi e Antiarrítmico' },
          ]}
        />
      </aside>
    </div>
  );
}

function CausasTab() {
  return (
    <>
      <div className="content-alert content-alert--warning">
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Lista Expandida SAVA — 16 Causas Reversíveis</div>
          <div className="content-alert-text">
            A lista SAVA inclui as 5Hs/5Ts clássicas MAIS as causas específicas do perioperatório
            pediátrico: Hipertermia Maligna, Hipervagal, Hipoglicemia, ISAL e QT Longo.
            Estas 5 diferenciam o anestesiologista no manejo da PCR pediátrica.
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-header">
          <div className="content-section-icon">📋</div>
          <div>
            <div className="content-section-title">Causas Reversíveis Perioperatórias</div>
            <div className="content-section-subtitle">Clássicas + Específicas SAVA</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Causa</th>
                <th>Contexto Clínico</th>
                <th>Tratamento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1</strong></td>
                <td style={{ color: '#e94560' }}>Hipertermia Maligna</td>
                <td>Halogenados/succinilcolina → rigidez, hipertermia, rabdomiólise</td>
                <td>Dantrolene imediato</td>
              </tr>
              <tr>
                <td><strong>2</strong></td>
                <td style={{ color: '#e94560' }}>Hipervagal</td>
                <td>Laringoscopia, tração visceral, compressão ocular</td>
                <td>Atropina 0,02 mg/kg</td>
              </tr>
              <tr>
                <td><strong>3</strong></td>
                <td>Hipóxia</td>
                <td>Obstrução VA, laringoespasmo, broncoespasmo</td>
                <td>O₂, via aérea avançada</td>
              </tr>
              <tr>
                <td><strong>4</strong></td>
                <td>Hipovolemia</td>
                <td>Sangramento cirúrgico, sepse. Compensa até colapso súbito</td>
                <td>Cristaloides 20 mL/kg bolus</td>
              </tr>
              <tr>
                <td><strong>5</strong></td>
                <td>Hipotermia</td>
                <td>Criança perde calor rapidamente. FV refratária se {'<'} 30°C</td>
                <td>Aquecer ativamente</td>
              </tr>
              <tr>
                <td><strong>6</strong></td>
                <td style={{ color: '#e94560' }}>Hipoglicemia</td>
                <td>Reservas limitadas em lactentes + jejum prolongado</td>
                <td>Glicose 0,5–1 g/kg IV</td>
              </tr>
              <tr>
                <td><strong>7</strong></td>
                <td>Hipo/Hipercalemia</td>
                <td>IR, hemólise, succinilcolina em doença neuromuscular</td>
                <td>Ca²⁺ IV para hipercalemia</td>
              </tr>
              <tr>
                <td><strong>8</strong></td>
                <td>H⁺ — Acidose</td>
                <td>Reduz contratilidade, piora resposta a vasopressores</td>
                <td>NaHCO₃ se pH {'<'} 7,1</td>
              </tr>
              <tr>
                <td><strong>9</strong></td>
                <td style={{ color: '#e94560' }}>Toxinas (ISAL/Anafilaxia)</td>
                <td>Colapso CV após bloqueio regional ou exposição a alérgeno</td>
                <td>Emulsão lipídica 20% / Epinefrina</td>
              </tr>
              <tr>
                <td><strong>10</strong></td>
                <td style={{ color: '#e94560' }}>QT Longo</td>
                <td>Congênito ou adquirido (ondansetrona, haloperidol)</td>
                <td>MgSO₄ 2 mg/kg IV</td>
              </tr>
              <tr>
                <td><strong>11</strong></td>
                <td>Trauma / Cirurgia</td>
                <td>Hemorragia oculta, embolia gasosa, pneumotórax iatrogênico</td>
                <td>Comunicar com equipe cirúrgica</td>
              </tr>
              <tr>
                <td><strong>12</strong></td>
                <td>Pneumotórax Hipertensivo</td>
                <td>Desvio mediastinal, MV ausente unilateral</td>
                <td>Punção 2º EIC hemiclavicular</td>
              </tr>
              <tr>
                <td><strong>13</strong></td>
                <td>Hipertensão Pulmonar</td>
                <td>Falência VD, mais comum em cardiopatias congênitas</td>
                <td>NO inalatório, prostaglandinas</td>
              </tr>
              <tr>
                <td><strong>14</strong></td>
                <td>Trombose Pulmonar</td>
                <td>Rara, possível em adolescentes com fatores de risco</td>
                <td>Trombolítico se EP maciça</td>
              </tr>
              <tr>
                <td><strong>15</strong></td>
                <td>Trombose Coronariana</td>
                <td>Anomalias congênitas, Kawasaki com aneurismas</td>
                <td>ECG pós-RCE, eco urgente</td>
              </tr>
              <tr>
                <td><strong>16</strong></td>
                <td>Tamponamento Cardíaco</td>
                <td>Trauma, cirurgia cardíaca, pericardite</td>
                <td>Pericardiocentese subxifóide</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-alert content-alert--danger" style={{ marginTop: 'var(--space-lg)' }}>
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">ISAL — Intoxicação Sistêmica por Anestésico Local</div>
          <div className="content-alert-text">
            PCR ou colapso cardiovascular após bloqueio regional → <strong>Emulsão lipídica 20%
            (Intralipid) 1,5 mL/kg IV em bolus + infusão 0,25 mL/kg/min</strong>.
            Deve estar disponível em toda sala de cirurgia!
          </div>
        </div>
      </div>
    </>
  );
}

function BradicardiaTab() {
  return (
    <>
      <div className="content-alert content-alert--warning">
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Bradicardia Pediátrica</div>
          <div className="content-alert-text">
            A bradicardia na criança é quase sempre secundária a <strong>hipóxia, acidose ou hipotensão</strong> —
            raramente é de causa cardíaca primária. O tratamento da causa base (especialmente a ventilação)
            resolve a maioria dos casos.
          </div>
        </div>
      </div>

      <div className="flowchart-layout" style={{ maxWidth: '900px' }}>
        <div className="flowchart-main">
          <FlowchartNode
            type="start"
            title="BRADICARDIA PEDIÁTRICA"
            items={['FC < 60/min com comprometimento cardiopulmonar']}
          />
          <FlowchartArrow direction="down" />
          <FlowchartNode
            type="decision"
            title="COMPROMETIMENTO CARDIOPULMONAR?"
            items={['Estado mental alterado + sinais de choque + hipotensão?']}
          />
          <FlowchartArrow direction="down" />

          <div className="flowchart-branch">
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">SIM — Comprometimento</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="SUPORTE IMEDIATO"
                stepNumber={1}
                items={[
                  'Via aérea patente + ventilação com pressão positiva',
                  'O₂ 100%',
                  'Monitor: ritmo, PA, SpO₂',
                  'Se FC < 60 apesar de O₂/ventilação → INICIAR RCP',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="EPINEFRINA"
                stepNumber={2}
                items={[
                  '0,01 mg/kg IV/IO (0,1 mL/kg da sol 0,1 mg/mL)',
                  'Sem acesso: via ET 0,1 mg/kg',
                  'Repetir a cada 3-5 min',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="decision"
                title="BRADICARDIA POR TÔNUS VAGAL OU BLOQUEIO AV?"
              />
              <FlowchartArrow direction="down" label="SIM" />
              <FlowchartNode
                type="action"
                title="ATROPINA"
                stepNumber={3}
                items={[
                  '0,02 mg/kg IV/IO',
                  'Dose mínima: 0,1 mg',
                  'Dose máxima única: 0,5 mg',
                  'Pode repetir 1 vez',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="warning"
                title="CONSIDERAR MARCAPASSO"
                stepNumber={4}
                items={[
                  'Transcutâneo ou transvenoso',
                  'Se bradicardia refratária a drogas',
                  'BAV completo ou disfunção do nó sinusal',
                ]}
              />
            </div>

            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">NÃO — Sem comprometimento</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="CONDUTA CONSERVADORA"
                items={[
                  'Manter ABC + oxigênio',
                  'ECG de 12 derivações',
                  'Identificar e tratar causas base',
                  'Verificar pulso a cada 2 min',
                ]}
              />
            </div>
          </div>
        </div>

        <aside className="flowchart-sidebar">
          <DosePanel
            title="Medicações — Bradicardia"
            accentColor="#7b1fa2"
            items={[
              { label: 'Epinefrina IV/IO', detail: '0,01 mg/kg (a cada 3-5 min)' },
              { label: 'Epinefrina ET', detail: '0,1 mg/kg' },
              { label: 'Atropina IV/IO', detail: '0,02 mg/kg (mín 0,1 / máx 0,5 mg)' },
            ]}
          />
          <DosePanel
            title="Causas da Bradicardia"
            accentColor="#e67e22"
            items={[
              { label: 'Hipóxia', detail: 'Causa mais comum! Tratar VA' },
              { label: 'Hipotermia', detail: 'Depressão nó SA' },
              { label: 'Medicações', detail: 'β-bloq, BCC, dexmedetomidina' },
              { label: 'Vagal', detail: 'Laringoscopia, aspiração' },
            ]}
          />
        </aside>
      </div>

      <div className="content-section" style={{ '--item-accent': '#e67e22', marginTop: 'var(--space-lg)' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">📊</div>
          <div>
            <div className="content-section-title">Causas e Tratamento Específico</div>
            <div className="content-section-subtitle">Bradicardia pediátrica</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Causa</th>
                <th>Mecanismo</th>
                <th>Tratamento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Hipóxia</strong></td>
                <td>Estimulação vagal + depressão nó SA por hipóxia tecidual</td>
                <td>Ventilação + O₂ (resolve rapidamente)</td>
              </tr>
              <tr>
                <td><strong>Hipotermia</strong></td>
                <td>Depressão direta do nó SA e sistema de condução</td>
                <td>Reaquecimento ativo progressivo</td>
              </tr>
              <tr>
                <td><strong>Medicações</strong></td>
                <td>β-bloq, BCC, dexmedetomidina, propofol, neostigmina, digoxina</td>
                <td>Suspender agente + Atropina + Glucagon (β-bloq) + Ca²⁺ (BCC)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PosPCRTab() {
  return (
    <>
      <div className="content-alert content-alert--info">
        <span className="content-alert-icon">📝</span>
        <div>
          <div className="content-alert-title">Cuidados Pós-PCR Pediátricos</div>
          <div className="content-alert-text">
            Os cuidados pós-PCR em pediatria seguem os mesmos princípios do adulto, com particularidades
            importantes quanto à oxigenação alvo, controle de temperatura e manejo da glicemia.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#7b1fa2' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🎯</div>
          <div>
            <div className="content-section-title">Metas e Alvos Pós-RCE</div>
            <div className="content-section-subtitle">Baseados em ACLS 2020</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Parâmetro</th>
                <th>Alvo</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>SpO₂</strong></td>
                <td>94–99%</td>
                <td>Evitar hiperoxia E hipóxia</td>
              </tr>
              <tr>
                <td><strong>Temperatura</strong></td>
                <td>32–34°C por 48h</td>
                <td>Hipotermia leve se comatoso pós-PCR extra-hospitalar</td>
              </tr>
              <tr>
                <td><strong>Glicemia</strong></td>
                <td>Normoglicemia</td>
                <td>Evitar hipo e hiperglicemia</td>
              </tr>
              <tr>
                <td><strong>Convulsões</strong></td>
                <td>Controle agressivo</td>
                <td>Aumentam demanda metabólica cerebral</td>
              </tr>
              <tr>
                <td><strong>Febre</strong></td>
                <td>Evitar ativamente</td>
                <td>Piora prognóstico neurológico</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-alert content-alert--warning" style={{ marginTop: 'var(--space-lg)' }}>
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Mudança ACLS 2020 — Hipotermia Terapêutica</div>
          <div className="content-alert-text">
            A hipotermia terapêutica pós-PCR pediátrica é indicada <strong>apenas após PCR extra-hospitalar</strong>.
            Não há evidência que justifique seu uso em outros contextos como neuroproteção.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#4caf50' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🔬</div>
          <div>
            <div className="content-section-title">Medidas Adicionais</div>
            <div className="content-section-subtitle">Suporte avançado pós-PCR</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>ECMO:</strong> considerar em centros habilitados com PCR refratária e prognóstico favorável</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Monitorização neurológica:</strong> EEG contínuo para detecção de convulsões subclínicas</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Hemodinâmica:</strong> manter perfusão adequada com vasopressores/inotrópicos conforme necessidade</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Ventilação protetora:</strong> evitar hiperventilação — manter PaCO₂ normal</span>
          </div>
        </div>
      </div>
    </>
  );
}
