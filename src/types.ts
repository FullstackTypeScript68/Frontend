export interface TodoItem {
  id: string;
  todoText: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
  // add this:
  imageUrl?: string | null;
}

// เพิ่ม OwnerItem
export type OwnerItem = {
  id: string;
  name: string;
  courseId: string;
  section: string;
  createdAt: string;
  updatedAt?: string | null;
};
