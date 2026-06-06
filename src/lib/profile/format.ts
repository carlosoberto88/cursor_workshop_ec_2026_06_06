import { formatFakeAmount } from "@/lib/fake-money";

export function formatFakeBalance(balanceCents: number): string {
  return formatFakeAmount(balanceCents);
}
