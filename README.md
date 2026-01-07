# Legal Tech Dashboard - Full-Stack Web Application

A comprehensive full-stack web application for managing legal processes, including documents, cases, tasks, and deadlines. Built with MongoDB, Node.js/Express, and React.

## 🎯 Features

- **Dashboard Overview**: Comprehensive dashboard with statistics, charts, and recent activity
- **Document Management**: Track and manage legal documents with status tracking
- **Case Management**: Manage legal cases with detailed information
- **Task Management**: Track tasks with progress bars and priority levels
- **Deadline Tracking**: Monitor deadlines with visual indicators for overdue items
- **Professional UI/UX**: Modern, responsive design with smooth animations
- **Search & Filters**: Advanced filtering and search capabilities across all modules
- **Charts & Visualizations**: Pie charts and bar charts for data representation

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Recharts** - Chart library
- **Lucide React** - Icons
- **Axios** - HTTP client
- **date-fns** - Date utilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### Step 1: MongoDB Setup (From Scratch)

#### Windows:
1. **Download MongoDB**:
   - Visit https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Run the installer and follow the installation wizard
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service (recommended)

2. **Verify Installation**:
   ```bash
   mongod --version
   ```

3. **Start MongoDB Service**:
   - MongoDB should start automatically as a Windows service
   - If not, open Services (services.msc) and start "MongoDB" service
   - Or run: `net start MongoDB`

4. **Access MongoDB Shell**:
   ```bash
   mongo
   ```
   Or if using MongoDB 6.0+:
   ```bash
   mongosh
   ```

#### macOS:
1. **Install using Homebrew**:
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**:
   ```bash
   brew services start mongodb-community
   ```

3. **Verify**:
   ```bash
   mongosh
   ```

#### Linux (Ubuntu/Debian):
1. **Import MongoDB GPG Key**:
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```

2. **Add MongoDB Repository**:
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   ```

3. **Install MongoDB**:
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB**:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

### Step 2: Clone/Setup Project

1. **Navigate to project directory**:
   ```bash
   cd assignment1
   ```

### Step 3: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   # Copy the example file
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # macOS/Linux
   ```

4. **Configure environment variables** (edit `.env` file):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/legaltech
   NODE_ENV=development
   ```

5. **Start MongoDB** (if not already running):
   - Windows: MongoDB should be running as a service
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

6. **Seed the database** (optional but recommended):
   ```bash
   npm run seed
   ```
   This will populate the database with sample data.

7. **Start the backend server**:
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

   The backend should now be running on `http://localhost:5000`

8. **Verify backend is working**:
   - Open browser: `http://localhost:5000/api/health`
   - You should see: `{"status":"OK","message":"Legal Tech API is running"}`

### Step 4: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

   The frontend should now be running on `http://localhost:3000`

4. **Access the application**:
   - Open browser: `http://localhost:3000`
   - You should see the Legal Tech Dashboard

## 📁 Project Structure

```
assignment1/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── Document.js
│   │   ├── Case.js
│   │   ├── Task.js
│   │   └── Deadline.js
│   ├── routes/          # API routes
│   │   ├── documents.js
│   │   ├── cases.js
│   │   ├── tasks.js
│   │   ├── deadlines.js
│   │   └── dashboard.js
│   ├── scripts/         # Utility scripts
│   │   └── seedData.js
│   ├── server.js        # Express server
│   ├── package.json
│   └── .env            # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── Layout.js
│   │   │   └── StatCard.js
│   │   ├── pages/       # Page components
│   │   │   ├── Dashboard.js
│   │   │   ├── Documents.js
│   │   │   ├── Cases.js
│   │   │   ├── Tasks.js
│   │   │   └── Deadlines.js
│   │   ├── services/    # API services
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🗄️ Database Collections

The application uses 4 MongoDB collections:

1. **Documents**: Legal documents with status, type, client information
2. **Cases**: Legal cases with case numbers, types, assigned lawyers
3. **Tasks**: Tasks with assignments, due dates, and progress tracking
4. **Deadlines**: Important deadlines with types and status tracking

## 🔌 API Endpoints

### Documents
- `GET /api/documents` - Get all documents (with filters)
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/stats/summary` - Get document statistics

