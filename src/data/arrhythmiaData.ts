export interface ArrhythmiaData {
  id: string;
  name: string;
  abbreviation?: string;
  category: 'narrow-regular' | 'narrow-irregular' | 'wide-regular' | 'wide-irregular';
  icon: string;
  color: string;
  description: string;
  ecgImage?: string;
  ecgFindings: string[];
  characteristics: string[];
  treatment: string[];
}

export const arrhythmiaData: ArrhythmiaData[] = [
  // ═══════════════════════════════════════
  // QRS ESTREITO + REGULAR
  // ═══════════════════════════════════════
  {
    id: 'taquicardia-sinusal',
    name: 'Taquicardia Sinusal',
    category: 'narrow-regular',
    icon: '💓',
    color: '#4a8c5c',
    description:
      'Aumento fisiológico da frequência cardíaca originada no nó sinusal, geralmente em resposta a estímulos como febre, dor, ansiedade, hipovolemia ou exercício. FC entre 100-150 bpm.',
    ecgImage: '/ecg/ecg_taquicardia_sinusal_1772369961301.png',
    ecgFindings: [
      'Onda P positiva em D1, D2, D3 e aVF',
      'Cada onda P seguida de QRS',
      'Intervalo PR normal (0,12-0,20s)',
      'QRS estreito (< 0,12s)',
      'FC geralmente entre 100-150 bpm',
    ],
    characteristics: [
      'Início e término graduais',
      'Resposta fisiológica a estímulos',
      'FC raramente ultrapassa 150 bpm em repouso',
      'Responde a manobras vagais com desaceleração gradual',
    ],
    treatment: [
      'Tratar a causa base (febre, dor, hipovolemia)',
      'Não usar antiarrítmicos para taquicardia sinusal',
      'Hidratação se hipovolemia',
      'Analgesia se dor',
      'Antipiréticos se febre',
    ],
  },
  {
    id: 'trn',
    name: 'Taquicardia por Reentrada Nodal',
    abbreviation: 'TRN',
    category: 'narrow-regular',
    icon: '🔄',
    color: '#5b6abf',
    description:
      'Arritmia supraventricular paroxística mais comum, causada por um circuito de reentrada no nó AV. FC tipicamente entre 150-250 bpm com início e término súbitos.',
    ecgImage: '/ecg/ecg_trn_1772369974811.png',
    ecgFindings: [
      'QRS estreito e regular',
      'FC entre 150-250 bpm',
      'Ondas P geralmente não visíveis (ocultas no QRS)',
      'Pseudo S em D2-D3-aVF ou pseudo R\' em V1',
      'Intervalo RR regular',
    ],
    characteristics: [
      'Início e término abruptos (paroxística)',
      'Mais comum em mulheres jovens',
      'Palpitações de início súbito',
      'Pode causar hipotensão em pacientes com cardiopatia',
    ],
    treatment: [
      'Manobra vagal (Valsalva modificada)',
      'Adenosina 6 mg IV em bolus rápido; se necessário, 12 mg',
      'Se refratária: Verapamil 5 mg IV ou Diltiazem',
      'Cardioversão elétrica sincronizada se instável (50-100J)',
    ],
  },
  {
    id: 'trav',
    name: 'Taquicardia por Reentrada Atrioventricular',
    abbreviation: 'TRAV',
    category: 'narrow-regular',
    icon: '↩️',
    color: '#8e44ad',
    description:
      'Taquicardia envolvendo via acessória (feixe anômalo). A forma ortodrômica (QRS estreito) desce pelo nó AV e sobe pela via acessória. Associada à Síndrome de Wolff-Parkinson-White.',
    ecgImage: '/ecg/ecg_trav_1772369989421.png',
    ecgFindings: [
      'QRS estreito na forma ortodrômica',
      'FC entre 150-250 bpm',
      'Onda P retrógrada visível após QRS',
      'Intervalo RP curto',
      'Em ritmo sinusal: onda delta (pré-excitação) na WPW',
    ],
    characteristics: [
      'Início e término abruptos',
      'Associada a via acessória (WPW)',
      'Forma ortodrômica: QRS estreito',
      'Forma antidrômica: QRS largo (mais rara)',
    ],
    treatment: [
      'Manobra vagal',
      'Adenosina 6 mg IV (se QRS estreito/ortodrômica)',
      'Procainamida ou Amiodarona se QRS largo',
      'EVITAR bloqueadores do nó AV se fibrilação atrial + WPW',
      'Cardioversão elétrica se instável',
    ],
  },
  {
    id: 'flutter-atrial',
    name: 'Flutter Atrial',
    category: 'narrow-regular',
    icon: '〰️',
    color: '#e67e22',
    description:
      'Arritmia atrial com circuito de macrorreentrada no átrio direito. Produz ondas F em "dentes de serra" com frequência atrial de 250-350 bpm e condução AV geralmente 2:1.',
    ecgImage: '/ecg/ecg_flutter_atrial_1772370003743.png',
    ecgFindings: [
      'Ondas F em "dentes de serra" (melhor vistas em D2, D3, aVF e V1)',
      'Frequência atrial 250-350 bpm',
      'Condução AV mais comum 2:1 (FC ~150 bpm)',
      'QRS estreito',
      'Intervalo RR regular (se condução fixa)',
    ],
    characteristics: [
      'FC ventricular ~150 bpm com condução 2:1',
      'Pode ter condução variável (irregular)',
      'Comum em pacientes com cardiopatia estrutural',
      'Menos responsivo à adenosina que a TRN',
    ],
    treatment: [
      'Controle de frequência: Betabloqueadores ou Bloqueadores de canal de cálcio',
      'Cardioversão elétrica sincronizada (50-100J)',
      'Anticoagulação se duração > 48h ou risco de tromboembolismo',
      'Ablação por cateter para casos recorrentes',
    ],
  },
  {
    id: 'taquicardia-atrial-focal',
    name: 'Taquicardia Atrial Focal',
    category: 'narrow-regular',
    icon: '📍',
    color: '#27ae60',
    description:
      'Taquicardia originada de um foco ectópico atrial único, com onda P de morfologia diferente da sinusal. FC entre 100-250 bpm.',
    ecgImage: '/ecg/ecg_taquicardia_atrial_focal_1772370071380.png',
    ecgFindings: [
      'Onda P de morfologia diferente da sinusal',
      'QRS estreito',
      'FC entre 100-250 bpm',
      'Pode ter "warm-up" e "cool-down" (aceleração e desaceleração)',
      'Linha isoelétrica entre ondas P',
    ],
    characteristics: [
      'Automaticidade aumentada de foco ectópico',
      'Pode ser incessante e causar taquicardiomiopatia',
      'Mais comum em pacientes com DPOC ou cardiopatia',
      'Não responde bem à adenosina (diagnóstico diferencial)',
    ],
    treatment: [
      'Controle de frequência com Betabloqueadores ou Bloqueadores de canal de cálcio',
      'Adenosina pode ajudar no diagnóstico (bloqueia transitoriamente o nó AV)',
      'Ablação por cateter para casos refratários',
      'Tratar causa base',
    ],
  },
  {
    id: 'taquicardia-juncional',
    name: 'Taquicardia Juncional',
    category: 'narrow-regular',
    icon: '⚡',
    color: '#2980b9',
    description:
      'Taquicardia originada na junção AV, com FC entre 60-130 bpm na forma não-paroxística (acelerada) e até 200 bpm na forma paroxística.',
    ecgImage: '/ecg/ecg_taquicardia_juncional_1772370084422.png',
    ecgFindings: [
      'QRS estreito e regular',
      'Ondas P invertidas em D2, D3, aVF (se visíveis)',
      'P pode estar antes, durante ou após o QRS',
      'FC geralmente 60-130 bpm (forma acelerada)',
    ],
    characteristics: [
      'Frequentemente associada a intoxicação digitálica',
      'Pode ocorrer pós-cirurgia cardíaca',
      'Forma acelerada: FC 60-130 bpm',
      'Forma paroxística: FC até 200 bpm',
    ],
    treatment: [
      'Suspender digitálico se intoxicação',
      'Betabloqueadores ou Bloqueadores de canal de cálcio',
      'Amiodarona em casos refratários',
      'Tratar a causa base',
    ],
  },

  // ═══════════════════════════════════════
  // QRS ESTREITO + IRREGULAR
  // ═══════════════════════════════════════
  {
    id: 'fibrilacao-atrial',
    name: 'Fibrilação Atrial',
    abbreviation: 'FA',
    category: 'narrow-irregular',
    icon: '💥',
    color: '#e74c3c',
    description:
      'Arritmia sustentada mais comum na prática clínica. Atividade elétrica atrial caótica e desorganizada, sem contração atrial efetiva. Risco elevado de tromboembolismo.',
    ecgImage: '/ecg/ecg_fibrilacao_atrial_1772370099052.png',
    ecgFindings: [
      'Ausência de ondas P organizadas',
      'Linha de base irregular com ondas "f" fibrilatórias',
      'Intervalos RR irregularmente irregulares',
      'QRS estreito (se sem aberrância)',
      'FC ventricular variável (60-170 bpm)',
    ],
    characteristics: [
      'Arritmia sustentada mais comum',
      'Risco aumentado de AVC (5x)',
      'Pode ser paroxística, persistente ou permanente',
      'Perda da contração atrial efetiva ("kick atrial")',
      'Avaliar CHA₂DS₂-VASc para anticoagulação',
    ],
    treatment: [
      'Controle de frequência: Betabloqueadores, BCC, Digoxina',
      'Controle de ritmo: Amiodarona, Cardioversão elétrica',
      'Anticoagulação baseada no CHA₂DS₂-VASc',
      'Se instável: Cardioversão elétrica sincronizada (120-200J bifásica)',
      'Se duração > 48h: Anticoagulação antes de cardioversão ou ECO TE',
    ],
  },
  {
    id: 'flutter-bav-variavel',
    name: 'Flutter Atrial com BAV Variável',
    category: 'narrow-irregular',
    icon: '📊',
    color: '#d35400',
    description:
      'Flutter atrial com grau de bloqueio AV variando (2:1, 3:1, 4:1), resultando em intervalos RR irregulares e frequência ventricular variável.',
    ecgImage: '/ecg/ecg_flutter_bav_variavel_1772370170735.png',
    ecgFindings: [
      'Ondas F em "dentes de serra"',
      'Frequência atrial 250-350 bpm',
      'Condução AV variável (2:1, 3:1, 4:1 alternando)',
      'Intervalos RR irregulares',
      'QRS estreito',
    ],
    characteristics: [
      'Aparência irregular ao contrário do flutter com condução fixa',
      'Pode simular fibrilação atrial',
      'Ondas F melhor identificadas em D2, D3, aVF e V1',
      'Manobra vagal pode revelar as ondas F',
    ],
    treatment: [
      'Controle de frequência: Betabloqueadores ou BCC',
      'Cardioversão elétrica sincronizada se instável',
      'Anticoagulação similar à fibrilação atrial',
      'Considerar ablação para casos recorrentes',
    ],
  },
  {
    id: 'taquicardia-atrial-multifocal',
    name: 'Taquicardia Atrial Multifocal',
    abbreviation: 'TAM',
    category: 'narrow-irregular',
    icon: '🎯',
    color: '#16a085',
    description:
      'Taquicardia com pelo menos 3 morfologias diferentes de onda P, intervalos PP, PR e RR variáveis. Comum em pacientes com DPOC e insuficiência respiratória.',
    ecgImage: '/ecg/ecg_taquicardia_atrial_multifocal_1772370184368.png',
    ecgFindings: [
      '≥ 3 morfologias diferentes de onda P',
      'Intervalos PP variáveis',
      'Intervalos PR variáveis',
      'Intervalos RR irregulares',
      'FC > 100 bpm',
      'Linha isoelétrica entre ondas P',
    ],
    characteristics: [
      'Fortemente associada a DPOC e insuficiência respiratória',
      'Pode ocorrer com hipóxia, hipomagnesemia, IC',
      'Frequentemente confundida com fibrilação atrial',
      'Diferencia-se da FA pela presença de ondas P visíveis',
    ],
    treatment: [
      'Tratar a causa base (DPOC, hipóxia)',
      'Corrigir distúrbios eletrolíticos (Mg²⁺, K⁺)',
      'Magnésio IV (2g em 15 min)',
      'Verapamil se necessário controle de FC',
      'EVITAR cardioversão elétrica (não é eficaz)',
    ],
  },

  // ═══════════════════════════════════════
  // QRS ALARGADO + REGULAR (monomórfica)
  // ═══════════════════════════════════════
  {
    id: 'tv-monomorfica',
    name: 'Taquicardia Ventricular Monomórfica',
    abbreviation: 'TV',
    category: 'wide-regular',
    icon: '⚠️',
    color: '#c0392b',
    description:
      'Taquicardia de complexo QRS largo (≥ 120ms) originada nos ventrículos, com morfologia QRS uniforme. ≥ 3 batimentos consecutivos. Sustentada se > 30 segundos ou com instabilidade hemodinâmica.',
    ecgImage: '/ecg/ecg_tv_monomorfica_1772370199620.png',
    ecgFindings: [
      'QRS alargado (≥ 120 ms) com morfologia uniforme',
      'FC entre 100-250 bpm',
      'Dissociação AV (ondas P independentes do QRS)',
      'Batimentos de captura e fusão (patognomônicos)',
      'Concordância de QRS nas precordiais',
    ],
    characteristics: [
      'Geralmente associada a cardiopatia estrutural',
      'Pode causar instabilidade hemodinâmica grave',
      'TV sustentada: > 30 seg ou necessita intervenção',
      'TV não sustentada: < 30 seg e autolimitada',
      'Todo QRS largo deve ser tratado como TV até prova em contrário',
    ],
    treatment: [
      'Se instável: Cardioversão elétrica sincronizada 100J',
      'Se estável: Amiodarona 150 mg IV em 10 min',
      'Procainamida 20-50 mg/min (máx 17 mg/kg)',
      'Se sem pulso: Protocolo de PCR (desfibrilação)',
      'Lidocaína 1-1,5 mg/kg IV como alternativa',
    ],
  },
  {
    id: 'tsv-aberrante',
    name: 'TSV com Condução Aberrante',
    category: 'wide-regular',
    icon: '🔀',
    color: '#7f8c8d',
    description:
      'Taquicardia supraventricular com condução aberrante pelo sistema His-Purkinje (bloqueio de ramo), simulando taquicardia ventricular. Diferenciação é fundamental para o tratamento adequado.',
    ecgImage: '/ecg/ecg_tsv_aberrante_1772370274598.png',
    ecgFindings: [
      'QRS alargado (≥ 120 ms)',
      'Morfologia de BRD ou BRE',
      'FC variável',
      'Pode ter ondas P associadas ao QRS',
      'Padrão típico de bloqueio de ramo',
    ],
    characteristics: [
      'Origem supraventricular com aberrância de condução',
      'Critérios de Brugada ajudam na diferenciação com TV',
      'Pacientes geralmente mais jovens e sem cardiopatia',
      'Na dúvida, TRATAR COMO TV',
    ],
    treatment: [
      'Se dúvida entre TV e TSV aberrante: tratar como TV',
      'Adenosina pode ser diagnóstica e terapêutica',
      'Procainamida é segura em ambos os casos',
      'EVITAR Verapamil se possibilidade de TV',
      'Cardioversão elétrica se instável',
    ],
  },

  // ═══════════════════════════════════════
  // QRS ALARGADO + IRREGULAR (polimórfica)
  // ═══════════════════════════════════════
  {
    id: 'tv-qti-curto',
    name: 'TV Polimórfica com QTi Curto',
    category: 'wide-irregular',
    icon: '🌊',
    color: '#e94560',
    description:
      'Taquicardia ventricular com morfologia QRS variável e intervalo QT basal normal ou curto. Geralmente associada a isquemia miocárdica aguda.',
    ecgImage: '/ecg/ecg_tv_polimorfica_qti_curto_1772370286689.png',
    ecgFindings: [
      'QRS largo com morfologia variável',
      'Intervalo QT basal normal ou curto',
      'FC rápida e irregular',
      'Eixo QRS variando continuamente',
      'Pode degenerar para FV',
    ],
    characteristics: [
      'Geralmente causada por isquemia aguda',
      'QT basal NÃO prolongado',
      'Alto risco de degeneração para FV',
      'Diferencia-se do Torsades pela ausência de QT longo',
    ],
    treatment: [
      'Tratar isquemia (reperfusão coronariana)',
      'Se instável/sem pulso: Desfibrilação',
      'Amiodarona 150 mg IV em 10 min',
      'Betabloqueadores IV',
      'Lidocaína como alternativa',
      'Magnésio NÃO é eficaz (diferente do Torsades)',
    ],
  },
  {
    id: 'torsades',
    name: 'TV Polimórfica com QTi Longo (Torsades de Pointes)',
    abbreviation: 'TdP',
    category: 'wide-irregular',
    icon: '🌀',
    color: '#9b59b6',
    description:
      'Forma específica de TV polimórfica associada a intervalo QT prolongado. O QRS "gira" em torno da linha de base, com aspecto fusiforme. Pode ser causada por drogas, distúrbios eletrolíticos ou síndromes congênitas.',
    ecgImage: '/ecg/ecg_torsades_1772370301626.png',
    ecgFindings: [
      'QRS largo com morfologia variável',
      'Aspecto fusiforme: QRS parece girar em torno da linha de base',
      'Intervalo QT basal prolongado (> 500 ms)',
      'Padrão "crescendo-decrescendo" da amplitude do QRS',
      'Pode ser precedida por sequência curto-longo-curto',
    ],
    characteristics: [
      'Associada a QT prolongado (congênito ou adquirido)',
      'Causas: drogas (antiarrítmicos, antipsicóticos), hipocalemia, hipomagnesemia',
      'Pode ser autolimitada ou degenerar para FV',
      'Pausa-dependente: ocorre frequentemente após pausa no ritmo',
    ],
    treatment: [
      'Magnésio IV 2g em bolus (tratamento de escolha)',
      'Correção de K⁺ (manter > 4,5 mEq/L)',
      'Se sem pulso: Desfibrilação',
      'Isoproterenol ou marca-passo para aumentar FC (overdrive)',
      'SUSPENDER drogas que prolongam o QT',
      'EVITAR Amiodarona e Procainamida (prolongam QT)',
    ],
  },
];

// Categorias para o fluxograma
export const arrhythmiaCategories = {
  'narrow-regular': {
    label: 'QRS Estreito + Regular',
    qrs: 'QRS estreito (< 120 ms)',
    rr: 'Regular',
    color: '#4a8c5c',
  },
  'narrow-irregular': {
    label: 'QRS Estreito + Irregular',
    qrs: 'QRS estreito (< 120 ms)',
    rr: 'Irregular',
    color: '#e74c3c',
  },
  'wide-regular': {
    label: 'QRS Alargado + Regular (monomórfica)',
    qrs: 'QRS alargado (> 120 ms)',
    rr: 'Regular (monomórfica)',
    color: '#c0392b',
  },
  'wide-irregular': {
    label: 'QRS Alargado + Irregular (polimórfica)',
    qrs: 'QRS alargado (> 120 ms)',
    rr: 'Irregular (polimórfica)',
    color: '#9b59b6',
  },
} as const;
