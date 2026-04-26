resource "aws_ecr_repository" "backend_repo" {
  name = "backend-repo"
}

resource "aws_ecr_repository" "worker_repo" {
  name = "worker-repo"
}