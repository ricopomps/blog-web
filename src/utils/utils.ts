import format from "date-fns/format";
import { ptBR } from "date-fns/locale";

export function formatDate(dateString: string) {
  return format(new Date(dateString), "MMM d, yyyy", { locale: ptBR });
}

export function generateSlug(input: string) {
  return input
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/ +/g, " ") //merge multiple spaces in a row
    .replace(/\s/g, "-")
    .toLowerCase();
}
