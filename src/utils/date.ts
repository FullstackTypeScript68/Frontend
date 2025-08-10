import dayjs from "dayjs";
import type { TodoItem } from "../types";

export function formatDateTime(dateStr: string) {
  const dt = dayjs(dateStr);
  if (!dt.isValid()) return { date: "N/A", time: "N/A" };
  return { date: dt.format("D/MM/YY"), time: dt.format("HH:mm") };
}

export function compareDate(a: TodoItem, b: TodoItem) {
  const da = dayjs(a.createdAt);
  const db = dayjs(b.createdAt);
  // ใหม่กว่าอยู่อันดับบน
  return da.isAfter(db) ? -1 : 1;
}
