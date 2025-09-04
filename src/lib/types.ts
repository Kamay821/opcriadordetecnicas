/**
 * Define todos os IDs possíveis para os efeitos especiais.
 * Usar um union type previne erros de digitação e habilita o autocomplete.
 */
export type EffectId =
  // ... (tipos de Efeitos permanecem os mesmos)
  | 'adicionar-empurrao'
  | 'adicionar-vantagem'
  | 'aumentar-alcance'
  | 'aumentar-area'
  | 'aumentar-area-largura'
  | 'aumentar-cd'
  | 'condicao-em-area'
  | 'controle-cirurgico'
  | 'tecnica-dominada'
  | 'criar-lacaio'
  | 'duracao-prolongada'
  | 'tecnica-rapida'
  | 'acerto-automatico'
  | 'adicionar-critico-19-20'
  | 'adicionar-critico-18-20'
  | 'ataque-cerco'
  | 'ataques-multiplos'
  | 'aumentar-acerto'
  | 'aumentar-dano'
  | 'criar-arma'
  | 'dano-adicional-dado'
  | 'dano-continuo'
  | 'dano-insistente'
  | 'adicionar-cura'
  | 'adicionar-pv-temporario'
  | 'adicionar-voo'
  | 'aumentar-cr'
  | 'aumentar-movimento-3m'
  | 'aumentar-movimento-6m'
  | 'contencao-dano-coletivo'
  | 'contencao-dano-individual'
  | 'reducao-movimento-metade'
  | 'reducao-movimento-zero';
  
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
  id: EffectId | ReducaoId | string; // Atualizado para incluir ReducaoId
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
 * NOVO: Adicionado reducaoTotal e limiteReducaoExcedido.
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
