# EA Sports FC 26 - Men's Football Dataset Project

## Project Overview
This project is a full-stack web application focused on managing and analyzing a comprehensive dataset of professional football players (Men's division) for EA Sports FC 26. It provides a powerful backend API for data retrieval, advanced filtering, statistical analysis, and administrative management.

## Current Status: Backend Complete 🚀
The backend development phase is **100% complete**. It is built with a scalable MVC architecture using **Node.js**, **Express.js**, and **MongoDB**.

### Key Backend Features
- **Comprehensive CRUD**: Full management of player records (Create, Read, Update, Delete).
- **Advanced Query Engine**: Supports complex filtering (min/max stats), global regex search, sorting, and pagination.
- **Data Analytics**: Leverages MongoDB Aggregation Framework for position distribution, team performance, and nation-specific analytics.
- **Secure Authentication**: JWT-based user authentication system with Role-Based Access Control (RBAC).
- **Administrative Dashboard**: Protected endpoints for high-level system statistics and monitoring.
- **Scalable Architecture**: Clean folder structure following industry standards (Routes, Controllers, Models, Middlewares, Services).
- **System Stability**: Integrated rate limiting, global error handling, and request logging.

## Frontend Status: Coming Soon 🎨
The frontend implementation phase will begin shortly. It will be a modern, responsive user interface designed to consume these APIs, featuring:
- Player search and comparison tools.
- Interactive data visualizations for analytics.
- Admin dashboard for dataset management.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT, BcryptJS
- **Dev Tools**: Nodemon, Morgan, Postman

## Installation & Setup
1. Clone the repository.
2. Navigate to the `backend` folder.
3. Install dependencies: `npm install`.
4. Create a `.env` file based on the environment requirements.
5. Start development server: `npm run dev`.

---
*Developed by Prashant Parmar - 2026*
