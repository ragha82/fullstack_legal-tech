# Quick Setup Instructions

Follow these steps to get the Legal Tech Dashboard up and running quickly.

## Prerequisites Checklist
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] npm or yarn installed

## Step-by-Step Setup

### 1. MongoDB Setup (5 minutes)

**Windows:**
- Download MongoDB from https://www.mongodb.com/try/download/community
- Install MongoDB Community Server
- MongoDB will run as a Windows service automatically
- Verify: Open Command Prompt and type `mongosh`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
mongosh
```

**Linux:**
```bash
# See MONGODB_SETUP.md for detailed instructions
sudo systemctl start mongod
mongosh
```

### 2. Backend Setup (3 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example or create manually)
# Add these lines:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/legaltech
# NODE_ENV=development

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📊 API available at http://localhost:5000/api
```

### 3. Frontend Setup (3 minutes)

**Open a NEW terminal window:**

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view legal-tech-frontend in the browser.
  Local:            http://localhost:3000
```

### 4. Access the Application

1. Open your browser
2. Navigate to: `http://localhost:3000`
3. You should see the Legal Tech Dashboard!

## Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] MongoDB connected (check backend console)
- [ ] Dashboard loads with data
- [ ] Can navigate between pages (Documents, Cases, Tasks, Deadlines)
- [ ] Charts display on Dashboard
- [ ] Search and filters work

## Common Issues & Quick Fixes

### MongoDB Not Running
**Error:** "MongoDB connection error"

**Fix:**
- Windows: Check Services (services.msc) - start MongoDB service
- macOS: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

### Port Already in Use
**Error:** "Port 5000 already in use"

**Fix:** Change PORT in `backend/.env` to another port (e.g., 5001)

### Module Not Found
**Error:** "Cannot find module"

**Fix:** 
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### No Data Showing
**Fix:** Run the seed script:
```bash
cd backend
npm run seed
```

## Next Steps

1. Explore the Dashboard - see charts and statistics
2. Navigate to Documents, Cases, Tasks, and Deadlines pages
3. Try the search and filter functionality
4. Check out the professional UI design

## Need Help?

- See `README.md` for detailed documentation
- See `MONGODB_SETUP.md` for MongoDB installation details
- Check backend console for API errors
- Check browser console (F12) for frontend errors

---

**Happy Coding! 🎉**

