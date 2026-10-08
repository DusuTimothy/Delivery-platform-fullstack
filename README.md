# Delivery Platform Fullstack

A full-stack delivery platform for managing customer delivery requests, rider workflows, payment tracking, and administrative oversight.

## Overview

This project combines a Node.js/Express backend with a React + Vite frontend to support:

- Customer sign-up and login
- Creating and tracking delivery requests
- Rider availability, job acceptance, and delivery status updates
- Admin monitoring and assignment workflows
- Payment records and customer payment history

## Tech Stack

- Frontend: React 19, Vite, React Router, Bootstrap, Axios
- Backend: Node.js, Express 5, Sequelize ORM, PostgreSQL
- Authentication: JWT + bcrypt
- Validation: express-validator

## Project Structure

```text
delivery-platform/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── README.md
└── .gitignore
```

## Features

### Customer experience
- Register and log in as a customer
- Create delivery requests with pickup and drop-off details
- View delivery history and current status
- Cancel pending deliveries
- Track payment information associated with completed or active deliveries

### Rider experience
- Login as a rider
- View assigned and available jobs
- Accept delivery jobs
- Update progress and status while on route
- Review personal delivery history

### Admin experience
- Access dashboard summary data
- View users, customers, riders, and delivery records
- Update rider availability
- Assign riders to deliveries
- Review payment records across the platform

## Prerequisites

Before running the app, ensure you have:

- Node.js 18+
- npm 9+
- PostgreSQL 14+
- A local PostgreSQL database created for the project

## Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
cp .env.example .env
```

4. Update the database and JWT settings in `.env`:

```env
PORT=
NODE_ENV=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
# For Aiven, set to certs/ca.pem after adding the downloaded CA certificate.
DB_SSL_CA_PATH=

JWT_SECRET=
JWT_EXPIRES_IN=

BCRYPT_ROUNDS=
```

For an Aiven PostgreSQL connection, save Aiven's CA certificate as
`backend/certs/ca.pem`, then set `DB_SSL_CA_PATH=certs/ca.pem` in
`backend/.env`. The backend will require TLS and verify the server certificate
using that CA.

5. Create the PostgreSQL database:

```sql
CREATE DATABASE delivery_platform_dev;
```

6. Run database migrations and seeders:

```bash
npm run setup
```

7. Start the server:

```bash
npm run dev
```

The backend runs by default on `http://localhost:5000`.

## Frontend Setup

1. In a separate terminal, go to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Vite dev server:

```bash
npm run dev
```

The frontend runs by default on `http://localhost:5173`.

## API Overview

The backend exposes the following main route groups:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and receive a JWT
- `GET /api/users/me` - Get current user profile
- `GET /api/customers/deliveries` - Get customer deliveries
- `POST /api/customers/deliveries` - Create a delivery request
- `GET /api/riders/available-jobs` - View available delivery jobs
- `PUT /api/riders/deliveries/:deliveryId/accept` - Accept a delivery
- `GET /api/admin/dashboard` - Get admin dashboard summary
- `GET /api/deliveries` - List deliveries
- `GET /api/payments/:id` - Get individual payment details

A health check endpoint is also available:

- `GET /api/health`

## Default Roles

The application is designed around three role types:

- `CUSTOMER`
- `RIDER`
- `ADMIN`

Role-based access control is enforced with protected routes and middleware.

## Useful Scripts

### Backend

```bash
npm start
npm run dev
npm run migrate
npm run migrate:undo
npm run seed
npm run setup
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Notes

- The backend uses environment variables from a `.env` file.
- The frontend expects the API to be available on the backend port during local development.
- If you are running the project locally without a configured API base URL in the frontend, update the client-side API configuration to match your backend host.

## License

This project is currently unlicensed unless otherwise specified by the repository owner.
