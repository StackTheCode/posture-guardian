import requests
# poetry run uvicorn main:app --reload
# poetry run python test_image_upload.py
image_path = "tests/data/test_image.jpg"
with open(image_path,'rb') as f :
    files = {'file':('image.jpg',f,'image/jpeg' )}
    response = requests.post('http://localhost:8000/analyze-posture', files=files)
    
    
    result = response.json()
    print(f"Posture: {result['posture_state']}")
    print(f"Confidence: {result['confidence']:.2f}")
    print(f"Severity: {result['severity']:.2f}")
    print(f"Recommendations:")
    for tip in result['recommendations']:
      print(f"   - {tip}")