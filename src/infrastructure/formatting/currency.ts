const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatCentsToBRL(cents: number) {
  return formatter.format(cents / 100);
}

export function reaisToCents(value: number): number {
  return Math.round(value * 100);
}
