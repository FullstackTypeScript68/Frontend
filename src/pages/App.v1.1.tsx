import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "../types";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

/**
 * NOTE
 * - axios baseURL สามารถตั้งผ่าน Vite env (`VITE_API_BASE`) หรือจะปล่อยเป็น relative path ก็ได้
 * - backend เสิร์ฟไฟล์อัปโหลดไว้ที่ `/uploads` → `imageUrl` จาก DB จึงชี้ตรงได้เลย
 */

// --------------------------------------------------
// types
// --------------------------------------------------

type OwnerItem = {
  id: string;
  name: string;
  courseId: string;
  section: string;
  createdAt: string;
  updatedAt?: string;
};

// --------------------------------------------------
// component
// --------------------------------------------------

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [owners, setOwners] = useState<OwnerItem[]>([]);

  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();
  // initial fetch -----------------------------------------------------------
  useEffect(() => {
    fetchTodos();
    fetchOwners();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  async function fetchOwners() {
    try {
      const res = await axios.get<OwnerItem[]>("/api/todo/owner");
      setOwners(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch owner list", err);
    }
  }

  async function fetchTodos() {
    try {
      const res = await axios.get<TodoItem[]>("/api/todo");
      setTodos(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch todo list", err);
    }
  }

  // -------------------------------------------------------------------------
  // input helpers
  // -------------------------------------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files?.[0] ?? null);
  };

  // ฟังก์ชันเช็กว่ารายการตรงกับคำค้นไหม
  function matchesSearch(item: TodoItem, q: string) {
    if (!q) return true;
    const s = q.trim().toLowerCase();

    // ค้นจากข้อความ todo
    const textHit = item.todoText?.toLowerCase().includes(s);

    // ค้นจากวันที่/เวลา
    const d = dayjs(item.createdAt);
    const dateStr1 = d.format("YYYY-MM-DD"); // ค้นแบบ 2025-08-09
    const dateStr2 = d.format("D/MM/YY"); // ค้นแบบ 9/08/25
    const timeStr = d.format("HH:mm");

    const dateHit = dateStr1.includes(s) || dateStr2.includes(s);
    const timeHit = timeStr.includes(s);

    return textHit || dateHit || timeHit;
  }

  // -------------------------------------------------------------------------
  // submit / update / delete
  // -------------------------------------------------------------------------

  async function handleSubmit() {
    if (!inputText) return;

    try {
      // 1) text-only edit -----------------------------------------------------
      if (mode === "EDIT" && !imageFile) {
        await axios.patch("/api/todo", {
          id: curTodoId,
          todoText: inputText,
        });

        // 2) add หรือ edit พร้อมไฟล์ ---------------------------------------
      } else {
        const fd = new FormData();
        fd.append("todoText", inputText);
        if (imageFile) fd.append("image", imageFile);

        await axios.post("/api/todo/upload", fd);
      }

      // reset ---------------------------------------------------------------
      setInputText("");
      setImageFile(null);
      setCurTodoId("");
      setMode("ADD");
      setShowModal(false);

      fetchTodos();
    } catch (err) {
      alert(err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await axios.delete("/api/todo", { data: { id } });
      fetchTodos();
      if (id === curTodoId) {
        cancelEdit();
      }
    } catch (err) {
      alert(err);
    }
  }

  const startEdit = (todo: TodoItem) => {
    setMode("EDIT");
    setCurTodoId(todo.id);
    setInputText(todo.todoText);
    setShowModal(true);
  };

  const cancelEdit = () => {
    setMode("ADD");
    setInputText("");
    setCurTodoId("");
    setImageFile(null);
  };

  // cute palette
  const baseBg = isDarkMode
    ? "linear-gradient(135deg, #0c0f14 0%, #121826 40%, #1b2a41 100%)"
    : "linear-gradient(135deg, #fdfcff 0%, #f1f6ff 40%, #eaf6ff 100%)";
  const glassBg = isDarkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(255,255,255,0.7)";
  const borderCol = isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const textSoft = isDarkMode ? "#cfd8ff" : "#455a64";
  const cardBg = isDarkMode ? "#141a26" : "#ffffff";

  // -------------------------------------------------------------------------
  // render
  // -------------------------------------------------------------------------

  return (
    <div
      className="container"
      style={{
        position: "relative",
        background: baseBg,
        color: isDarkMode ? "#ffffff" : "#0f172a",
        minHeight: "100vh",
        margin: 0,
        padding: "2.5rem 1.25rem",
        transition: "all 0.3s ease-in-out",
        overflowX: "hidden",
      }}
    >
      {/* decorative blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            top: -80,
            left: -60,
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: isDarkMode ? 0.35 : 0.5,
            background:
              "radial-gradient(circle at 30% 30%, #6ee7ff 0%, transparent 60%), radial-gradient(circle at 70% 70%, #a78bfa 0%, transparent 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            bottom: -120,
            right: -80,
            borderRadius: "50%",
            filter: "blur(90px)",
            opacity: isDarkMode ? 0.35 : 0.45,
            background:
              "radial-gradient(circle at 40% 40%, #ffb3d9 0%, transparent 60%), radial-gradient(circle at 70% 60%, #7dd3fc 0%, transparent 55%)",
          }}
        />
      </div>

      {/* content wrapper */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        {/* theme toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              fontSize: "0.85rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "20px",
              backgroundColor: isDarkMode ? "#eee" : "#333",
              color: isDarkMode ? "#333" : "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              marginBottom: "1rem",
            }}
          >
            {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* header */}
        <header style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <h1
            style={{
              marginBottom: ".25rem",
              fontSize: "2.4rem",
              lineHeight: 1.1,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: isDarkMode ? "#fff" : "#1a1a1a",
              letterSpacing: 0.5,
              textShadow: isDarkMode
                ? "0 2px 20px rgba(124,58,237,0.2)"
                : "none",
            }}
          >
            TODO APP
          </h1>
          {/* <p style={{ color: textSoft, margin: 0, fontSize: ".95rem" }}>
            💕 💕 💕 💕 💕 💕 💕
          </p> */}
        </header>

        {/* owner + logout */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "stretch",
            marginBottom: "1.5rem",
          }}
        >
          <section
            style={{
              flex: 1,
              background: glassBg,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: `1px solid ${borderCol}`,
              borderRadius: 16,
              padding: "1.25rem",
              boxShadow: isDarkMode
                ? "0 10px 30px rgba(0,0,0,0.35)"
                : "0 10px 30px rgba(2,132,199,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                🧑‍🏫 <span>Owner List</span>
              </h2>

              <button
                onClick={handleLogout}
                className="logout-btn"
                style={{
                  padding: ".55rem .9rem",
                  borderRadius: 12,
                  border: `1px solid ${borderCol}`,
                  cursor: "pointer",
                  backgroundColor: "#64d6ffff",
                  color: "#fff",
                  fontWeight: 700,
                  boxShadow: "0 8px 22px rgba(142, 183, 255, 0.29)",
                  transition: "transform .15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
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
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "0.75rem",
                }}
              >
                {owners.map((owner) => (
                  <div
                    key={owner.id}
                    style={{
                      background: cardBg,
                      border: `1px solid ${borderCol}`,
                      padding: "0.85rem 1rem",
                      borderRadius: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxShadow: isDarkMode
                        ? "0 6px 18px rgba(0,0,0,0.35)"
                        : "0 6px 18px rgba(2,132,199,0.12)",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "1.05rem" }}>
                        {owner.name}
                      </strong>
                      <div
                        style={{
                          fontSize: ".9rem",
                          color: textSoft,
                          marginTop: 4,
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <span>📚 Course: {owner.courseId}</span>
                        <span>🎯 Section: {owner.section}</span>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: ".85rem",
                        color: textSoft,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⏰ {dayjs(owner.createdAt).format("DD MMM YYYY, HH:mm")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* search */}
        <div
          style={{
            marginBottom: ".9rem",
            display: "flex",
            gap: ".5rem",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: ".6rem",
              background: glassBg,
              border: `1px solid ${borderCol}`,
              borderRadius: 999,
              padding: ".55rem .9rem",
              boxShadow: isDarkMode
                ? "0 8px 22px rgba(0,0,0,0.35)"
                : "0 8px 22px rgba(2,132,199,0.12)",
            }}
          >
            <span aria-hidden>🔍</span>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search text / YYYY-MM-DD / HH:mm"
              style={{
                flex: 1,
                padding: ".25rem",
                borderRadius: 999,
                border: "none",
                outline: "none",
                background: "transparent",
                color: isDarkMode ? "#fff" : "#000",
              }}
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                style={{
                  padding: "0.5rem 0.9rem",
                  borderRadius: "999px",
                  border: "1px solid #ccc",
                  background: isDarkMode ? "#2c2c2c" : "#f7f7f7",
                  cursor: "pointer",
                }}
                title="Clear"
              >
                ✖
              </button>
            )}
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 14,
              background: isDarkMode
                ? "linear-gradient(90deg,#38bdf8,#a78bfa)"
                : "linear-gradient(90deg,#0ea5e9,#7c3aed)",
              color: "#fff",
              border: `1px solid ${borderCol}`,
              cursor: "pointer",
              boxShadow: isDarkMode
                ? "0 10px 24px rgba(56,189,248,0.25)"
                : "0 10px 24px rgba(124,58,237,0.25)",
              transition: "transform .15s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            ➕ Add Todo
          </button>
        </div>

        {/* modal */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div
              style={{
                background: glassBg,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                color: isDarkMode ? "#fff" : "#000",
                padding: "1.25rem",
                borderRadius: 18,
                width: "100%",
                maxWidth: 520,
                border: `1px solid ${borderCol}`,
                boxShadow: isDarkMode
                  ? "0 18px 40px rgba(0,0,0,0.5)"
                  : "0 18px 40px rgba(2,132,199,0.18)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>
                {mode === "ADD" ? "Add New Todo" : "Edit Todo"}
              </h2>

              <input
                type="text"
                value={inputText}
                onChange={handleChange}
                placeholder="Enter todo text"
                style={{
                  width: "100%",
                  padding: ".7rem .9rem",
                  borderRadius: 12,
                  border: `1px solid ${borderCol}`,
                  marginBottom: "0.8rem",
                  backgroundColor: isDarkMode ? "#0b1220" : "#ffffff",
                  color: isDarkMode ? "#fff" : "#000",
                }}
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: "1rem" }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: ".6rem",
                }}
              >
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: ".6rem 1rem",
                    borderRadius: 12,
                    background: isDarkMode
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
                  onClick={() => {
                    setShowModal(false);
                    mode === "EDIT" ? cancelEdit() : setImageFile(null);
                  }}
                  style={{
                    padding: ".6rem 1rem",
                    borderRadius: 12,
                    background: isDarkMode ? "#0b1220" : "#e2e8f0",
                    border: `1px solid ${borderCol}`,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* todo list */}
        <main>
          <div data-cy="todo-item-wrapper" style={{ marginTop: "0.5rem" }}>
            {todos
              .filter((t) => matchesSearch(t, searchText))
              .sort(compareDate)
              .map((item, idx) => {
                const { date, time } = formatDateTime(item.createdAt);
                return (
                  <article
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto auto auto 1fr auto auto",
                      gap: ".65rem",
                      alignItems: "center",
                      background: glassBg,
                      border: `1px solid ${borderCol}`,
                      padding: ".7rem 1rem",
                      borderRadius: 16,
                      marginBottom: ".6rem",
                      boxShadow: isDarkMode
                        ? "0 10px 26px rgba(0,0,0,0.35)"
                        : "0 10px 26px rgba(2,132,199,0.12)",
                    }}
                  >
                    <div style={{ opacity: 0.8 }}>({idx + 1})</div>
                    <div
                      title="Created date"
                      style={{
                        padding: ".2rem .55rem",
                        borderRadius: 999,
                        background: isDarkMode ? "#0b1220" : "#eef2ff",
                        border: `1px solid ${borderCol}`,
                        fontSize: ".85rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      📅 {date}
                    </div>
                    <div
                      title="Created time"
                      style={{
                        padding: ".2rem .55rem",
                        borderRadius: 999,
                        background: isDarkMode ? "#0b1220" : "#eef2ff",
                        border: `1px solid ${borderCol}`,
                        fontSize: ".85rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⏰ {time}
                    </div>

                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt="todo"
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: "cover",
                          borderRadius: 12,
                          border: `1px solid ${borderCol}`,
                        }}
                      />
                    )}

                    <div
                      data-cy="todo-item-text"
                      style={{
                        flex: 1,
                        fontSize: "1.02rem",
                        lineHeight: 1.35,
                        color: isDarkMode ? "#e9edff" : "#1f2a44",
                      }}
                    >
                      📰 {item.todoText}
                    </div>

                    <div
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => startEdit(item)}
                      data-cy="todo-item-update"
                      title="Edit"
                    >
                      🖊️
                    </div>

                    <div
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleDelete(item.id)}
                      data-cy="todo-item-delete"
                      title="Delete"
                    >
                      🗑️
                    </div>
                  </article>
                );
              })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

// ---------------------------------------------------------------------------
// utils
// ---------------------------------------------------------------------------

function formatDateTime(dateStr: string) {
  if (!dayjs(dateStr).isValid()) return { date: "N/A", time: "N/A" };
  const dt = dayjs(dateStr);
  return {
    date: dt.format("D/MM/YY"),
    time: dt.format("HH:mm"),
  };
}

function compareDate(a: TodoItem, b: TodoItem) {
  const da = dayjs(a.createdAt);
  const db = dayjs(b.createdAt);
  return da.isAfter(db) ? -1 : 1; // ใหม่กว่าอยู่บนสุด
}
