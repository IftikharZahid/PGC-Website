# PGC Website - College Management System

A comprehensive, full-stack web application designed for the Punjab Group of Colleges (PGC). This system integrates public informational pages with robust portals for Students, Teachers, and Administrators.

## 🚀 Features

### 🌐 Public Website
- **Home**: Dynamic landing page with news, events, and announcements.
- **Informational Pages**: About Us, Admissions (Fall 2025), Programs (FSc, ICS, ICom, FA), Faculty, Campus Life.
- **Resources**: News, Events, Seminars, Research Breakthroughs, Career Services.
- **Legal**: Privacy Policy, Terms of Service, Accessibility.

### 👨‍🎓 Student Portal
- **Dashboard**: Overview of academic progress and announcements.
- **Academics**: Access to Timetable, Academic Calendar, and Course Syllabuses.
- **Results**: Detailed view of exam results and grades.
- **Digital Library**: Access to Video Lectures and other learning resources.
- **Profile**: Personal student information.

### 👩‍🏫 Teacher Portal
- **Dashboard**: Quick stats on assigned classes and pending tasks.
- **Class Management**: Manage schedules and student lists.
- **Attendance**: Mark and view student attendance.
- **Assignments**: Upload and grade student assignments.
- **Results**: Upload and manage student marks.

### 🛡️ Admin Dashboard
- **User Management**: Create/Edit/Delete Students and Teachers.
- **Academic Management**: Manage Courses, Attendance, Results, and Admissions.
- **Financials**: Manage Fees and Staff Salaries.
- **Content Management**: Update Gallery, Announcements, Notifications, and Video Lectures.
- **Settings**: System-wide configuration (e.g., Maintenance Mode).

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Routing**: React Router DOM v6+
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom configuration with gradients, glassmorphism)
- **Icons**: Lucide React
- **State Management**: React Context API (Auth, Theme, Admin)

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Security**: Helmet, XSS-Clean, HPP, Express Rate Limit, BCryptJS (Password Hashing)
- **Authentication**: JWT (JSON Web Tokens) not fully implemented yet, currently session/token based via Context.

## 📂 Project Structure

```
PGC Website/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (Auth, Theme)
│   │   ├── pages/          # Application routes/pages
│   │   │   ├── admin/      # Admin portal pages
│   │   │   ├── teacher/    # Teacher portal pages
│   │   │   └── ...         # Public & Student pages
│   │   └── ...
│   └── ...
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose schemas (Student, Teacher, etc.)
│   ├── routes/             # API Endpoints
│   ├── utils/              # Helper functions
│   └── ...
├── MIGRATION_GUIDE.md      # Instructions for moving to a new machine
├── setup_and_run.bat       # One-click Windows setup script
└── README.md              # Project Documentation
```

## 🔧 Setup & Installation

### Option 1: Automated (Windows)
1.  Ensure **Node.js** and **MongoDB** are installed.
2.  Run the **`setup_and_run.bat`** script in the root folder.
3.  This will install dependencies and start both the client and server.

### Option 2: Manual Setup

1.  **Backend Setup**:
    ```bash
    cd server
    npm install
    npm start
    ```
    *Server runs on port 5000.*

2.  **Frontend Setup**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
    *Client runs on port 5173.*

## ⚙️ Environment Configuration

The backend requires a `.env` file in the `server` directory.

```env
PORT=5000
MONGODB_URI=mongodb+srv://... (or mongodb://localhost:27017/pgc-website)
NODE_ENV=development
```

## 📜 Scripts

**Root Directory:**
- `setup_and_run.bat`: Full automated setup.

**Client (`/client`):**
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview production build.

**Server (`/server`):**
- `npm start`: Start production server.
- `npm run dev`: Start development server (requires `nodemon`).
- `node seed_students.js`: Populate database with dummy student data.

## 👤 Developer Info

**Lead Developer**: Iftikhar Zahid  
**Email**: IftikharXahid@gmail.com  
**License**: ISC