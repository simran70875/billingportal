# Billing Portal

This is a MERN (MongoDB, Express.js, React, Node.js) project for managing billing activities. The portal is designed to accommodate three types of users:

- **Super Admin:** Has full access to all features and can create and manage admins and operators.
- **Admins:** Created by the super admin, they have access to specific features and can create and manage operators.
- **Operators:** Can perform specific tasks assigned by admins or super admins.

## Key Features

- **User authentication and authorization system** with role-based access control.
- **Dashboard** for super admin, admins, and operators with relevant data and functionalities.
- **CRUD operations** for managing customers, invoices, and payments.
- **Reporting and analytics** for monitoring billing activities.

## Technologies Used

- **Frontend:** React for interactive user interfaces.
- **Backend:** Node.js and Express.js for RESTful API development.
- **Database:** MongoDB for storing user data and billing information.
- **State Management:** Redux for managing application state.
- **Authentication:** JWT (JSON Web Tokens) for secure user authentication.

## How to Use

1. Clone the repository to your local machine.
2. Install dependencies using `npm install` in the root directory (for backend and frontend `billingportal` both).
3. Configure environment variables for database connection and JWT secret.
4. Run the backend server using `npm start` in the `backend` directory.
5. Run the frontend development server using `npm start` in the `billingportal` directory.
6. Access the application in your web browser at [http://localhost:8000](http://localhost:8000).

- **Feel free to explore the codebase and contribute to enhancing the billing portal!**

