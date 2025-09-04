import type { MultiOption } from "./types";

export const GRAU_OPTIONS: { [key: number]: { max_points: number; max_dice: number; description: string } } = {
  1: {
    max_points: 2,
    max_dice: 2,
    description: "2d10 em um único alvo ou 2d6 em múltiplos alvos. Alcance em Esfera/Cilindro/Emanação: Até 3m. Alcance em Cone: Até 12m. Alcance em Linha: Toque ou 9m.",
  },
  2: {
    max_points: 4,
    max_dice: 4,
    description: "4d10 em um único alvo ou 4d6 em múltiplos alvos. Alcance em Esfera/Cilindro/Emanação: Até 4,5m. Alcance em Cone: Até 15m. Alcance em Linha: Toque ou 15m.",
  },
  3: {
    max_points: 6,
    max_dice: 6,
    description: "6d10 em um único alvo ou 6d6 em múltiplos alvos. Alcance em Esfera/Cilindro/Emanação: Até 6m. Alcance em Cone: Até 18m. Alcance em Linha: Toque ou 21m.",
  },
  4: {
    max_points: 9,
    max_dice: 9,
    description: "9d10 em um único alvo ou 9d6 em múltiplos alvos. Alcance em Esfera/Cilindro/Emanação: Até 7,5m. Alcance em Cone: Até 21m. Alcance em Linha: Toque ou 27m.",
  },
  5: {
    max_points: 12,
    max_dice: 12,
    description: "12d10 em um único alvo ou 12d6 em múltiplos alvos. Alcance em Esfera/Cilindro/Emanação: Até 9m. Alcance em Cone: Até 24m. Alcance em Linha: Toque ou 33m.",
  },
  6: {
    max_points: 16,
    max_dice: 16,
    description: "16d12 em um único alvo ou 16d6 em múltiplos alvos. Alcance em Esfera/Cilindro/Emanação: Até 10,5m. Alcance em Cone: Até 27m. Alcance em Linha: Toque ou 39m.",
  },
  7: {
    max_points: 20,
    max_dice: 20,
    description: "20d12 em um único alvo ou 20d6 em múltiplos alvos. Alcance em Esfera/Cilindro/Emanação: Até 12m. Alcance em Cone: Até 30m. Alcance em Linha: Toque ou 45m.",
  },
};

/**
 * Tabela de custos de Tipos.
 */
export const TIPO_OPTIONS = [
  {
    id: "combate",
    label: "Técnica de Combate",
    description: "Reduz pontos dinâmicos com base no Grau.",
  },
  {
    id: "fruta",
    label: "Técnica de Fruta",
    cost: 0,
    description: "Adiciona 0 pontos.",
  },
];

export const EFEITOS_CONDICOES = [
  { id: "agarrado", label: "Agarrado", cost: 1 },
  { id: "amendrontado", label: "Amedrontado", cost: 2 },
  { id: "atordoado", label: "Atordoado", cost: 4 },
  { id: "bebado", label: "Bêbado", cost: 1 },
  { id: "caido", label: "Caído", cost: 1 },
  { id: "cego", label: "Cego", cost: 2 },
  { id: "empoderado", label: "Empoderado", cost: 4 },
  { id: "enfeiticado", label: "Enfeitiçado", cost: 2 },
  { id: "enfurecido", label: "Enfurecido", cost: 2 },
  { id: "envenenado", label: "Envenenado", cost: 1 },
  { id: "estremecido", label: "Estremecido", cost: 2 },
  { id: "impedido", label: "Impedido", cost: 2 },
  { id: "incapacitado", label: "Incapacitado", cost: 2 },
  { id: "inconsciente", label: "Inconsciente", cost: 8 },
  { id: "invisivel", label: "Invisível", cost: 5 },
  { id: "letargico", label: "Letárgico", cost: 2 },
  { id: "paralisado", label: "Paralisado", cost: 6 },
  { id: "queimado", label: "Queimado", cost: 1 },
  { id: "sangramento", label: "Sangramento", cost: 1 },
  { id: "sonolento", label: "Sonolento", cost: 3 },
  { id: "sufocado", label: "Sufocado", cost: 2 },
  { id: "surdo", label: "Surdo", cost: 1 },
];

/**
 * Tabela de custos e efeitos de Efeitos.
 */
