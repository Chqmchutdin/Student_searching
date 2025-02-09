const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");

// ใช้ CORS ให้กับทุกคำร้องขอ
app.use(cors());


app.use(express.json());
let db;
const client = new MongoClient("mongodb://localhost:27017");

client.connect().then(() => {
    db = client.db("students"); // ชื่อฐานข้อมูล 'students'
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB unconnected");
});
// ดึงข้อมูลทั้งหมดหรือค้นหาจาก studentId
app.get('/findstudents/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;  // ดึง studentId จาก URL parameters
        if (studentId) {
            // ค้นหานักศึกษาตาม studentId
            const student = await db.collection("students_info").find({ id: studentId }).toArray();
            if (student.length > 0) {
                res.json(student);  // ส่งผลลัพธ์เป็น array หากพบข้อมูล
            } else {
                res.json([]);  // หากไม่พบผลลัพธ์ใดๆ
            }
        } else {
            const students = await db.collection("students_info").find().toArray();
            res.json(students);  // หากไม่มี studentId ให้ดึงข้อมูลทั้งหมด
        }
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch students data." });
    }
});

// ดึงข้อมูลทั้งหมด
app.get('/students', async (req, res) => {
    try {
        const studentId = req.query.studentId;  // ดึง studentId จาก query parameter
        if (studentId) {
            const student = await db.collection("students_info").findOne({ studentId });
            if (student) {
                res.json([student]);  // ส่งผลลัพธ์เป็น array เพื่อให้แสดงผลเหมือนเดิม
            } else {
                res.json([]);  // หากไม่พบผลลัพธ์ใดๆ
            }
        } else {
            const students = await db.collection("students_info").find().toArray();
            res.json(students);
        }
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch students data." });
    }
});

// ดึงข้อมูลนักศึกษาตาม ID
app.get('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await db.collection("students_info").findOne({
            "_id": new ObjectId(id)
        });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch student." });
    }
});

// เพิ่มข้อมูลนักศึกษา
app.post('/students', async (req, res) => {
    try {
        const data = req.body;
        const student = await db.collection("students_info").insertOne(data);
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: "Unable to add student." });
    }
});

// แก้ไขข้อมูลนักศึกษา
app.put('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const student = await db.collection("students_info").updateOne({
            "_id": new ObjectId(id)
        }, {
            $set: data
        });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: "Unable to update student." });
    }
});

// ลบข้อมูลนักศึกษา
app.delete('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await db.collection("students_info").deleteOne({
            "_id": new ObjectId(id)
        });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: "Unable to delete student." });
    }
});

app.listen(3000, () => {
    console.log('Server started: success');
});

