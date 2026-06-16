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

## Prerequisites

- **.NET SDK 10** — `dotnet --version`
- **Node.js 18+** (developed on 24) — `node --version`
- **SQL Server LocalDB** (`(localdb)\MSSQLLocalDB`) — ships with Visual Studio or the standalone
  "SQL Server Express LocalDB" installer. *Windows only*; on macOS/Linux point the connection
  string in `backend/DogGrooming.Api/appsettings.json` at a real SQL Server (e.g. via Docker).
- **EF Core CLI** (for migrations):
  ```bash
  dotnet tool install --global dotnet-ef --version 10.0.9
  ```

## Getting started

### 1. Backend

```bash
cd backend
dotnet build
# Creates the DogGroomingDb database with tables, seed data, the SQL view and the stored procedure:
dotnet ef database update --project DogGrooming.Infrastructure --startup-project DogGrooming.Api
dotnet run --project DogGrooming.Api --launch-profile http   # listens on http://localhost:5135
```

Swagger UI is available in Development at `http://localhost:5135/swagger`.

Run the unit tests (xUnit + Moq — covers the appointment business rules and password hashing):

```bash
cd backend
dotnet test
```

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
