const client = require("prom-client");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// ✅ Prometheus Metrics Setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// In-memory Student Database
let students = [
  {
    id: "1",
    name: "Rahul",
    rollNo: "101",
    department: "CSE",
    year: "3rd",
  },
];
// ✅ Prometheus Metrics Endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.end(metrics);
});
// ✅ Custom HTTP Request Counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
});

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.labels(
      req.method,
      req.route?.path || req.url,
      res.statusCode
    ).inc();
  });

  console.log(`${req.method} request received for ${req.url}`);
  next();
});

// ✅ GET - Fetch all students
app.get("/students", (req, res) => {
  res.status(200).json(students);
});

// ✅ POST - Add new student
app.post("/students", (req, res) => {
  const { name, rollNo, department, year } = req.body;

  const newStudent = {
    id: uuidv4(),
    name,
    rollNo,
    department,
    year,
  };

  students.push(newStudent);
  res.status(201).json({
    message: "Student added successfully",
    student: newStudent,
  });
});

// ✅ PATCH - Update student
app.patch("/students/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  students = students.map((student) =>
    student.id === id ? { ...student, ...updatedData } : student
  );

  res.json({ message: "Student updated successfully" });
});

// ✅ DELETE - Remove student
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  students = students.filter((student) => student.id !== id);

  res.json({ message: "Student deleted successfully" });
});
app.get("/test", (req, res) => {
  res.send("Dev branch working successfully!");
});
// Server start only if not in test mode
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;   // ✅ REQUIRED for automation testing
