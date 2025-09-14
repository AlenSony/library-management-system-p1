# Library Management System

A full-stack library management system built with React (Frontend) and Node.js/Express (Backend) with MongoDB database.

## Features

### Frontend (React + TypeScript + Vite)

- **Add Authors**: Register new authors with ID, name, and email
- **Add Publishers**: Register new publishers with ID, name, and year of publication
- **Add Staff**: Register new staff members with ID and name
- **Add Readers**: Register new readers with complete profile information
- **Add Books**: Add new books with author and publisher selection from dropdowns
- **Issue Books**: Issue books to readers with return date
- **Return Books**: Return issued books
- **View Books**: Display all books in a table with availability status
- **View Book Issues**: Display all book issues with status tracking

### Backend (Node.js + Express + MongoDB)

- RESTful API endpoints for all CRUD operations
- MongoDB integration with Mongoose
- CORS enabled for frontend communication
- Comprehensive error handling
- Data validation and relationships

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd library-management-system-p1
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd services
npm install
cd ..
```

### 4. Database Setup

Make sure MongoDB is running on your system. The application will connect to:

- Local MongoDB: `mongodb://localhost:27017/LibraryManagementSystem`
- Or set `MONGO_URL` environment variable for custom connection string

### 5. Start the Application

#### Option 1: Start Backend and Frontend Separately

**Terminal 1 - Start Backend:**

```bash
cd services
npm start
```

Backend will run on http://localhost:3000

**Terminal 2 - Start Frontend:**

```bash
npm run dev
```

Frontend will run on http://localhost:5173

#### Option 2: Using npm scripts (if you have concurrently installed)

```bash
# Install concurrently globally
npm install -g concurrently

# Start both servers
npm run dev:full
```

## API Endpoints

### Authors

- `POST /api/author` - Create new author
- `GET /api/author?email=<email>` - Get author by email
- `GET /api/authors` - Get all authors

### Publishers

- `POST /api/publisher` - Create new publisher
- `GET /api/publisher?name=<name>` - Get publisher by name
- `GET /api/publishers` - Get all publishers

### Staff

- `POST /api/staff` - Create new staff member
- `GET /api/staff?staffID=<staffID>` - Get staff by ID
- `GET /api/staffs` - Get all staff

### Readers

- `POST /api/reader` - Register new reader
- `GET /api/reader?email=<email>` - Get reader by email

### Books

- `POST /api/book` - Create new book
- `GET /api/book?title=<title>` - Get book by title
- `GET /api/books` - Get all books

### Book Issues

- `POST /api/bookissue` - Issue a book
- `PATCH /api/bookissue` - Return a book
- `GET /api/bookissues` - Get all book issues

### Health Check

- `GET /api/health` - Server health status

## Usage Guide

### 1. Setting Up Data

1. Start by adding **Authors** and **Publishers** first
2. Add **Staff** members
3. Register **Readers**
4. Add **Books** (select authors and publishers from dropdowns)

### 2. Managing Books

1. Use **View Books** to see all available books
2. **Issue Books** to readers by providing reader name and book name
3. **Return Books** when readers bring them back

### 3. Monitoring

1. Use **View Issues** to track all book transactions
2. Check book availability status in the books view

## Project Structure

```
library-management-system-p1/
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── forms/               # Form components
│   │   ├── views/               # View components
│   │   └── ui/                  # UI components
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # Page components
│   └── lib/                     # Utility functions
├── services/                    # Backend Node.js application
│   ├── index.js                 # Main server file
│   └── package.json             # Backend dependencies
├── public/                      # Static assets
└── package.json                 # Frontend dependencies
```

## Technologies Used

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query (TanStack Query)
- Radix UI components

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS

## Features in Detail

### Data Relationships

- Books are linked to Authors and Publishers
- Book Issues link Readers and Books
- Proper foreign key relationships maintained

### User Experience

- Responsive design
- Real-time form validation
- Loading states
- Success/error notifications
- Intuitive navigation

### Data Management

- CRUD operations for all entities
- Data validation on both frontend and backend
- Proper error handling
- Stock management for books
- Issue tracking with status updates

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in services/index.js

2. **CORS Issues**
   - Backend has CORS enabled for all origins
   - If issues persist, check browser console

3. **Port Conflicts**
   - Backend runs on port 3000
   - Frontend runs on port 5173
   - Change ports in respective config files if needed

4. **API Endpoint Errors**
   - Ensure backend is running before frontend
   - Check network tab in browser dev tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
