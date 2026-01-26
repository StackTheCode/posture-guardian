import pytest
import numpy as np
import cv2
from unittest.mock import Mock, patch
from models.posture_detector import PostureDetector
from schemas.posture import PostureState

class TestPostureDetector:
    
    @pytest.fixture
    def detector(self):
        """Create a PostureDetector instance"""
        return PostureDetector()
    
    def test_detector_initialization(self, detector):
        """Test that detector initializes correctly"""
        assert detector is not None
        assert detector.pose is not None
        assert detector.mp_pose is not None
    
    def test_detect_no_person(self, detector, sample_image):
        """Test detection when no person is in frame"""
        # Mock MediaPipe to return no landmarks
        with patch.object(detector.pose, 'process') as mock_process:
            mock_result = Mock()
            mock_result.pose_landmarks = None
            mock_process.return_value = mock_result
            
            posture_state, confidence, keypoints = detector.detect(sample_image)
            
            assert posture_state == PostureState.NO_PERSON_DETECTED
            assert confidence == 0.0
            assert keypoints == {}
    
    def test_detect_good_posture(self, detector, sample_image, mock_landmarks):
        """Test detection of good posture"""
        with patch.object(detector.pose, 'process') as mock_process:
            mock_result = Mock()
            mock_result.pose_landmarks = mock_landmarks
            mock_process.return_value = mock_result
            
            posture_state, confidence, keypoints = detector.detect(sample_image)
            
            assert posture_state == PostureState.GOOD
            assert confidence > 0.7
            assert 'nose' in keypoints
            assert 'left_shoulder' in keypoints
            assert 'right_shoulder' in keypoints
    
    def test_detect_slouched_posture(self, detector, sample_image, slouched_landmarks):
        """Test detection of slouched posture"""
        with patch.object(detector.pose, 'process') as mock_process:
            mock_result = Mock()
            mock_result.pose_landmarks = slouched_landmarks
            mock_process.return_value = mock_result
            
            posture_state, confidence, keypoints = detector.detect(sample_image)
            
            # Should detect some form of bad posture
            assert posture_state != PostureState.GOOD
            assert posture_state != PostureState.NO_PERSON_DETECTED
    
    def test_detect_forward_lean(self, detector, sample_image):
        """Test detection of forward lean"""
        # Create mock landmarks with nose significantly forward
        class MockLandmark:
            def __init__(self, x, y, visibility):
                self.x = x
                self.y = y
                self.visibility = visibility
        
        class MockLandmarks:
            def __init__(self):
                self.landmark = [
                    MockLandmark(0.6, 0.2, 0.9),  # NOSE - very high (forward)
                    *[MockLandmark(0.0, 0.0, 0.0) for _ in range(10)],
                    MockLandmark(0.45, 0.35, 0.9), # LEFT_SHOULDER
                    MockLandmark(0.55, 0.35, 0.9), # RIGHT_SHOULDER
                    *[MockLandmark(0.0, 0.0, 0.0) for _ in range(10)],
                    MockLandmark(0.45, 0.65, 0.9), # LEFT_HIP
                    MockLandmark(0.55, 0.65, 0.9), # RIGHT_HIP
                ]
        
        with patch.object(detector.pose, 'process') as mock_process:
            mock_result = Mock()
            mock_result.pose_landmarks = MockLandmarks()
            mock_process.return_value = mock_result
            
            posture_state, confidence, keypoints = detector.detect(sample_image)
            
            assert posture_state == PostureState.FORWARD_LEAN
            assert confidence > 0.5
    
    def test_detect_shoulder_tilt(self, detector, sample_image):
        """Test detection of shoulder tilt"""
        class MockLandmark:
            def __init__(self, x, y, visibility):
                self.x = x
                self.y = y
                self.visibility = visibility
        
        class MockLandmarks:
            def __init__(self):
                self.landmark = [
                    MockLandmark(0.5, 0.2, 0.9),   # NOSE
                    *[MockLandmark(0.0, 0.0, 0.0) for _ in range(10)],
                    MockLandmark(0.45, 0.30, 0.9), # LEFT_SHOULDER - higher
                    MockLandmark(0.55, 0.40, 0.9), # RIGHT_SHOULDER - lower (tilt)
                    *[MockLandmark(0.0, 0.0, 0.0) for _ in range(10)],
                    MockLandmark(0.45, 0.65, 0.9), # LEFT_HIP
                    MockLandmark(0.55, 0.65, 0.9), # RIGHT_HIP
                ]
        
        with patch.object(detector.pose, 'process') as mock_process:
            mock_result = Mock()
            mock_result.pose_landmarks = MockLandmarks()
            mock_process.return_value = mock_result
            
            posture_state, confidence, keypoints = detector.detect(sample_image)
            
            assert posture_state == PostureState.SHOULDER_TILT
            assert confidence > 0.5
    
    def test_keypoints_extraction(self, detector, sample_image, mock_landmarks):
        """Test that keypoints are correctly extracted"""
        with patch.object(detector.pose, 'process') as mock_process:
            mock_result = Mock()
            mock_result.pose_landmarks = mock_landmarks
            mock_process.return_value = mock_result
            
            _, _, keypoints = detector.detect(sample_image)
            
            # Check keypoint structure
            assert 'nose' in keypoints
            assert 'x' in keypoints['nose']
            assert 'y' in keypoints['nose']
            assert 'confidence' in keypoints['nose']
            
            # Check values are in valid range
            assert 0 <= keypoints['nose']['x'] <= 1
            assert 0 <= keypoints['nose']['y'] <= 1
    
    def test_detector_handles_invalid_image(self, detector):
        """Test that detector handles invalid input gracefully"""
        # Pass None or invalid image
        invalid_image = None
        
        with pytest.raises(Exception):
            detector.detect(invalid_image)
    
    def test_detector_cleanup(self, detector):
        """Test that detector cleans up resources"""
        del detector