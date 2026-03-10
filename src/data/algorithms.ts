import { AlgorithmData, GravidadeLevel } from '../types';

/* ─────────────────────────────────────────────
   Seção 1 — Ressuscitação (Gravidade Extrema)
   ───────────────────────────────────────────── */
export const ressuscitacao: AlgorithmData[] = [
  {
    id: 'bls',
    title: 'Suporte Básico de Vida',
    subtitle: 'SBV para Adultos',
    icon: '🫁',
    color: '#4a8c5c',
    path: '/bls',
    description: 'Verificar responsividade, acionar SME, protocolo de RCP e desfibrilação para adultos.',
    caseNumber: 5,
    tema: 'Reanimação',
    gravidade: 'Extrema',
    referencias: ['AHA 2025', 'ACLS'],
  },
  {
    id: 'cardiac-arrest',
    title: 'PCR',
    subtitle: 'Parada Cardiorrespiratória no Adulto',
    icon: '💔',
    color: '#c0392b',
    path: '/cardiac-arrest',
    description: 'Vias FV/TVsp e Assistolia/AESP com RCP, choques e ciclos de medicação.',
    caseNumber: 6,
    tema: 'Reanimação Avançada',
    gravidade: 'Extrema',
    referencias: ['AHA 2025', 'ACLS'],
  },
  {
    id: 'pediatric-cardiac-arrest',
    title: 'PCR em Pediatria',
    subtitle: 'Suporte Avançado Pediátrico',
    icon: '👶',
    color: '#7b1fa2',
    path: '/pediatric-cardiac-arrest',
    description: 'Algoritmos de PCR e bradicardia pediátricos com as principais diferenças em relação ao adulto.',
    tema: 'Reanimação Avançada',
    gravidade: 'Extrema',
    referencias: ['PALS 2025', 'AHA'],
  },
  {
    id: 'pregnant-cardiac-arrest',
    title: 'PCR em Gestante',
    subtitle: 'Parada na Gestação',
    icon: '🤰',
    color: '#ad1457',
    path: '/pregnant-cardiac-arrest',
    description: 'Modificações no ACLS para gestantes: deslocamento uterino, cesárea perimortem e causas específicas.',
    tema: 'Reanimação Avançada',
    gravidade: 'Extrema',
    referencias: ['AHA 2025', 'ACLS'],
  },
];

/* ─────────────────────────────────────────────
   Seção 2 — Crises Iminentes (Gravidade Altíssima)
   ───────────────────────────────────────────── */
export const crisesIminentes: AlgorithmData[] = [
  {
    id: 'anaphylaxis',
    title: 'Anafilaxia',
    subtitle: 'Reação Anafilática',
    icon: '🔴',
    color: '#c62828',
    path: '/anaphylaxis',
    description: 'Diagnóstico precoce, classificação de gravidade e tratamento imediato com Epinefrina IM.',
    tema: 'Emergência Clínica / Choque',
    gravidade: 'Altíssima',
    referencias: ['Manual SAVA', 'Diretrizes de Alergia e Imunologia'],
  },
  {
    id: 'local-anesthetic-toxicity',
    title: 'Intoxicação por AL',
    subtitle: 'Anestésico Local — LAST',
    icon: '🧪',
    color: '#00897b',
    path: '/local-anesthetic-toxicity',
    description: 'Diagnóstico, prevenção e tratamento da intoxicação por anestésicos locais com emulsão lipídica.',
    tema: 'Emergência Toxicológica',
    gravidade: 'Altíssima',
    referencias: ['Manual SAVA', 'ASRA'],
  },
  {
    id: 'malignant-hyperthermia',
    title: 'Hipertermia Maligna',
    subtitle: 'Emergência Anestésica',
    icon: '🌡️',
    color: '#d84315',
    path: '/malignant-hyperthermia',
    description: 'Diagnóstico precoce, prevenção, tratamento com Dantrolene e cuidados pós-crise.',
    tema: 'Emergência Anestésica',
    gravidade: 'Altíssima',
    referencias: ['Manual SAVA', 'MHAUS'],
  },
];

/* ─────────────────────────────────────────────
   Seção 3 — Tempo-Dependentes (Gravidade Alta)
   ───────────────────────────────────────────── */
