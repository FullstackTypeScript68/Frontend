import dayjs from "dayjs";
import type { OwnerItem } from "../types";
import type { Palette } from "../utils/ui";

type Props = {
  owners: OwnerItem[];
  palette: Palette;
  onLogout: () => void;
};

export default function OwnerList({ owners, palette, onLogout }: Props) {
  const { isDark, borderCol, cardBg, textSoft } = palette;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "900px",
        marginInline: "auto",
        marginBottom: "2rem",
      }}
    >
      <section
        style={{
          backgroundColor: isDark ? "#1e1e1e" : "#fff",
          color: isDark ? "#fff" : "#000",
          padding: "1.5rem",
          border: `1px solid ${borderCol}`,
          borderRadius: "12px",
          boxShadow: isDark
            ? "0 4px 12px rgba(255,255,255,0.05)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🧑‍🏫 <span>Owner List</span>
          </h2>

          <button
            onClick={onLogout}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              border: `1px solid ${borderCol}`,
              cursor: "pointer",
              backgroundColor: "#ff4d4f",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        {owners.length === 0 ? (
          <p style={{ fontStyle: "italic", color: textSoft }}>
            No owners found.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {owners.map((o) => (
              <div
                key={o.id}
                style={{
                  background: cardBg,
                  padding: "0.75rem 1rem",
                  border: `1px solid ${borderCol}`,
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ fontSize: "1.1rem" }}>{o.name}</strong>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: textSoft,
                      marginTop: "4px",
                    }}
                  >
                    📚 Course: {o.courseId} &nbsp;|&nbsp; 🎯 Section:{" "}
                    {o.section}
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: textSoft }}>
                  ⏰ {dayjs(o.createdAt).format("DD MMM YYYY, HH:mm")}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
