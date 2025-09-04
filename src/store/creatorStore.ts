import { create } from "zustand";
import type { CreatorState, CreatorActions, MultiOption, EffectId, ReducaoId, DamageOption } from "../lib/types";
import { getEffectCost } from "../lib/pointsEngine";
import { getReducaoCost } from "../lib/reducoesEngine";
import { GRAU_OPTIONS } from "../lib/constants";

export const useCreatorStore = create<CreatorState & CreatorActions>((set, get) => ({
  // --- ESTADO INICIAL ---
  grau: null,
  tipo: null,
  alcance: null,
  dano: null,
  efeitos: [],
  reducoes: [],
  pointsSpent: 0,
  maxPoints: 0,
  pointsAvailable: 0,
  reducaoTotal: 0,
  limiteReducaoExcedido: false,

  // --- AÇÕES ---
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

  addEfeito: (efeito) => {
    set((state) => ({ efeitos: [...state.efeitos, efeito] }));
    get().recalculatePoints();
  },
  removeEfeito: (id) => {
    set((state) => ({
      efeitos: state.efeitos.filter((e) => e.id !== id),
    }));
    get().recalculatePoints();
  },
  updateEfeito: (id, value) => {
    set(state => {
      const existingEffect = state.efeitos.find(e => e.id === id);
      if (existingEffect) {
        return { efeitos: state.efeitos.map(e => e.id === id ? { ...e, value } : e) };
      } else {
        return { efeitos: [...state.efeitos, { id, value, cost: 0, label: id, description: '' }] };
      }
    });
    get().recalculatePoints();
  },

  addReducao: (reducao) => {
    set((state) => ({ reducoes: [...state.reducoes, reducao] }));
    get().recalculatePoints();
  },
  removeReducao: (id) => {
    set((state) => ({
      reducoes: state.reducoes.filter((r) => r.id !== id),
    }));
    get().recalculatePoints();
  },
  updateReducao: (id, value) => {
    set(state => {
      const existingReducao = state.reducoes.find(r => r.id === id);
      if (existingReducao) {
        return { reducoes: state.reducoes.map(r => r.id === id ? { ...r, value } : r) };
      } else {
        return { reducoes: [...state.reducoes, { id, value, cost: 0, label: id, description: '' }] };
      }
    });
    get().recalculatePoints();
  },
  
  resetState: () => {
    set({
      grau: null,
      tipo: null,
      alcance: null,
      dano: null,
      efeitos: [],
      reducoes: [],
      pointsSpent: 0,
      maxPoints: 0,
      pointsAvailable: 0,
      reducaoTotal: 0,
      limiteReducaoExcedido: false,
    });
  },

  recalculatePoints: () => {
    const state = get();
    if (state.grau === null) return;

    // Recalcula custos de Efeitos e Reduções
    const updatedEfeitos = state.efeitos.map(e => ({ ...e, cost: getEffectCost(e.id as EffectId, state.grau, e.value) }));
    const updatedReducoes = state.reducoes.map(r => ({ ...r, cost: getReducaoCost(r.id as ReducaoId, state.grau, state.tipo, state.dano, r.value) }));
    
    const reducaoBruta = updatedReducoes.reduce((sum, r) => sum + r.cost, 0);
    const limiteReducao = -state.grau;
    
    const reducaoLiquida = Math.max(reducaoBruta, limiteReducao);
    const limiteExcedido = reducaoBruta < limiteReducao;

    // Calcula Pontos Gastos
    let totalSpent = 0;
    
    // Custos positivos
    totalSpent += state.dano?.cost || 0;
    totalSpent += updatedEfeitos.reduce((sum, e) => sum + e.cost, 0);

    // Custos negativos (Reduções)
    totalSpent += reducaoLiquida;

    // **A CORREÇÃO:** A "Técnica de Combate" é uma REDUÇÃO, então subtraímos do custo total.
    if (state.tipo === "combate") {
        totalSpent -= Math.ceil(state.grau / 2);
    }

    set({
      efeitos: updatedEfeitos,
      reducoes: updatedReducoes,
      pointsSpent: totalSpent,
      pointsAvailable: state.maxPoints - totalSpent,
      reducaoTotal: reducaoBruta,
      limiteReducaoExcedido: limiteExcedido,
    });
  },
}));