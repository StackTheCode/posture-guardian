
# Posture Guardian ML Engine Documentation

The Posture Guardian ML Engine is a FastAPI-based 
microservice designed to analyze human posture from images using Mediapipe and OpenCV. It provides real-time feedback, severity scoring, and corrective recommendations.
## Technical Architecture
The engine is structured into three primary layers:


API Layer (main.py): Handles HTTP requests, CORS, and Prometheus monitoring.

Service Layer (analysis.py): Manages the business logic, image decoding, and severity calculations.

Detection Layer (posture_detector.py): Utilizes Mediapipe Pose to extract 3D landmarks and apply geometric heuristics for classification.

## Core Features
Posture Classification: Detects states including GOOD, FORWARD_LEAN, SLOUCHED, SHOULDER_TILT, and TWISTED_SPINE.

Geometric Analysis: Calculates posture based on specific metrics:
Lean Angle: Measured between the ears and shoulder center.

Torso Ratio: Vertical distance between shoulders and hips relative to shoulder width.

Tilt Ratio: Vertical alignment of the left and right shoulders.

Health & Metrics: Includes /health for heartbeat checks and /metrics for testing (request counts and latency)

| Endpoint | Method   | Description                                              |
|:---------|:---------|:---------------------------------------------------------|
| `/`    | `GET` | Returns the service name, version (0.1.0), and current health status.|
| `/health` | `GET`  | Provides a health check confirmation and a UTC ISO timestamp. |
| `/analyze-posture`  | `POST`  | Accepts an image file via UploadFile to perform a detailed posture analysis|
| `/metrics`  | `GET`  | Exports metrics for request counts and processing duration.|  

