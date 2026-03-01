# Plano de Melhorias de Conteúdo — SAVA e ACLS

## Estado Atual do Projeto

### Páginas Implementadas (13 páginas)

| Página | Tipo | Idioma | Formato | Conteúdo |
|--------|------|--------|---------|----------|
| HomePage | Home | PT-BR | Grid de cards | 12 algoritmos listados |
| SBV (BLS) | Algoritmo ACLS | PT-BR | Flowchart | Sequência CAB, DEA, ventilação |
| PCR (Cardiac Arrest) | Algoritmo ACLS | PT-BR | Flowchart + Sidebar | FV/TVsp e Assistolia/AESP |
| Bradicardia | Algoritmo ACLS | PT-BR | Flowchart + Cards | Flowchart + 4 bradiarritmias com ECG |
| Taquicardia | Algoritmo SAVA | PT-BR | Árvore + Cards | 12 taquiarritmias com ECG, tratamento |
| SCA (ACS) | Algoritmo ACLS | PT-BR | Flowchart 3 ramos | STEMI / NSTEMI / Normal |
| AVC (Stroke) | Algoritmo ACLS | PT-BR | Flowchart + Tempo | Hemorrágico vs Isquêmico + NINDS |
| Intoxicação por AL (LAST) | SAVA Especial | PT-BR | Tabs (Diag/Prev/Trat) | Diagnóstico, prevenção, emulsão lipídica |
| Hipertermia Maligna | SAVA Especial | PT-BR | Tabs (4 abas) | Diagnóstico, prevenção, Dantrolene, pós-crise |
| Cuidados pós-PCR | SAVA Especial | PT-BR | Tabs (2 abas) | Metas hemodinâmicas, algoritmo |
| PCR em Pediatria | SAVA Especial | PT-BR | Tabs (6 abas) | Diferenças, SBV, algoritmo, bradicardia |
| Anafilaxia | SAVA Especial | PT-BR | Tabs (3 abas) | Diagnóstico, classificação, tratamento |
| PCR em Gestante | SAVA Especial | PT-BR | Tabs (7 abas) | Causas, fisiologia, SBV, SAV, cesárea |

---

## Documentos de Referência Disponíveis (não utilizados completamente)

### Documentos SAVA (em `/public/`)
| Documento | Conteúdo Principal | Aproveitamento Atual |
|-----------|-------------------|---------------------|
| SAVA_Doc1_Aulas1-4.docx | SBV, SAV, Segurança Anestésica, Cuidados Pós-PCR | Parcial — dados usados nas páginas ACLS |
| SAVA_Doc2_Aulas5-8.docx | Ética/Liderança, LAST, Hipertermia Maligna, Anafilaxia | Parcial — LAST, HM e Anafilaxia implementados |
| SAVA_Dia02_Pediatria_Gestante.docx | PCR Pediátrica e na Gestante | Parcial — páginas implementadas |
| e-book Manual SAVA 1ª Ed 2022-1.pdf | Manual completo SAVA | Não utilizado diretamente |
| ACLS_Handbook.pdf | Handbook ACLS completo | Base para algoritmos ACLS |

### Artigos UpToDate (em `/public/`)
| Artigo | Tópico | Aproveitamento |
|--------|--------|---------------|
| Advanced cardiac life support (ACLS) in adults | SAV adulto | Não utilizado |
| Overview of tachyarrhythmias in adults | Taquiarritmias | Não utilizado |
| Initial assessment post-cardiac arrest | Pós-PCR | Não utilizado |
| Accidental hypothermia in adults | Hipotermia acidental | Não utilizado |
| Initial management unknown overdose | Intoxicação exógena | Não utilizado |
| Anaphylaxis: Emergency treatment | Anafilaxia | Parcialmente utilizado |
| Pediatric BLS for health care providers | SBV Pediátrico | Não utilizado |
| Pediatric advanced life support (PALS) | SAV Pediátrico | Não utilizado |
| Basic airway management in children | Via Aérea Pediátrica | Não utilizado |
| Bradycardia in children | Bradicardia Pediátrica | Não utilizado |
| Sinus bradycardia | Bradicardia Sinusal | Não utilizado |
| Malignant hyperthermia: acute crisis | HM - Crise aguda | Parcialmente utilizado |
| Local anesthetic systemic toxicity | LAST | Parcialmente utilizado |

---

## Melhorias Propostas

### 1. Enriquecimento de Conteúdo Existente

#### 1.1 Expandir páginas ACLS com conteúdo SAVA
- **SBV**: Adicionar seção sobre OVACE (Aula 1 do Doc1) — manobra de Heimlich e golpes nas costas
- **SBV**: Incluir tabela comparativa adulto vs pediátrico para compressões torácicas
- **PCR**: Adicionar informações sobre ECMO-RCP (ECPR) mencionadas na Aula 5
- **PCR**: Incluir critérios para interrupção da RCP (ETCO2, tempo, causas reversíveis)
- **Bradicardia**: Expandir sidebar com informações sobre marca-passo transvenoso
- **SCA**: Adicionar checklist fibrinolítico detalhado com contraindicações

