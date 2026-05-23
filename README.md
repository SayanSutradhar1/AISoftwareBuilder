# 🚀 Architex

**Architex** is an AI-powered system design generator and project bootstrapper. It leverages local LLM inference (via Ollama) to ingest high-level developer prompt requirements and automatically synthesize them into detailed low-level software architecture specs, database schemas, APIs, deployment scripts, and complete interactive folder scaffolds.

---

## ✨ Features & Functionality

*   **🪄 Interactive Scaffold Wizard**: A premium, multi-step glassmorphic setup assistant enabling developers to input custom project names, service types, descriptions, data flows, and design preferences.
*   **📂 Visual Directory Tree Scaffolder**: Automatically generates interactive directory structure previews matching the customized spec.
*   **🛠️ Full-Stack Synthesizer**: Produces deep blueprints for:
    *   **Frontend**: UI components, styling strategies, routing setups, state management.
    *   **Backend**: API endpoints, ORM schemas, database choices, cron setups.
    *   **Security**: Authentication (JWT, OAuth), Role-Based Access Control (RBAC), and encryption parameters.
    *   **Deployment**: CI/CD pipelines, Dockerfiles, and hosting setup specs.
*   **💬 Real-Time AI Chat**: Fully-integrated sidebar chat module for live refinement, editing, and revision of generated software designs.
*   **⚙️ Project Settings & Soft Deletion**: High-tech project manager listing all system blueprints, with a premium glassmorphic "Danger Zone" offering soft deletion powered by an animated consent confirmation modal.

---

## 💻 Tech Stack & Architecture

### Frontend (`/client`)
*   **Framework & Bundler**: React 18, TypeScript, Vite
*   **Styling & Icons**: Tailwind CSS, Lucide React
*   **Animations**: Framer Motion
*   **Design Language**: Sleek glassmorphic theme with glowing borders and vibrant dark-mode highlights.

### Backend (`/asb-web-builder-service`)
*   **Framework**: NestJS (TypeScript)
*   **Database**: MongoDB & Mongoose ORM
*   **AI Engine**: Ollama (Local LLM Integration)

---

## 📂 Repository Structure

```bash
Architex/
├── client/                     # React + Vite Frontend application
├── asb-web-builder-service/    # NestJS Backend API service
├── GEMINI.md                   # Collaborative session context & memory rules
├── package.json                # Root startup scripts
└── README.md                   # Project documentation (this file)
```

---

## 🛠️ Getting Started & Run Instructions

### Prerequisites
1.  **Node.js** (v18 or higher recommended)
2.  **MongoDB** (running locally or via Atlas connection string in backend configuration)
3.  **Ollama** (installed and running locally with your chosen model, e.g., `llama3` or `mistral`)

---

### Running the Project

#### Option A: Running from the Root Workspace
You can spin up both components directly using the workspace-level convenience scripts in the root `package.json`:

*   **Start the Frontend**:
    ```bash
    npm run client
    ```
*   **Start the Backend**:
    ```bash
    npm run web
    ```

*Note: If you have updated the frontend folder name from `asb-frontend` to `client`, make sure your root `package.json` reflects the change.*

---

#### Option B: Running Directories Individually

##### 1. Backend Setup (`/asb-web-builder-service`)
1.  Navigate into the directory:
    ```bash
    cd asb-web-builder-service
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables (create a `.env` if required with your port and MongoDB URI).
4.  Run the application in development mode:
    ```bash
    npm run start:dev
    ```

##### 2. Frontend Setup (`/client`)
1.  Navigate into the directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open the local address printed in the terminal (usually `http://localhost:5173`) in your browser to experience the dashboard.
