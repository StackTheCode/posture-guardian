from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, Mock
from schemas.posture import PostureState
import pytest
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
            
            
    def test_analyze_posture_bad_posture(self):
        """Test analysis with bad posture detection """
        
        image = Image.new('RGB',(640,480),color='white')
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr,format='JPEG')
        img_byte_arr.seek(0)
        
        with patch('main.analysis_service.analyze_image') as mock_analyze:
            from schemas.posture import PostureAnalysisResponse
            
            mock_analyze.return_value = PostureAnalysisResponse(
                posture_state=PostureState.SLOUCHED,
                confidence=0.90,
                severity=0.75,
                recommendations=[
                    "Sit up straight with back against chair",
                    "Check if your chair has proper lumbar support"
                ],
                keypoints={"nose":{"x":0.5,"y":0.3, "confidence":0.9}}
            )
            
            response =client.post("/analyze-posture",
                                  files={"file":("test.jpg", img_byte_arr, "image/jpeg")})
            
            assert response.status_code == 200
            data = response.json()
            assert data["posture_state"] == "slouched"
            assert data["severity"] > 0.5
            assert len(data["recommendations"]) > 0
            
            
            
    def test_analyze_posture_no_file(self):
        """Test analysis without file upload"""
        response = client.post("/analyze-posture")
        
        assert response.status_code == 422
        
    
    def test_analyze_posture_invalid_file(self):
        """Test analysis with invalid file format """
        
        
        text_content =b"This is not an image"
        
        response = client.post(
            "/analyze-posture",
            files={"file": ("test.txt", io.BytesIO(text_content), "text/plain")}
        )
        assert response.status_code in [422,500]
        
    
    
    def test_metrics_endpoint(self):
        """Test Prometheus metrics endpoint """
        response = client.get("/metrics")
        
        assert response.status_code == 200
        assert "posture_analysis_requests_total" in response.text or response.headers.get("content-type")=="text/plain"
        
    
    @pytest.mark.asyncio
    async def test_concurrent_requests(self):
        """Test that API can handle concurrent requests """
        import asyncio
        async def make_request():
            image = Image.new('RGB', (640, 480), color='white')
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='JPEG')
            img_byte_arr.seek(0)
            
            return client.post("/analyze-posture", 
                               files={"file":("test.jpg",img_byte_arr, "image/jpeg")})
        
        
        
        with patch("main.analysis_service.analyze_image") as mock_analyze:
            from schemas.posture import PostureAnalysisResponse
            
            mock_analyze.return_value = PostureAnalysisResponse(
                posture_state=PostureState.GOOD,
                confidence=0.85,
                severity =0.2,
                recommendations=["Good"],
                keypoints={}
            )
            tasks = [make_request() for _ in range(5)]
            responses = await asyncio.gather(*tasks)
            
            for response in responses:
                assert response.status_code == 200



