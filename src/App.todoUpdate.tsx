import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "./types";
import dayjs from "dayjs";

type OwnerItem = {
  id: string;
  name: string;
  courseId: string;
  section: string;
  createdAt: string;
  updatedAt?: string;
};

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");
  const [owners, setOwners] = useState<OwnerItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- เพิ่มสองบรรทัดนี้ ---
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
    fetchOwners();
  }, []);

  async function fetchOwners() {
    try {
      const res = await axios.get<OwnerItem[]>("/api/todo/owner");
      setOwners(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch owner list", err);
    }
  }

  async function fetchData() {
    const res = await axios.get<TodoItem[]>("/api/todo");
    setTodos(res.data);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  // --- ปรับ handleSubmit ให้รองรับไฟล์ ---
  async function handleSubmit() {
    console.log("🟩 Submit clicked");
    if (!inputText) return;

    const formData = new FormData();
    formData.append("todoText", inputText);
    if (imageFile) formData.append("image", imageFile);

    try {
      // ✅ เพิ่ม log ตรวจสอบค่าที่จะส่ง
      console.log("📤 Submitting FormData:");
      for (const pair of formData.entries()) {
        console.log(`🔹 ${pair[0]}:`, pair[1]);
      }

      if (mode === "ADD") {
        const res = await axios.post("/api/todo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("✅ Upload success:", res.data);
      } else {
        // ✅ เพิ่ม log ตรวจสอบตอน edit ด้วย
        if (imageFile) {
          const res = await axios.post(`/api/todo/${curTodoId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("✅ Update with image:", res.data);
        } else {
          const res = await axios.patch("/api/todo", {
            id: curTodoId,
            todoText: inputText,
          });
          console.log("✅ Update without image:", res.data);
        }
      }

      // ✅ Log หลังสำเร็จ
      console.log("🎉 Task saved, clearing form...");

      // Reset state
      setInputText("");
      setImageFile(null);
      setMode("ADD");
      setCurTodoId("");
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Upload failed");
    }
  }

  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { id } })
      .then(fetchData)
      .catch((err) => alert(err));
  }

  function handleEdit(item: TodoItem) {
    setMode("EDIT");
    setCurTodoId(item.id);
    setInputText(item.todoText);
    setShowModal(true);
  }

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
        color: isDarkMode ? "#fff" : "#000",
        minHeight: "100vh",
        padding: "2rem",
        transition: "0.3s",
        overflowX: "hidden",
      }}
    >
      {/* === ธีม === */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setIsDarkMode((d) => !d)}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* === Header & Add Button === */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2.2rem" }}>TODO APP</h1>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          ➕ Add Task
        </button>
      </header>

      {/* === Owner List === */}
      <section style={{ margin: "2rem 0" }}>
        <h2>🧑‍🏫 Owner List</h2>
        {owners.map((o) => (
          <div
            key={o.id}
            style={{
              padding: "0.5rem",
              background: isDarkMode ? "#2c2c2c" : "#eee",
              margin: "0.5rem 0",
              borderRadius: "6px",
            }}
          >
            <strong>{o.name}</strong> &nbsp;|&nbsp; {o.courseId} / {o.section}
          </div>
        ))}
      </section>

      {/* === Modal === */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: isDarkMode ? "#1e1e1e" : "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: 400,
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {mode === "ADD" ? "Add New Task" : "Edit Task"}
            </h3>
            <input
              type="text"
              value={inputText}
              onChange={handleChange}
              placeholder="Task detail"
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.75rem",
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              style={{ marginBottom: "0.75rem" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: "0.5rem 1rem", borderRadius: "6px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  backgroundColor: "#28A745",
                  color: "#fff",
                  border: "none",
                }}
              >
                {mode === "ADD" ? "Submit" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Todo List === */}
      <main style={{ marginTop: "2rem" }}>
        {todos.map((item, idx) => {
          const { date, time } = (() => {
            const dt = dayjs(item.createdAt);
            return { date: dt.format("D/MM/YY"), time: dt.format("HH:mm") };
          })();
          return (
            <div
              key={item.id}
              style={{
                background: isDarkMode ? "#1f1f1f" : "#eee",
                padding: "0.75rem",
                borderRadius: "6px",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div>({idx + 1})</div>
              <div>📅 {date}</div>
              <div>⏰ {time}</div>
              <div style={{ flex: 1 }}>📰 {item.todoText}</div>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt="task"
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              )}
              <button
                onClick={() => handleEdit(item)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                🗑️
              </button>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;
