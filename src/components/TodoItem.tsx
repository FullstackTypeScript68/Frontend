import type { TodoItem } from "../types";
import type { Palette } from "../utils/ui";
import { formatDateTime } from "../utils/date";

type Props = {
  item: TodoItem;
  index: number;
  palette: Palette;
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: string) => void;
  onImageClick: (src: string, alt?: string) => void;
};

export default function TodoItemView({
  item,
  index,
  palette,
  onEdit,
  onDelete,
  onImageClick,
}: Props) {
  const { glassBg, borderCol, isDark } = palette;
  const { date, time } = formatDateTime(item.createdAt);

  return (
    <article
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
        background: glassBg,
        border: `1px solid ${borderCol}`,
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        marginBottom: "0.5rem",
      }}
    >
      <div style={{ width: 64, height: 64 }}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.todoText || "Todo Image"}
            onClick={() => onImageClick(item.imageUrl!, item.todoText)}
            style={{
              width: 64,
              height: 64,
              objectFit: "cover",
              borderRadius: 8,
              border: `1px solid ${borderCol}`,
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.04)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          />
        ) : (
          <div
            title="No image"
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              border: `1px solid ${borderCol}`,
              display: "grid",
              placeItems: "center",
              background: isDark ? "#0b1220" : "#f8fafc",
              color: isDark ? "#94a3b8" : "#64748b",
              fontSize: "1.25rem",
            }}
          >
            🖼️
          </div>
        )}
      </div>

      <div>({index + 1})</div>
      <div>📅{date}</div>
      <div>⏰{time}</div>

      <div style={{ flex: 1 }}>📰{item.todoText}</div>

      <div style={{ cursor: "pointer" }} onClick={() => onEdit(item)}>
        🖊️
      </div>

      <div style={{ cursor: "pointer" }} onClick={() => onDelete(item.id)}>
        🗑️
      </div>
    </article>
  );
}
