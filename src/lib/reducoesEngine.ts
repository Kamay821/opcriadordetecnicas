import type { ReducaoId, DamageOption } from "./types";

/**
 * Calcula a redução de pontos de uma opção específica.
 * @param id O ID da redução.
 * @param grau O grau da técnica.
 * @param tipo O tipo da técnica.
 * @param dano O estado do dano da técnica.
 * @param value O valor numérico associado (número de seleções ou valor do input).
 * @returns A redução de pontos (valor negativo).
 */
export const getReducaoCost = (id: ReducaoId, grau: number | null, tipo: string | null, dano: DamageOption | null, value: number = 0): number => {
  if (grau === null) return 0;
    
  switch (id) {
    // Modelo 1: Redução Fixa
    case 'tecnica-demorada':
      return -3;
    case 'tecnica-devoradora':
      return -3;
    case 'tecnica-nao-ofensiva':
      // Lógica agora implementada aqui
      if (tipo === 'combate') return -2;
      if (dano?.type === 'auxiliar') return -1;
      return 0; // Não aplicável para outros casos

    // Modelo 2: Redução Linear
    case 'reduzir-area':
      return value * -1;
    case 'tecnica-debilitante':
      return value * -3;
    case 'tecnica-exaustiva':
      return value * -4;

    // Modelo 3: Redução Escalonada
    case 'concentracao-crucial':
      if (value === 0) return 0;
      return -2 + (value - 1) * -1;

    // Modelo 5: Redução por Faixa Variável
    case 'requisito-limitador':
    case 'efeito-colateral':
    case 'tecnica-dependente':
      return value * -1;

    default:
      return 0;
  }
};