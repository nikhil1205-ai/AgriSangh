# AgriSangh

AgriSangh is a full-stack agricultural collaboration platform built to help farmers, buyers, and groups manage contributions, batches, revenue, market access, and group collaboration.

## Overview

- **Frontend:** React + Vite application with Firebase authentication, maps, charts, group dashboards, and marketplace flows.
- **Backend:** Express.js API with MongoDB, JWT authentication, Firebase Admin token verification, and endpoints for farmers, groups, contributions, batches, revenue, and dashboard analytics.
- **Blockchain:** A placeholder `Blockchain/` folder exists for future Ethereum or blockchain-related integrations.

## Features

- Farmer registration and authentication
- Group creation, join requests, and group room management
- Contribution tracking and batch management
- Revenue analytics and dashboard insights
- Buyer marketplace flows and market news pages
- Profile management and protected routes

## Repository Structure

- `Backend/` - Node.js API server
  - `src/config` - DB and Firebase Admin configuration
  - `src/controllers` - Route handlers
  - `src/models` - Mongoose schemas
  - `src/routes` - Express routes
  - `src/services` - Business logic services
  - `src/utils` - API helpers and error handling
- `Frontend/` - React application
  - `src/components` - Reusable UI and feature components
  - `src/pages` - Application pages and screens
  - `src/routes` - Route definitions and protected route wrappers
  - `src/context` - Authentication context
  - `src/config` - Firebase client configuration
- `Blockchain/` - Ethereum/blockchain integration placeholder

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router, Firebase, Recharts, Leaflet
- Backend: Node.js, Express 5, MongoDB, Mongoose, Firebase Admin, JSON Web Tokens, Helmet, CORS
- Dev: Nodemon, ESLint

## Getting Started

### Backend

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal and navigate to the frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Available Scripts

### Backend

- `npm run dev` - start the server with nodemon
- `npm start` - start the server with Node

### Frontend

- `npm run dev` - start Vite development server
- `npm run build` - build production assets
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## API Endpoints

The backend API is available at `http://localhost:8080/api` by default.

Common route groups:

- `/api/auth`
- `/api/farmers`
- `/api/groups`
- `/api/contributions`
- `/api/batches`
- `/api/revenue`
- `/api/dashboard`
- `/api/health`

## Notes

- `Frontend/src/config/firebase.js` loads Firebase config from VITE environment variables.
- `Backend/src/config/firebaseAdmin.js` requires Firebase Admin service account environment variables.
- Update `CLIENT_URL` in `Backend/.env` for production frontend deployment.

---

Powered by the AgriSangh platform for smart agriculture collaboration and farm group management.
