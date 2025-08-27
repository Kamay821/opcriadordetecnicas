import { create } from "zustand";
import type { CreatorState, CreatorActions, EffectId, ReducaoId } from "../lib/types";
import { getEffectCost } from "../lib/pointsEngine";
import { getReducaoCost } from "../lib/reducoesEngine";
import { GRAU_OPTIONS } from "../lib/constants";

export const useCreatorStore = create<CreatorState & CreatorActions>((set, get) => ({
  // Estado inicial
  grau: null,
  tipo: null,
  alcance: null,
  dano: null,
  efeitos: [],
  reducoes: [],
  pointsSpent: 0,
  maxPoints: 0,
  pointsAvailable: 0,

  // Ações para definir as propriedades principais
  setGrau: (grau) => {
    set({
      grau,
      maxPoints: grau !== null ? GRAU_OPTIONS[grau].max_points : 0,
    });
    get().recalculatePoints();
  },
  setTipo: (tipo) => {
    set({ tipo });
    get().recalculatePoints();
  },
  setAlcance: (alcance) => {
    set({ alcance });
    get().recalculatePoints();
  },
  setDano: (dano) => {
    set({ dano });
    get().recalculatePoints();
  },

  // Ações para gerir Efeitos
  addEfeito: (efeito) => {
    set((state) => ({ efeitos: [...state.efeitos.filter(e => e.id !== efeito.id), efeito] }));
    get().recalculatePoints();
  },
  removeEfeito: (id) => {
    set((state) => ({ efeitos: state.efeitos.filter((e) => e.id !== id) }));
    get().recalculatePoints();
  },
  updateEfeito: (id, value) => {
    set((state) => {
      const effectExists = state.efeitos.some(e => e.id === id);
      const newEfeitos = effectExists
        ? state.efeitos.map(e => e.id === id ? { ...e, value } : e)
        : [...state.efeitos, { id, value, cost: 0, label: id, description: '' }];
      return { efeitos: newEfeitos };
    });
    get().recalculatePoints();
  },

  // Ações para gerir Reduções
  addReducao: (reducao) => {
    set((state) => ({ reducoes: [...state.reducoes.filter(r => r.id !== reducao.id), reducao] }));
    get().recalculatePoints();
  },
  removeReducao: (id) => {
    set((state) => ({ reducoes: state.reducoes.filter((r) => r.id !== id) }));
    get().recalculatePoints();
  },
  updateReducao: (id, value) => {
    set((state) => {
      const reducaoExists = state.reducoes.some(r => r.id === id);
      const newReducoes = reducaoExists
        ? state.reducoes.map(r => r.id === id ? { ...r, value } : r)
        : [...state.reducoes, { id, value, cost: 0, label: id, description: '' }];
      return { reducoes: newReducoes };
    });
    get().recalculatePoints();
  },

  // Ação para resetar o estado
  resetState: () => {
    set({
      grau: null, tipo: null, alcance: null, dano: null,
      efeitos: [], reducoes: [],
      pointsSpent: 0, maxPoints: 0, pointsAvailable: 0,
    });
  },

  // A função central que recalcula tudo a partir do zero
  recalculatePoints: () => {
    const state = get();
    let totalSpent = 0;

    // 1. Custo do Tipo (pode ser negativo)
    if (state.tipo === "combate" && state.grau !== null) {
      totalSpent -= Math.ceil(state.grau / 2);
    }
    
    // 2. Custo do Dano
    totalSpent += state.dano?.cost || 0;

    // 3. Custo dos Efeitos (atualiza o custo de cada um no processo)
    const updatedEfeitos = state.efeitos.map(effect => {
      const newCost = getEffectCost(effect.id as EffectId, state.grau, effect.value);
      totalSpent += newCost;
      return { ...effect, cost: newCost };
    });

    // 4. Custo das Reduções (atualiza o custo de cada uma e subtrai do total)
    const updatedReducoes = state.reducoes.map(reducao => {
      let newCost = getReducaoCost(reducao.id as ReducaoId, reducao.value);
      
      // Lógica especial para 'tecnica-nao-ofensiva' que depende de outros estados
      if (reducao.id === 'tecnica-nao-ofensiva') {
        if (state.dano?.type === 'auxiliar') newCost = -1;
        else if (state.tipo === 'combate') newCost = -2;
        else newCost = 0;
      }

      totalSpent += newCost; // Adiciona o valor negativo
      return { ...reducao, cost: newCost };
    });

    // 5. Atualiza o estado final com os novos valores calculados
    set({
      efeitos: updatedEfeitos,
      reducoes: updatedReducoes,
      pointsSpent: totalSpent,
      pointsAvailable: state.maxPoints - totalSpent,
    });
  },
}));
