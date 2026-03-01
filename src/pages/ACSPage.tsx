import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';

export default function ACSPage() {
  return (
    <div className="algo-page">
      <Navbar title="Síndrome Coronariana Aguda" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🫀</span>
        <h1 className="algo-page-title">Algoritmo de Síndrome Coronariana Aguda</h1>
        <span className="algo-page-case">Caso 7</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Início */}
          <FlowchartNode
            type="start"
            title="SINTOMAS DE INFARTO OU ISQUEMIA"
          />

          <FlowchartArrow direction="down" />

          {/* Avaliação SME */}
          <FlowchartNode
            type="critical"
            title="AVALIAÇÃO SME / ATENDIMENTO HOSPITALAR"
            items={[
              'Suporte ABC; preparar para RCP/desfibrilação',
              'Administrar AAS, morfina, nitroglicerina e oxigênio se necessário',
              'Obter ECG de 12 derivações',
              'Se supradesnivelamento de ST:',
              '  • Notificar hospital; anotar primeiro contato médico e início dos sintomas',
              '  • Hospital deve se preparar para STEMI',
              '  • Se fibrinólise pré-hospitalar, usar checklist fibrinolítico',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Avaliação no PS */}
          <FlowchartNode
            type="action"
            title="AVALIAÇÃO E TRATAMENTO SME / PS"
            items={[
              'Verificar sinais vitais/saturação de O2',
              'Acesso IV',
              'Realizar anamnese e exame físico direcionados',
              'Preencher checklist fibrinolítico, verificar contraindicações',
              'Solicitar marcadores cardíacos iniciais',
              'Obter radiografia de tórax portátil (<30 min)',
              'Tratamento imediato no PS:',
              '  • Se SatO2 <94%, iniciar O2 a 4 L/min, titular',
              '  • AAS 160 a 325 mg VO (mastigar)',
              '  • Nitroglicerina spray ou sublingual',
              '  • Morfina IV se nitroglicerina ineficaz',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Decisão: Interpretação do ECG */}
          <FlowchartNode
            type="decision"
            title="INTERPRETAR ECG"
          />

          <FlowchartArrow direction="down" />

          {/* Ramo triplo: STEMI / NSTEMI / Normal */}
          <div className="flowchart-branch">

            {/* STEMI */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label" style={{ color: '#e94560', background: 'rgba(233, 69, 96, 0.1)' }}>STEMI</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="SUPRA DE ST OU BRE NOVO"
                items={['Alta probabilidade de lesão (STEMI)']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="INICIAR TERAPIAS ADJUVANTES"
                items={['Não atrasar a reperfusão']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="decision"
                title="INÍCIO DOS SINTOMAS ≤12 HORAS?"
              />
              <FlowchartArrow direction="down" label="SIM" />
              <FlowchartNode
                type="critical"
                title="METAS DE REPERFUSÃO"
                items={[
                  'Fibrinólise (porta-agulha) meta < 30 minutos',
                  'ICP (porta-balão) meta < 90 minutos',
                ]}
              />
            </div>

            {/* NSTEMI */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label" style={{ color: '#e67e22', background: 'rgba(230, 126, 34, 0.1)' }}>NSTEMI/AI</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="warning"
                title="INFRA DE ST / ALTERAÇÕES DE ONDA T"
                items={[
                  'Alta probabilidade de isquemia',
                  'Angina instável de alto risco / IAM sem supra de ST (AI/NSTEMI)',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="INDICADORES DE ALTO RISCO"
                items={[
                  'Troponina elevada ou paciente de alto risco',
                  'Estratégia invasiva precoce se:',
                  '  • Taquicardia ventricular',
                  '  • Sinais de insuficiência cardíaca',
                  '  • Instabilidade hemodinâmica',
                  '  • Dor torácica isquêmica refratária',
                  '  • Desvio de ST persistente/recorrente',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="INICIAR TRATAMENTOS ADJUVANTES"
                items={[
                  'Heparina (HNF ou HBPM)',
                  'Nitroglicerina',
                  'Considerar clopidogrel',
                  'Considerar inibidor GP IIb/IIIa',
                ]}
              />
            </div>

            {/* Normal */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label" style={{ color: '#4a8c5c', background: 'rgba(74, 140, 92, 0.1)' }}>NORMAL/NÃO DIAGNÓSTICO</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="ALTERAÇÕES NORMAIS OU NÃO DIAGNÓSTICAS"
                items={[
                  'SCA de baixo a intermediário risco',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="ADMITIR NA UNIDADE DE DOR TORÁCICA"
                items={[
                  'Marcadores cardíacos seriados (troponina)',
                  'Monitorização contínua do segmento ST',
                  'Repetir ECG',
                  'Teste diagnóstico não invasivo',
                ]}
              />
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <aside className="flowchart-sidebar">
          <DosePanel
            title="Tratamento Imediato no PS"
            accentColor="#e94560"
            items={[
              { label: 'Oxigênio', detail: 'Se SatO2 <94%, iniciar a 4 L/min, titular' },
              { label: 'AAS', detail: '160 a 325 mg VO (mastigar)' },
              { label: 'Nitroglicerina', detail: 'Spray ou sublingual' },
              { label: 'Morfina', detail: 'IV se nitroglicerina ineficaz' },
            ]}
          />
          <DosePanel
            title="Metas de Reperfusão"
            accentColor="#c0392b"
            items={[
              { label: 'Fibrinólise', detail: 'Meta porta-agulha < 30 minutos' },
              { label: 'ICP', detail: 'Meta porta-balão < 90 minutos' },
              { label: 'Primeiro Contato Médico', detail: 'Anotar horário do primeiro contato médico e início dos sintomas' },
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
