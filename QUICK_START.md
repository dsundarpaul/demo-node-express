# 🏫 School CMS API - Quick Start Guide

## Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

The server will start on `http://localhost:3000`

---

## 🎯 Quick Demo - All 4 Features in 5 Minutes

### 1️⃣ File System (FS) Operations

**Add a Student:**
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Emma Watson", "grade": "10th", "age": 16, "parentContact": "+1-555-0123"}'
```

**View All Students:**
```bash
curl http://localhost:3000/api/students
```

✅ **What's Happening:**
- Data is saved to `data/students.json` using `fs.writeFileSync()`
- Retrieved using `fs.readFileSync()`

---

### 2️⃣ Data Streaming

**Stream a Student Report:**
```bash
curl http://localhost:3000/api/stream/report/1
```

**Stream Large File Export:**
```bash
curl http://localhost:3000/api/stream/large-file
```

✅ **What's Happening:**
- Uses `fs.createReadStream()` to read data
- Sends response in chunks with `Transfer-Encoding: chunked`
- Demonstrates `.pipe()` for efficient memory usage

---

### 3️⃣ File/Image Handling

**Upload a Student Photo:**
```bash
curl -X POST http://localhost:3000/api/upload/student-photo \
  -F "photo=@/path/to/your/image.jpg" \
  -F "studentId=1"
```

**List All Uploads:**
```bash
curl http://localhost:3000/api/uploads/list
```

**Download a File:**
```bash
curl http://localhost:3000/api/download/[filename] --output downloaded.jpg
```

✅ **What's Happening:**
- Multer handles multipart/form-data uploads
- Files validated (type, size)
- Stored in `uploads/` directory
- Downloads use streaming with `fs.createReadStream()`

---

### 4️⃣ Event Emitting (Real-Time Events)

**Option A: Using Browser (Recommended)**

1. Open in browser:
```
http://localhost:3000/public/events-test.html
```

2. Click "Connect to Events"
3. In another terminal, create a student or upload a file
4. Watch events appear in real-time! 🎉

**Option B: Using Terminal**

Terminal 1 (Event Listener):
```bash
curl -N http://localhost:3000/api/events/listen
```

Terminal 2 (Trigger Events):
```bash
# This will trigger a 'studentAdded' event
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "grade": "9th", "age": 15, "parentContact": "+1-555-9999"}'
```

✅ **What's Happening:**
- Uses Node.js `EventEmitter` class
- Server-Sent Events (SSE) for real-time updates
- Events logged to console and `data/activity.log`

---

## 🧪 Automated Test Script

Run all tests automatically:

```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 📊 Event Types You'll See

| Event | Trigger | Data Included |
|-------|---------|---------------|
| `studentAdded` | POST `/api/students` | Student info |
| `gradeUpdated` | POST `/api/grades` | Grade details |
| `announcementCreated` | POST `/api/announcements` | Announcement info |
| `fileUploaded` | POST `/api/upload/*` | File metadata |

---

## 🗂️ Directory Structure After Running

```
node-express/
├── data/                    # FS operations
│   ├── students.json
│   ├── announcements.json
│   ├── grades.json
│   └── activity.log        # Event logs
├── uploads/                # File uploads
│   └── [uploaded files]
├── public/
│   └── events-test.html    # Event monitor
└── server.js
```

---

## 🔍 Key Node.js Concepts Demonstrated

### 1. File System (fs module)
```javascript
fs.readFileSync()   // Synchronous read
fs.writeFileSync()  // Synchronous write
fs.createReadStream() // Streaming read
fs.existsSync()     // Check file existence
```

### 2. Streaming
```javascript
createReadStream()  // Read streams
res.write()         // Write chunks
stream.pipe(res)    // Pipe streams
Transfer-Encoding: chunked
```

### 3. File Handling
```javascript
multer()           // File upload middleware
fileFilter         // Validation
diskStorage        // Storage configuration
```

### 4. Event Emitting
```javascript
EventEmitter       // Event-driven architecture
.emit()           // Trigger events
.on()             // Listen to events
Server-Sent Events // Real-time browser updates
```

---

## 💡 Pro Tips

2. **Check Activity Log:** `data/activity.log` keeps a permanent record
3. **Use the HTML Monitor:** Best way to visualize real-time events
4. **Test Multiple Tabs:** Open multiple browser tabs to see event broadcasting

---

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
lsof -ti:3000 | xargs kill -9
```

**Can't upload files?**
- Check file type (JPEG, PNG, GIF, PDF only)
- Check file size (max 5MB)

**Events not appearing?**
- Make sure you're connected to `/api/events/listen`
- Try refreshing the browser
- Check server is running

---

## 📚 Full API Documentation

See `API_DEMO.md` for complete endpoint documentation with examples.

---

## 🎓 Learning Outcomes

After running this demo, you'll understand:
- ✅ How to read/write files with Node.js `fs` module
- ✅ How to stream data efficiently
- ✅ How to handle file uploads with validation
- ✅ How to implement event-driven architecture
- ✅ How to use Server-Sent Events for real-time updates
- ✅ How to build a RESTful API with Express

Enjoy exploring the School CMS! 🚀

