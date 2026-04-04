# Smart Hostel Room Allocation System

A full stack beginner-friendly project to manage hostel room allocation with:

- **Frontend:** React (JavaScript), CSS, Axios, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT for students + separate admin login

## 1) Folder Structure

```text
Smart Hostel Room Allocation System/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   ├── Room.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
│   ├── seed/
│   │   └── seedRooms.js
│   ├── utils/
│   │   └── roomConfig.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   └── SummaryCard.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AvailableRooms.jsx
│   │   │   ├── BookingSuccess.jsx
│   │   │   ├── CategorySelection.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyBooking.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RoomsTable.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── StudentsTable.jsx
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── utils/
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 2) Backend Setup

### Step A: Initialize and install dependencies

```bash
cd backend
npm install
```

### Step B: Create `.env`

Copy `.env.example` to `.env` and update values:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/smart-hostel
JWT_SECRET=your_super_secret_jwt_key
ADMIN_EMAIL=admin@hostel.com
ADMIN_PASSWORD=admin123
GOOGLE_API_KEY=your_google_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
SMTP_FROM=Smart Hostel <your_email@gmail.com>
```

### Step C: Run backend

```bash
npm run dev
```

### Optional: Run seed script manually

```bash
npm run seed
```

> Note: `server.js` auto-seeds rooms + default admin on first run.

## 3) Frontend Setup

### Step A: Install dependencies

```bash
cd frontend
npm install
```

### Step B: Create `.env`

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### Step C: Run frontend

```bash
npm run dev
```

## 4) API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`

### Student
- `GET /api/student/me`
- `GET /api/student/categories`
- `GET /api/student/rooms/:category`
- `POST /api/student/book-room`
- `GET /api/student/my-booking`

### Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/rooms`
- `GET /api/admin/students`
- `GET /api/admin/full-rooms`
- `GET /api/admin/available-rooms`
- `GET /api/admin/category/:category`

## 5) Room Seed Logic

This project seeds exactly **100 rooms**:

- Non AC 6 Sharing: `N601` to `N620` (capacity 6)
- AC 6 Sharing: `A601` to `A620` (capacity 6)
- Non AC 4 Sharing: `N401` to `N420` (capacity 4)
- AC 4 Sharing: `A401` to `A420` (capacity 4)
- AC 3 Sharing: `A301` to `A320` (capacity 3)

Initial values:
- `occupied = 0`
- `remainingBeds = capacity`
- `isFull = false`

## 6) Features Included

- Student register/login with JWT
- Admin login (separate)
- One student = one room booking (duplicate prevention)
- Automatic room full status update
- Category-wise available room filtering
- Category/full/all-room messages:
  - "Rooms not available in this category. Please select another category."
  - "No hostel rooms available."
- Student dashboard + booking pages
- Admin dashboard with:
  - summary cards
  - room filters (category/status)
  - student search by name/email
  - all rooms / all students / full rooms tables
- Responsive modern UI with gradient cards, badges, and clean layout

## 7) Default Admin Login

Use values from `.env`:

- Email: `admin@hostel.com`
- Password: `admin123`

## 8) Quick Run Commands

Open two terminals:

```bash
# Terminal 1 - backend
cd backend
npm install
npm run dev
```

```bash
# Terminal 2 - frontend
cd frontend
npm install
npm run dev
```

Then open the frontend URL shown by Vite (usually `http://localhost:5173`).

## 9) Production-Ready Notes

- Add your own strong values for `JWT_SECRET` and `ADMIN_PASSWORD`.
- Keep `.env` files private (already ignored by `.gitignore`).
- Make sure MongoDB is running before starting backend (no in-memory fallback in production mode).
