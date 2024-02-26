terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 3.5"
    }
  }

  required_version = ">= 0.12"
}

variable "zone" {
  description = "The zone to deploy resources in"
  default     = "us-central1-a"
}

provider "google" {
  project = "japangor"
  region  = "us-central1"
}

resource "google_compute_network" "vpc" {
  name                    = "my-vpc"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
}

resource "google_compute_subnetwork" "webapp_subnet" {
  name          = "webapp"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

resource "google_compute_subnetwork" "db_subnet" {
  name          = "db"
  ip_cidr_range = "10.0.2.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

resource "google_compute_route" "webapp_route" {
  name             = "webapp-route"
  dest_range       = "0.0.0.0/0"
  network          = google_compute_network.vpc.id
  next_hop_gateway = "default-internet-gateway"
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-app-traffic"
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports    = ["3000"]
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_instance" "webapp_instance" {
  name         = "webapp-instance"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "projects/japangor/global/images/packer-1708936713" # Update this with the correct image name
    }
  }

  network_interface {
    network    = google_compute_network.vpc.name
    subnetwork = google_compute_subnetwork.webapp_subnet.name

    access_config {
      // Assigns an external IP address
    }
  }

  metadata = {
    ssh-keys = "jaygo:${file("google_compute_engine.pub")}"
  }


  service_account {
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  tags = ["http-server", "https-server"]
}

output "webapp_instance_external_ip" {
  value = google_compute_instance.webapp_instance.network_interface[0].access_config[0].nat_ip
}
