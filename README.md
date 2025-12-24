<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# College Management Website

A modern, full-stack College Management Website built with React (Vite) and Node.js (Express).

## 🚀 Features

- **Modern UI**: Built with Tailwind CSS, featuring gradients, animations, and glassmorphism
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **React Router**: Smooth client-side navigation
- **API Integration**: Backend REST API with course data
- **Pages**: Home, Admissions, Courses, Student Login

## 📁 Project Structure

```
College Website/
├── client/          # React frontend (Vite)
├── server/          # Express backend
```

## 🛠️ Setup & Installation

### Backend (Server)

```bash
cd server
npm install
npm run dev    # Start with nodemon (auto-reload)
```

Server runs on: `http://localhost:5000`

### Frontend (Client)

```bash
cd client
npm install
npm run dev    # Start Vite dev server
```

Application runs on: `http://localhost:5173`

## 📡 API Endpoints

### Get All Courses

```
GET /api/courses
```

Returns a list of all available courses with details (title, description, duration, instructor).

### Get Single Course

```
GET /api/courses/:id
```

Returns a specific course by ID.

## 🎨 Tech Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Google Fonts (Inter)

### Backend

- Node.js
- Express
- CORS

## 🌐 Pages

1. **Home** (`/`) - Hero section, features, stats, CTA
2. **Admissions** (`/admissions`) - Process timeline, requirements, important dates
3. **Courses** (`/courses`) - Course catalog with API data
4. **Student Login** (`/login`) - Authentication form

## 🔧 Configuration

### Vite Proxy

The frontend uses a Vite proxy to forward `/api/*` requests to the backend:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

### Tailwind Configuration

Custom colors, animations, and utilities configured in `tailwind.config.js`.

## 📝 Development

1. Start the backend server first
2. Then start the frontend development server
3. Navigate to `http://localhost:5173`
4. Test all pages and API integration

## 📦 Build for Production

### Frontend

```bash
cd client
npm run build     # Creates dist/ folder
npm run preview   # Preview production build
```

### Backend

```bash
cd server
npm start        # Production mode
```

## 📄 License

ISC
>>>>>>> 6d8561d5a5bf3653682b392064d3f62e986d726e
