# School CMS API - Feature Demonstrations

This Express app demonstrates four key Node.js concepts within a School CMS context:

## 🗂️ 1. File System (fs) Operations

### Student Management
Store and retrieve student records using JSON files.

**Create Student**
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emma Watson",
    "grade": "10th",
    "age": 16,
    "parentContact": "+1-555-0123"
  }'
```

**Get All Students**
```bash
curl http://localhost:3000/api/students
```

**Get Single Student**
```bash
curl http://localhost:3000/api/students/1
```

**Update Student**
```bash
curl -X PUT http://localhost:3000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"grade": "11th", "age": 17}'
```

**Delete Student**
```bash
curl -X DELETE http://localhost:3000/api/students/1
```

### Announcements
Manage school announcements stored in files.

**Create Announcement**
```bash
curl -X POST http://localhost:3000/api/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "School Holiday Notice",
    "content": "School will be closed on Monday for maintenance",
    "priority": "high"
  }'
```

**Get All Announcements**
```bash
curl http://localhost:3000/api/announcements
```

### Grades Management
Record and retrieve student grades.

**Add Grade**
```bash
curl -X POST http://localhost:3000/api/grades \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "subject": "Mathematics",
    "grade": "A",
    "semester": "Fall 2024"
  }'
```

**Get Student Grades**
```bash
curl http://localhost:3000/api/grades/1
```

---

## 🌊 2. Data Streaming

### Stream Student Report
Streams a formatted student report using readable streams.

```bash
curl http://localhost:3000/api/stream/report/1
```

This endpoint:
- Uses `fs.createReadStream()` to read student data
- Streams the response in chunks
- Demonstrates chunked transfer encoding

### Stream Large File Export
Simulates streaming a large database export.

```bash
curl http://localhost:3000/api/stream/large-file
```

This endpoint:
- Sends data in chunks over time
- Uses chunked transfer encoding
- Simulates real-time data generation

### Stream Activity Logs
Stream application logs in real-time.

```bash
curl http://localhost:3000/api/logs/activity
```

---

## 📁 3. Image/File Handling

### Upload Student Photo
Upload images with validation and file size limits.

```bash
curl -X POST http://localhost:3000/api/upload/student-photo \
  -F "photo=@/path/to/student-photo.jpg" \
  -F "studentId=1"
```

Features:
- File type validation (JPEG, PNG, GIF, PDF only)
- 5MB file size limit
- Unique filename generation
- Multer disk storage

### Upload Document
Upload school documents (transcripts, certificates, etc.).

```bash
curl -X POST http://localhost:3000/api/upload/document \
  -F "document=@/path/to/transcript.pdf" \
  -F "documentType=transcript"
```

### Download File
Download uploaded files using streaming.

```bash
curl http://localhost:3000/api/download/[filename] --output downloaded-file.jpg
```

### List All Uploads
Get metadata of all uploaded files.

```bash
curl http://localhost:3000/api/uploads/list
```

---

## 🔔 4. Event Emitting

The app uses Node.js EventEmitter to track school activities.

### Listen to Events (SSE - Server-Sent Events)
Keep connection open to receive real-time events.

```bash
curl -N http://localhost:3000/api/events/listen
```

This will stream events like:
- `studentAdded` - When a new student enrolls
- `gradeUpdated` - When grades are recorded
- `announcementCreated` - When announcements are posted
- `fileUploaded` - When files are uploaded

### Manually Trigger Custom Event
Trigger a custom event (for testing).

```bash
curl -X POST http://localhost:3000/api/events/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "customEvent",
    "data": {"message": "Test event"}
  }'
```

### Automatic Event Logging
All events are automatically logged to `data/activity.log`:
- Check server console for real-time event notifications
- Events are written to file system for audit trail

---

## 🚀 Getting Started

1. **Start the server:**
```bash
npm start
```

2. **View available endpoints:**
```bash
curl http://localhost:3000/
```

3. **Test the features:**
   - Use the curl commands above
   - Or use Postman/Insomnia
   - Check created directories: `data/` and `uploads/`

---

## 📂 Directory Structure

```
├── data/
│   ├── students.json       # Student records (FS operations)
│   ├── announcements.json  # School announcements
│   ├── grades.json         # Student grades
│   └── activity.log        # Event logs
├── uploads/                # Uploaded files (photos, documents)
└── server.js              # Main application
```

---

## 🎯 Feature Summary

| Feature | Endpoints | Demonstration |
|---------|-----------|---------------|
| **FS Operations** | `/api/students`, `/api/announcements`, `/api/grades` | `fs.readFileSync`, `fs.writeFileSync`, `fs.existsSync` |
| **Streaming** | `/api/stream/report/:id`, `/api/stream/large-file` | `fs.createReadStream`, chunked encoding, `.pipe()` |
| **File Handling** | `/api/upload/*`, `/api/download/:filename` | Multer, file validation, stream downloads |
| **Event Emitting** | `/api/events/listen`, auto-triggered on actions | EventEmitter, SSE, event listeners |

---

## 💡 Testing Workflow

1. **Add a student** (triggers `studentAdded` event)
2. **Open event listener** in another terminal
3. **Upload a photo** (triggers `fileUploaded` event)
4. **Add a grade** (triggers `gradeUpdated` event)
5. **Stream the student report**
6. **View activity logs**

Watch events appear in real-time in the console and event stream!

