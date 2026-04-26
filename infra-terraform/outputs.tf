output "s3_bucket" {
  value = aws_s3_bucket.video_bucket.bucket
}

output "sqs_url" {
  value = aws_sqs_queue.video_queue.id
}

output "sns_arn" {
  value = aws_sns_topic.video_topic.arn
}