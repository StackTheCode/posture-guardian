import cv2
from models.posture_detector import PostureDetector
import time

detector = PostureDetector()
cap = cv2.VideoCapture(0)

print("Testing posture detection...")
print("Press 'q' to quit")
print("Press 's' to save current frame for debugging")

frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    frame_count += 1
    
    # Detect every 5 frames (performance)
    if frame_count % 5 == 0:
        posture_state, confidence, keypoints = detector.detect(frame)
        
        # Display results on frame
        color = (0, 255, 0) if posture_state.value == "good" else (0, 165, 255) if confidence < 0.7 else (0, 0, 255)
        
        cv2.putText(frame, f"Posture: {posture_state.value}", 
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        cv2.putText(frame, f"Confidence: {confidence:.2f}", 
                    (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        
        # Draw keypoints
        if keypoints:
            h, w = frame.shape[:2]
            for name, kp in keypoints.items():
                x, y = int(kp['x'] * w), int(kp['y'] * h)
                cv2.circle(frame, (x, y), 5, (255, 0, 255), -1)
                cv2.putText(frame, name.split('_')[0], (x+10, y), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
    
    cv2.imshow('Posture Detection Test', frame)
    
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == ord('s'):
        filename = f"debug_frame_{int(time.time())}.jpg"
        cv2.imwrite(filename, frame)
        print(f"Saved {filename}")

cap.release()
cv2.destroyAllWindows()