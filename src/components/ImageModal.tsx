import type { Palette } from "../utils/ui";

type Props = {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
  palette: Palette;
};

export default function ImageModal({
  open,
  src,
  alt,
  onClose,
  palette,
}: Props) {
  if (!open) return null;
  const { isDark, borderCol } = palette;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: isDark ? "#0f172a" : "#ffffff",
          borderRadius: 12,
          padding: "0.75rem",
          border: `1px solid ${borderCol}`,
          maxWidth: "92vw",
          maxHeight: "86vh",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 36,
            height: 36,
            borderRadius: 8,
            border: `1px solid ${borderCol}`,
            background: isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: "1",
          }}
        >
          ×
        </button>

        <img
          src={src}
          alt={alt || "Todo Image"}
          style={{
            display: "block",
            maxWidth: "88vw",
            maxHeight: "72vh",
            objectFit: "contain",
            borderRadius: 10,
          }}
        />
        {alt && (
          <div
            style={{
              textAlign: "center",
              fontSize: "0.95rem",
              color: isDark ? "#cfd8ff" : "#475569",
              padding: "0.25rem 0.5rem",
            }}
          >
            {alt}
          </div>
        )}
      </div>
    </div>
  );
}
