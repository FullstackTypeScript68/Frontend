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
        background: baseBg,
        color: isDarkMode ? "#ffffff" : "#000000",
        minHeight: "100vh",
        margin: 0,
        padding: "2rem",
        transition: "all 0.3s ease-in-out",
        overflowX: "hidden",
      }}
    >
      {/* ------------------------------------------------------------------- */}
      {/* theme toggle                                                       */}
      {/* ------------------------------------------------------------------- */}
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

      {/* ------------------------------------------------------------------- */}
      {/* header                                                             */}
      {/* ------------------------------------------------------------------- */}
      <header>
        <h1
          style={{
            marginBottom: "1.5rem",
            fontSize: "2.2rem",
            color: isDarkMode ? "#fff" : "#1a1a1a",
          }}
        >
          TODO APP
        </h1>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* owner list                                                         */}
      {/* ------------------------------------------------------------------- */}
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
        {/* กล่อง Owner List */}
        <section
          style={{
            backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
            padding: "1.5rem",
            border: `1px solid ${borderCol}`,
            borderRadius: "12px",
            boxShadow: isDarkMode
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
              onClick={handleLogout}
              className="logout-btn"
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
            <p
              style={{
                fontStyle: "italic",
                color: textSoft,
              }}
            >
              No owners found.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {owners.map((owner) => (
                <div
                  key={owner.id}
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
                    <strong style={{ fontSize: "1.1rem" }}>{owner.name}</strong>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: textSoft,
                        marginTop: "4px",
                      }}
                    >
                      📚 Course: {owner.courseId} &nbsp;|&nbsp; 🎯 Section:{" "}
                      {owner.section}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: textSoft,
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

      {/* search bar */}
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
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search text / YYYY-MM-DD / HH:mm"
          style={{
            flex: 1,
            padding: "0.6rem 0.9rem",
            borderRadius: "999px",
            background: glassBg,
            border: `1px solid ${borderCol}`,
            color: isDarkMode ? "#fff" : "#000",
            outline: "none",
          }}
        />
        {searchText && (
          <button
            onClick={() => setSearchText("")}
            style={{
              padding: "0.5rem 0.9rem",
              borderRadius: "999px",
              border: "1px solid #ccc",
              background: isDarkMode ? "#464646c0" : "#f7f7f7",
              cursor: "pointer",
            }}
            title="Clear"
          >
            ✖
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* add todo button                                                    */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          maxWidth: "900px",
          marginInline: "auto",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            background: isDarkMode
              ? "linear-gradient(90deg,#38bdf8,#a78bfa)"
              : "linear-gradient(90deg,#0ea5e9,#7c3aed)",
            color: "#fff",
            border: `1px solid ${borderCol}`,
            boxShadow: isDarkMode
              ? "0 10px 24px rgba(56,189,248,0.25)"
              : "0 10px 24px rgba(124,58,237,0.25)",
            cursor: "pointer",
          }}
        >
          ➕ Add Todo
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* modal                                                              */}
      {/* ------------------------------------------------------------------- */}
      {showModal && (
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
              color: isDarkMode ? "#fff" : "#000",
              padding: "1.5rem",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "450px",
              border: `1px solid ${borderCol}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>
              {mode === "ADD" ? "Add New Todo" : "Edit Todo"}
            </h2>

            <input
              type="text"
              value={inputText}
              onChange={handleChange}
              placeholder="Enter todo text"
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: `1px solid ${borderCol}`,
                marginBottom: "1rem",
                backgroundColor: isDarkMode ? "#222" : "#fff",
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
                gap: "0.5rem",
              }}
            >
              <button
                onClick={handleSubmit}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
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
      )}

      {/* ------------------------------------------------------------------- */}
      {/* todo list                                                          */}
      {/* ------------------------------------------------------------------- */}
      <main style={{ maxWidth: "900px", marginInline: "auto" }}>
        <div data-cy="todo-item-wrapper" style={{ marginTop: "1rem" }}>
          {todos
            .filter((t) => matchesSearch(t, searchText))
            .sort(compareDate)
            .map((item, idx) => {
              const { date, time } = formatDateTime(item.createdAt);
              return (
                <article
                  key={item.id}
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
                  <div>({idx + 1})</div>
                  <div>📅{date}</div>
                  <div>⏰{time}</div>

                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt="todo"
                      style={{
                        width: 60,
                        height: 60,
                        border: `1px solid ${borderCol}`,
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  )}

                  <div data-cy="todo-item-text" style={{ flex: 1 }}>
                    📰{item.todoText}
                  </div>

                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => startEdit(item)}
                    data-cy="todo-item-update"
                  >
                    🖊️
                  </div>

                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                    data-cy="todo-item-delete"
                  >
                    🗑️
                  </div>
                </article>
              );
            })}
        </div>
      </main>
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
