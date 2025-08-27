import type { ReducaoId } from "./types";

/**
 * Calcula a redução de pontos de uma opção específica.
 * @param id O ID da redução.
 * @param value O valor numérico associado (número de seleções ou valor do input).
 * @returns A redução de pontos (valor negativo).
 */
export const getReducaoCost = (id: ReducaoId, value: number = 0): number => {
  switch (id) {
    // Modelo 1: Redução Fixa
    case 'tecnica-demorada':
    case 'tecnica-devoradora':
      return -3;
    case 'tecnica-nao-ofensiva':
      // A lógica condicional será tratada no store, que tem acesso ao 'tipo'
      // Aqui retornamos um valor base ou 0 se não aplicável.
      // Esta lógica específica será movida para o recalculatePoints.
      return 0;

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
      return value * -1; // A redução é o valor inserido, negativo

    default:
      return 0;
  }
};
