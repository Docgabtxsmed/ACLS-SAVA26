import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import './AlgoPage.css';

export default function BLSSurveyPage() {
  return (
    <div className="algo-page">
      <Navbar title="SBV — Suporte Básico de Vida para Adultos" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🫁</span>
        <h1 className="algo-page-title">SBV — Suporte Básico de Vida para Adultos</h1>
        <span className="algo-page-case">Caso 5 — Suporte Básico de Vida</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Passo 1: Verificar Responsividade */}
          <FlowchartNode
            type="action"
            title="VERIFICAR RESPONSIVIDADE"
            stepNumber={1}
            items={[
              'Sacudir e chamar: "Você está bem?"',
              'Verificar respiração por no máximo 10 segundos',
              'Se NÃO respirar ou respiração insuficiente, continuar avaliação',
            ]}
          />

          <FlowchartArrow direction="right" />

          {/* Passo 2: Acionar SME e Obter DEA */}
          <FlowchartNode
            type="action"
            title="ACIONAR SME E OBTER DEA"
            stepNumber={2}
            items={[
              'Enviar alguém para acionar o Serviço Médico de Emergência (SAMU 192)',
              'Enviar alguém para buscar o desfibrilador externo automático (DEA)',
              'Se você for o ÚNICO socorrista, acione o SME e busque o DEA',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Passo 3: Desfibrilação */}
          <FlowchartNode
            type="critical"
            title="DESFIBRILAÇÃO"
            stepNumber={3}
            items={[
              'Se SEM pulso, verificar ritmo chocável com DEA',
              'Se ritmo chocável, afastar-se ao aplicar o choque',
              'Realizar RCP entre os choques, iniciando com compressões torácicas',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Decisão: Checar pulso */}
          <FlowchartNode
            type="decision"
            title="CHECAR PULSO"
            items={['Verificar pulso por no máximo 10 segundos']}
          />

          <FlowchartArrow direction="down" />

          {/* Ramo: Pulso vs Sem Pulso */}
          <div className="flowchart-branch">
            {/* Pulso Presente */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">PULSO</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="INICIAR VENTILAÇÃO DE RESGATE"
                items={['Fornecer ventilações']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="1 VENTILAÇÃO A CADA 5 A 6 SEGUNDOS"
                items={['ou 10 a 12 ventilações por minuto']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="start"
                title="CHECAR PULSO A CADA 2 MIN"
                items={['Reavaliar e continuar conforme necessário']}
              />
            </div>

            {/* Sem Pulso */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">SEM PULSO</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="INICIAR RCP"
                items={['Iniciar compressões torácicas imediatamente']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="30 COMPRESSÕES PARA 2 VENTILAÇÕES"
                items={['Profundidade de compressão de pelo menos 5 cm']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="FREQUÊNCIA DE 100–120 COMPRESSÕES/MIN"
                items={['Permitir retorno completo do tórax entre compressões', 'Minimizar interrupções']}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
