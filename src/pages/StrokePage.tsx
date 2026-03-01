import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';

export default function StrokePage() {
  return (
    <div className="algo-page">
      <Navbar title="AVC — Acidente Vascular Cerebral Agudo" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🧠</span>
        <h1 className="algo-page-title">Algoritmo de AVC Agudo</h1>
        <span className="algo-page-case">Caso 7</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Início */}
          <FlowchartNode
            type="critical"
            title="ATIVAR RESPOSTA DE EMERGÊNCIA"
            items={['Identificar sinais/sintomas de AVC']}
          />

          <FlowchartArrow direction="down" />

          {/* Avaliação SME */}
          <div className="flowchart-node-wrapper">
            <span className="flowchart-time-label">METAS DE TEMPO NINDS</span>
            <FlowchartNode
              type="action"
              title="AVALIAÇÃO/AÇÕES IMPORTANTES DO SME"
              items={[
                'Completar avaliação pré-hospitalar de AVC',
                'Anotar horário de início dos sintomas (último estado normal)',
                'Suporte ABC; administrar O2',
                'Verificar glicemia',
                'Encaminhar para centro de AVC',
                'Alertar hospital',
              ]}
            />
          </div>

          <FlowchartArrow direction="down" />

          {/* Avaliação Geral */}
          <div className="flowchart-node-wrapper">
            <span className="flowchart-time-label">CHEGADA AO PS EM ATÉ 10 MINUTOS</span>
            <FlowchartNode
              type="action"
              title="AVALIAÇÃO GERAL/ESTABILIZAÇÃO"
              items={[
                'Avaliar sinais vitais/ABC',
                'Obter acesso IV/realizar exames laboratoriais',
                'Obter ECG de 12 derivações',
                'Administrar O2 se hipoxêmico',
                'Verificar glicemia; tratar se necessário',
                'Completar avaliação neurológica de triagem',
                'Solicitar RM de crânio/TC de emergência',
                'Ativar equipe de AVC',
              ]}
            />
          </div>

          <FlowchartArrow direction="down" />

          {/* Avaliação Neurológica */}
          <div className="flowchart-node-wrapper">
            <span className="flowchart-time-label">CHEGADA AO PS EM ATÉ 25 MINUTOS</span>
            <FlowchartNode
              type="action"
              title="AVALIAÇÃO NEUROLÓGICA PELA EQUIPE DE AVC"
              items={[
                'Revisar história do paciente',
                'Completar exame neurológico (CPSS ou Escala NIHSS)',
                'Anotar último estado normal conhecido ou início dos sintomas',
              ]}
            />
          </div>

          <FlowchartArrow direction="down" />

          {/* Decisão TC */}
          <div className="flowchart-node-wrapper">
            <span className="flowchart-time-label">CHEGADA AO PS EM ATÉ 45 MINUTOS</span>
            <FlowchartNode
              type="decision"
              title="TC MOSTRA HEMORRAGIA?"
            />
          </div>

          <FlowchartArrow direction="down" />

          {/* Ramo: Hemorrágico vs Isquêmico */}
          <div className="flowchart-branch">

            {/* SIM → Hemorrágico */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">SIM — HEMORRÁGICO</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="AVALIAÇÃO NEUROCIRURGIÃO/NEUROLOGISTA"
                items={['Transferir se não disponível']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="ADMINISTRAR AAS"
                items={['Manejar AVC hemorrágico conforme protocolo']}
              />
            </div>

            {/* NÃO → Isquêmico */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">NÃO — ISQUÊMICO</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="PROVÁVEL AVC ISQUÊMICO AGUDO"
                items={[
                  'Preparar para terapia fibrinolítica',
                  'Repetir exame neurológico; déficits melhorando?',
                  'Pesquisar exclusões para fibrinólise',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="decision"
                title="TERAPIA FIBRINOLÍTICA AINDA POSSÍVEL?"
              />
              <FlowchartArrow direction="down" />

              <div className="flowchart-branch">
                <div className="flowchart-branch-path">
                  <span className="flowchart-branch-label flowchart-branch-label--yes">CANDIDATO</span>
                  <FlowchartArrow direction="down" />
                  <FlowchartNode
                    type="critical"
                    title="ADMINISTRAR rtPA (ALTEPLASE)"
                    items={[
                      'Iniciar terapia fibrinolítica conforme protocolo',
                      'Monitorar complicações',
                      'Admitir em unidade de AVC/UTI',
                    ]}
                  />
                </div>
                <div className="flowchart-branch-path">
                  <span className="flowchart-branch-label flowchart-branch-label--no">NÃO CANDIDATO</span>
                  <FlowchartArrow direction="down" />
                  <FlowchartNode
                    type="info"
                    title="ADMINISTRAR AAS"
                    items={[
                      'Considerar trombectomia se oclusão de grande vaso',
                      'Admitir em unidade de AVC',
                      'Manter cuidados de suporte',
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <aside className="flowchart-sidebar">
          <DosePanel
            title="Metas de Tempo NINDS"
            accentColor="#8e44ad"
            items={[
              { label: 'Porta-médico', detail: '10 minutos' },
              { label: 'Porta-TC concluída', detail: '25 minutos' },
              { label: 'Porta-laudo da TC', detail: '45 minutos' },
              { label: 'Porta-droga (rtPA)', detail: '60 minutos' },
              { label: 'Porta-leito monitorado', detail: '3 horas' },
            ]}
          />
          <DosePanel
            title="Escalas de Avaliação de AVC"
            accentColor="#5b6abf"
            items={[
              { label: 'CPSS (Cincinnati)', detail: 'Desvio facial, Queda do braço, Fala' },
              { label: 'Escala NIHSS', detail: 'Quantifica gravidade do AVC (0-42)' },
              { label: 'Chave: Último Estado Normal', detail: 'Crítico para janela de elegibilidade fibrinolítica' },
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
