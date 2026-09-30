# 🥛 Smart Dairy ERP Lite

A full-stack Dairy Management System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) for managing dairy operations efficiently.

## 🚀 Live Demo

### Frontend
https://smart-dairy-erp-lite-1.onrender.com

### Backend API
https://smart-dairy-erp-lite.onrender.com

---

# 📌 Project Overview

Smart Dairy ERP Lite is designed to simplify daily dairy management tasks such as:

- Farmer Management
- Milk Collection
- Payment Tracking
- Reports Generation
- Staff Management
- Dairy Settings Management
- Dashboard Analytics

The system helps dairy owners maintain records digitally and reduce manual paperwork.

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- Recharts

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js

## Deployment

- Frontend: Render
- Backend: Render
- Database: MongoDB Atlas

---

# 📂 Project Structure

```bash
Smart-Dairy-ERP-Lite
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── app.js
│
└── README.md
```

---

# 🔐 Authentication

The system uses JWT-based authentication.

### Features

- Secure Login
- Password Encryption using Bcrypt
- JWT Token Generation
- Protected Routes
- Role-based Expansion Ready

---

# 👨‍🌾 Farmer Management

### Features

- Add Farmer
- Edit Farmer
- Delete Farmer
- Search Farmer
- Auto Farmer ID Generation

Example:

```text
FARM001
FARM002
FARM003
```

Farmer Details:

- Farmer ID
- Name
- Mobile Number
- Village
- Address
- Cattle Count

---

# 🥛 Milk Collection Module

### Features

- Add Milk Collection
- Edit Collection
- Delete Collection
- Search Collections
- Collection History

Collection Fields:

- Farmer ID
- Farmer Name
- Shift
- Quantity
- Fat %
- SNF %
- Rate
- Amount

---

## Milk Rate Formula

```text
Rate = (Fat × Fat Rate) + (SNF × SNF Rate)

Amount = Quantity × Rate
```

Example:

```text
Fat = 6.5
SNF = 8.8

Fat Rate = 6.5
SNF Rate = 2.3

Rate = 62.49

Amount = Quantity × Rate
```

---

# 💰 Payment Module

### Features

- Payment Cycle Management
- Mark Payment Paid
- Payment Receipt
- Payment History

Payment Cycles:

```text
1 - 10
11 - 20
21 - End Of Month
```

---

# 📊 Dashboard

Dashboard displays:

- Today's Collection
- Today's Quantity
- Today's Revenue
- Top Farmer
- Collection Trends
- Shift Analysis

Charts:

- Line Chart
- Pie Chart
- Growth Statistics

---

# 📈 Reports Module

### Features

- Collection Reports
- Farmer Reports
- Payment Reports
- Date-wise Filtering

Future:

- PDF Export
- Excel Export

---

# 👨‍💼 Staff Management

Admin can manage staff members.

### Features

- Add Staff
- Edit Staff
- Delete Staff
- Search Staff

Staff Details:

- Staff ID
- Name
- Mobile Number
- Role
- Salary
- Status

Example:

```text
STF001
STF002
STF003
```

Roles:

- Collector
- Accountant
- Manager

---

# ⚙️ Settings Module

Manage dairy information.

Settings Include:

- Dairy Name
- Owner Name
- Mobile Number
- Address
- Fat Rate
- SNF Rate
- Receipt Title
- Footer Text

Example:

```text
Fat Rate = 6.5

SNF Rate = 2.3
```

---

# 🌐 API Endpoints

## Auth

```http
POST /api/auth/register
POST /api/auth/login
```

## Farmers

```http
GET    /api/farmers
POST   /api/farmers
PUT    /api/farmers/:id
DELETE /api/farmers/:id
```

## Milk Collection

```http
GET    /api/milk
POST   /api/milk
PUT    /api/milk/:id
DELETE /api/milk/:id
```

## Payments

```http
GET /api/payments
POST /api/payments
```

## Reports

```http
GET /api/reports
```

## Dashboard

```http
GET /api/dashboard
```

## Settings

```http
GET /api/settings
PUT /api/settings
```

## Staff

```http
GET    /api/staff
POST   /api/staff
PUT    /api/staff/:id
DELETE /api/staff/:id
```

---

# ⚡ Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# 💻 Local Installation

## Clone Repository

```bash
git clone https://github.com/yogeshsoni03/Smart-Dairy-ERP-Lite.git
```

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Backend Setup

```bash
cd server

npm install

npm run dev
```

Backend:

```text
http://localhost:5000
```

---

# 🔮 Future Enhancements

### Farmer Portal

- Farmer Login
- OTP Verification
- Download Reports
- Payment Status

### Staff Portal

- Collector Login
- Accountant Login
- Attendance Tracking
- Salary Management

### Reports

- PDF Export
- Excel Export
- Advanced Analytics

### Notifications

- SMS Alerts
- WhatsApp Alerts
- Email Notifications

---

# 🎯 Current Status

✅ Authentication

✅ Farmer Management

✅ Milk Collection

✅ Dashboard

✅ Payments

✅ Reports

✅ Settings

✅ Staff Management

✅ MongoDB Atlas Integration

✅ Render Deployment

---

# 👨‍💻 Developer

**Yogesh Soni**

MCA Student | Cloud & Full Stack Developer

Project: Smart Dairy ERP Lite

Built using MERN Stack and MongoDB Atlas.

---

# 📜 License

This project is developed for educational and learning purposes.