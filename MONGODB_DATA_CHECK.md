# How to Check MongoDB Data and Collections

This guide shows you multiple ways to verify your MongoDB data and view collections.

## Method 1: Using MongoDB Shell (mongosh) - Command Line

### Step 1: Open MongoDB Shell

**Windows:**
```bash
mongosh
```

**macOS/Linux:**
```bash
mongosh
```

If you're using an older MongoDB version, use:
```bash
mongo
```

### Step 2: List All Databases

```javascript
show dbs
```

You should see `legaltech` in the list.

### Step 3: Switch to Your Database

```javascript
use legaltech
```

### Step 4: List All Collections

```javascript
show collections
```

Expected output:
```
documents
cases
tasks
deadlines
```

### Step 5: View Data in Collections

#### View All Documents:
```javascript
db.documents.find().pretty()
```

#### View All Cases:
```javascript
db.cases.find().pretty()
```

#### View All Tasks:
```javascript
db.tasks.find().pretty()
```

#### View All Deadlines:
```javascript
db.deadlines.find().pretty()
```

### Step 6: Count Documents in Each Collection

```javascript
// Count documents
db.documents.countDocuments()

// Count cases
db.cases.countDocuments()

// Count tasks
db.tasks.countDocuments()

// Count deadlines
db.deadlines.countDocuments()
```

### Step 7: View Specific Documents

#### View first 5 documents:
```javascript
db.documents.find().limit(5).pretty()
```

#### View documents with specific status:
```javascript
db.documents.find({ status: "Pending" }).pretty()
```

#### View a specific case:
```javascript
db.cases.findOne({ caseNumber: "CASE-2024-001" })
```

### Step 8: Check Collection Statistics

```javascript
// Get collection stats
db.documents.stats()
db.cases.stats()
db.tasks.stats()
db.deadlines.stats()
```

### Step 9: Aggregate Data (Group by Status)

```javascript
// Documents by status
db.documents.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Cases by status
db.cases.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Tasks by status
db.tasks.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

### Step 10: Exit MongoDB Shell

```javascript
exit
```

---

## Method 2: Using MongoDB Compass (GUI Tool) - Recommended

MongoDB Compass provides a visual interface to browse your data.

### Step 1: Download MongoDB Compass

- **Windows/macOS/Linux**: Download from https://www.mongodb.com/try/download/compass
- Or install via Homebrew (macOS): `brew install --cask mongodb-compass`

### Step 2: Connect to MongoDB

1. Open MongoDB Compass
2. Connection String: `mongodb://localhost:27017`
3. Click **"Connect"**

### Step 3: Navigate to Your Database

1. In the left sidebar, click on **"legaltech"** database
2. You'll see all 4 collections listed:
   - documents
   - cases
   - tasks
   - deadlines

### Step 4: View Collection Data

1. Click on any collection (e.g., "documents")
2. You'll see all documents in a table format
3. Click on any document to view its full details
4. Use filters and search at the top

### Step 5: Verify Data

- **Documents Collection**: Should have 6 documents
- **Cases Collection**: Should have 5 cases
- **Tasks Collection**: Should have 6 tasks
- **Deadlines Collection**: Should have 5 deadlines

### Step 6: Use Schema Tab

- Click the **"Schema"** tab to see the structure
- Verify fields match the expected schema

---

## Method 3: Using Node.js Script (Automated Check)

We've created a script to automatically check your data.

### Run the Check Script:

```bash
cd backend
node scripts/checkData.js
```

