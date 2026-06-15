# Dog Grooming Salon — Queue Management System

A queue-management system for a dog grooming salon. Customers register/log in, join the
grooming waiting list, choose a haircut type by dog size (each with its own duration and
price), and manage their own appointments. Loyal customers (more than 3 past appointments)
automatically receive a 10% discount.

This repository is built **in phases**. The current phase is the **Backend API**.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Backend | ASP.NET Core Web API (.NET 10) |
| Data access | Entity Framework Core 10 (code-first) |
| Database | Microsoft SQL Server (LocalDB for development) |
| Auth | JWT bearer tokens + PBKDF2 password hashing |
| Frontend | React / Next.js *(later phase)* |

## Architecture

A layered solution following the **Controller → Service → Repository** pattern:

```
backend/
├─ DogGrooming.Domain          # Entities & domain models (no dependencies)
├─ DogGrooming.Application      # DTOs, service & repository interfaces, business rules
├─ DogGrooming.Infrastructure   # EF Core DbContext, repositories, migrations, security
└─ DogGrooming.Api              # Controllers, startup, JWT/CORS/Swagger, middleware
```

## Database highlights

- **SQL VIEW** `vw_AppointmentQueue` — backs every queue list / filter read.
- **Stored procedure** `sp_CreateAppointment` — atomically computes the loyalty discount
  and inserts an appointment.

## Getting started (backend)

```bash
cd backend
dotnet build
dotnet ef database update --project DogGrooming.Infrastructure --startup-project DogGrooming.Api
dotnet run --project DogGrooming.Api
```

Then open Swagger UI at the URL printed on startup (e.g. `https://localhost:7155/swagger`).
