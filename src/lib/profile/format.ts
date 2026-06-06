export function formatFakeBalance(balanceCents: number): string {
  const dollars = balanceCents / 100;
  return `$${dollars.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} fake`;
}
