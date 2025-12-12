import cv2
import requests
import time

# Start the camera
cap = cv2.VideoCapture(0)

print("Press 'q' to quit, 's' to analyze posture")


while True:
    ret,frame = cap.read();
    if not ret:
        break
    
    cv2.imshow("Posture Guardian test ",frame)
    
    key = cv2.waitKey(1) & 0xFF
    if key  == ord('s'):
        # encode frame
        _, buffer = cv2.imencode('.jpg',frame)
        
        # send to api
        files = {'file':('frame.jpg', buffer.tobytes(), 'image/jpeg')}
        response = requests.post('http://localhost:8000/analyze-posture', files=files)
        
        result = response.json()
        print(f"\n Posture: {result['posture_state']}")
        print(f" Confidence: {result['confidence']:.2f}")
        print(f"  Severity: {result['severity']:.2f}")
        print(f" Tips: {result['recommendations'][0]}")
        
cap.release()
cv2.destroyAllWindows
