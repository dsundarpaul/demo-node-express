import bodyParser from "body-parser";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import { EventEmitter } from "events";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SECRET_KEY = "this_is_unknown_secret_key";

const app = express();
const schoolEventEmitter = new EventEmitter();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));

const MOCK_USERS = [
  {
    id: 1,
    name: "john",
    password: "123",
    age: 20,
    phone: "1234567890",
  },
  {
    id: 2,
    name: "doe john",
    password: "123456",
    age: 21,
    phone: "1234567890",
  },
];

const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const STUDENTS_FILE = path.join(DATA_DIR, "students.json");
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, "announcements.json");
const GRADES_FILE = path.join(DATA_DIR, "grades.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

schoolEventEmitter.on("studentAdded", (student) => {
  console.log(`📢 NEW STUDENT ENROLLED: ${student.name} (ID: ${student.id})`);

  fs.appendFileSync(
    path.join(DATA_DIR, "activity.log"),
    `${new Date().toISOString()} - Student Added: ${student.name}\n`
  );
});

schoolEventEmitter.on("gradeUpdated", (data) => {
  console.log(
    `📊 GRADE UPDATED: Student ${data.studentId} - ${data.subject}: ${data.grade}`
  );
  fs.appendFileSync(
    path.join(DATA_DIR, "activity.log"),
    `${new Date().toISOString()} - Grade Updated: Student ${data.studentId}, ${
      data.subject
    }: ${data.grade}\n`
  );
});

schoolEventEmitter.on("announcementCreated", (announcement) => {
  console.log(`📣 NEW ANNOUNCEMENT: ${announcement.title}`);
  fs.appendFileSync(
    path.join(DATA_DIR, "activity.log"),
    `${new Date().toISOString()} - Announcement Created: ${
      announcement.title
    }\n`
  );
});

schoolEventEmitter.on("fileUploaded", (fileInfo) => {
  console.log(
    `📁 FILE UPLOADED: ${fileInfo.filename} by ${fileInfo.uploadedBy}`
  );
  fs.appendFileSync(
    path.join(DATA_DIR, "activity.log"),
    `${new Date().toISOString()} - File Uploaded: ${fileInfo.filename}\n`
  );
});

const authenticateUser = (req, res, next) => {
  const newAuth = req.headers.authorization.split(" ")[1];

  jwt.verify(newAuth, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      next();
    }
  });
};

app.get("/", (req, res) => {
  res.status(200).json({
    message: "🏫 School CMS API - Node.js Feature Demonstrations",
    documentation: {
      quickStart: "See QUICK_START.md",
      fullAPI: "See API_DEMO.md",
      eventMonitor: "http://localhost:3000/public/events-test.html",
    },
    features: {
      "1. File System Operations": {
        description:
          "Read/write JSON files for students, announcements, and grades",
        endpoints: [
          "POST /api/students",
          "GET /api/students",
          "GET /api/students/:id",
          "PUT /api/students/:id",
          "DELETE /api/students/:id",
          "POST /api/announcements",
          "GET /api/announcements",
          "POST /api/grades",
          "GET /api/grades/:studentId",
        ],
      },
      "2. Data Streaming": {
        description: "Stream data using createReadStream and chunked encoding",
        endpoints: [
          "GET /api/stream/report/:studentId",
          "GET /api/stream/large-file",
          "GET /api/logs/activity",
        ],
      },
      "3. File/Image Handling": {
        description: "Upload and download files with Multer (images, PDFs)",
        endpoints: [
          "POST /api/upload/student-photo",
          "POST /api/upload/document",
          "GET /api/download/:filename",
          "GET /api/uploads/list",
        ],
      },
      "4. Event Emitting": {
        description:
          "Real-time events using EventEmitter and Server-Sent Events",
        endpoints: ["GET /api/events/listen (SSE)", "POST /api/events/trigger"],
        events: [
          "studentAdded",
          "gradeUpdated",
          "announcementCreated",
          "fileUploaded",
        ],
      },
    },
    quickTest: {
      createStudent:
        'curl -X POST http://localhost:3000/api/students -H \'Content-Type: application/json\' -d \'{"name":"Test","grade":"10th","age":16,"parentContact":"+1-555-0000"}\'',
      getStudents: "curl http://localhost:3000/api/students",
      streamReport: "curl http://localhost:3000/api/stream/report/1",
      listenEvents: "curl -N http://localhost:3000/api/events/listen",
    },
  });
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const user = MOCK_USERS.find(
    (user) => user.name === name && user.password === password
  );

  if (user) {
    jwt.sign(
      { user },
      "this_is_unknown_secret_key",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          res.status(500).json({ message: "Error generating token" });
        } else {
          res
            .status(200)
            .json({ message: "Login successful", user: { ...user, token } });
        }
      }
    );
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/users", authenticateUser, (req, res) => {
  res.status(200).json(MOCK_USERS);
});

