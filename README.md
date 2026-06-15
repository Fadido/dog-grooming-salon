# פינוקי — Dog Grooming Salon Queue Management System

A queue-management system for a dog grooming salon. Customers register/log in, join the
grooming waiting list, choose a haircut type by dog size (each with its own duration and
price), and manage their own appointments. Loyal customers (more than 3 past appointments)
automatically receive a 10% discount.

The UI is **Hebrew-first and fully RTL**, built to the *פינוקי* (Pinuki) design system —
a warm coral/teal "spa for dogs" look.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Backend | ASP.NET Core Web API (.NET 10) |
| Data access | Entity Framework Core 10 (code-first) |
| Database | Microsoft SQL Server (LocalDB for development) |
| Auth | JWT bearer tokens + PBKDF2 password hashing |
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript |

## Architecture

### Backend — layered, Controller → Service → Repository

```
backend/
├─ DogGrooming.Domain          # Entities & domain models (no dependencies)
├─ DogGrooming.Application      # DTOs, service & repository interfaces, business rules
├─ DogGrooming.Infrastructure   # EF Core DbContext, repositories, migrations, security
└─ DogGrooming.Api              # Controllers, startup, JWT/CORS/Swagger, middleware
```

### Frontend — Next.js App Router

```
frontend/
├─ src/app/                 # routes: / (redirect), /login, /register, /queue
├─ src/design-system/       # ported פינוקי components + design tokens (globals.css)
├─ src/features/            # auth, queue, appointments (screens & modals)
└─ src/lib/                 # API client, auth context, types, formatters
```

## Database highlights

- **SQL VIEW** `vw_AppointmentQueue` — backs every queue list / filter read.
- **Stored procedure** `sp_CreateAppointment` — atomically computes the loyalty discount
  and inserts an appointment.

## Getting started

### 1. Backend

```bash
cd backend
dotnet build
dotnet ef database update --project DogGrooming.Infrastructure --startup-project DogGrooming.Api
dotnet run --project DogGrooming.Api --launch-profile http   # listens on http://localhost:5135
```

Swagger UI is available in Development at `http://localhost:5135/swagger`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

The frontend reads the API base URL from `NEXT_PUBLIC_API_BASE_URL`
(defaults to `http://localhost:5135/api` if unset — create `frontend/.env.local` to override).
The backend's CORS policy allows `http://localhost:3000` out of the box.

## Features

- Register / login with server-side JWT authentication.
- Shared grooming queue; each customer can add / edit / delete **only their own** appointments.
- Booking by dog size (small / medium / large) with live price + duration and the 10% loyalty
  discount shown automatically.
- Appointment detail popup including the original creation timestamp.
- A customer cannot edit others' rows, and cannot delete same-day appointments.
- Filter the queue by date range and by customer name.
