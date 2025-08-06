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

  useEffect(() => {
    fetchData();
    fetchOwners();
  }, []);

  async function fetchOwners() {
    try {
      const res = await axios.get<OwnerItem[]>("/api/todo/owner");
      console.log("📦 Owners:", res.data);
      setOwners(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch owner list", err);
    }
  }

  async function fetchData() {
    const res = await axios.get<TodoItem[]>("api/todo");
    setTodos(res.data);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  function handleSubmit() {
    if (!inputText) return;
    if (mode === "ADD") {
      axios
        .request({
          url: "/api/todo",
          method: "put",
          data: { todoText: inputText },
        })
        .then(() => {
          setInputText("");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    } else {
      axios
        .request({
          url: "/api/todo",
          method: "patch",
          data: { id: curTodoId, todoText: inputText },
        })
        .then(() => {
          setInputText("");
          setMode("ADD");
          setCurTodoId("");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    }
  }

  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { id } })
      .then(fetchData)
      .then(() => {
        setMode("ADD");
        setInputText("");
      })
      .catch((err) => alert(err));
  }

  function handleCancel() {
    setMode("ADD");
    setInputText("");
    setCurTodoId("");
  }

  return (
    <div
      className="container"
      style={{
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
        color: isDarkMode ? "#ffffff" : "#000000",
        minHeight: "100vh",
        margin: 0,
        padding: "2rem",
        transition: "all 0.3s ease-in-out",
        overflowX: "hidden",
      }}
    >
      {/* 🔄 ปุ่มเปลี่ยนธีม */}
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

      {/* 👇 ส่วน Header */}
      <header>
        <h1
          style={{
            marginBottom: "1.5rem",
            fontSize: "2.2rem",
            color: isDarkMode ? "#fff" : "#1a1a1a", // ✅ เพิ่มเงื่อนไขสี
          }}
        >
          TODO APP
        </h1>
      </header>

      {/* 👨‍🏫 Owner List */}
      <section
        style={{
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: isDarkMode
            ? "0 4px 12px rgba(255,255,255,0.05)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
          marginBottom: "2rem",
          maxWidth: "900px",
          marginInline: "auto",
        }}
      >
        <h2
          style={{
            marginBottom: "1rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          🧑‍🏫 <span>Owner List</span>
        </h2>

        {owners.length === 0 ? (
          <p
            style={{ fontStyle: "italic", color: isDarkMode ? "#aaa" : "#666" }}
          >
            No owners found.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {owners.map((owner) => (
              <div
                key={owner.id}
                style={{
                  backgroundColor: isDarkMode ? "#2c2c2c" : "#f7f7f7",
                  padding: "0.75rem 1rem",
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
                      color: isDarkMode ? "#ccc" : "#555",
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
                    color: isDarkMode ? "#bbb" : "#888",
                  }}
                >
                  ⏰ {dayjs(owner.createdAt).format("DD MMM YYYY, HH:mm")}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 📋 Todo Input & List */}
      <main style={{ maxWidth: "900px", marginInline: "auto" }}>
        <div style={{ display: "flex", alignItems: "start" }}>
          <input
            type="text"
            onChange={handleChange}
            value={inputText}
            data-cy="input-text"
            placeholder="Add your task..."
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginRight: "0.5rem",
              flex: 1,
              backgroundColor: isDarkMode ? "#222" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
          />
          <button
            onClick={handleSubmit}
            data-cy="submit"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {mode === "ADD" ? "Submit" : "Update"}
          </button>
          {mode === "EDIT" && (
            <button
              onClick={handleCancel}
              className="secondary"
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                backgroundColor: "#ccc",
                border: "none",
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <div data-cy="todo-item-wrapper" style={{ marginTop: "1rem" }}>
          {todos.sort(compareDate).map((item, idx) => {
            const { date, time } = formatDateTime(item.createdAt);
            return (
              <article
                key={item.id}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  backgroundColor: isDarkMode ? "#1f1f1f" : "#eee",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                }}
              >
                <div>({idx + 1})</div>
                <div>📅{date}</div>
                <div>⏰{time}</div>
                <div data-cy="todo-item-text">📰{item.todoText}</div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setMode("EDIT");
                    setCurTodoId(item.id);
                    setInputText(item.todoText);
                  }}
                  data-cy="todo-item-update"
                >
                  {curTodoId !== item.id ? "🖊️" : "✍🏻"}
                </div>
                {mode === "ADD" && (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                    data-cy="todo-item-delete"
                  >
                    🗑️
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;

function formatDateTime(dateStr: string) {
  if (!dayjs(dateStr).isValid()) {
    return { date: "N/A", time: "N/A" };
  }
  const dt = dayjs(dateStr);
  const date = dt.format("D/MM/YY");
  const time = dt.format("HH:mm");
  return { date, time };
}

function compareDate(a: TodoItem, b: TodoItem) {
  const da = dayjs(a.createdAt);
  const db = dayjs(b.createdAt);
  return da.isBefore(db) ? -1 : 1;
}
