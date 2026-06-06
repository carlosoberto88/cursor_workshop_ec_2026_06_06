import { formatFakeBalance } from "@/lib/profile/format";

export type HeaderProfile = {
  balance_cents: number;
  first_name: string;
  last_name: string;
};

export type HeaderAuthState =
  | {
      kind: "signed_out";
      showSignIn: true;
      showSignUp: true;
      showSignOut: false;
      showBalance: false;
      balanceLabel: null;
    }
  | {
      kind: "signed_in";
      showSignIn: false;
      showSignUp: false;
      showSignOut: true;
      showBalance: true;
      balanceLabel: string;
    };

export function getHeaderAuthState({
  user,
  profile,
}: {
  user: { id: string } | null;
  profile: HeaderProfile | null;
}): HeaderAuthState {
  if (!user) {
    return {
      kind: "signed_out",
      showSignIn: true,
      showSignUp: true,
      showSignOut: false,
      showBalance: false,
      balanceLabel: null,
    };
  }

  const balanceLabel =
    profile === null
      ? "Balance unavailable"
      : formatFakeBalance(profile.balance_cents);

  return {
    kind: "signed_in",
    showSignIn: false,
    showSignUp: false,
    showSignOut: true,
    showBalance: true,
    balanceLabel,
  };
}
