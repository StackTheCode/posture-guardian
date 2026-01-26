from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, Mock
from schemas.posture import PostureState

from PIL import Image
import io


client = TestClient(app)

class TestAPI:
    
    def test_root_endpoint(self):
        """Test root endpoint return service info """
        
        response =client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "service" in data
        assert "version" in data
        assert data["service"] =="Posture Guardian ML Service"
        
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        
        
    def test_analyze_posture_success(self):
        """Test posture analysis with valid image"""
        
        image = Image.new('RGB', (640,480) ,color="white")
        img_byte_arr =io.BytesIO()
        image.save(img_byte_arr,format="JPEG")
        img_byte_arr.seek(0)
        
        
        with patch("main.analysis_service.analyze_image") as mock_analyze:
            from schemas.posture import PostureAnalysisResponse
            
            mock_analyze.return_value = PostureAnalysisResponse(
                posture_state=PostureState.GOOD,
                confidence=0.85,
                severity=0.2,
                recommendations=["Great posture! Keep it up!"],
                keypoints={"nose": {"x": 0.5, "y": 0.2, "confidence": 0.9}}
            )
            response = client.post(
                "/analyze-posture",
                files={"file":("test.jpg",img_byte_arr,"image/jpeg")}
            )
            
            assert response.status_code ==200
            data = response.json()
            assert data["posture_state"] == "good"
            assert data["confidence"] == 0.85
            assert data["severity"] == 0.2
            assert len(data["recommendations"]) > 0
            
    
    
    def test_analyze_posture_no_person(self):
        """Test analysis when no person detected  """
        
        image = Image.new('RGB', (640,480), color="white")
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr,format='JPEG')
        img_byte_arr.seek(0)
        
        with patch('main.analysis_service.analyze_image') as mock_analyze:
            from schemas.posture import PostureAnalysisResponse
            
            mock_analyze.return_value = PostureAnalysisResponse(
                posture_state=PostureState.NO_PERSON_DETECTED,
                confidence=0.0,
                severity=0.0,
                recommendations=["No person detected in frame"],
                keypoints={}
            )
            
            response = client.post(
                "/analyze-posture",
                files={"file":("test.jpg",img_byte_arr,"image/jpeg")}
            )
            
            assert response.status_code == 200
            data  = response.json()
            assert data["posture_state"] == "no_person_detected"