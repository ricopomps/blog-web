import { TooManyRequestsError } from "@/network/http-errors";
import { AxiosError, isAxiosError } from "axios";
import format from "date-fns/format";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import ptBR from "date-fns/locale/pt-BR";
import { toast } from "react-toastify";

export function formatDate(dateString: string) {
  return format(new Date(dateString), "MMM d, yyyy", { locale: ptBR });
}

export function formatRelativeDate(dateString: string) {
  return formatDistanceToNowStrict(new Date(dateString), {
    addSuffix: true,
    locale: ptBR,
  });
}

export function generateSlug(input: string) {
  return input
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/ +/g, " ") //merge multiple spaces in a row
    .replace(/\s/g, "-")
    .toLowerCase();
}

export function generateFormData(input: Record<string, any>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) formData.append(key, value);
  }

  return formData;
}

export function handleError(error: unknown) {
  if (error instanceof TooManyRequestsError) {
    toast.error("Too many requests, please wait a while");
  } else if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error: string }>;
    if (axiosError.response?.data?.error) {
      toast.error(axiosError.response.data.error);
    } else {
      toast.error("An error occurred.");
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else if (typeof error === "string") {
    toast.error(error);
  } else {
    toast.error("An error occurred.");
  }
}

export function isServer() {
  return typeof window === "undefined";
}
