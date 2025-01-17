<h2 align="center">Electronic Devices Web Project</h2>

## Overview
- **This project is a web application for managing and showcasing electronic devices. It includes a user-friendly frontend built with ReactJS and a backend API developed using Node.js. The project demonstrates a modular design and adheres to best practices for web development.**

## Features
- **Product Listing: View and search electronic devices with detailed specifications.** 
- **User Authentication: Secure login and registration system.**
- **Shopping Cart: Add and manage devices in a cart.**
- **Order Management: Place orders and track their status.**
- **Admin Panel: Manage products, users, and orders.**
- **Responsive Design: Fully responsive for desktop, tablet, and mobile devices.**

## Technologies Used
- **ReactJS: Component-based UI framework.** 
- **React Router: For navigation and routing.**
- **Axios: HTTP client for API communication.**
- **TailwindCSS: Styling framework for a responsive design.**
- **Node.js: Server-side JavaScript runtime.**
- **MongoDB: Database for storing application data.**
- **JWT (JSON Web Token): Authentication mechanism.**

## Installation and Setup
Prerequisites

Node.js installed (v16 or later).

MongoDB instance (local or Mongo Atlas).

Backend Setup

Navigate to the server directory:

cd server

Install dependencies:

npm install

Create a .env file and add the following variables:

PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>

Start the server:

npm start

API will be running on http://localhost:5000.

Frontend Setup

Navigate to the client directory:

cd client

Install dependencies:

npm install

Start the development server:

npm start

The application will be running on http://localhost:3000.

Project Structure

project-root
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── app.js
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   └── App.js
└── README.md

Contributing

Fork the repository.

Create a feature branch: git checkout -b feature-name.

Commit your changes: git commit -m "Add feature".

Push to the branch: git push origin feature-name.

Submit a pull request.
