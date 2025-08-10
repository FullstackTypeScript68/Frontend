import type { TodoItem } from "../types";
import { compareDate } from "../utils/date";
import { matchesSearch } from "../utils/filter";
import type { Palette } from "../utils/ui";
import TodoItemView from "./TodoItem";

type Props = {
  todos: TodoItem[];
  searchText: string;
  palette: Palette;
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: string) => void;
  onImageClick: (src: string, alt?: string) => void;
};

export default function TodoList({
  todos,
  searchText,
  palette,
  onEdit,
  onDelete,
  onImageClick,
}: Props) {
  return (
    <div data-cy="todo-item-wrapper" style={{ marginTop: "1rem" }}>
      {todos
        .filter((t) => matchesSearch(t, searchText))
        .sort(compareDate)
        .map((item, idx) => (
          <TodoItemView
            key={item.id}
            item={item}
            index={idx}
            palette={palette}
            onEdit={onEdit}
            onDelete={onDelete}
            onImageClick={onImageClick}
          />
        ))}
    </div>
  );
}
