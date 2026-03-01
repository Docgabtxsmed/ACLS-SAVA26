import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';

export default function CardiacArrestPage() {
  return (
    <div className="algo-page">
      <Navbar title="Algoritmo de PCR no Adulto" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">💔</span>
        <h1 className="algo-page-title">Algoritmo de PCR no Adulto</h1>
        <span className="algo-page-case">Caso 6</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Início */}
          <FlowchartNode
            type="start"
            title="ATIVAR RESPOSTA DE EMERGÊNCIA"
          />

          <FlowchartArrow direction="down" />

          {/* Passo 1 */}
          <FlowchartNode
            type="action"
            title="INICIAR RCP"
            stepNumber={1}
            items={[
              'Administrar oxigênio',
              'Conectar monitor/desfibrilador',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Decisão: Ritmo chocável? */}
          <FlowchartNode
            type="decision"
            title="RITMO CHOCÁVEL?"
            items={['Verificar ritmo no monitor']}
          />

          <FlowchartArrow direction="down" />

          {/* Ramo: FV/TVsp vs Assistolia/AESP */}
          <div className="flowchart-branch">

            {/* ESQUERDA: Chocável (FV/TVsp) */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">SIM — FV/TVsp</span>

              <FlowchartArrow direction="down" />
              <FlowchartNode type="action" title="FV/TVsp" stepNumber={2} />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="critical" title="APLICAR CHOQUE" stepNumber={3} />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="RCP POR DOIS MINUTOS"
                stepNumber={4}
                items={['Acesso IV/IO']}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="decision" title="RITMO CHOCÁVEL?" />

              <FlowchartArrow direction="down" label="SIM" />
              <FlowchartNode type="critical" title="APLICAR CHOQUE" stepNumber={5} />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="RCP POR DOIS MINUTOS"
                stepNumber={6}
                items={[
                  'Epinefrina a cada 3 a 5 min',
                  'Considerar via aérea avançada e capnografia',
                ]}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="decision" title="RITMO CHOCÁVEL?" />

              <FlowchartArrow direction="down" label="SIM" />
              <FlowchartNode type="critical" title="APLICAR CHOQUE" stepNumber={7} />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="RCP POR DOIS MINUTOS"
                stepNumber={8}
                items={[
                  'Amiodarona ou Lidocaína',
                  'Tratar causas reversíveis',
                ]}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="AVALIAR RCE"
                items={[
                  'Se sem sinais de RCE, ir para passo 5 ou 7',
                  'Se sinais de RCE, ir para Cuidados Pós-PCR',
                ]}
              />
            </div>

            {/* DIREITA: Não Chocável (Assistolia/AESP) */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">NÃO — Assistolia/AESP</span>

              <FlowchartArrow direction="down" />
              <FlowchartNode type="action" title="ASSISTOLIA/AESP" stepNumber={9} />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="critical" title="EPINEFRINA IMEDIATA" />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="RCP POR DOIS MINUTOS"
                stepNumber={10}
                items={[
                  'Epinefrina a cada 3 a 5 min',
                  'Considerar via aérea avançada e capnografia',
                ]}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="decision" title="RITMO CHOCÁVEL?" />

              <FlowchartArrow direction="down" label="NÃO" />
              <FlowchartNode
                type="action"
                title="RCP POR DOIS MINUTOS"
                stepNumber={11}
                items={['Tratar causas reversíveis']}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="decision" title="RITMO CHOCÁVEL?" />

              <FlowchartArrow direction="down" label="SIM" />
              <FlowchartNode
                type="warning"
                title="IR PARA PASSO 5 OU 7"
                items={['Mudar para via de ritmo chocável']}
              />

              <FlowchartArrow direction="down" label="NÃO" />
              <FlowchartNode
                type="info"
                title="AVALIAR RCE"
                items={[
                  'Se sem sinais de RCE, ir para passo 10 ou 11',
                  'Se sinais de RCE, ir para Cuidados Pós-PCR',
                ]}
              />
            </div>
          </div>
        </div>

        {/* Sidebar: Doses */}
        <aside className="flowchart-sidebar">
          <DosePanel
            title="Medicações"
            accentColor="#c0392b"
            items={[
              { label: 'Epinefrina', detail: '1 mg IV/IO a cada 3–5 minutos' },
              { label: 'Amiodarona (1ª dose)', detail: '300 mg bolus IV/IO' },
              { label: 'Amiodarona (2ª dose)', detail: '150 mg IV/IO' },
              { label: 'Lidocaína (1ª dose)', detail: '1–1,5 mg/kg IV/IO' },
              { label: 'Lidocaína (subsequentes)', detail: '0,5–0,75 mg/kg IV/IO' },
            ]}
          />
          <DosePanel
            title="5H's e 5T's (Causas Reversíveis)"
            accentColor="#5b6abf"
            items={[
              { label: 'H — Hipovolemia', detail: 'Reposição volêmica' },
              { label: 'H — Hipóxia', detail: 'Oxigenação/ventilação' },
              { label: 'H — Hidrogênio (acidose)', detail: 'Correção de acidose' },
              { label: 'H — Hipo/Hipercalemia', detail: 'Correção eletrolítica' },
              { label: 'H — Hipotermia', detail: 'Reaquecimento' },
              { label: 'T — Tensão (pneumotórax)', detail: 'Descompressão por agulha' },
              { label: 'T — Tamponamento cardíaco', detail: 'Pericardiocentese' },
              { label: 'T — Toxinas', detail: 'Antídotos específicos' },
              { label: 'T — Trombose coronariana', detail: 'ICP / fibrinolíticos' },
              { label: 'T — Trombose pulmonar', detail: 'Embolectomia / fibrinolíticos' },
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