export const tempoDependentes: AlgorithmData[] = [
  {
    id: 'acs',
    title: 'SCA',
    subtitle: 'Síndrome Coronariana Aguda',
    icon: '🫀',
    color: '#e94560',
    path: '/acs',
    description: 'Vias STEMI, NSTEMI e AI com interpretação do ECG e metas de reperfusão.',
    caseNumber: 7,
    tema: 'Emergência Cardiovascular',
    gravidade: 'Alta',
    referencias: ['AHA 2025', 'ACLS'],
  },
  {
    id: 'stroke',
    title: 'AVC',
    subtitle: 'Acidente Vascular Cerebral Agudo',
    icon: '🧠',
    color: '#8e44ad',
    path: '/stroke',
    description: 'Metas de tempo NINDS, decisão de TC, vias de AVC hemorrágico vs isquêmico.',
    caseNumber: 7,
    tema: 'Emergência Neurológica',
    gravidade: 'Alta',
    referencias: ['AHA 2025', 'NINDS'],
  },
];

/* ─────────────────────────────────────────────
   Seção 4 — Arritmias (Gravidade Alta)
   ───────────────────────────────────────────── */
export const arritmias: AlgorithmData[] = [
  {
    id: 'tachycardia',
    title: 'Taquicardia',
    subtitle: 'Taquicardia com Pulso no Adulto',
    icon: '⚡',
    color: '#e67e22',
    path: '/tachycardia',
    description: 'FC >150 bpm: estável vs instável, QRS estreito vs alargado.',
    caseNumber: 7,
    tema: 'Arritmias',
    gravidade: 'Alta',
    referencias: ['AHA 2025', 'ACLS'],
  },
  {
    id: 'bradycardia',
    title: 'Bradicardia',
    subtitle: 'Bradicardia com Pulso no Adulto',
    icon: '🐌',
    color: '#5b6abf',
    path: '/bradycardia',
    description: 'Manejo de FC <50 bpm: Atropina, marca-passo transcutâneo, Dopamina e Epinefrina.',
    caseNumber: 7,
    tema: 'Arritmias',
    gravidade: 'Alta',
    referencias: ['AHA 2025', 'ACLS'],
  },
];

/* ─────────────────────────────────────────────
   Seção 5 — Pós-Crise (Manejo Contínuo)
   ───────────────────────────────────────────── */
export const posCrise: AlgorithmData[] = [
  {
    id: 'post-cardiac-arrest',
    title: 'Cuidados pós PCR',
    subtitle: 'Pós-Ressuscitação',
    icon: '🫀',
    color: '#1565c0',
    path: '/post-cardiac-arrest',
    description: 'Metas e alvos hemodinâmicos, ventilatórios e neurológicos pós-retorno da circulação espontânea.',
    tema: 'Terapia Intensiva / Pós-Crise',
    gravidade: 'Manejo',
    referencias: ['AHA 2025', 'ACLS'],
  },
];

/* ─────────────────────────────────────────────
   Definição das Seções para a HomePage
   ───────────────────────────────────────────── */
export interface SectionGroup {
  id: string;
  label: string;
  level: string;
  levelColor: string;
  items: AlgorithmData[];
}

export const gravidadeStars: Record<GravidadeLevel, string> = {
  'Extrema':   '★★★★★',
  'Altíssima':  '★★★★',
  'Alta':       '★★★',
  'Moderada':   '★★',
  'Manejo':     '★',
};

export const gravidadeColors: Record<GravidadeLevel, string> = {
  'Extrema':   '#e53935',
  'Altíssima':  '#ff6d00',
  'Alta':       '#fdd835',
  'Moderada':   '#66bb6a',
  'Manejo':     '#42a5f5',
};

export const sections: SectionGroup[] = [
  {
    id: 'ressuscitacao',
    label: 'Ressuscitação',
    level: 'Gravidade Extrema',
    levelColor: '#e53935',
    items: ressuscitacao,
  },
  {
    id: 'crises-iminentes',
    label: 'Crises Iminentes',
    level: 'Gravidade Altíssima',
    levelColor: '#ff6d00',
    items: crisesIminentes,
  },
  {
    id: 'tempo-dependentes',
    label: 'Condições Tempo-Dependentes',
    level: 'Gravidade Alta',
    levelColor: '#fdd835',
    items: tempoDependentes,
  },
  {
    id: 'arritmias',
    label: 'Arritmias',
    level: 'Gravidade Alta',
    levelColor: '#fdd835',
    items: arritmias,
  },
  {
    id: 'pos-crise',
    label: 'Pós-Crise',
    level: 'Manejo Contínuo',
    levelColor: '#42a5f5',
    items: posCrise,
  },
];

/* ─── Exports legados (compatibilidade) ─── */
export const algorithms: AlgorithmData[] = [
  ...ressuscitacao,
  ...crisesIminentes,
  ...tempoDependentes,
  ...arritmias,
  ...posCrise,
];

export const savaTopics: AlgorithmData[] = [];