#### 1.2 Expandir páginas SAVA com dados UpToDate
- **Anafilaxia**: Incluir dados sobre anafilaxia refratária a epinefrina (protocolo com vasopressina, azul de metileno)
- **Anafilaxia**: Adicionar seção sobre diagnósticos diferenciais (reação vasovagal, asma, etc.)
- **LAST**: Adicionar algoritmo visual em flowchart (atualmente só tem tabs de texto)
- **Hipertermia Maligna**: Incluir checklist de preparo da sala (flush de anestésico, carvão ativado nos vaporizadores)
- **Cuidados pós-PCR**: Expandir metas de neuroproteção com dados do UpToDate (controle de temperatura 32-36°C)

#### 1.3 Adicionar imagens ECG nas páginas de arritmias
- As imagens ECG já existem em `/public/ecg/` (14 imagens) mas **não são exibidas** nas páginas
- Integrar imagens nos modais de taquiarritmia (ArrhythmiaModal) e bradiarritmia (BradyarrhythmiaModal)
- Cada card de arritmia deveria mostrar o ECG correspondente ao abrir o modal

### 2. Novas Páginas e Funcionalidades

#### 2.1 Página: Ética, Liderança e Trabalho em Equipe (Aula 5)
- **Prioridade: Média**
- Conteúdo disponível no SAVA_Doc2 (Aula 5)
- Critérios para interrupção da RCP
- Comunicação em alça fechada
- Liderança e dinâmica de equipe
- Diretivas antecipadas de vontade

#### 2.2 Página: Segurança Anestésica (Aula 3)
- **Prioridade: Alta** — tema central do SAVA
- Conteúdo disponível no SAVA_Doc1 (Aula 3)
- Anestesia segura e seus pilares
- Checklist de segurança no bloco cirúrgico
- Monitorização obrigatória
- Eventos adversos mais comuns em anestesia

#### 2.3 Página: Hipotermia Acidental
- **Prioridade: Baixa**
- Artigo UpToDate disponível: "Accidental hypothermia in adults"
- Classificação, manejo e relação com PCR

#### 2.4 Página: Intoxicação Exógena / Overdose
- **Prioridade: Baixa**
- Artigo UpToDate disponível: "Initial management of unknown overdose"
- Manejo inicial, antídotos, suporte

#### 2.5 Funcionalidade: Quiz Interativo
- **Prioridade: Alta** — maior impacto educacional
- Questões tipo OSCE baseadas nos algoritmos
- Cenários clínicos com tomada de decisão
- Feedback imediato com explicações
- Pode ser separado por tema (SBV, PCR, Arritmias, SAVA)

#### 2.6 Funcionalidade: Modo Simulação
- **Prioridade: Média**
- Simular cenário de emergência com decisões em tempo real
- Timer visual para simular urgência
- Feedback sobre decisões tomadas

#### 2.7 Funcionalidade: Calculadora de Doses Pediátricas
- **Prioridade: Alta**
- Input: peso da criança
- Output: doses de todas as medicações de emergência
- Muito útil para o cenário perioperatório pediátrico

### 3. Melhorias Visuais e de UX

#### 3.1 Consistência de formato
- Padronizar formato das páginas SAVA (atualmente usam tabs) e páginas ACLS (usam flowcharts)
- Considerar adicionar flowcharts visuais nas páginas SAVA onde aplicável (ex: LAST já tem algoritmo sequencial no documento de referência)

#### 3.2 Navegação entre páginas relacionadas
- Adicionar links "Ver também" entre páginas relacionadas
  - PCR → Cuidados Pós-PCR
  - PCR → PCR Pediátrica / PCR Gestante
  - Bradicardia ↔ Taquicardia
  - SBV → PCR

#### 3.3 Busca por conteúdo
- Implementar busca global por termos médicos
- Permite encontrar rapidamente drogas, doses, protocolos

#### 3.4 Modo offline (PWA)
- Converter para Progressive Web App
- Algoritmos disponíveis sem internet — essencial para uso em bloco cirúrgico
- Service worker para cache de conteúdo

#### 3.5 Responsividade mobile
- Garantir que flowcharts são legíveis em smartphones
- Layout adaptado para tablets (uso em centro cirúrgico)

---

## Priorização Recomendada

### Fase 1 — Quick Wins (Alto impacto, baixo esforço)
1. Integrar imagens ECG nos modais de arritmias
2. Adicionar links de navegação entre páginas relacionadas
3. Expandir conteúdo da página de Anafilaxia com dados do UpToDate

### Fase 2 — Funcionalidades Core (Alto impacto, médio esforço)
4. Criar página de Segurança Anestésica
5. Implementar quiz interativo
6. Criar calculadora de doses pediátricas
7. Adicionar flowchart visual na página de LAST

### Fase 3 — Expansão (Médio impacto, médio esforço)
8. Criar página de Ética e Liderança
9. Expandir Cuidados pós-PCR com dados UpToDate
10. Implementar modo offline (PWA)
11. Adicionar OVACE na página de SBV

### Fase 4 — Diferenciação (Alto impacto, alto esforço)
12. Modo simulação com cenários
13. Busca global por conteúdo
14. Páginas de Hipotermia e Intoxicação Exógena
