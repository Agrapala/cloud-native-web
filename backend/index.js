const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

// simple in-memory queue
let queue = [];

app.post("/upload", upload.single("video"), (req, res) => {
    const job = {
        id: Date.now(),
        file: req.file.filename,
        status: "queued"
    };

    queue.push(job);

    res.json({
        message: "Uploaded successfully",
        job
    });
});

app.get("/queue", (req, res) => {
    res.json(queue);
});

app.listen(3000, () => {
    console.log("Backend running on port 3000");
});