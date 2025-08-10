import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "../types";
import dayjs from "dayjs";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [owner, setOwner] = useState<any>(null);
  const [inputText, setInputText] = useState("");

  // Search
  const [searchText, setSearchText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");

  // Image handling (data URL flow for no-multer backend)
  const [selectedImageDataUrl, setSelectedImageDataUrl] = useState<
    string | null | undefined
  >(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Image Modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>("");
  const [modalImageAlt, setModalImageAlt] = useState<string>("Todo Image"); // <-- เพิ่มตัวแปรนี้

  const navigate = useNavigate();

  // --------- Fetchers ----------
  async function fetchData() {
    const res = await axios.get<TodoItem[]>("/api/todo");
    setTodos(res.data);
  }

  async function fetchOwner() {
    const res = await axios.get("/api/todo/owner");
    setOwner(res.data);
  }

  useEffect(() => {
    fetchData();
    fetchOwner();
  }, []);

  // --------- Auth/UI ----------
  const handleLogout = () => {
    navigate("/");
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  // --------- Search ----------
  const filteredTodos = todos.filter((todo) => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();

    const d = dayjs(todo.createdAt);
    const formattedDate = d.format("YYYY-MM-DD");
    const formattedTime = d.format("HH:mm");

    return (
      todo.todoText.toLowerCase().includes(searchLower) ||
      formattedDate.includes(searchLower) ||
      formattedTime.includes(searchLower)
    );
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  function clearSearch() {
    setSearchText("");
    setIsSearchOpen(false);
  }

  function toggleSearch() {
    setIsSearchOpen((v) => !v);
    if (isSearchOpen) setSearchText("");
  }

  // --------- Image (file -> dataURL) ----------
  async function fileToCompressedDataURL(
    file: File,
    maxW = 1280,
    maxH = 1280,
    quality = 0.8
  ): Promise<string> {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    // คงอัตราส่วนภาพ
    const scale = Math.min(maxW / width, maxH / height, 1);
    width = Math.round(width * scale);
    height = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, width, height);

    // ใช้ image/jpeg หรือ image/webp จะเล็กกว่า png มาก
    return canvas.toDataURL("image/jpeg", quality); // 0..1
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // บีบอัด/ย่อ ก่อนเซ็ตเป็น data URL
    fileToCompressedDataURL(file, 1280, 1280, 0.8).then((dataUrl) => {
      setSelectedImageDataUrl(dataUrl);
      setImagePreview(dataUrl);
    });
  }

  // กดลบรูปในฟอร์ม
  function removeImage() {
    setSelectedImageDataUrl(null);
    setImagePreview(null);
  }

  // --------- Image Modal ----------
  function openImageModal(imageSrc: string, imageAlt: string = "Todo Image") {
    if (!imageSrc) return; // ถ้าไม่มี imageSrc ให้ไม่ทำอะไร
    setModalImageSrc(imageSrc); // ตั้งค่า modalImageSrc ให้เป็น URL หรือ Data URL ที่แท้จริง
    setModalImageAlt(imageAlt); // ตั้งค่า modalImageAlt เป็นคำบรรยายของภาพ
    setIsImageModalOpen(true); // เปิดโมดัล
  }

  function closeImageModal() {
    setIsImageModalOpen(false);
    setModalImageSrc("");
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isImageModalOpen) closeImageModal();
    }
    if (isImageModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isImageModalOpen]);

  // --------- Submit (JSON, no FormData) ----------
  async function handleSubmit() {
    if (!inputText.trim()) return;

    try {
      if (mode === "ADD") {
        const payload: any = { todoText: inputText.trim() };
        // ถ้า user เลือกรูปใหม่ -> แนบ image เป็น data URL
        if (
          typeof selectedImageDataUrl === "string" &&
          selectedImageDataUrl.length > 0
        ) {
          payload.image = selectedImageDataUrl;
        }
        await axios.put("/api/todo", payload);
      } else {
        const payload: any = { id: curTodoId, todoText: inputText.trim() };
        // แก้ไขรูป:
        // - string => รูปใหม่ (data URL)
        // - null => ลบรูป
        // - undefined => ไม่เปลี่ยนรูป
        if (selectedImageDataUrl === null) {
          payload.image = null;
        } else if (
          typeof selectedImageDataUrl === "string" &&
          selectedImageDataUrl.length > 0
        ) {
          payload.image = selectedImageDataUrl;
        }
        await axios.patch("/api/todo", payload);
      }

      // รีเซ็ตฟอร์ม
      setInputText("");
      setMode("ADD");
      setCurTodoId("");
      setSelectedImageDataUrl(undefined); // กลับสู่สถานะ "ไม่เปลี่ยนรูป"
      setImagePreview(null);

      // reload
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Error");
    }
  }

  // --------- Delete ----------
  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { id } })
      .then(fetchData)
      .then(() => {
        setMode("ADD");
        setInputText("");
        setCurTodoId("");
        setSelectedImageDataUrl(undefined);
        setImagePreview(null);
      })
      .catch((err) =>
        alert(err?.response?.data?.message || err.message || "Error")
      );
  }

  // --------- Cancel ----------
  function handleCancel() {
    setMode("ADD");
    setInputText("");
    setCurTodoId("");
    setSelectedImageDataUrl(undefined);
    setImagePreview(null);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title-wrapper">
          <div className="app-icon">📝</div>
          <h1 className="app-title">Todo App</h1>
        </div>
      </header>

      <main className="main-content">
        {/* Owner Information Card */}
        <aside>
          {owner && (
            <div className="owner-card">
              <div className="owner-card-header">
                <div className="owner-card-icon">👤</div>
                <h2 className="owner-card-title">Personal Information</h2>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
              <div className="owner-card-body">
                <div className="owner-info-item">
                  <div className="info-badge id">ID</div>
                  <div className="info-content">
                    <div className="info-label">Student Code</div>
                    <div className="info-value">{owner.id}</div>
                  </div>
                </div>
                <div className="owner-info-item">
                  <div className="info-badge name">👨‍🎓</div>
                  <div className="info-content">
                    <div className="info-label">Fullname</div>
                    <div className="info-value">{owner.name}</div>
                  </div>
                </div>
                <div className="owner-info-item">
                  <div className="info-badge course">📚</div>
                  <div className="info-content">
                    <div className="info-label">Course ID</div>
                    <div className="info-value">{owner.course_id}</div>
                  </div>
                </div>
                <div className="owner-info-item">
                  <div className="info-badge section">🏫</div>
                  <div className="info-content">
                    <div className="info-label">Section</div>
                    <div className="info-value">{owner.section}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Todo Section */}
        <section className="todo-section">
          <div className="input-card">
            <div className="input-label">
              <span>{mode === "ADD" ? "➕" : "✏️"}</span>
              {mode === "ADD" ? "Add Todo List" : "Edit Todo"}
            </div>
            <div className="input-group">
              <div className="text-input-row">
                <input
                  type="text"
                  className="text-input"
                  value={inputText}
                  onChange={handleChange}
                  placeholder="Type your todo item..."
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              {/* Image Upload Section */}
              <div className="image-upload-section">
                <label className="image-upload-label">
                  📷 Add Image (Optional)
                </label>
                <div className="image-upload-container">
                  <div className="image-upload-input">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                  </div>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="remove-image-btn"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!inputText.trim()}
                >
                  {mode === "ADD" ? "Add" : "Update"}
                </button>
                {mode === "EDIT" && (
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="todo-list-card">
            <div className="todo-list-header">
              <div className="header-left">
                <span>📋</span>
                <h3 className="todo-list-title">
                  Todo Lists ({filteredTodos.length}
                  {searchText && ` of ${todos.length}`})
                </h3>
                {searchText && (
                  <div className="search-results-badge">Filtered</div>
                )}
              </div>
              <div className="header-right">
                {isSearchOpen && (
                  <div className="header-search-container">
                    <span className="header-search-icon">🔍</span>
                    <input
                      type="text"
                      className="header-search-input"
                      value={searchText}
                      onChange={handleSearchChange}
                      placeholder="Search todos..."
                      autoFocus
                    />
                    {searchText && (
                      <button
                        className="header-clear-btn"
                        onClick={clearSearch}
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
                <button
                  className={`search-toggle-btn ${
                    isSearchOpen ? "active" : ""
                  }`}
                  onClick={toggleSearch}
                  title={isSearchOpen ? "Close search" : "Search todos"}
                >
                  {isSearchOpen ? "✕" : "🔍"}
                </button>
              </div>
            </div>

            <div className="todo-list-body">
              {filteredTodos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{searchText ? "🔍" : "📝"}</div>
                  <div className="empty-title">
                    {searchText ? "No Results Found" : "Nothing Here..."}
                  </div>
                  <div className="empty-description">
                    {searchText
                      ? `No todos match "${searchText}"`
                      : "Start by adding a new todo"}
                  </div>
                </div>
              ) : (
                filteredTodos.map((item, index) => {
                  const isEditing = curTodoId === item.id;
                  const d = dayjs(item.createdAt);
                  const formattedDate = d.format("YYYY-MM-DD");
                  const formattedTime = d.format("HH:mm");

                  return (
                    <div
                      key={item.id}
                      className={`todo-item ${isEditing ? "editing" : ""}`}
                    >
                      <div className="todo-number">{index + 1}</div>

                      {/* Todo Image */}
                      <div
                        className="todo-image-container"
                        onClick={() => openImageModal(item.imageUrl || "")}
                      >
                        {item.imageUrl ? (
                          <div className="todo-image">
                            <img src={item.imageUrl} alt="Todo" />
                          </div>
                        ) : (
                          <div className="todo-image-placeholder">🖼️</div>
                        )}
                      </div>

                      <div className="todo-content">
                        <div className="todo-text">{item.todoText}</div>
                        <div className="todo-meta">
                          <span>📅 {formattedDate}</span>
                          <span>🕐 {formattedTime}</span>
                        </div>
                      </div>

                      <button
                        className={`action-btn edit-btn ${
                          mode === "EDIT" ? "active" : ""
                        }`}
                        onClick={() => {
                          setMode("EDIT");
                          setCurTodoId(item.id);
                          setInputText(item.todoText);

                          // Show the image preview in editing mode, but don't change it
                          setImagePreview(item.imageUrl || null);
                          setSelectedImageDataUrl(undefined); // undefined = unchanged
                        }}
                      >
                        {mode === "EDIT" ? "✍️" : "✏️"}
                      </button>

                      {mode === "ADD" && (
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal-close"
              onClick={closeImageModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <div className="image-modal-image-container">
              <img
                src={modalImageSrc}
                alt="Todo"
                className="image-modal-image"
              />
            </div>
            <div className="image-modal-caption">{modalImageAlt}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
