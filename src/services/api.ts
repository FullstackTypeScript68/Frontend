import axios from "axios";
import type { TodoItem, OwnerItem } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "", // รองรับทั้งมี/ไม่มี base
});

// ----- Todos -----
export async function getTodos(): Promise<TodoItem[]> {
  const res = await api.get<TodoItem[]>("/api/todo");
  return res.data;
}

export async function createOrUpdateWithUpload(input: {
  todoText: string;
  file?: File | null;
}) {
  const fd = new FormData();
  fd.append("todoText", input.todoText);
  if (input.file) fd.append("image", input.file);
  return api.post("/api/todo/upload", fd);
}

export async function patchTodoText(input: { id: string; todoText: string }) {
  return api.patch("/api/todo", input);
}

export async function removeTodo(id: string) {
  return api.delete("/api/todo", { data: { id } });
}

// ----- Owners -----
export async function getOwners(): Promise<OwnerItem[]> {
  const res = await api.get<OwnerItem[]>("/api/todo/owner");
  return res.data;
}

export default api;
