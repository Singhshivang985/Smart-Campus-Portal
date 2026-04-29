# Smart Campus Resource Portal (Production-Ready Backend)

A production-grade backend API built with Node.js and Express, designed to manage academic resources for students. It includes a comprehensive set of features, enterprise-level architecture, and a minimal frontend for demonstration purposes.

## Key Features
- **MVC Architecture**: Highly scalable and maintainable folder structure.
- **Robust Authentication**: JWT-based authentication with secure HTTP-only cookies and Refresh logic.
- **Role-Based Access Control**: Student, Faculty, and Admin roles.
- **Security**: Advanced security mechanisms including `helmet`, `express-rate-limit`, NoSQL injection prevention, XSS protection, and secure password hashing (`bcryptjs`).
- **Advanced Querying**: Built-in API support for Pagination, Filtering, Sorting, and Searching.
- **Approval Workflow**: Uploaded resources stay in a pending state until reviewed and approved by Admins or Faculty.
- **File Uploads**: Handled securely via `multer`.
- **User Engagement**: Bookmark/Favorite resources and track downloads.
- **Activity Logging**: Track important user actions in the database.
- **Analytics Dashboard APIs**: Aggregation pipelines to fetch usage statistics (users, resources, popular categories).
- **Centralized Error Handling**: Custom `AppError` class and global error handling middleware.

## Tech Stack
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Multer (File Uploads)
- EJS (Template Engine for Demo Frontend)
- Winston & Morgan (Logging)

## Project Structure
```text
├── config/           # Database and logger configuration
├── controllers/      # Route controllers (auth, resources, users, views)
├── middlewares/      # Custom middlewares (auth, error handling, upload)
├── models/           # Mongoose schemas (User, Resource, Log)
├── public/           # Static files (uploads)
├── routes/           # Express routers
├── utils/            # Utility classes (APIFeatures, AppError, catchAsync)
├── views/            # EJS templates for the minimal frontend
├── app.js            # Express application setup
└── server.js         # Entry point and DB connection
```

## How to Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Update the `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/campus-resources
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Access the Portal**
   Open your browser and navigate to `http://localhost:5000`


