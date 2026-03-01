import { useState } from 'react';
import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';
import './ContentPage.css';

type Tab = 'causas' | 'fisiologia' | 'sbv' | 'sav' | 'algoritmo' | 'cesarea' | 'pos';

export default function PregnantCardiacArrestPage() {
  const [activeTab, setActiveTab] = useState<Tab>('causas');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'causas', label: 'Causas' },
    { key: 'fisiologia', label: 'Fisiologia' },
    { key: 'sbv', label: 'SBV' },
    { key: 'sav', label: 'SAV / Via Aérea' },
    { key: 'algoritmo', label: 'Algoritmo' },
    { key: 'cesarea', label: 'Cesárea Perimortem' },
    { key: 'pos', label: 'Pós-PCR' },
  ];

  return (
    <div className="algo-page">
      <Navbar title="PCR em Gestante" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🤰</span>
        <h1 className="algo-page-title">PCR em Gestante</h1>
        <span className="algo-page-case">Parada Cardiorrespiratória na Gestação</span>
      </header>

      <div className="content-tabs" style={{ '--tab-accent': '#ad1457' } as React.CSSProperties}>
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
        {activeTab === 'causas' && <CausasTab />}
        {activeTab === 'fisiologia' && <FisiologiaTab />}
        {activeTab === 'sbv' && <SBVTab />}
        {activeTab === 'sav' && <SAVTab />}
        {activeTab === 'algoritmo' && <AlgoritmoTab />}
        {activeTab === 'cesarea' && <CesareaTab />}
        {activeTab === 'pos' && <PosPCRTab />}
      </div>
    </div>
  );
}

