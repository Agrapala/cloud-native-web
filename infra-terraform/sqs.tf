resource "aws_sqs_queue" "video_queue" {
  name = "video-processing-queue"
}