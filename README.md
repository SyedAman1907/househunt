# HouseHunt App
  Visit here  : https://amanjavya-househunt.vercel.app/

A full-stack Rental House application built with the MERN stack (MongoDB, Express, React, Node.js).

## Prerequisites

- Node.js installed
- MongoDB installed and running locally

## Project Structure

- `househunt backend/` - Server side code (Express + Mongoose)
- `frontend/` - Client side code (React + Vite)

## How to Run

### 1. Start the Backend Server

The backend connects to MongoDB and handles API requests.

```bash
cd "househunt backend"
npm install  # Install dependencies (only first time)
node server.js
```

_Server runs on: http://localhost:5000_

### 2. Start the Frontend Application

The frontend provides the user interface.

```bash
cd "frontend"
npm install  # Install dependencies (only first time)
npm run dev
```

_App runs on: http://localhost:5173 (Control+Click to open)_

## Features

- **Renters**: specific properties, book appointments.
- **Owners**: Add properties (with images), accept/reject bookings.
- **Admins**: Approve owners, view all properties.
