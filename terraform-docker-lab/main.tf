terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

provider "docker" {}

# ✅ Pull Docker Image
resource "docker_image" "student_backend_image" {
  name         = "vinaydaripelly/student-backend:latest"
  keep_locally = false
}

# ✅ Create Docker Container using Terraform
resource "docker_container" "student_backend_container" {
  name  = "student-backend-terraform"
  image = docker_image.student_backend_image.image_id

  ports {
    internal = 5000
    external = 5001
  }
}
