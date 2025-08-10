import type { Palette } from "../utils/ui";

type Props = {
  open: boolean;
  mode: "ADD" | "EDIT";
  value: string;
  onChange: (v: string) => void;
  onImageChange: (file: File | null) => void;
  onSubmit: () => void;
  onClose: () => void;
  palette: Palette;
};

export default function TodoModal({
  open,
  mode,
  value,
  onChange,
  onImageChange,
  onSubmit,
  onClose,
  palette,
}: Props) {
  if (!open) return null;
  const { isDark, glassBg, borderCol } = palette;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: glassBg,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          color: isDark ? "#fff" : "#000",
          padding: "1.25rem",
          borderRadius: 18,
          width: "100%",
          maxWidth: 520,
          border: `1px solid ${borderCol}`,
          boxShadow: isDark
            ? "0 18px 40px rgba(0,0,0,0.5)"
            : "0 18px 40px rgba(2,132,199,0.18)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          {mode === "ADD" ? "Add New Todo" : "Edit Todo"}
        </h2>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter todo text"
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "6px",
            border: `1px solid ${borderCol}`,
            marginBottom: "1rem",
            backgroundColor: isDark ? "#222" : "#fff",
            color: isDark ? "#fff" : "#000",
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
          style={{ marginBottom: "1rem" }}
        />

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}
        >
          <button
            onClick={onSubmit}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: isDark
                ? "linear-gradient(90deg,#22c55e,#4ade80)"
                : "linear-gradient(90deg,#16a34a,#22c55e)",
              color: "#fff",
              border: `1px solid ${borderCol}`,
              cursor: "pointer",
              boxShadow: "0 10px 24px rgba(34,197,94,0.25)",
            }}
          >
            {mode === "ADD" ? "Submit" : "Update"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              backgroundColor: "#ccc",
              border: `1px solid ${borderCol}`,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