export const EFEITOS_OPTIONS_DATA: MultiOption[] = [
  { id: "adicionar-condicao", label: "ADICIONAR CONDIÇÃO", cost: 0, description: "Concede à técnica a capacidade de impor uma ou mais condições. Custo: o mesmo da condição." },
  { id: "adicionar-empurrao", label: "ADICIONAR EMPURRÃO", cost: 1, description: "Custo Adicional: 1 PP por seleção." },
  { id: "adicionar-vantagem", label: "ADICIONAR VANTAGEM/DESVANTAGEM", cost: 0, description: "Custo Adicional: Valor de PP igual à metade do grau da técnica, arredondado para cima." },
  { id: "aumentar-alcance", label: "AUMENTAR ALCANCE", cost: 1, description: "Custo Adicional: 1 PP para cada 6 metros adicionais." },
  { id: "aumentar-area", label: "AUMENTAR ÁREA", cost: 1, description: "Custo Adicional: 1 PP para cada 3m adicionais. Para Linha: 2 PP para cada 1.5m de largura." },
  { id: "aumentar-cd", label: "AUMENTAR CLASSE DE DIFICULDADE", cost: 1, max: 2, description: "Custo Adicional: 1 PP para cada +1 na CD da técnica (máx. +2)." },
  { id: "condicao-em-area", label: "CONDIÇÃO/EFEITO EM ÁREA", cost: 0, description: "Custo Adicional: Valor de PP igual à metade do grau da técnica, arredondado para cima." },
  { id: "condicao-extra", label: "CONDIÇÃO/EFEITO EXTRA", cost: 0, description: "Custo Adicional: O mesmo valor de PP pertencente a cada condição ou efeito adicionado." },
  { id: "controle-cirurgico", label: "CONTROLE CIRÚRGICO", cost: 1, description: "Custo Adicional: 1 PP." },
  { id: "tecnica-dominada", label: "TÉCNICA DOMINADA", cost: 1, description: "Custo Adicional: 1 PP." },
  { id: "criar-lacaio", label: "CRIAR LACAIO", cost: 8, description: "Custo Adicional: 8 PP (podendo aumentar até 15 PP)." },
  { id: "duracao-prolongada", label: "DURAÇÃO PROLONGADA", cost: 4, description: "Custo Adicional: 4 PP para o 1º min e 2 PP para cada minuto posterior." },
  { id: "tecnica-rapida", label: "TÉCNICA RÁPIDA", cost: 0, description: "Custo Adicional: Valor de PP igual ao grau da técnica." },
  { id: "acerto-automatico", label: "ACERTO AUTOMÁTICO", cost: 0, description: "Custo Adicional: Valor de PP igual ao grau da técnica." },
  { id: "adicionar-critico", label: "ADICIONAR CRÍTICO", cost: 0, description: "Custo Adicional: 1 PP para crítico em 19–20 ou 3 PP para 18–20." },
  { id: "ataque-cerco", label: "ATAQUE DE CERCO", cost: 2, description: "Custo Adicional: 2 PP." },
  { id: "ataques-multiplos", label: "ATAQUES MÚLTIPLOS", cost: 6, description: "Custo Adicional: 6 PP." },
  { id: "aumentar-acerto", label: "AUMENTAR ACERTO", cost: 1, max: 3, description: "Custo Adicional: 1 PP por +1 (máx. +3)." },
  { id: "aumentar-dano", label: "AUMENTAR DANO", cost: 3, max: 3, description: "Custo Adicional: 3 PP para +1 de dano, +2 PP por cada +1 extra (máx. +3)." },
  { id: "criar-arma", label: "CRIAR ARMA", cost: 1, max: 4, description: "Custo Adicional: 1 PP para 1d8 inicial, +2 PP por d8 adicional (máx. 4d8)." },
  { id: "dano-adicional-dado", label: "DANO ADICIONAL", cost: 1, max: 5, description: "Custo Adicional: 1 PP por dado de dano adicional (máx. 5 PP)." },
  { id: "dano-continuo", label: "DANO CONTÍNUO", cost: 0, description: "Custo Adicional: Valor de PP igual à metade do grau da técnica, arredondado para cima." },
  { id: "dano-insistente", label: "DANO INSISTENTE", cost: 0, description: "Custo Adicional: Valor de PP igual à metade do grau da técnica, arredondado para cima." },
  { id: "adicionar-cura", label: "ADICIONAR CURA", cost: 1, description: "Custo Adicional: 1 PP para cada 1d10 ou 1d6." },
  { id: "adicionar-pv-temporario", label: "ADICIONAR PONTOS DE VIDA TEMPORÁRIOS", cost: 1, description: "Custo Adicional: 1 PP para cada 1d10 ou 1d4." },
  { id: "adicionar-voo", label: "ADICIONAR VOO", cost: 2, max: 3, description: "Custo Adicional: 2 PP para 9m e +1 PP para cada 3m adicionais (máx. 15m)." },
  { id: "aumentar-cr", label: "AUMENTAR CLASSE DE RESISTÊNCIA", cost: 2, max: 3, description: "Custo Adicional: 2 PP para cada +1 na CR (máx. +3)." },
  { id: "aumentar-movimento", label: "AUMENTAR MOVIMENTO", cost: 0, description: "Custo Adicional: 1 PP para 3m ou 2 PP para 6m." },
  { id: "contencao-dano-coletivo", label: "CONTENÇÃO DE DANO (Coletivo)", cost: 1, max: 15, description: "Custo Adicional: 1 PP para cada 1d8 de proteção (máx. 15 dados)." },
  { id: "contencao-dano-individual", label: "CONTENÇÃO DE DANO (Individual)", cost: 1, max: 30, description: "Custo Adicional: 1 PP para cada 2d8 de proteção (máx. 30 dados)." },
  { id: "reducao-movimento", label: "REDUÇÃO DE MOVIMENTO", cost: 0, description: "Custo Adicional: 1 PP para metade ou 2 PP para 0." },
];

/**
 * Tabela de custos e efeitos de Reduções.
 */
export const REDUCOES_OPTIONS: MultiOption[] = [
  {
    id: "duracao-limitada",
    label: "Duração Limitada",
    cost: -2,
    description: "A técnica dura apenas 1 rodada. Tira 2 pontos do custo total.",
  },
  {
    id: "condicao-especifica",
    label: "Condição Específica",
    cost: -3,
    description: "Requer uma condição especial para ser usada. Tira 3 pontos do custo total.",
  },
  {
    id: "carga",
    label: "Carga",
    cost: -4,
    description: "Requer um turno para carregar antes de ser usada. Tira 4 pontos do custo total.",
  },
];

/**
 * Custo do Dano de Dado.
 */
export const DANO_BASE_COST = 1;