# Team Task Manager

A complete full-stack project management and task tracking application built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

---

## Features

- **Authentication**: JWT-based login/signup with role-based access control (Admin, Member).
- **Projects**: Admins can create and manage projects.
- **Tasks**: Tasks can be assigned to team members, tracked by status (Todo, In Progress, Completed), priority, and due date.
- **Dashboard**: Modern chart visualizations (using Recharts) for task statistics.
- **Modern UI**: Clean and responsive user interface built with Tailwind CSS.
- **Protected Routes**: Secure frontend and backend routes.
- **REST APIs**: Fully functional backend APIs for authentication, projects, and tasks.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **MongoDB Atlas Integration**: Cloud database support.
- **Deployment Ready**: Frontend deployed on Vercel and backend deployed on Render.

---

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt.js

---

## Live Demo

### Frontend
```bash
https://team-task-manager-s.vercel.app/
```

### Backend API
```bash
https://team-task-manager-sv2i.onrender.com
```

---

## Folder Structure

```bash
    team-task-manager/
    │
    ├── backend/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── server.js
    │   └── package.json
    │
    ├── frontend/
    │   ├── src/
    │   ├── .env
    │   └── package.json
    │
    └── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas URI or local MongoDB instance

---

# Backend Setup

```bash
cd backend
npm install
```

### Create `.env` file

```env
PORT=8000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

NODE_ENV=development
```

### Start Backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
```

### Create `.env` file

```env
VITE_API_URL=http://localhost:8000/api
```

### Start Frontend

```bash
npm run dev
```

---

## Usage

- Create an account using the Signup page.
- Select the `Admin` role to create and manage projects.
- Assign tasks to members and track task progress.
- Use the Dashboard to monitor project statistics and overdue tasks.

---

## API Documentation

The API provides resources for:
- Authentication
- Projects
- Tasks

Check the `backend/routes` folder for complete endpoint definitions.

---

## Authentication Features

- JWT-based Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Access Control
- Persistent Login using Local Storage

---

## Roles & Permissions

### Admin
- Create/Edit/Delete Projects
- Assign Tasks
- Manage Team Members
- View Dashboard Statistics

### Member
- View Assigned Tasks
- Update Task Status
- Access Personal Dashboard

---

## Deployment

### Frontend Deployment
- Platform: Vercel

### Backend Deployment
- Platform: Render

### Database
- MongoDB Atlas

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
NODE_ENV=production
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Future Improvements

- Real-time notifications using Socket.io
- Drag & Drop Kanban Board
- Team Chat
- File Uploads
- Dark Mode
- Email Notifications

---

## License

This project is licensed under the MIT License.

---

## Author

Shree Singal