### Cases
- `GET /api/cases` - Get all cases (with filters)
- `GET /api/cases/:id` - Get case by ID
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case
- `GET /api/cases/stats/summary` - Get case statistics

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/summary` - Get task statistics

### Deadlines
- `GET /api/deadlines` - Get all deadlines (with filters)
- `GET /api/deadlines/:id` - Get deadline by ID
- `POST /api/deadlines` - Create new deadline
- `PUT /api/deadlines/:id` - Update deadline
- `DELETE /api/deadlines/:id` - Delete deadline
- `GET /api/deadlines/upcoming/list` - Get upcoming deadlines

### Dashboard
- `GET /api/dashboard/overview` - Get comprehensive dashboard data

## 🎨 Features Overview

### Dashboard
- **Statistics Cards**: Overview of documents, cases, tasks, and deadlines
- **Pie Charts**: Document status distribution, case status distribution
- **Bar Charts**: Cases by type, task status distribution
- **Recent Activity**: Latest documents and cases

### Documents Page
- **Table View**: All documents with sortable columns
- **Filters**: Filter by status and document type
- **Search**: Search by title, description, or client name
- **Status Badges**: Visual status indicators
- **Priority Indicators**: Color-coded priority levels

### Cases Page
- **Case Management**: View and manage all cases
- **Case Numbers**: Unique case identifiers
- **Filters**: Filter by status and case type
- **Search**: Search across case details

### Tasks Page
- **Task Tracking**: Manage tasks with progress bars
- **Due Date Tracking**: Visual indicators for overdue tasks
- **Progress Bars**: Visual representation of task completion
- **Filters**: Filter by status and priority

### Deadlines Page
- **Deadline Tracking**: Monitor all deadlines
- **Overdue Alerts**: Visual indicators for overdue deadlines
- **Days Remaining**: Countdown to deadlines
- **Status Tracking**: Track deadline completion status

## 🎯 Usage Guide

### Navigation
- Use the sidebar to navigate between different sections
- Click on any menu item to switch pages
- The active page is highlighted in the sidebar

### Adding Data
- Click the "Add" button (with + icon) on any page to add new items
- Fill in the required fields
- Save the new entry

### Filtering & Search
- Use the search box to search across all fields
- Use dropdown filters to filter by specific criteria
- Filters can be combined for more specific results

### Viewing Charts
- Navigate to Dashboard to see visualizations
- Charts update automatically based on current data
- Hover over chart elements for detailed information

## 🐛 Troubleshooting

### MongoDB Connection Issues
- **Error**: "MongoDB connection error"
  - **Solution**: Ensure MongoDB is running (`mongod` or `brew services start mongodb-community`)
  - Check if MongoDB service is running: `net start MongoDB` (Windows)
  - Verify connection string in `.env` file

### Port Already in Use
- **Error**: "Port 5000 already in use"
  - **Solution**: Change PORT in `.env` file or stop the process using port 5000
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - macOS/Linux: `lsof -ti:5000 | xargs kill`

### CORS Errors
- **Error**: CORS policy errors
  - **Solution**: Ensure backend CORS is enabled (already configured)
  - Check that backend is running on port 5000
  - Verify frontend proxy settings in `package.json`

### Module Not Found
- **Error**: "Cannot find module"
  - **Solution**: Run `npm install` in the respective directory (backend or frontend)
  - Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Database Empty
- **Solution**: Run the seed script: `npm run seed` in the backend directory
  - This will populate the database with sample data

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legaltech
NODE_ENV=development
```

### Frontend
- Default API URL: `http://localhost:5000/api`
- Can be overridden with `REACT_APP_API_URL` environment variable

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Update `MONGODB_URI` with production connection string
4. Run `npm start` (not `npm run dev`)

### Frontend
1. Build the React app: `npm run build`
2. Serve the `build` folder using a web server (nginx, Apache, etc.)
3. Update API URL if backend is on different domain
4. Configure CORS on backend for production domain

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Recharts Documentation](https://recharts.org/)

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Development Notes

- Backend uses Express.js with RESTful API design
- Frontend uses React with functional components and hooks
- MongoDB uses Mongoose ODM for schema validation
- All API endpoints include error handling
- Frontend includes loading states and error handling
- Responsive design works on desktop and mobile devices

---

**Happy Coding! 🎉**

