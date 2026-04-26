const AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-south-1"
});

const sqs = new AWS.SQS();
const sns = new AWS.SNS();

// 🔹 YOUR DETAILS
const QUEUE_URL = process.env.SQS_QUEUE_URL || "https://sqs.ap-south-1.amazonaws.com/632813643911/video-processing-queue";
const TOPIC_ARN = process.env.SNS_TOPIC_ARN || "arn:aws:sns:ap-south-1:632813643911:web-native.fifo:1016daef-5083-4a53-bac9-677eab0be73d";

async function processVideo(job) {
    console.log("Processing video:", job.videoUrl);

    // simulate processing
    await new Promise(r => setTimeout(r, 5000));

    console.log("Processing completed:", job.fileName);
}

async function pollQueue() {
    try {
        const data = await sqs.receiveMessage({
            QueueUrl: QUEUE_URL,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10
        }).promise();

        if (!data.Messages) return;

        for (const msg of data.Messages) {
            const body = JSON.parse(msg.Body);

            await processVideo(body);

            // delete message
            await sqs.deleteMessage({
                QueueUrl: QUEUE_URL,
                ReceiptHandle: msg.ReceiptHandle
            }).promise();

            // 📢 SNS Notification
            const publishParams = {
                TopicArn: TOPIC_ARN,
                Message: `Video processed: ${body.fileName}`
            };

            if (TOPIC_ARN.endsWith(".fifo")) {
                publishParams.MessageGroupId = "video-processing";
                publishParams.MessageDeduplicationId = `${body.fileName}-${Date.now()}`;
            }

            await sns.publish(publishParams).promise();

            console.log("SNS Notification sent");
        }

    } catch (err) {
        console.error("Worker error:", err.message);
    }
}

setInterval(pollQueue, 5000);