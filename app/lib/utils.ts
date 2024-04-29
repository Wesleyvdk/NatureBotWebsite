import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "~/db.server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
