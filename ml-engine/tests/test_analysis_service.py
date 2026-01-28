import pytest
import numpy as np
from unittest.mock import Mock, patch
from services.analysis import PostureAnalysisService
from schemas.posture import PostureState
class TestPostureAnalysisService:
    
    @pytest.fixture
    def service(self):
        """Create PostureAnalysisService instance"""
        return PostureAnalysisService()
    
    
    @pytest.mark.asyncio
    async def test_analyze_image_good_posture(self,service,sample_image):
        """Test analysis of good posture """
        _,encoded = np.array([]) ,None
        import cv2
        _,encoded = cv2.imencode('.jpg',sample_image)
        image_bytes = encoded.tobytes()
        
        with patch.object(service.detector, 'detect') as mock_detect:
            mock_detect.return_value = (
                PostureState.GOOD,
                0.85,
                {"nose" :{"x":0.5, "y" : 0.2, "confidence": 0.9}}
            )
            result = await service.analyze_image(image_bytes)
            
            assert result.posture_state == PostureState.GOOD
            assert result.confidence == 0.85
            assert result.severity == 0.0
            assert len(result.recommendations) > 0
            
            
    
    @pytest.mark.asyncio
    async def test_analyze_image_bad_posture(self,service,sample_image):
        """Test analysis of bad posture """
        import cv2
        _,encoded = cv2.imencode('.jpg',sample_image)
        image_bytes = encoded.tobytes()
        
        with patch.object(service.detector, 'detect') as mock_detect:
            mock_detect.return_value = (
                PostureState.SLOUCHED,
                0.90,
                {"nose" :{"x":0.5,"y": 0.3,"confidence":0.9}}
            )
            result = await service.analyze_image(image_bytes)
            
            assert result.posture_state == PostureState.SLOUCHED
            assert result.severity > 0.5
            assert "Sit up straight with back against chair" in result.recommendations[0]
            
            
            
    @pytest.mark.asyncio
    async def test_analyze_image_no_person(self,service,sample_image):
         """Test analysis when no person detected """
         import cv2
         _,encoded = cv2.imencode('.jpg', sample_image)
         image_bytes = encoded.tobytes()
         
         with patch.object(service.detector, 'detect') as mock_detect:
             mock_detect.return_value= (
                 PostureState.NO_PERSON_DETECTED,
                 0.0,
                 {}
             )
             result  =await service.analyze_image(image_bytes)
             
             assert result.posture_state == PostureState.NO_PERSON_DETECTED
             assert result.confidence ==0.0
             assert "No person detected in frame" in result.recommendations[0]
             
             
             
    def test_calculate_severity_good_posture(self,service):
        """Test severity calculation for good posture"""
        severity = service._calculate_severity(PostureState.GOOD,0.85)
        assert severity == 0.0

    def test_claculate_severity_slouched(self,service):
        """Test severity claculation for slouched posture """
        severity = service._calculate_severity(PostureState.SLOUCHED,0.90)
        assert  severity > 0.7
        
        
    def test_calculate_severity_forward_lean(self, service):
        """Test severity calculation for forward lean"""
        severity = service._calculate_severity(PostureState.FORWARD_LEAN, 0.85)
        
        assert 0.4 < severity < 0.7
        
    def test_recommendations_mapping(self, service):
        """Test that all posture states have recommendations"""
        for posture_state in PostureState:
            assert posture_state in service.recommendation_map
            assert len(service.recommendation_map[posture_state]) > 0