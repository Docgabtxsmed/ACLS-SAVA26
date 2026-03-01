export interface BradyarrhythmiaData {
  id: string;
  name: string;
  abbreviation?: string;
  category: 'sinusal' | 'bloqueio-av' | 'escape';
  icon: string;
  color: string;
  description: string;
  ecgImage?: string;
  ecgFindings: string[];
  characteristics: string[];
  treatment: string[];
}

export const bradyarrhythmiaData: BradyarrhythmiaData[] = [
  // ═══════════════════════════════
  // SINUSAL
  // ═══════════════════════════════
  {
    id: 'bradicardia-sinusal',
    name: 'Bradicardia Sinusal',
    category: 'sinusal',
    icon: '🐌',
    color: '#4a8c5c',
    description:
      'Ritmo sinusal com frequência cardíaca inferior a 60 bpm. A despolarização ainda se origina do nó sinusal de forma normal, porém com frequência reduzida. Pode ser fisiológica (atletas, sono) ou patológica.',
    ecgImage: '/ecg/ecg_bradicardia_sinusal.png',
    ecgFindings: [
      'Ritmo regular',
      'FC < 60 bpm',
      'Onda P positiva em D1, D2, D3 e aVF',
      'Cada onda P seguida de um QRS',
      'Intervalo PR normal (0,12-0,20s)',
      'QRS estreito (< 0,12s)',
    ],
    characteristics: [
      'Origem no nó sinusal',
      'Pode ser fisiológica em atletas e durante o sono',
      'Causas patológicas: hipotireoidismo, hipotermia, aumento da pressão intracraniana',
      'Drogas: betabloqueadores, bloqueadores de canal de cálcio, digoxina',
      'Doença do nó sinusal (síndrome bradi-taqui)',
    ],
    treatment: [
      'Se assintomático: observação',
      'Se sintomático: Atropina 1 mg IV (repetir a cada 3-5 min, máx 3 mg)',
      'Se refratário: marcapasso transcutâneo',
      'Dopamina 5-20 mcg/kg/min ou Epinefrina 2-10 mcg/min',
      'Avaliar e tratar causa reversível',
    ],
  },
  {
    id: 'parada-sinusal',
    name: 'Parada Sinusal / Pausa Sinusal',
    abbreviation: 'PS',
    category: 'sinusal',
    icon: '⏸️',
    color: '#e67e22',
    description:
      'Falha transitória do nó sinusal em gerar impulso, resultando em pausa prolongada sem ondas P. Difere do bloqueio sinoatrial, onde o impulso é gerado mas não conduzido. A pausa não é múltiplo do intervalo PP basal.',
    ecgImage: '/ecg/ecg_parada_sinusal.png',
    ecgFindings: [
      'Ritmo basal sinusal',
      'Pausa súbita e prolongada sem ondas P',
      'A pausa NÃO é múltiplo exato do intervalo PP basal',
      'Pode haver ritmo de escape juncional ou ventricular',
      'Retorno com onda P sinusal',
    ],
    characteristics: [
      'Falha na geração do impulso pelo nó sinusal',
      'Diferente do bloqueio sinoatrial (onde o impulso é gerado mas bloqueado)',
      'Causas: isquemia do nó sinusal, fibrose, drogas (digoxina, betabloqueadores)',
      'Pode causar síncope se pausa prolongada',
      'Componente da doença do nó sinusal',
    ],
    treatment: [
      'Se assintomático: observação e monitoramento',
      'Se sintomático: Atropina 1 mg IV',
      'Suspender drogas causadoras',
      'Marcapasso transcutâneo se pausas prolongadas e sintomáticas',
      'Marcapasso definitivo se recorrente e sintomático',
    ],
  },

  // ═══════════════════════════════
  // BLOQUEIO AV
  // ═══════════════════════════════
  {
    id: 'bav-1grau',
    name: 'BAV de 1º Grau',
    abbreviation: 'BAV 1°',
    category: 'bloqueio-av',
    icon: '🔶',
    color: '#f39c12',
    description:
      'Atraso na condução do impulso do átrio para o ventrículo através do nó AV, com intervalo PR prolongado (> 0,20 s). Todos os impulsos atriais são conduzidos aos ventrículos — não há bloqueio verdadeiro, apenas atraso.',
    ecgImage: '/ecg/ecg_bav_1grau.png',
    ecgFindings: [
      'Ritmo regular',
      'Intervalo PR prolongado (> 0,20 s / > 200 ms)',
      'Cada onda P é seguida de um QRS',
      'Relação P:QRS = 1:1',
      'QRS geralmente estreito',
      'Intervalo PR constante',
    ],
    characteristics: [
      'Na verdade é um atraso de condução, não um bloqueio verdadeiro',
      'Geralmente benigno e assintomático',
      'Comum em atletas, idosos e como efeito de drogas',
      'Drogas: betabloqueadores, bloqueadores de canal de cálcio, digoxina, amiodarona',
      'Pode ser encontrado isoladamente ou associado a outros distúrbios de condução',
    ],
    treatment: [
      'Geralmente não requer tratamento',
      'Observação e monitoramento do intervalo PR',
      'Avaliar e suspender drogas causadoras se necessário',
      'Investigar se PR muito prolongado (> 300 ms)',
      'Raramente necessita marcapasso',
    ],
  },
  {
    id: 'bav-2grau-tipo1',
    name: 'BAV 2º Grau Tipo I',
    abbreviation: 'Mobitz I / Wenckebach',
    category: 'bloqueio-av',
    icon: '📐',
    color: '#e74c3c',
    description:
      'Bloqueio AV com prolongamento progressivo do intervalo PR até que uma onda P não seja conduzida (onda P bloqueada). O ciclo se repete — padrão clássico de Wenckebach. O bloqueio geralmente ocorre no nível do nó AV.',
    ecgImage: '/ecg/ecg_bav_2grau_tipo1.png',
    ecgFindings: [
      'Prolongamento progressivo do intervalo PR a cada batimento',
      'Encurtamento progressivo do intervalo RR',
      'Onda P eventualmente bloqueada (sem QRS após ela)',
      'Pausa após o batimento bloqueado (menor que 2x o intervalo RR menor)',
      'O ciclo se reinicia com PR mais curto',
      'QRS geralmente estreito',
    ],
    characteristics: [
      'Padrão de Wenckebach: PR progressivamente mais longo → P bloqueada → ciclo reinicia',
      'Bloqueio geralmente no nível do nó AV (supra-hissiano)',
      'Geralmente benigno e transitório',
      'Causas: aumento do tônus vagal, miocardite, IAM inferior, drogas',
      'Comum em atletas e durante o sono',
    ],
    treatment: [
      'Geralmente benigno — observação na maioria dos casos',
      'Se sintomático: Atropina 1 mg IV',
      'Suspender drogas que prolongam condução AV',
      'Monitorização contínua em contexto de IAM',
      'Raramente requer marcapasso definitivo',
    ],
  },
  {
    id: 'bav-2grau-tipo2',
    name: 'BAV 2º Grau Tipo II',
    abbreviation: 'Mobitz II',
    category: 'bloqueio-av',
    icon: '🔴',
    color: '#c0392b',
    description:
      'Bloqueio AV com ondas P intermitentemente bloqueadas SEM prolongamento prévio do PR. O intervalo PR dos batimentos conduzidos é constante. Bloqueio geralmente infra-hissiano (no feixe de His ou ramos). Risco significativo de progressão para BAVT.',
    // ecgImage: '/ecg/ecg_bav_2grau_tipo2.png', // TODO: generate when quota resets
    ecgFindings: [
      'Intervalo PR constante nos batimentos conduzidos',
      'Ondas P intermitentemente bloqueadas (sem QRS)',
      'NÃO há prolongamento progressivo do PR',
      'QRS frequentemente alargado (bloqueio de ramo associado)',
      'Padrão de condução pode ser 2:1, 3:1, 4:1',
      'A pausa é exatamente o dobro do intervalo PP',
    ],
    characteristics: [
      'Bloqueio geralmente infra-hissiano (His ou ramos)',
      'Mais grave que Mobitz I — risco de progressão para BAVT',
      'QRS alargado indica bloqueio nos ramos (pior prognóstico)',
      'Causas: IAM anterior, doença degenerativa do sistema de condução, cirurgia cardíaca',
      'Pode causar síncope (crises de Stokes-Adams)',
    ],
    treatment: [
      'Considerado emergência — alto risco de progressão para BAVT',
      'Atropina pode ser tentada mas frequentemente ineficaz',
      'Marcapasso transcutâneo de urgência',
      'NÃO atrasar marcapasso para tentar Atropina',
      'Marcapasso transvenoso temporário seguido de definitivo na maioria dos casos',
      'Dopamina ou Epinefrina como ponte se necessário',
    ],
  },
  {
    id: 'bav-3grau',
    name: 'BAV de 3º Grau (Total)',
    abbreviation: 'BAVT',
    category: 'bloqueio-av',
    icon: '⛔',
    color: '#8e44ad',
    description:
      'Dissociação completa entre a atividade atrial e ventricular — nenhum impulso atrial é conduzido aos ventrículos. As ondas P e os complexos QRS ocorrem independentemente. O ritmo ventricular é mantido por um foco de escape (juncional ou ventricular).',
    // ecgImage: '/ecg/ecg_bav_3grau.png', // TODO: generate when quota resets
    ecgFindings: [
      'Ondas P e QRS completamente independentes (dissociação AV)',
      'Frequência atrial > frequência ventricular',
      'Intervalos PP regulares entre si',
      'Intervalos RR regulares entre si',
      'PR variável e sem relação fixa entre P e QRS',
      'QRS estreito se escape juncional, largo se escape ventricular',
    ],
    characteristics: [
      'Nenhum impulso atrial alcança os ventrículos',
      'Ritmo de escape juncional: FC 40-60 bpm, QRS estreito',
      'Ritmo de escape ventricular: FC 20-40 bpm, QRS largo (pior prognóstico)',
      'Causas: IAM (inferior ou anterior), doença degenerativa, pós-cirurgia cardíaca',
      'Pode causar síncope, insuficiência cardíaca e morte súbita',
    ],
    treatment: [
      'Emergência médica — marcapasso transcutâneo imediato',
      'Atropina 1 mg IV pode ser tentada (mais eficaz se escape juncional)',
      'Dopamina 5-20 mcg/kg/min ou Epinefrina 2-10 mcg/min',
      'Marcapasso transvenoso temporário',
      'Marcapasso definitivo é indicação absoluta na maioria dos casos',
      'Preparar para marcapasso definitivo',
    ],
  },

  // ═══════════════════════════════
  // ESCAPE
  // ═══════════════════════════════
  {
    id: 'ritmo-juncional',
    name: 'Ritmo Juncional (Escape)',
    abbreviation: 'RJ',
    category: 'escape',
    icon: '🟡',
    color: '#2980b9',
    description:
      'Ritmo de escape originado na junção AV quando o nó sinusal falha ou há bloqueio AV. FC tipicamente entre 40-60 bpm. As ondas P podem estar ausentes, invertidas (antes ou após o QRS) ou retrógradas.',
    // ecgImage: '/ecg/ecg_ritmo_juncional.png', // TODO: generate when quota resets
    ecgFindings: [
      'QRS estreito e regular',
      'FC entre 40-60 bpm',
      'Ondas P podem estar ausentes',
      'Ondas P invertidas em D2, D3, aVF (se retrógradas)',
      'P pode aparecer antes, durante ou após o QRS',
      'Se P antes do QRS: PR curto (< 0,12s)',
    ],
    characteristics: [
      'Ritmo de escape — mecanismo de segurança quando o nó sinusal falha',
      'Origem na junção AV (nó AV ou feixe de His proximal)',
      'FC intrínseca da junção AV: 40-60 bpm',
      'Causas: disfunção do nó sinusal, BAV completo, intoxicação digitálica',
      'Ritmo regular com QRS estreito',
    ],
    treatment: [
      'Tratar a causa subjacente',
      'Se assintomático: observação',
      'Se sintomático: Atropina 1 mg IV',
      'NÃO suprimir o ritmo de escape (é um mecanismo protetor)',
      'Marcapasso se sintomático e refratário',
    ],
  },
  {
    id: 'ritmo-idioventricular',
    name: 'Ritmo Idioventricular (Escape)',
    abbreviation: 'RIV',
    category: 'escape',
    icon: '🟤',
    color: '#7f8c8d',
    description:
      'Ritmo de escape ventricular quando tanto o nó sinusal quanto a junção AV falham em manter o ritmo. FC tipicamente entre 20-40 bpm. QRS alargado por origem ventricular. Quando acelerado (FC 40-120 bpm), é chamado de ritmo idioventricular acelerado (RIVA).',
    // ecgImage: '/ecg/ecg_ritmo_idioventricular.png', // TODO: generate when quota resets
    ecgFindings: [
      'QRS alargado (> 0,12s) com morfologia bizarra',
      'FC entre 20-40 bpm (escape) ou 40-120 bpm (acelerado/RIVA)',
      'Ritmo geralmente regular',
      'Ondas P geralmente ausentes',
      'Pode haver dissociação AV com ondas P independentes',
      'Ondas T geralmente opostas ao QRS',
    ],
    characteristics: [
      'Último recurso do sistema de condução — foco ventricular assume',
      'FC muito baixa (20-40 bpm) se escape puro',
      'RIVA (40-120 bpm) frequentemente visto em reperfusão pós-IAM',
      'RIVA geralmente benigno e autolimitado',
      'Causas: BAVT, falência sinusal e juncional, reperfusão miocárdica',
    ],
    treatment: [
      'NÃO suprimir o ritmo de escape — é mecanismo protetor vital',
      'Tratar a causa subjacente',
      'Se instável hemodinamicamente: Atropina (pode ser ineficaz)',
      'Marcapasso transcutâneo de urgência',
      'RIVA geralmente não requer tratamento (autolimitado)',
      'Dopamina ou Epinefrina se refratário',
    ],
  },
];
