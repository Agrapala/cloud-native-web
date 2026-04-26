const AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-south-1" // change if needed
});

const s3 = new AWS.S3();
const sqs = new AWS.SQS();

module.exports = { s3, sqs };