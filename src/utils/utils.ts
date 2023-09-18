import format from "date-fns/format";
import { ptBR } from "date-fns/locale";

export function formatDate(dateString: string) {
  return format(new Date(dateString), "MMM d, yyyy", { locale: ptBR });
}