function CausasTab() {
  return (
    <>
      <div className="content-alert content-alert--danger">
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">Dois Pacientes Simultâneos</div>
          <div className="content-alert-text">
            A PCR na gestante é o único cenário que envolve dois pacientes — mãe e feto. Exige
            acionamento imediato do <strong>"Código Azul Materno"</strong> com anestesiologista, obstetra,
            neonatologista e enfermagem. Os esforços devem se concentrar na MÃE — a sobrevivência
            fetal quase sempre depende da sobrevivência materna.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#ad1457' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">📋</div>
          <div>
            <div className="content-section-title">Mnemônico ABCDEFGH — Causas Reversíveis</div>
            <div className="content-section-subtitle">72% das causas de morte materna são diretas (relacionadas à gestação)</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Letra</th>
                <th>Causa</th>
                <th>Exemplos Clínicos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style={{ color: '#ad1457' }}>A</strong></td>
                <td><strong>Anestesia / Acidentes / Trauma</strong></td>
                <td>Bloqueio neuroaxial alto, VA difícil, broncoaspiração, LAST, hipotensão, trauma</td>
              </tr>
              <tr>
                <td><strong style={{ color: '#ad1457' }}>B</strong></td>
                <td><strong>Bleeding (Hemorragia)</strong></td>
                <td>Atonia uterina, placenta acreta, DPP, ruptura uterina — PRINCIPAL causa direta ({'>'} 27%)</td>
              </tr>
              <tr>
                <td><strong style={{ color: '#ad1457' }}>C</strong></td>
                <td><strong>Causas Cardiovasculares</strong></td>
                <td>IAM, dissecção de aorta, cardiomiopatia, arritmias, cardiopatias congênitas</td>
              </tr>
              <tr>
                <td><strong style={{ color: '#ad1457' }}>D</strong></td>
                <td><strong>Drogas</strong></td>
                <td>Ocitocina, sulfato de magnésio, opioides, drogas ilícitas, erros de medicação</td>
              </tr>
              <tr>
                <td><strong style={{ color: '#ad1457' }}>E</strong></td>
                <td><strong>Embolia</strong></td>
                <td>EP, embolia de líquido amniótico, AVC isquêmico, embolia aérea venosa</td>
              </tr>
              <tr>
                <td><strong style={{ color: '#ad1457' }}>F</strong></td>
                <td><strong>Febre / Infecção</strong></td>
                <td>Sepse puerperal, infecções graves</td>
              </tr>
              <tr>
                <td><strong style={{ color: '#ad1457' }}>G</strong></td>
                <td><strong>Gerais — 5Hs e 5Ts</strong></td>
                <td>Mesmas causas reversíveis clássicas do adulto</td>
              </tr>
              <tr>
                <td><strong style={{ color: '#ad1457' }}>H</strong></td>
                <td><strong>Hipertensão / Pré-eclâmpsia</strong></td>
                <td>Pré-eclâmpsia, eclâmpsia, HELLP, hemorragia intracraniana</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function FisiologiaTab() {
  return (
    <>
      <div className="content-alert content-alert--info">
        <span className="content-alert-icon">📝</span>
        <div>
          <div className="content-alert-title">Alterações Fisiológicas com Impacto na RCP</div>
          <div className="content-alert-text">
            As modificações anatômicas e fisiológicas da gestação determinam mudanças importantes
            nos algoritmos de atendimento. Conhecê-las é fundamental para a RCP efetiva.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#c62828' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">❤️</div>
          <div>
            <div className="content-section-title">Sistema Circulatório — A Mais Importante para RCP</div>
            <div className="content-section-subtitle">Compressão aortocava pelo útero gravídico</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Compressão aortocava:</strong> útero gravídico comprime VCI e aorta → ↓ retorno venoso → ↓ débito cardíaco</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Manobra obrigatória:</strong> DUE (deslocamento uterino para esquerda) durante TODA a RCP e pós-PCR</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Indicação:</strong> fundo uterino ao nível ou ACIMA da cicatriz umbilical (~20 semanas)</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#1565c0' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🫁</div>
          <div>
            <div className="content-section-title">Sistema Respiratório</div>
            <div className="content-section-subtitle">Dessaturação rápida e via aérea difícil</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>CRF reduzida + ↑ consumo O₂:</strong> dessaturação MUITO rápida durante apneia</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Mucosa hiperemiada:</strong> maior risco de sangramento e edema durante IOT</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Tubos menores:</strong> utilizar tubos 6,0–7,0 mm de diâmetro interno</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#e67e22' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🍽️</div>
          <div>
            <div className="content-section-title">Sistema Digestório</div>
            <div className="content-section-subtitle">Risco elevado de aspiração</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Esfíncter esofágico inferior hipotônico: maior risco de refluxo e broncoaspiração</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span>Retardo do esvaziamento gástrico: risco ampliado durante emergências</span>
          </div>
        </div>
      </div>

      <div className="content-alert content-alert--danger" style={{ marginTop: 'var(--space-lg)' }}>
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">Gestante = ESTÔMAGO CHEIO</div>
          <div className="content-alert-text">
            A gestante é considerada ESTÔMAGO CHEIO <strong>independentemente do jejum</strong>.
            Priorizar intubação precoce para proteção de via aérea!
          </div>
        </div>
      </div>
    </>
  );
}

function SBVTab() {
  return (
    <>
      <div className="content-alert content-alert--warning">
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Prioridades Simultâneas — Iniciar IMEDIATAMENTE</div>
          <div className="content-alert-text">
            Mínimo <strong>4 socorristas</strong>. RCP de alta qualidade + DUE contínuo + DEA + anotar hora exata
            da PCR (marco zero para cesárea perimortem em 4 minutos).
          </div>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="comparison-card" style={{ '--comp-color': '#ad1457' } as React.CSSProperties}>
          <div className="comparison-card-title">🫁 DUE — Deslocamento Uterino Esquerdo</div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Quando</span>
            <span className="comparison-card-value">Fundo uterino ≥ cicatriz umbilical (~20 sem)</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Como</span>
            <span className="comparison-card-value">1 ou 2 mãos no flanco direito → esquerda</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Ângulo</span>
            <span className="comparison-card-value">15–30° para esquerda</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Regra</span>
            <span className="comparison-card-value">NÃO interromper compressões para realizar DUE</span>
          </div>
        </div>

        <div className="comparison-card" style={{ '--comp-color': '#1565c0' } as React.CSSProperties}>
          <div className="comparison-card-title">💓 Compressões Torácicas</div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Local</span>
            <span className="comparison-card-value">Centro do esterno (mesma posição)</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Frequência</span>
            <span className="comparison-card-value">100–120/min</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Profundidade</span>
            <span className="comparison-card-value">5–6 cm</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Relação</span>
            <span className="comparison-card-value">30:2 sem via aérea avançada</span>
          </div>
        </div>

        <div className="comparison-card" style={{ '--comp-color': '#e94560' } as React.CSSProperties}>
          <div className="comparison-card-title">⚡ Desfibrilação</div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Energia</span>
            <span className="comparison-card-value">Mesmas cargas do adulto</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Bifásico</span>
            <span className="comparison-card-value">120–200 J</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Posição pás</span>
            <span className="comparison-card-value">Anterolateral (sob o tecido mamário)</span>
          </div>
          <div className="comparison-card-row">
            <span className="comparison-card-label">Monitor fetal</span>
            <span className="comparison-card-value">REMOVER antes do choque</span>
          </div>
        </div>
      </div>

      <div className="content-alert content-alert--info" style={{ marginTop: 'var(--space-lg)' }}>
        <span className="content-alert-icon">⚠️</span>
        <div>
          <div className="content-alert-title">Mudança ACLS 2020 — Desfibrilação</div>
          <div className="content-alert-text">
            A desfibrilação na gestante segue as mesmas recomendações do adulto. A carga NÃO prejudica
            o feto. Monitores fetais devem ser REMOVIDOS antes de qualquer choque para evitar
            eletrocussão e interferência.
          </div>
        </div>
      </div>
    </>
  );
}

function SAVTab() {
  return (
    <>
      <div className="content-section" style={{ '--item-accent': '#ad1457' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">📋</div>
          <div>
            <div className="content-section-title">SAV — Passos do Algoritmo</div>
            <div className="content-section-subtitle">Suporte Avançado de Vida na Gestante</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">1.</span>
            <span>RCP contínua de alta qualidade</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">2.</span>
            <span><strong>DUE contínuo</strong> (Deslocamento Uterino para Esquerda)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">3.</span>
            <span><strong>Acesso venoso ACIMA do diafragma:</strong> MMSS ou jugular/subclávia. Evitar acesso femoral — o útero comprime a VCI</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">4.</span>
            <span>Controle avançado da via aérea: pelo profissional mais experiente</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">5.</span>
            <span>Medicamentos: mesmas indicações e doses do adulto</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">6.</span>
            <span>Identificar e tratar causas específicas (ABCDEFGH)</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">7.</span>
            <span><strong>Preparar para cesárea perimortem:</strong> equipe prontidão desde o início</span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#e94560' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🫁</div>
          <div>
            <div className="content-section-title">Manejo da Via Aérea — VAD</div>
            <div className="content-section-subtitle">Sequência de tentativas (2 por técnica)</div>
          </div>
        </div>

        <div className="flowchart-layout" style={{ maxWidth: '600px' }}>
          <div className="flowchart-main">
            <FlowchartNode
              type="action"
              title="1ª TENTATIVA IOT"
              stepNumber={1}
              items={['Tubo 6,0–7,0 mm', 'Profissional mais experiente']}
            />
            <FlowchartArrow direction="down" label="Falhou?" />
            <FlowchartNode
              type="action"
              title="2ª TENTATIVA IOT"
              stepNumber={2}
              items={['Ajustar técnica, bougie']}
            />
            <FlowchartArrow direction="down" label="Falhou?" />
            <FlowchartNode
              type="warning"
              title="1ª TENTATIVA DSG"
              stepNumber={3}
              items={['Dispositivo supraglótico']}
            />
            <FlowchartArrow direction="down" label="Falhou?" />
            <FlowchartNode
              type="warning"
              title="2ª TENTATIVA DSG"
              stepNumber={4}
              items={['Trocar dispositivo/tamanho']}
            />
            <FlowchartArrow direction="down" label="Falhou?" />
            <FlowchartNode
              type="action"
              title="VENTILAÇÃO SOB MÁSCARA"
              stepNumber={5}
              items={['Dois operadores, cânula orofaríngea']}
            />
            <FlowchartArrow direction="down" label="Falhou?" />
            <FlowchartNode
              type="critical"
              title="CRICOTIREOIDOSTOMIA"
              stepNumber={6}
              items={['Percutânea ou cirúrgica', 'Último recurso — NEVER give up!']}
            />
          </div>
        </div>
      </div>

      <div className="content-alert content-alert--danger" style={{ marginTop: 'var(--space-lg)' }}>
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">Hipóxia se instala RAPIDAMENTE na gestante</div>
          <div className="content-alert-text">
            A cada falha, ter o próximo recurso JÁ preparado. Na gestante, o tempo entre tentativas
            deve ser MÍNIMO. NEVER give up — à cada falha, avançar para o próximo recurso.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#4caf50' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">💊</div>
          <div>
            <div className="content-section-title">Medicamentos — Mesmos do Adulto</div>
            <div className="content-section-subtitle">Com exceção do MgSO₄ em uso</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Dose</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Adrenalina</strong></td>
                <td>1 mg IV a cada 3–5 min</td>
                <td>Mesma dose e indicação do adulto</td>
              </tr>
              <tr>
                <td><strong>Amiodarona</strong></td>
                <td>300 mg IV em bólus</td>
                <td>Se ritmo chocável refratário</td>
              </tr>
              <tr>
                <td><strong>MgSO₄ em uso</strong></td>
                <td>SUSPENDER</td>
                <td>Administrar Ca²⁺: CaCl₂ 10% 10 mL IV ou gluconato Ca²⁺ 10% 30 mL IV</td>
              </tr>
            </tbody>
          </table>
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
          title="PCR EM GESTANTE"
          items={['Confirmar PCR — sem pulso, sem resposta', 'ANOTAR HORA EXATA DA PCR']}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="critical"
          title="ATIVAR EQUIPE MULTIDISCIPLINAR"
          stepNumber={1}
          items={[
            '"Código Azul Materno"',
            'Anestesiologia + Obstetrícia + Neonatologia',
            'Mínimo 4 socorristas',
          ]}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="critical"
          title="INICIAR RCP + DUE"
          stepNumber={2}
          items={[
            'Compressões de alta qualidade (100–120/min, 5–6 cm)',
            'DUE CONTÍNUO (socorrista dedicado)',
            'O₂ 100% — preparar IOT precoce',
            'Acesso IV ACIMA do diafragma',
            'Remover monitores fetais',
          ]}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="action"
          title="SEGUIR PROTOCOLO ACLS PADRÃO"
          stepNumber={3}
          items={[
            'Avaliar ritmo — chocável vs não chocável',
            'Epinefrina 1 mg IV a cada 3-5 min',
            'Desfibrilação: mesmas energias (120–200 J bifásico)',
            'Amiodarona 300 mg se FV/TV refratária',
          ]}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="action"
          title="TRATAR CAUSAS — ABCDEFGH"
          stepNumber={4}
          items={[
            'Hemorragia: reposição volêmica + hemoderivados',
            'Eclâmpsia: MgSO₄ 4-6 g IV (se em uso → SUSPENDER + dar Ca²⁺)',
            'Intox AL: Emulsão Lipídica 20%',
            'TEP: considerar trombólise',
          ]}
        />
        <FlowchartArrow direction="down" />
        <FlowchartNode
          type="decision"
          title="RCE EM 4-5 MINUTOS?"
        />

        <FlowchartArrow direction="down" />

        <div className="flowchart-branch">
          <div className="flowchart-branch-path">
            <span className="flowchart-branch-label flowchart-branch-label--yes">SIM — RCE</span>
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="info"
              title="CUIDADOS PÓS-PCR"
              items={[
                'DUE contínuo (ou decúbito lateral esquerdo)',
                'Monitorização fetal: cardiotocografia contínua',
                'CDT 32–36°C se comatosa',
                'UTI multidisciplinar',
              ]}
            />
          </div>
          <div className="flowchart-branch-path">
            <span className="flowchart-branch-label flowchart-branch-label--no">NÃO — Sem RCE (IG ≥ 20 sem)</span>
            <FlowchartArrow direction="down" />
            <FlowchartNode
              type="critical"
              title="CESÁREA PERIMORTEM"
              stepNumber={5}
              items={[
                'Regra 4+1: iniciar no 4º min → feto fora no 5º min',
                'NO LOCAL DA PCR — NÃO transportar para CC',
                'MANTER RCP + DUE durante procedimento',
                'Objetivo DUPLO: ↑ RCE materna + sobrevida fetal',
              ]}
            />
          </div>
        </div>
      </div>

      <aside className="flowchart-sidebar">
        <DosePanel
          title="Medicações — PCR Gestante"
          accentColor="#ad1457"
          items={[
            { label: 'Epinefrina', detail: '1 mg IV/IO a cada 3-5 min' },
            { label: 'Amiodarona (1ª)', detail: '300 mg IV/IO' },
            { label: 'Amiodarona (2ª)', detail: '150 mg IV/IO' },
            { label: 'MgSO₄ em uso', detail: 'SUSPENDER + Ca²⁺ IV' },
          ]}
        />
        <DosePanel
          title="Modificações Essenciais"
          accentColor="#e67e22"
          items={[
            { label: 'DUE', detail: 'Contínuo, 15-30° para esquerda' },
            { label: 'Compressões', detail: 'Centro do esterno, superfície rígida' },
            { label: 'IOT', detail: 'Tubo 6,0-7,0, sequência rápida' },
            { label: 'Acesso IV', detail: 'ACIMA do diafragma (MMSS/jugular)' },
          ]}
        />
        <DosePanel
          title="Pontos-Chave"
          accentColor="#c62828"
          items={[
            { label: '⏱️ Hora PCR', detail: 'Documentar SEMPRE' },
            { label: '🩻 Monitor fetal', detail: 'Remover antes de desfibrilar' },
            { label: '🔻 Acesso femoral', detail: 'NÃO USAR (VCI comprimida)' },
            { label: '🔪 Cesárea', detail: '= Manobra de ressuscitação MATERNA' },
          ]}
        />
      </aside>
    </div>
  );
}

function CesareaTab() {
  return (
    <>
      <div className="content-alert content-alert--danger">
        <span className="content-alert-icon">🚨</span>
        <div>
          <div className="content-alert-title">Regra do 4+1 — A Decisão Mais Crítica</div>
          <div className="content-alert-text">
            Iniciar a cesárea no <strong>4º minuto</strong> → retirar o feto até o <strong>5º minuto</strong> pós-PCR.
            Este é o timing ideal para melhorar o prognóstico materno e fetal. O objetivo é DUPLO:
            (1) melhorar retorno venoso e DC da mãe ao retirar compressão aortocava;
            (2) dar chance de sobrevida ao feto viável. É, acima de tudo, uma manobra de ressuscitação <strong>MATERNA</strong>.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#ad1457' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">📋</div>
          <div>
            <div className="content-section-title">Parâmetros da Cesárea Perimortem</div>
            <div className="content-section-subtitle">Indicação, timing e barreiras</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Parâmetro</th>
                <th>Detalhe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Indicação</strong></td>
                <td>Sem RCE em 4 min + fundo uterino ≥ cicatriz umbilical (≥ 20 semanas)</td>
              </tr>
              <tr>
                <td><strong>Timing</strong></td>
                <td>Iniciar no 4º min → feto fora no 5º min. PCR não testemunhada: iniciar no começo da RCP</td>
              </tr>
              <tr>
                <td><strong>Local</strong></td>
                <td>NO LOCAL da PCR — <strong>NÃO transportar</strong> para centro cirúrgico</td>
              </tr>
              <tr>
                <td><strong>Principal barreira</strong></td>
                <td>Mentalidade de que exige condições ideais de CC — causa mais comum de ATRASO!</td>
              </tr>
              <tr>
                <td><strong>RCP durante cesárea</strong></td>
                <td>MANTER compressões + DUE. Equipe cirúrgica trabalha enquanto RCP continua</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#c62828' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🔪</div>
          <div>
            <div className="content-section-title">Técnica Cirúrgica</div>
            <div className="content-section-subtitle">Velocidade é prioridade sobre estética</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">1.</span>
            <span><strong>NÃO interromper compressões</strong> em nenhum momento</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">2.</span>
            <span><strong>Incisão mediana vertical</strong> — da sínfise púbica ao fundo uterino</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">3.</span>
            <span>Histerotomia — incisão no corpo uterino</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">4.</span>
            <span>Extrair feto e entregar à equipe neonatal</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">5.</span>
            <span>Remoção da placenta para ↓ sangramento</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">6.</span>
            <span>Não é necessário preparo estéril — <strong>priorizar velocidade</strong></span>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#e67e22' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">📊</div>
          <div>
            <div className="content-section-title">Cronograma da Cesárea Perimortem</div>
            <div className="content-section-subtitle">Tempo é crítico</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Tempo</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>0 min</strong></td>
                <td>PCR identificada → RCP + DUE + chamar equipe + ANOTAR HORA</td>
              </tr>
              <tr>
                <td><strong>0–4 min</strong></td>
                <td>RCP de alta qualidade, ACLS padrão, tratar causas (ABCDEFGH)</td>
              </tr>
              <tr>
                <td><strong>4 min</strong></td>
                <td>Se sem RCE → INICIAR cesárea perimortem no LOCAL</td>
              </tr>
              <tr>
                <td><strong>5 min</strong></td>
                <td>META: feto extraído do útero</td>
              </tr>
              <tr>
                <td><strong>Pós-cesárea</strong></td>
                <td>Continuar RCP materna + cuidados neonatais simultâneos</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#4caf50' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">✅</div>
          <div>
            <div className="content-section-title">Benefícios — Para Mãe e Feto</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Mãe:</strong> alivia compressão aortocaval → ↑ retorno venoso e DC durante RCP</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Mãe:</strong> melhora complacência pulmonar e ventilação</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Mãe:</strong> há relatos de RCE ocorrendo APÓS a cesárea perimortem</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">•</span>
            <span><strong>Feto:</strong> melhor chance de sobrevida neurológica se IG ≥ 24 sem</span>
          </div>
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
          <div className="content-alert-title">Cuidados Pós-PCR na Gestante</div>
          <div className="content-alert-text">
            Após RCE materna, os cuidados pós-PCR seguem os mesmos princípios do adulto, com adaptações
            específicas para a gestação. A monitorização fetal é fundamental.
          </div>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#ad1457' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">🎯</div>
          <div>
            <div className="content-section-title">Metas e Intervenções Pós-RCE</div>
            <div className="content-section-subtitle">Adaptações para gestante</div>
          </div>
        </div>
        <div className="content-table-wrapper">
          <table className="content-table">
            <thead>
              <tr>
                <th>Parâmetro</th>
                <th>Alvo / Conduta</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Monitorização fetal</strong></td>
                <td>Cardiotocografia contínua</td>
                <td>Comprometimento fetal = sinal precoce de deterioração materna</td>
              </tr>
              <tr>
                <td><strong>DUE</strong></td>
                <td>Manter contínuo</td>
                <td>Até decúbito lateral esquerdo ou cesárea realizada</td>
              </tr>
              <tr>
                <td><strong>CDT (Temperatura)</strong></td>
                <td>32–36°C por 24h</td>
                <td>Se comatosa após RCE</td>
              </tr>
              <tr>
                <td><strong>Hipotermia</strong></td>
                <td>Usar com cautela</td>
                <td>Risco de coagulopatia — avaliar individualmente</td>
              </tr>
              <tr>
                <td><strong>Avaliação fetal</strong></td>
                <td>Contínua</td>
                <td>Feto é "monitor" precoce da mãe</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section" style={{ '--item-accent': '#4caf50', marginTop: 'var(--space-lg)' } as React.CSSProperties}>
        <div className="content-section-header">
          <div className="content-section-icon">✅</div>
          <div>
            <div className="content-section-title">Pontos-Chave — Resumo Final</div>
            <div className="content-section-subtitle">Memorize estes itens</div>
          </div>
        </div>
        <div className="content-list">
          <div className="content-list-item">
            <span className="content-list-item-bullet">✅</span>
            <span><strong>Hora da PCR:</strong> SEMPRE documentar — é o marco zero para cesárea perimortem</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">✅</span>
            <span><strong>Acesso IV:</strong> ACIMA do diafragma — o útero comprime a VCI e impede retorno de infusões femorais</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">✅</span>
            <span><strong>DUE contínuo:</strong> não interromper compressões para realizar DUE — são tarefas simultâneas</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">✅</span>
            <span><strong>Monitores fetais:</strong> REMOVER antes de desfibrilar — evitar artefatos e lesão</span>
          </div>
          <div className="content-list-item">
            <span className="content-list-item-bullet">✅</span>
            <span><strong>Cesárea perimortem:</strong> = manobra de ressuscitação MATERNA. Não esperar condições ideais de CC</span>
          </div>
        </div>
      </div>
    </>
  );
}
