# EA Sports FC 26 - Frontend Dashboard

## Project Overview
This is a full-stack dashboard project built for the EA Sports FC 26 Men's Football Dataset. The frontend is built using **React (Vite)**, **Tailwind CSS v4**, and **Material UI (MUI)**, integrated with a **MongoDB + Express** backend.

## Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4, Material UI v6
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **API Communication**: Axios
- **Form Handling**: Formik & Yup
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **SEO**: React Helmet Async

## Features
- **Authentication**: JWT-based Login and Registration with role-based access control (Admin/User).
- **Dashboard Layout**: Responsive sidebar and top navbar with theme toggle (Light/Dark mode).
- **Players Management**: Full CRUD operations for football player records, including search and server-side pagination.
- **Users Management**: Admin-only dashboard to manage user accounts and roles.
- **Analytics**: Data visualization using MongoDB aggregations for position distribution, nation analytics, and top teams.
- **Profile Management**: User profile screen with account details.
- **SEO Implementation**: Dynamic page titles and meta tags for all routes.

## Folder Structure
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── features/        # Redux slices (Auth, Players, UI, Users)
│   ├── layouts/         # Dashboard and Public layouts
│   ├── pages/           # Screen components (Dashboard, Login, Players, etc.)
│   ├── services/        # API layer (Axios instance and service files)
│   ├── store/           # Redux store configuration
│   ├── theme/           # MUI theme customization
│   ├── App.jsx          # Main routing and app initialization
│   ├── index.css        # Tailwind v4 imports and global styles
│   └── main.jsx         # Entry point
├── .gitignore
├── package.json
└── vite.config.js
```

## Setup Instructions
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## API Configuration
The frontend uses a proxy configured in `vite.config.js` to communicate with the backend at `http://localhost:5000`. The base API URL is `/api/v1`.

---
*Developed by Prashant Parmar - 2026*