app.post("/api/students", (req, res) => {
  try {
    const { name, grade, age, parentContact } = req.body;

    let students = [];
    if (fs.existsSync(STUDENTS_FILE)) {
      const data = fs.readFileSync(STUDENTS_FILE, "utf-8");
      students = JSON.parse(data);
    }

    const newStudent = {
      id: students.length + 1,
      name,
      grade,
      age,
      parentContact,
      enrolledAt: new Date().toISOString(),
    };

    students.push(newStudent);

    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));

    schoolEventEmitter.emit("studentAdded", newStudent);

    res.status(201).json({
      message: "Student enrolled successfully",
      student: newStudent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/students", (req, res) => {
  try {
    if (!fs.existsSync(STUDENTS_FILE)) {
      return res.status(200).json([]);
    }

    const data = fs.readFileSync(STUDENTS_FILE, "utf-8");
    const students = JSON.parse(data);

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/students/:id", (req, res) => {
  try {
    if (!fs.existsSync(STUDENTS_FILE)) {
      return res.status(404).json({ message: "Student not found" });
    }

    const data = fs.readFileSync(STUDENTS_FILE, "utf-8");
    const students = JSON.parse(data);
    const student = students.find((s) => s.id === parseInt(req.params.id));

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/students/:id", (req, res) => {
  try {
    if (!fs.existsSync(STUDENTS_FILE)) {
      return res.status(404).json({ message: "Student not found" });
    }

    const data = fs.readFileSync(STUDENTS_FILE, "utf-8");
    let students = JSON.parse(data);
    const index = students.findIndex((s) => s.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    students[index] = { ...students[index], ...req.body };

    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));

    res.status(200).json({
      message: "Student updated successfully",
      student: students[index],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/students/:id", (req, res) => {
  try {
    if (!fs.existsSync(STUDENTS_FILE)) {
      return res.status(404).json({ message: "Student not found" });
    }

    const data = fs.readFileSync(STUDENTS_FILE, "utf-8");
    let students = JSON.parse(data);
    const filteredStudents = students.filter(
      (s) => s.id !== parseInt(req.params.id)
    );

    if (students.length === filteredStudents.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(filteredStudents, null, 2));

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/announcements", (req, res) => {
  try {
    const { title, content, priority } = req.body;

    let announcements = [];
    if (fs.existsSync(ANNOUNCEMENTS_FILE)) {
      const data = fs.readFileSync(ANNOUNCEMENTS_FILE, "utf-8");
      announcements = JSON.parse(data);
    }

    const newAnnouncement = {
      id: announcements.length + 1,
      title,
      content,
      priority: priority || "normal",
      createdAt: new Date().toISOString(),
    };

    announcements.push(newAnnouncement);

    fs.writeFileSync(
      ANNOUNCEMENTS_FILE,
      JSON.stringify(announcements, null, 2)
    );

    schoolEventEmitter.emit("announcementCreated", newAnnouncement);

    res.status(201).json({
      message: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/announcements", (req, res) => {
  try {
    if (!fs.existsSync(ANNOUNCEMENTS_FILE)) {
      return res.status(200).json([]);
    }

    const data = fs.readFileSync(ANNOUNCEMENTS_FILE, "utf-8");
    const announcements = JSON.parse(data);

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/stream/report/:studentId", (req, res) => {
  try {
    const studentId = req.params.studentId;

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const reportStream = fs.createReadStream(STUDENTS_FILE);

    res.write(`STUDENT REPORT - GENERATED ON ${new Date().toISOString()}\n`);
    res.write("=".repeat(60) + "\n\n");

    let studentData = "";

    reportStream.on("data", (chunk) => {
      studentData += chunk.toString();
    });

    reportStream.on("end", () => {
      try {
        const students = JSON.parse(studentData);
        const student = students.find((s) => s.id === parseInt(studentId));

        if (student) {
          res.write(`Student ID: ${student.id}\n`);
          res.write(`Name: ${student.name}\n`);
          res.write(`Grade: ${student.grade}\n`);
          res.write(`Age: ${student.age}\n`);
          res.write(`Parent Contact: ${student.parentContact}\n`);
          res.write(`Enrolled At: ${student.enrolledAt}\n\n`);
          res.write("=".repeat(60) + "\n");
          res.write("END OF REPORT\n");
        } else {
          res.write("Student not found\n");
        }

        res.end();
      } catch (error) {
        res.write(`Error: ${error.message}\n`);
        res.end();
      }
    });

    reportStream.on("error", (error) => {
      res.write(`Error reading data: ${error.message}\n`);
      res.end();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/stream/large-file", (req, res) => {
  try {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    res.write("SCHOOL DATABASE EXPORT\n");
    res.write("Generated: " + new Date().toISOString() + "\n");
    res.write("=".repeat(80) + "\n\n");

    let counter = 0;
    const interval = setInterval(() => {
      if (counter < 10) {
        res.write(`Record ${counter + 1}: Student data chunk ${counter + 1}\n`);
        counter++;
      } else {
        res.write("\n" + "=".repeat(80) + "\n");
        res.write("END OF EXPORT\n");
        res.end();
        clearInterval(interval);
      }
    }, 100);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed."),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.post("/api/upload/student-photo", upload.single("photo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.body.studentId || "unknown",
      uploadedAt: new Date().toISOString(),
    };

    schoolEventEmitter.emit("fileUploaded", fileInfo);

    res.status(200).json({
      message: "Student photo uploaded successfully",
      file: fileInfo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/upload/document", upload.single("document"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      documentType: req.body.documentType || "general",
      uploadedAt: new Date().toISOString(),
    };

    schoolEventEmitter.emit("fileUploaded", fileInfo);

    res.status(200).json({
      message: "Document uploaded successfully",
      file: fileInfo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/download/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const stat = fs.statSync(filePath);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", stat.size);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/uploads/list", (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);

    const fileDetails = files.map((filename) => {
      const filePath = path.join(UPLOADS_DIR, filename);
      const stats = fs.statSync(filePath);

      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      };
    });

    res.status(200).json(fileDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/grades", (req, res) => {
  try {
    const { studentId, subject, grade, semester } = req.body;

    let grades = [];
    if (fs.existsSync(GRADES_FILE)) {
      const data = fs.readFileSync(GRADES_FILE, "utf-8");
      grades = JSON.parse(data);
    }

    const newGrade = {
      id: grades.length + 1,
      studentId,
      subject,
      grade,
      semester,
      recordedAt: new Date().toISOString(),
    };

    grades.push(newGrade);

    fs.writeFileSync(GRADES_FILE, JSON.stringify(grades, null, 2));

    schoolEventEmitter.emit("gradeUpdated", newGrade);

    res.status(201).json({
      message: "Grade recorded successfully",
      grade: newGrade,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/grades/:studentId", (req, res) => {
  try {
    if (!fs.existsSync(GRADES_FILE)) {
      return res.status(200).json([]);
    }

    const data = fs.readFileSync(GRADES_FILE, "utf-8");
    const grades = JSON.parse(data);
    const studentGrades = grades.filter(
      (g) => g.studentId === parseInt(req.params.studentId)
    );

    res.status(200).json(studentGrades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/events/listen", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("data: Connected to school events stream\n\n");

  const studentAddedHandler = (student) => {
    res.write(
      `data: ${JSON.stringify({ event: "studentAdded", data: student })}\n\n`
    );
  };

  const gradeUpdatedHandler = (grade) => {
    res.write(
      `data: ${JSON.stringify({ event: "gradeUpdated", data: grade })}\n\n`
    );
  };

  const announcementHandler = (announcement) => {
    res.write(
      `data: ${JSON.stringify({
        event: "announcementCreated",
        data: announcement,
      })}\n\n`
    );
  };

  const fileUploadedHandler = (fileInfo) => {
    res.write(
      `data: ${JSON.stringify({ event: "fileUploaded", data: fileInfo })}\n\n`
    );
  };

  schoolEventEmitter.on("studentAdded", studentAddedHandler);
  schoolEventEmitter.on("gradeUpdated", gradeUpdatedHandler);
  schoolEventEmitter.on("announcementCreated", announcementHandler);
  schoolEventEmitter.on("fileUploaded", fileUploadedHandler);

  req.on("close", () => {
    schoolEventEmitter.off("studentAdded", studentAddedHandler);
    schoolEventEmitter.off("gradeUpdated", gradeUpdatedHandler);
    schoolEventEmitter.off("announcementCreated", announcementHandler);
    schoolEventEmitter.off("fileUploaded", fileUploadedHandler);
  });
});

app.post("/api/events/trigger", (req, res) => {
  try {
    const { eventType, data } = req.body;

    schoolEventEmitter.emit(eventType, data);

    res.status(200).json({
      message: `Event '${eventType}' triggered successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/logs/activity", (req, res) => {
  try {
    const logFile = path.join(DATA_DIR, "activity.log");

    if (!fs.existsSync(logFile)) {
      return res.status(200).send("No activity logs found");
    }

    const logStream = fs.createReadStream(logFile);

    res.setHeader("Content-Type", "text/plain");
    logStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("🏫 School CMS Server is running on port 3000");
  console.log("📚 Available endpoints:");
  console.log(
    "  - FS Operations: /api/students, /api/announcements, /api/grades"
  );
  console.log("  - Streaming: /api/stream/report/:id, /api/stream/large-file");
  console.log(
    "  - File Handling: /api/upload/student-photo, /api/download/:filename"
  );
  console.log("  - Event Emitting: /api/events/listen, /api/events/trigger");
});
