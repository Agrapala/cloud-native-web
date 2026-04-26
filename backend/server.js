const express = require("express");
const multer = require("multer");
const cors = require("cors");

const { s3, sqs } = require("./aws");

const app = express();
app.use(cors());

// 🔹 YOUR AWS DETAILS
const BUCKET = "your-s3-bucket-name";
const QUEUE_URL = process.env.SQS_QUEUE_URL || "https://sqs.ap-south-1.amazonaws.com/632813643911/video-processing-queue";

// memory upload
const upload = multer({ storage: multer.memoryStorage() });

// 🚀 Upload API
app.post("/upload", upload.single("video"), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // 1️⃣ Upload to S3
        const uploadResult = await s3.upload({
            Bucket: BUCKET,
            Key: `${Date.now()}-${file.originalname}`,
            Body: file.buffer
        }).promise();

        console.log("S3 Upload Success:", uploadResult.Location);

        // 2️⃣ Send message to SQS
        const message = {
            videoUrl: uploadResult.Location,
            fileName: file.originalname
        };

        await sqs.sendMessage({
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(message)
        }).promise();

        console.log("Sent to SQS");

        res.json({
            message: "Upload successful",
            videoUrl: uploadResult.Location
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
});

app.listen(3000, () => {
    console.log("Backend running on port 3000");
});