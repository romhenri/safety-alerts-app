import type { GuardStatus } from "./types";

export function labelGuardStatus(s: GuardStatus): string {
  const m: Record<GuardStatus, string> = {
    pending: "Aguardando sua confirmação",
    going: "Você confirmou deslocamento",
    not_going: "Indisponível para deslocamento",
    canceled: "Alerta cancelado",
    solved: "Alerta resolvido",
  };
  return m[s];
}

export function shortLabelGuardStatus(s: GuardStatus): string {
  const m: Record<GuardStatus, string> = {
    pending: "Pendente",
    going: "A caminho",
    not_going: "Indisponível",
    canceled: "Cancelado",
    solved: "Resolvido",
  };
  return m[s];
}
