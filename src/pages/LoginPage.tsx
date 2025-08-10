import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  // ✅ Hooks ต้องอยู่ในคอมโพเนนต์
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize navigate hook

  // Mock login credentials for testing
  const mockCredentials = {
    username: "test",
    password: "1234",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      formData.username === mockCredentials.username &&
      formData.password === mockCredentials.password
    ) {
      try {
        console.log("Login attempt:", formData);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("Login successful!");
        navigate("/home");
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  // ✅ คำนวณตัวแปรธีมจาก isDarkMode ภายในคอมโพเนนต์
  const baseBg = isDarkMode
    ? "linear-gradient(135deg, #0c0f14 0%, #121826 40%, #1b2a41 100%)"
    : "linear-gradient(135deg, #fdfcff 0%, #f1f6ff 40%, #eaf6ff 100%)";
  const glassBg = isDarkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(255,255,255,0.7)";
  const borderCol = isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const textSoft = isDarkMode ? "#cfd8ff" : "#455a64";
  const cardBg = isDarkMode ? "#141a26" : "#ffffff";

  return (
    <>
      <style>{`
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: ${baseBg};
}

/* Page Container */
.page-container {
  min-height: 100vh;
  background: ${baseBg};
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  padding: 5rem 2rem 0rem 2rem;
  text-align: center;
}

.app-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.app-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.app-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 2rem 3rem 2rem;
}

.login-card {
  background: ${glassBg};
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
  border: 1px solid ${borderCol};
}

.login-title {
  text-align: center;
  color: ${textSoft};
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: ${textSoft};
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.75rem 1rem;
  background-color: ${isDarkMode ? "#0c0f14" : "#f8fafc"};
  border: 2px solid ${borderCol};
  border-radius: 0.75rem;
  font-size: 1rem;
  color: ${textSoft};
  transition: all 0.2s ease;
  width: 100%;
}

.form-input::placeholder {
  color: #94a3b8;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background-color: ${isDarkMode ? "#141a26" : "#ffffff"};
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-button {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .app-header { padding: 2rem 1rem 3rem 1rem; }
  .app-title { font-size: 2.5rem; }
  .app-icon { width: 3rem; height: 3rem; font-size: 1.5rem; }
  .main-content { padding: 0 1rem 2rem 1rem; }
  .login-card { padding: 2rem; }
  .login-title { font-size: 1.75rem; }
}

@media (max-width: 480px) {
  .app-header { padding: 1.5rem 1rem 2rem 1rem; }
  .app-title-wrapper { flex-direction: column; gap: 0.75rem; }
  .app-title { font-size: 2rem; }
  .login-card { padding: 1.5rem; }
}
      `}</style>

      <div className="page-container">
        <header className="app-header">
          <div className="app-title-wrapper">
            <div className="app-icon">📝</div>
            <h1 className="app-title">I like this</h1>
          </div>
        </header>

        <main className="main-content">
          <div
            className="login-card"
            style={{ background: glassBg, borderColor: borderCol }}
          >
            <h2 className="login-title">Login</h2>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Type your username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Type your Password"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading && <div className="loading-spinner" />}
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* ปุ่มสลับโหมด (ถ้าต้องการ) */}
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setIsDarkMode((v) => !v)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: `1px solid ${borderCol}`,
                  background: cardBg,
                  color: textSoft,
                  cursor: "pointer",
                }}
              >
                Toggle {isDarkMode ? "Light" : "Dark"} Mode
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LoginPage;
