import type { Palette } from "../utils/ui";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  palette: Palette;
};

export default function SearchBar({
  value,
  onChange,
  onClear,
  palette,
}: Props) {
  const { isDark, glassBg, borderCol } = palette;
  return (
    <div
      style={{
        maxWidth: "900px",
        marginInline: "auto",
        marginBottom: "0.75rem",
        display: "flex",
        gap: "0.5rem",
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search text / YYYY-MM-DD / HH:mm"
        style={{
          flex: 1,
          padding: "0.6rem 0.9rem",
          borderRadius: "999px",
          background: glassBg,
          border: `1px solid ${borderCol}`,
          color: isDark ? "#fff" : "#000",
          outline: "none",
        }}
      />
      {value && (
        <button
          onClick={onClear}
          style={{
            padding: "0.5rem 0.9rem",
            borderRadius: "999px",
            border: "1px solid #ccc",
            background: isDark ? "#464646c0" : "#f7f7f7",
            cursor: "pointer",
          }}
          title="Clear"
        >
          ✖
        </button>
      )}
    </div>
  );
}
