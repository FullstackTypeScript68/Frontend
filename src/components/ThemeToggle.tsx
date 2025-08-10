type Props = { isDark: boolean; onToggle: () => void };

export default function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button
        onClick={onToggle}
        style={{
          fontSize: "0.85rem",
          padding: "0.4rem 0.8rem",
          borderRadius: "20px",
          backgroundColor: isDark ? "#eee" : "#333",
          color: isDark ? "#333" : "#fff",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          marginBottom: "1rem",
        }}
      >
        {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
}
