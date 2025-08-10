import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TodoItem, OwnerItem } from "../types";
import {
  createOrUpdateWithUpload,
  getOwners,
  getTodos,
  patchTodoText,
  removeTodo,
} from "../services/api";
import ThemeToggle from "../components/ThemeToggle";
import OwnerList from "../components/OwnerList";
import SearchBar from "../components/SearchBar";
import TodoModal from "../components/TodoModal";
import TodoList from "../components/TodoList";
import ImageModal from "../components/ImageModal";
import { makePalette } from "../utils/ui";
import { useImageModal } from "../hooks/useImageModal";

export default function TodoPage() {
  // ----- state -----
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [owners, setOwnersState] = useState<OwnerItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchText, setSearchText] = useState("");

  // add/edit modal
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // image preview modal
  const imageModal = useImageModal();

  const navigate = useNavigate();
  const palette = makePalette(isDarkMode);

  // ----- effects -----
  useEffect(() => {
    refreshAll();
  }, []);

  async function refreshAll() {
    const [t, o] = await Promise.all([getTodos(), getOwners()]);
    setTodos(t);
    setOwnersState(o);
  }

  // ----- handlers -----
  const handleLogout = () => navigate("/");

  const startEdit = (todo: TodoItem) => {
    setMode("EDIT");
    setCurTodoId(todo.id);
    setInputText(todo.todoText);
    setShowModal(true);
    setImageFile(null); // ถ้าไม่เลือกไฟล์ คือ edit เฉพาะ text
  };

  const cancelEdit = () => {
    setMode("ADD");
    setInputText("");
    setCurTodoId("");
    setImageFile(null);
  };

  async function handleSubmit() {
    if (!inputText) return;

    try {
      if (mode === "EDIT" && !imageFile) {
        await patchTodoText({ id: curTodoId, todoText: inputText });
      } else {
        await createOrUpdateWithUpload({
          todoText: inputText,
          file: imageFile || undefined,
        });
      }

      cancelEdit();
      setShowModal(false);
      await refreshAll();
    } catch (err: any) {
      alert(err?.message || "Submit failed");
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeTodo(id);
      if (id === curTodoId) cancelEdit();
      await refreshAll();
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    }
  }

  return (
    <div
      style={{
        background: palette.baseBg,
        color: palette.isDark ? "#ffffff" : "#000000",
        minHeight: "100vh",
        margin: 0,
        padding: "2rem",
        transition: "all 0.3s ease-in-out",
        overflowX: "hidden",
      }}
    >
      <ThemeToggle
        isDark={isDarkMode}
        onToggle={() => setIsDarkMode(!isDarkMode)}
      />

      <header>
        <h1
          style={{
            marginBottom: "1.5rem",
            fontSize: "2.2rem",
            color: palette.isDark ? "#fff" : "#1a1a1a",
          }}
        >
          I LIKE THIS
        </h1>
      </header>

      <OwnerList owners={owners} palette={palette} onLogout={handleLogout} />

      <SearchBar
        value={searchText}
        onChange={setSearchText}
        onClear={() => setSearchText("")}
        palette={palette}
      />

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
            background: palette.isDark
              ? "linear-gradient(90deg,#38bdf8,#a78bfa)"
              : "linear-gradient(90deg,#0ea5e9,#7c3aed)",
            color: "#fff",
            border: `1px solid ${palette.borderCol}`,
            boxShadow: palette.isDark
              ? "0 10px 24px rgba(56,189,248,0.25)"
              : "0 10px 24px rgba(124,58,237,0.25)",
            cursor: "pointer",
          }}
        >
          ➕ Add Todo
        </button>
      </div>

      <TodoModal
        open={showModal}
        mode={mode}
        value={inputText}
        onChange={setInputText}
        onImageChange={setImageFile}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowModal(false);
          mode === "EDIT" ? cancelEdit() : setImageFile(null);
        }}
        palette={palette}
      />

      <ImageModal
        open={imageModal.isOpen}
        src={imageModal.src}
        alt={imageModal.alt}
        onClose={imageModal.close}
        palette={palette}
      />

      <main style={{ maxWidth: "900px", marginInline: "auto" }}>
        <TodoList
          todos={todos}
          searchText={searchText}
          palette={palette}
          onEdit={startEdit}
          onDelete={handleDelete}
          onImageClick={imageModal.open}
        />
      </main>
    </div>
  );
}
