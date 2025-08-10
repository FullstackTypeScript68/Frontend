import dayjs from "dayjs";
import type { TodoItem } from "../types";

export function matchesSearch(item: TodoItem, q: string) {
  if (!q) return true;
  const s = q.trim().toLowerCase();

  const textHit = (item.todoText || "").toLowerCase().includes(s);

  const d = dayjs(item.createdAt);
  const dateStr1 = d.format("YYYY-MM-DD");
  const dateStr2 = d.format("D/MM/YY");
  const timeStr = d.format("HH:mm");

  const dateHit = dateStr1.includes(s) || dateStr2.includes(s);
  const timeHit = timeStr.includes(s);

  return textHit || dateHit || timeHit;
}
