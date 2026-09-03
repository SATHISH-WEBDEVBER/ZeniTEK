# ZeniTEK Solar Thermal Solutions

Production-Ready MERN Stack Application for ZeniTEK Solar Thermal Solutions.

## 🚀 Features

- **Frontend**: Built with React, Vite, and Tailwind CSS.
- **Backend**: Node.js & Express REST API with MongoDB integration.
- **Modules**: Lead Management, Farmer Stories, Interactive Map Component, About Us, and Services.

## 🛠️ Project Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB connection string (set in `backend/.env`)

### Installation & Running Locally

1. **Install Dependencies**:
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend && npm install

   # Install frontend dependencies
   cd ../frontend && npm install
   ```

2. **Run Backend Development Server**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Run Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Run Both (from root)**:
   ```bash
   npm run backend
   npm run frontend
   ```

## 📁 Repository Structure

```
ZeniTEK/
├── backend/            # Express Server, Models, Routes
├── frontend/           # Vite + React UI, Pages, Components
├── .gitignore          # Ignored files (node_modules, env, dist)
├── package.json        # Root package manifest
└── README.md           # Project Documentation
```
