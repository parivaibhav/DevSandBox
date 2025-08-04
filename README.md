# 🧪 DevSandbox – Web Code Runner (MERN Stack)

DevSandbox is a full-stack web-based HTML/CSS/JS editor built with the MERN stack. It allows users to write, preview, save, and load code snippets in real time, with features like live console output, file management, and Google login.

---

## ✨ Features

- 🖥️ Monaco code editor for HTML, CSS, JavaScript
- 🌐 Live preview with jQuery & Bootstrap support
- 🧩 Console output panel (`console.log`, `console.warn`, `console.error`)
- 💡 Theme toggle: Light & Dark mode (auto-detect + switch)
- 💾 Save/load/delete code files (MongoDB)
- 🔐 Google Sign-In authentication (JWT protected)
- 🧑‍💻 Guest access with limited features
- 📦 Download code as `.zip`
- 🗂️ File explorer for managing saved files
- 🔁 Reset & Load prebuilt examples

---

## 🔧 Tech Stack

**Frontend**:
- React + Vite
- Zustand (state management)
- Tailwind CSS
- Monaco Editor
- React Icons
- Google OAuth

**Backend**:
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- CORS + dotenv