**Expected Output:**
```
✅ Connected to MongoDB

📄 DOCUMENTS:
   Total: 6
   Sample documents:
   1. Merger Agreement Draft - Status: In Review - Client: TechCorp Inc.
   2. Employment Contract Template - Status: Approved - Client: Global Industries
   3. Patent Application Brief - Status: Pending - Client: InnovateLabs

⚖️  CASES:
   Total: 5
   Sample cases:
   1. CASE-2024-001 - Corporate Merger Agreement - Status: In Progress
   2. CASE-2024-002 - Employment Dispute Resolution - Status: Open
   3. CASE-2024-003 - Patent Infringement Case - Status: In Progress

✅ TASKS:
   Total: 6
   Sample tasks:
   1. Review Merger Agreement - Status: In Progress - Assigned: Sarah Johnson
   2. Research Patent Precedents - Status: In Progress - Assigned: Emily Rodriguez
   3. Draft Employment Contract - Status: Completed - Assigned: Michael Chen

📅 DEADLINES:
   Total: 5
   Sample deadlines:
   1. Court Filing Deadline - Date: 3/25/2024 - Status: Due Soon
   2. Patent Response Deadline - Date: 4/5/2024 - Status: Upcoming
   3. Contract Expiry Review - Date: 5/15/2024 - Status: Upcoming

📊 SUMMARY:
   Documents: 6
   Cases: 5
   Tasks: 6
   Deadlines: 5
   Total Records: 22

📈 STATUS DISTRIBUTIONS:
   Documents by Status:
     In Review: 2
     Approved: 2
     Pending: 2
   Cases by Status:
     In Progress: 2
     Open: 2
     On Hold: 1
   Tasks by Status:
     In Progress: 3
     Completed: 2
     Not Started: 1
```

---

## Method 4: Using API Endpoints (Via Browser/Postman)

You can also verify data through the API endpoints.

### Check via Browser:

1. **Health Check:**
   ```
   http://localhost:5000/api/health
   ```

2. **Get All Documents:**
   ```
   http://localhost:5000/api/documents
   ```

3. **Get All Cases:**
   ```
   http://localhost:5000/api/cases
   ```

4. **Get All Tasks:**
   ```
   http://localhost:5000/api/tasks
   ```

5. **Get All Deadlines:**
   ```
   http://localhost:5000/api/deadlines
   ```

6. **Get Dashboard Overview:**
   ```
   http://localhost:5000/api/dashboard/overview
   ```

### Check via Frontend:

1. Start the frontend: `cd frontend && npm start`
2. Open `http://localhost:3000`
3. Navigate to each page to see the data:
   - Dashboard
   - Documents
   - Cases
   - Tasks
   - Deadlines

---

## Quick Verification Checklist

Use this checklist to verify your data is correct:

- [ ] MongoDB is running
- [ ] Database `legaltech` exists
- [ ] 4 collections exist: documents, cases, tasks, deadlines
- [ ] Documents collection has 6 documents
- [ ] Cases collection has 5 cases
- [ ] Tasks collection has 6 tasks
- [ ] Deadlines collection has 5 deadlines
- [ ] Each document has required fields (title, status, clientName, etc.)
- [ ] Each case has required fields (caseNumber, title, status, etc.)
- [ ] Status values match expected enums
- [ ] Dates are properly formatted
- [ ] Relationships between collections exist (caseId references)

---

## Common Issues & Solutions

### Issue: No Collections Found

**Solution:**
```bash
cd backend
npm run seed
```

### Issue: Empty Collections

**Solution:**
Run the seed script again:
```bash
cd backend
npm run seed
```

### Issue: Cannot Connect to MongoDB

**Solution:**
1. Check if MongoDB is running:
   - Windows: Check Services (services.msc)
   - macOS: `brew services list`
   - Linux: `sudo systemctl status mongod`

2. Verify connection string in `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/legaltech
   ```

### Issue: Wrong Database Name

**Solution:**
1. Check database name in MongoDB:
   ```javascript
   show dbs
   ```

2. Update `.env` file if needed:
   ```
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   ```

---

## Useful MongoDB Shell Commands Reference

```javascript
// Switch database
use legaltech

// List collections
show collections

// Count documents
db.documents.countDocuments()

// Find all
db.documents.find()

// Find with filter
db.documents.find({ status: "Pending" })

// Find one
db.documents.findOne()

// Sort results
db.documents.find().sort({ uploadedDate: -1 })

// Limit results
db.documents.find().limit(5)

// Pretty print
db.documents.find().pretty()

// Delete all (be careful!)
db.documents.deleteMany({})

// Drop collection (be careful!)
db.documents.drop()
```

---

## Expected Data Summary

After running the seed script, you should have:

- **6 Documents** with various statuses (Pending, In Review, Approved)
- **5 Cases** with different types (Corporate, Employment, IP, etc.)
- **6 Tasks** with different statuses and priorities
- **5 Deadlines** with various types and dates

---

**Tip:** Use MongoDB Compass for the easiest visual way to browse your data! 🎯

