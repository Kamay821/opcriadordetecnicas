/**
 * Define todos os IDs possíveis para os efeitos especiais.
 * Usar um union type previne erros de digitação e habilita o autocomplete.
 */
export type EffectId =
  // Modelo 0: Condição
  | `adicionar-condicao-${string}`
  | 'condicao-extra'

  // Modelo 1: Custo Fixo
  | 'controle-cirurgico'
  | 'tecnica-dominada'
  | 'ataque-cerco'
  | 'ataques-multiplos'
  | 'criar-lacaio'

  // Modelo 2: Custo Linear
  | 'adicionar-empurrao'
  | 'aumentar-alcance'
  | 'aumentar-area'
  | 'aumentar-area-largura'
  | 'aumentar-cd'
  | 'aumentar-acerto'
  | 'dano-adicional-dado'
  | 'adicionar-cura'
  | 'adicionar-pv-temporario'
  | 'aumentar-cr'
  | 'contencao-dano-coletivo'
  | 'contencao-dano-individual'

  // Modelo 3: Custo Escalonado
  | 'duracao-prolongada'
  | 'aumentar-dano'
  | 'criar-arma'
  | 'adicionar-voo'

  // Modelo 4: Custo Mapeado
  | 'adicionar-critico-19-20'
  | 'adicionar-critico-18-20'
  | 'aumentar-movimento-3m'
  | 'aumentar-movimento-6m'
  | 'reducao-movimento-metade'
  | 'reducao-movimento-zero'

  // Modelo 6: Custo Dependente de Grau
  | 'adicionar-vantagem'
  | 'condicao-em-area'
  | 'tecnica-rapida'
  | 'acerto-automatico'
  | 'dano-continuo'
  | 'dano-insistente';
  
/**
 * Define todos os IDs possíveis para as reduções.
 */
export type ReducaoId =
  // Modelo 1
  | 'tecnica-demorada'
  | 'tecnica-devoradora'
  | 'tecnica-nao-ofensiva'
  // Modelo 2
  | 'reduzir-area'
  | 'tecnica-debilitante'
  | 'tecnica-exaustiva'
  // Modelo 3
  | 'concentracao-crucial'
  // Modelo 5
  | 'requisito-limitador'
  | 'efeito-colateral'
  | 'tecnica-dependente';

/**
 * Interface base para uma opção selecionável.
 */
export interface Option {
  id: string;
  label: string;
  description: string;
}

/**
 * Interface para uma opção que pode ter um valor numérico associado
 * e um custo em pontos. Usada para Efeitos e Reduções.
 */
export interface MultiOption extends Option {
  id: EffectId | ReducaoId | string;
  value?: number;
  cost: number;
  max?: number;
}

/**
 * Define a estrutura para o estado do Dano.
 */
export interface DamageOption {
  type: "auxiliar" | "single" | "multiple";
  diceCount?: number;
  cost: number;
  isSafeguard?: boolean;
}

/**
 * Interface para o estado global do Zustand store.
 */
export interface CreatorState {
  grau: number | null;
  tipo: string | null;
  alcance: string | null;
  dano: DamageOption | null;
  efeitos: MultiOption[];
  reducoes: MultiOption[];
  pointsSpent: number;
  maxPoints: number;
  pointsAvailable: number;
  reducaoTotal: number;
  limiteReducaoExcedido: boolean;
}

/**
 * Interface para as ações do Zustand store.
 */
export interface CreatorActions {
  setGrau: (grau: number | null) => void;
  setTipo: (tipo: string | null) => void;
  setAlcance: (alcance: string | null) => void;
  setDano: (dano: DamageOption | null) => void;
  addEfeito: (efeito: MultiOption) => void;
  removeEfeito: (id: EffectId | string) => void;
  updateEfeito: (id: EffectId, value: number) => void;
  addReducao: (reducao: MultiOption) => void;
  removeReducao: (id: ReducaoId | string) => void;
  updateReducao: (id: ReducaoId, value: number) => void;
  resetState: () => void;
  recalculatePoints: () => void;
}