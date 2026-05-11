# 📄 Offer Letter Generator

> A Full-Stack Automated Offer Letter Generation Platform

The **Offer Letter Generator** is a full-stack application designed to automate offer letter creation using manual forms and Excel file uploads.

It simplifies the process of generating offer letters by reducing manual work, improving consistency, and allowing HR teams to quickly generate and manage employee offer documents.

The platform supports secure authentication, PDF generation, Excel-based bulk processing, email integration, and database-driven offer letter management.

---

# 🚀 Key Highlights

- 🔐 JWT-based Authentication
- 📄 Automated Offer Letter Generation
- 📊 Excel File Upload Support
- 📥 PDF Download Functionality
- 📧 Email Integration
- 🗄️ PostgreSQL Database Integration
- ⚡ FastAPI Backend Services
- 🎨 Modern React Frontend

---

# 🏗️ System Architecture

    Frontend (React + Vite)
            │
            ▼
    Backend API (FastAPI)
            │
            ├── PostgreSQL (Database)
            ├── PDF Generation Service
            └── Email Service

The project follows a modular architecture separating frontend, backend, database, and document generation services for maintainability and scalability.

---

# ✨ Features

## 👨‍💼 HR / Admin

- Generate offer letters using forms
- Generate offer letters using Excel uploads
- Download generated PDFs
- Manage generated offer letters
- Secure login authentication
- Password reset functionality

## 📄 Offer Letter System

- Dynamic offer letter generation
- PDF creation and download
- Excel bulk processing support
- Salary breakdown generation
- Template-based document generation

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Python FastAPI |
| Database | PostgreSQL |
| Authentication | JWT |
| ORM | SQLAlchemy |
| PDF Generation | Python Document Services |
| Excel Processing | Pandas / OpenPyXL |

---

# 📂 Project Structure

    OfferLetter-Generator
    │
    ├── frontend/
    │   └── react/              # React Frontend Application
    │
    ├── backend/                # FastAPI Backend Application
    │
    └── README.md

---

# ⚙️ Environment Configuration

The project uses environment variables for configuration.

A template file `.env.example` is already provided in the repository.

---

## Frontend Environment Variables

Create a `.env` file inside:

```bash
frontend/react/
```

Add:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## Backend Environment Variables

Create a `.env` file inside:

```bash
backend/
```

Add:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email Configuration

SMTP_SERVER=your_smtp_server
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=your_email@example.com

FRONTEND_URL=http://localhost:5173
```

---

# 🗄️ Database Setup (PostgreSQL)

1. Install PostgreSQL and pgAdmin
2. Create a database
3. Configure database credentials inside `.env`
4. Ensure PostgreSQL service is running

Example Database Name:

```text
olg_2026
```

---

# 🚀 Running the Project Locally

## 1️⃣ Clone Repository

```bash
git clone https://github.com/SamChrstopher/offer-letter-generator.git

cd offer-letter-generator
```

---

# 🖥️ Frontend Setup

## 2️⃣ Navigate to Frontend Directory

```bash
cd frontend/react
```

## 3️⃣ Install Frontend Dependencies

```bash
npm install
```

## 4️⃣ Start Frontend Server

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

Open a new terminal window.

## 5️⃣ Navigate to Backend Directory

```bash
cd backend
```

---

## 6️⃣ Create Virtual Environment

### Windows

```bash
python -m venv venv
```

### macOS / Linux

```bash
python3 -m venv venv
```

---

## 7️⃣ Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

---

## 8️⃣ Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 9️⃣ Start Backend Server

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# 🔧 Optional Fix for bcrypt/passlib Error

If you encounter errors related to bcrypt or passlib, run:

```bash
pip uninstall bcrypt -y

pip uninstall passlib -y

pip install bcrypt==3.2.2

pip install passlib==1.7.4
```

---

# 🗃️ Database Tables

The backend automatically creates required tables when the server starts.

Tables include:

- users
- refresh_tokens
- offer_letters
- password_reset_tokens

---

# 🌐 Access the Application

Open in browser:

```text
http://localhost:5173
```

---

# 🧪 Available Scripts

## Frontend

```bash
npm run dev

npm run build
```

## Backend

```bash
uvicorn main:app --reload
```

---

# 🔐 Security Features

- JWT-based authentication
- Refresh token handling
- Password reset functionality
- Secure environment variable management
- Protected API routes

---

# 🛠️ Troubleshooting

## Frontend Issues

### Reinstall Dependencies

```bash
rm -rf node_modules

npm install
```

### Port Already in Use

```bash
npm run dev -- --port 5174
```

---

## Backend Issues

### Reinstall Python Dependencies

```bash
pip install -r requirements.txt
```

### Change Backend Port

```bash
uvicorn main:app --reload --port 8001
```

---

## Database Issues

- Ensure PostgreSQL service is running
- Verify `.env` database credentials
- Restart backend after database setup

---

# 📈 Design Approach

- Modular frontend and backend architecture
- Database-driven document generation
- Scalable API-based backend services
- Separation of authentication and business logic
- Template-driven PDF generation

---

# 📌 Important Notes

- Backend must run before frontend
- PostgreSQL must be active before backend starts
- `.env` file must be configured correctly
- Virtual environment should be activated before running backend

---

# 🛑 Stopping the Application

## Stop Frontend

Press:

```text
Ctrl + C
```

inside frontend terminal.

---

## Stop Backend

Press:

```text
Ctrl + C
```

inside backend terminal.

---

## Deactivate Virtual Environment

```bash
deactivate
```

---