# NestHub - Apartment Management System

## Overview

The Apartment Management System (APMS) is a full-stack MERN application that I developed to simplify the day-to-day management of apartment communities. The system provides separate interfaces for administrators and residents, allowing them to manage complaints, visitors, notices, and apartment-related information through a secure, role-based platform.

---

## Features

### Authentication
- Secure user authentication using JWT
- Role-based access control for Admin and Resident users
- Protected API routes

### Admin
- Manage residents and apartment flats
- View and update complaint status
- Create and manage notices
- View visitor records
- Access dashboard statistics

### Resident
- Register complaints
- Track complaint status
- View apartment notices
- View visitor information
- Access a personalized dashboard

### Maintenance
- Register and manage maintenance requests
- Track the status of maintenance issues
- Maintain apartment-related service records

### Security
- Secure login with JWT authentication
- Protected routes and role-based authorization
- Visitor record management for improved apartment security

---

## Technology Stack

### Frontend
- React.js
- React Router
- Context API
- Axios

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication

### Database
- MongoDB
- Mongoose

---

## Project Structure

```text
APMS/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/<your-github-username>/Apartment-Management-System.git
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create a `config.env` file inside the `backend/config` directory.

```env
PORT=
MONGO_URI=
JWT_SECRET=
```

### 5. Run the backend

```bash
cd backend
npm start
```

### 6. Run the frontend

```bash
cd frontend
npm run dev
```

---

## Screenshots

### Login Page

![Login Page](screenshots/login.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

### Resident Dashboard

![Resident Dashboard](screenshots/resident-dashboard.png)

### Security Dashboard

![Security Dashboard](screenshots/security-dashboard.png)

### Maintenance Dashboard

![Maintenance Dashboard](screenshots/maintenance-dashboard.png)

---

## Future Improvements

- Online maintenance payment integration
- Email notifications
- Push notifications
- Document upload support
- Mobile responsiveness improvements
- Analytics dashboard

---

## What I Learned

Through this project, I gained practical experience in:

- Building REST APIs using Express.js
- Developing frontend applications with React
- Implementing JWT-based authentication and authorization
- Designing MongoDB databases with Mongoose
- Managing application state and routing
- Building a complete full-stack MERN application

---

## Author

**Aadhithya Pattabiraman**
