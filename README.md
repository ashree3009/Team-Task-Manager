# Team Task Manager

A complete full-stack project management and task tracking application built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Features
- **Authentication**: JWT-based login/signup with role-based access control (Admin, Member).
- **Projects**: Admins can create and manage projects.
- **Tasks**: Tasks can be assigned to team members, tracked by status (Todo, In Progress, Completed), priority, and due date.
- **Dashboard**: Modern chart visualizations (using Recharts) for task statistics.
- **Modern UI**: Clean and responsive user interface built with Tailwind CSS.

## Tech Stack
- Frontend: React.js (Vite), Tailwind CSS, React Router, Recharts, Axios, React Hot Toast
- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file from .env.example
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Usage
- Create an account using the Signup page.
- Select `Admin` role to be able to create projects.
- Use the Dashboard to track progress.

## API Documentation
The API provides resources for Auth, Projects, and Tasks. Check the `backend/routes` folder for the complete listing of available endpoints.
