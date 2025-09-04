import { EFEITOS_CONDICOES } from "./constants";
import type { EffectId } from "./types";

/**
 * Calcula o custo de um efeito específico com base em seu ID, valor e o grau da técnica.
 * Esta função implementa os modelos de custo definidos.
 */
export const getEffectCost = (id: EffectId, grau: number | null, value: number = 0): number => {
  if (grau === null && !id.startsWith('adicionar-condicao-')) return 0;

  // Modelo 0: Condição
  if (id.startsWith("adicionar-condicao-")) {
    const condicaoId = id.replace("adicionar-condicao-", "");
    const condicao = EFEITOS_CONDICOES.find(c => c.id === condicaoId);
    return condicao?.cost || 0;
  }
  if (id === "condicao-extra") {
    return value; // O custo é o valor inserido pelo usuário
  }

  // Assegura que temos um grau para os modelos restantes
  if (grau === null) return 0;

  switch (id) {
    // Modelo 1: Custo Fixo
    case "controle-cirurgico": return 1;
    case "tecnica-dominada": return 1;
    case "ataque-cerco": return 2;
    case "ataques-multiplos": return 6;
    case "criar-lacaio": return 8;

    // Modelo 2: Custo Linear
    case "adicionar-empurrao": return value * 1;
    case "aumentar-alcance": return value * 1;
    case "aumentar-area": return value * 1; // Simplificado para raio/comprimento
    case "aumentar-area-largura": return value * 2;
    case "aumentar-cd": return value * 1;
    case "aumentar-acerto": return value * 1;
    case "dano-adicional-dado": return value * 1;
    case "adicionar-cura": return value * 1;
    case "adicionar-pv-temporario": return value * 1;
    case "aumentar-cr": return value * 2;
    case "contencao-dano-coletivo": return value * 1;
    case "contencao-dano-individual": return value * 1;

    // Modelo 3: Custo Escalonado (Não-Linear)
    case "duracao-prolongada":
      if (value === 0) return 0;
      return 4 + (value - 1) * 2;
    case "aumentar-dano":
      if (value === 0) return 0;
      if (value === 1) return 3;
      return 3 + (value - 1) * 2;
    case "criar-arma":
      if (value === 0) return 0;
      if (value === 1) return 6; // Custo inicial para 2d8
      return 6 + (value - 1) * 2; // +2 para cada d8 adicional
    case "adicionar-voo":
      if (value === 0) return 0;
      return 2 + (value - 1) * 1;

    // Modelo 4: Custo Mapeado (tratado no componente, mas com valores aqui para consistência)
    case "adicionar-critico-19-20": return 1;
    case "adicionar-critico-18-20": return 3;
    case "aumentar-movimento-3m": return 1;
    case "aumentar-movimento-6m": return 2;
    case "reducao-movimento-metade": return 1;
    case "reducao-movimento-zero": return 2;

    // Modelo 6: Custo Dependente de Variável Externa (Grau)
    case "adicionar-vantagem": return 1;
    case "condicao-em-area":
    case "dano-continuo":
    case "dano-insistente":
      return Math.ceil(grau / 2);
    case "tecnica-rapida":
    case "acerto-automatico": return 4;

    default:
      return 0;
  }
};
