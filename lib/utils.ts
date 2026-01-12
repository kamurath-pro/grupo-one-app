/**
 * Utilitários compartilhados
 */

/**
 * Formata data relativa (ex: "2min", "3h", "5d")
 */
export function formatTimeAgo(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Agora";
  if (minutes < 60) return `${minutes}min`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
