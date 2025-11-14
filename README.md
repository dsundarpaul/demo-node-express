# 🏫 School CMS API - Node.js Feature Demonstrations

A comprehensive Express.js application demonstrating four essential Node.js concepts through a School Content Management System.

## 🎯 Features Demonstrated

### 1. 🗂️ File System (fs) Operations
- Read and write JSON data files
- Synchronous file operations (`readFileSync`, `writeFileSync`)
- Directory creation and file existence checks
- CRUD operations for Students, Announcements, and Grades

### 2. 🌊 Data Streaming
- File streaming with `createReadStream()`
- Chunked transfer encoding
- Stream piping for efficient memory usage
- Real-time data generation and streaming

### 3. 📁 File/Image Handling
- File uploads with Multer middleware
- File type validation (JPEG, PNG, GIF, PDF)
- File size limits (5MB max)
- Stream-based file downloads
- Disk storage with unique filenames

### 4. 🔔 Event Emitting
- EventEmitter for application events
- Server-Sent Events (SSE) for real-time updates
- Automatic event logging
- Real-time browser notifications

---

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Start Server

```bash
npm start
```

Server runs on: `http://localhost:3000`

### View API Info

```bash
curl http://localhost:3000/
```

---

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick demo guide
- **[API_DEMO.md](./API_DEMO.md)** - Complete API documentation with examples
- **[Postman Collection](./School-CMS.postman_collection.json)** - Import into Postman for easy testing

---

## 🧪 Testing

### Option 1: Automated Test Script

```bash
chmod +x test-api.sh
./test-api.sh
```

### Option 2: Interactive Event Monitor (Browser)

Open in your browser:
```
http://localhost:3000/public/events-test.html
```

Click "Connect to Events" and watch real-time updates as you interact with the API!

### Option 3: Manual Testing with cURL

**Create a Student:**
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Emma Watson","grade":"10th","age":16,"parentContact":"+1-555-0123"}'
```

**Stream Report:**
```bash
curl http://localhost:3000/api/stream/report/1
```

**Listen to Events:**
```bash
curl -N http://localhost:3000/api/events/listen
```

---

## 📂 Project Structure

```
node-express/
├── server.js                           # Main application
├── package.json
├── README.md                           # This file
├── QUICK_START.md                      # Quick demo guide
├── API_DEMO.md                         # Full API documentation
├── test-api.sh                         # Automated test script
├── School-CMS.postman_collection.json  # Postman collection
├── public/
│   └── events-test.html               # Real-time event monitor
├── data/                              # Auto-generated
│   ├── students.json
│   ├── announcements.json
│   ├── grades.json
│   └── activity.log
└── uploads/                           # Auto-generated
    └── [uploaded files]
```

---

## 🎓 API Endpoints Overview

### File System Operations
```
POST   /api/students              # Create student
GET    /api/students              # Get all students
GET    /api/students/:id          # Get single student
PUT    /api/students/:id          # Update student
DELETE /api/students/:id          # Delete student

POST   /api/announcements         # Create announcement
GET    /api/announcements         # Get all announcements

POST   /api/grades                # Add grade
GET    /api/grades/:studentId     # Get student grades
```

### Data Streaming
```
GET    /api/stream/report/:studentId  # Stream formatted report
GET    /api/stream/large-file         # Stream large export
GET    /api/logs/activity              # Stream activity logs
```

### File Handling
```
POST   /api/upload/student-photo   # Upload student photo
POST   /api/upload/document        # Upload document
GET    /api/download/:filename     # Download file
GET    /api/uploads/list           # List all uploads
```

### Event Emitting
```
GET    /api/events/listen          # Listen to SSE stream
POST   /api/events/trigger         # Trigger custom event
```

---

## 🎯 Learning Objectives

By exploring this project, you'll understand:

✅ **File System Module**
- How to read/write files synchronously
- How to create directories programmatically
- How to check file existence
- Best practices for file-based data storage

✅ **Streaming**
- Why streaming is important for large files
- How to use readable streams
- How to pipe streams for efficiency
- Chunked transfer encoding

✅ **File Upload/Download**
- Multer middleware configuration
- File validation (type, size)
- Unique filename generation
- Stream-based downloads

✅ **Event-Driven Architecture**
- EventEmitter class usage
- Creating and listening to custom events
- Server-Sent Events for real-time updates
- Event logging for audit trails

---

## 🔍 Code Examples

### File System (fs)
```javascript
// Read JSON file
const data = fs.readFileSync('data/students.json', 'utf-8');
const students = JSON.parse(data);

// Write JSON file
fs.writeFileSync('data/students.json', JSON.stringify(students, null, 2));
```

### Streaming
```javascript
// Create read stream
const fileStream = fs.createReadStream(filePath);

// Pipe to response
fileStream.pipe(res);
```

### File Upload
```javascript
// Multer configuration
const upload = multer({
  storage: diskStorage,
  fileFilter: validateFileType,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Use in route
app.post('/upload', upload.single('photo'), handler);
```

### Event Emitting
```javascript
// Create emitter
const eventEmitter = new EventEmitter();

// Emit event
eventEmitter.emit('studentAdded', studentData);

// Listen to event
eventEmitter.on('studentAdded', (data) => {
  console.log('New student:', data.name);
});
```

---

## 🌟 Highlights

- ✨ **Clean Code**: Well-structured and readable
- 🎨 **Beautiful UI**: Modern event monitor with real-time updates
- 📝 **Comprehensive Docs**: Three levels of documentation
- 🧪 **Easy Testing**: Multiple testing options included
- 🏗️ **Production-Ready Patterns**: Real-world coding practices
- 🎯 **Educational**: Clear demonstrations of each concept

---

## 💡 Use Cases

This application demonstrates patterns useful for:

- Content Management Systems
- Student Information Systems
- File Upload Portals
- Real-time Notification Systems
- Activity Logging Systems
- Report Generation Systems

---

## 🛠️ Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **EventEmitter** - Event-driven architecture
- **Server-Sent Events** - Real-time updates
- **File System (fs)** - File operations

---

## 📊 Event Types

| Event | Triggered By | Data Included |
|-------|--------------|---------------|
| `studentAdded` | POST `/api/students` | Student details |
| `gradeUpdated` | POST `/api/grades` | Grade information |
| `announcementCreated` | POST `/api/announcements` | Announcement content |
| `fileUploaded` | POST `/api/upload/*` | File metadata |

All events are:
- Logged to console with emojis
- Written to `data/activity.log`
- Broadcast via Server-Sent Events

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Can't upload files:**
- Check file type (only JPEG, PNG, GIF, PDF allowed)
- Check file size (max 5MB)
- Ensure file field name matches ('photo' or 'document')

**Events not appearing:**
- Ensure you're connected to `/api/events/listen`
- Check server is running
- Try the browser-based event monitor

**Data not persisting:**
- Check `data/` and `uploads/` directories exist
- Check file permissions

---

## 🎉 Next Steps

1. **Start the server** - `npm start`
2. **Open event monitor** - Visit `http://localhost:3000/public/events-test.html`
3. **Run tests** - Execute `./test-api.sh`
4. **Explore API** - Import Postman collection
5. **Read docs** - Check QUICK_START.md and API_DEMO.md

---

## 📝 License

MIT

---

## 👨‍💻 Author

Created as an educational demonstration of Node.js core concepts.

---

**Happy Coding! 🚀**

For questions or issues, refer to the documentation files or check the console logs for debugging information.

