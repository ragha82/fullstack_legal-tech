# MongoDB Setup Guide - Step by Step

This guide provides detailed instructions for setting up MongoDB from scratch on different operating systems.

## Table of Contents
1. [Windows Setup](#windows-setup)
2. [macOS Setup](#macos-setup)
3. [Linux Setup](#linux-setup)
4. [Verification](#verification)
5. [Common Issues](#common-issues)

---

## Windows Setup

### Step 1: Download MongoDB

1. Visit the official MongoDB download page:
   ```
   https://www.mongodb.com/try/download/community
   ```

2. Select:
   - **Version**: Latest stable version (recommended)
   - **Platform**: Windows
   - **Package**: MSI

3. Click "Download" and save the installer file

### Step 2: Install MongoDB

1. **Run the Installer**:
   - Double-click the downloaded `.msi` file
   - Click "Next" on the welcome screen

2. **Accept License Agreement**:
   - Check "I accept the terms in the License Agreement"
   - Click "Next"

3. **Choose Setup Type**:
   - Select **"Complete"** (recommended for beginners)
   - Click "Next"

4. **Service Configuration**:
   - Check **"Install MongoDB as a Service"**
   - Select **"Run service as Network Service user"** (default)
   - Service Name: `MongoDB` (default)
   - Click "Next"

5. **Install MongoDB Compass** (Optional but recommended):
   - Check "Install MongoDB Compass" to install the GUI tool
   - Click "Next"

6. **Install**:
   - Click "Install" and wait for installation to complete
   - Click "Finish" when done

### Step 3: Verify Installation

1. **Check MongoDB Service**:
   - Press `Win + R`, type `services.msc`, press Enter
   - Look for "MongoDB" service
   - Status should be "Running"

2. **Test MongoDB Connection**:
   - Open Command Prompt or PowerShell
   - Run:
     ```bash
     mongosh
     ```
   - Or if using older MongoDB version:
     ```bash
     mongo
     ```
   - You should see MongoDB shell prompt: `>`

3. **Exit MongoDB Shell**:
   - Type `exit` and press Enter

### Step 4: Configure MongoDB

1. **Default Installation Path**:
   - Data Directory: `C:\Program Files\MongoDB\Server\<version>\data\db`
   - Log Directory: `C:\Program Files\MongoDB\Server\<version>\log`

2. **MongoDB Configuration File**:
   - Location: `C:\Program Files\MongoDB\Server\<version>\bin\mongod.cfg`
   - You can edit this file to customize MongoDB settings

---

## macOS Setup

### Step 1: Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Add MongoDB Tap

```bash
brew tap mongodb/brew
```

### Step 3: Install MongoDB

```bash
brew install mongodb-community
```

### Step 4: Start MongoDB Service

```bash
brew services start mongodb-community
```

### Step 5: Verify Installation

```bash
mongosh
```

You should see the MongoDB shell prompt.

---

## Linux Setup (Ubuntu/Debian)

### Step 1: Import MongoDB GPG Key

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
```

### Step 2: Add MongoDB Repository

For Ubuntu 20.04 (Focal):
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

For Ubuntu 22.04 (Jammy):
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

### Step 3: Update Package List

```bash
sudo apt-get update
```

### Step 4: Install MongoDB

```bash
sudo apt-get install -y mongodb-org
```

### Step 5: Start MongoDB Service

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 6: Verify Installation

```bash
mongosh
```

---

## Verification

### Test MongoDB Connection

1. **Start MongoDB Shell**:
   ```bash
   mongosh
   ```

2. **Run Test Commands**:
   ```javascript
   // Show current database
   db
   
   // Show all databases
   show dbs
   
   // Create a test database
   use testdb
   
   // Insert a test document
   db.test.insertOne({name: "MongoDB Test", status: "working"})
   
   // Find the document
   db.test.find()
   
   // Exit
   exit
   ```

### Check MongoDB Status

**Windows**:
```bash
# Check service status
sc query MongoDB

# Or check in Services GUI
services.msc
```

**macOS**:
```bash
brew services list
```

**Linux**:
```bash
sudo systemctl status mongod
```

---

## Common Issues

### Issue 1: MongoDB Service Won't Start

**Windows**:
- Check if port 27017 is already in use:
  ```bash
  netstat -ano | findstr :27017
  ```
- Check MongoDB logs:
  - Location: `C:\Program Files\MongoDB\Server\<version>\log\mongod.log`
- Restart the service:
  ```bash
  net stop MongoDB
  net start MongoDB
  ```

**macOS**:
```bash
brew services restart mongodb-community
```

**Linux**:
```bash
sudo systemctl restart mongod
sudo journalctl -u mongod -n 50
```

### Issue 2: Permission Denied Errors

**Linux**:
```bash
# Fix data directory permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
```

### Issue 3: MongoDB Shell Not Found

- Ensure MongoDB bin directory is in PATH
- Windows: Usually `C:\Program Files\MongoDB\Server\<version>\bin`
- Add to PATH environment variable if needed

### Issue 4: Connection Refused

1. **Check if MongoDB is running**:
   - Windows: Check Services
   - macOS: `brew services list`
   - Linux: `sudo systemctl status mongod`

2. **Check MongoDB port**:
   - Default port: 27017
   - Verify it's not blocked by firewall

3. **Check connection string**:
   - Should be: `mongodb://localhost:27017/legaltech`

---

## MongoDB Compass (GUI Tool)

MongoDB Compass is a graphical tool for managing MongoDB databases.

### Installation

**Windows**: Included with MongoDB installer (if selected)

**macOS**:
```bash
brew install --cask mongodb-compass
```

**Linux**: Download from https://www.mongodb.com/try/download/compass

### Usage

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Click "Connect"
4. Browse databases and collections visually

---

## Next Steps

After MongoDB is installed and running:

1. **Create Database for Legal Tech App**:
   ```bash
   mongosh
   use legaltech
   exit
   ```

2. **Update Backend Configuration**:
   - Edit `backend/.env` file
   - Set `MONGODB_URI=mongodb://localhost:27017/legaltech`

3. **Run Seed Script**:
   ```bash
   cd backend
   npm run seed
   ```

4. **Start Backend Server**:
   ```bash
   npm run dev
   ```

---

## Additional Resources

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Community Forums](https://developer.mongodb.com/community/forums/)

---

**Congratulations! MongoDB is now installed and ready to use! 🎉**

