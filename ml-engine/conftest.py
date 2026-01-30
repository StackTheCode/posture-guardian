import pytest
import numpy as np
import cv2
from pathlib import Path
import os

@pytest.fixture
def sample_image():
    """Create a sample test(blank) """
    
    image = np.zeros((480,640,3),dtype=np.uint8)
    return image


@pytest.fixture
def test_image_path(tmp_path):
    """Create a temporary test image file"""
    image = np.zeros((480,640,3),dtype=np.uint8)
    image_path = tmp_path / "test_image.jpg"
    cv2.imwrite(str(image_path),image)
    return image_path


@pytest.fixture
def mock_landmarks():
    """Mock MediaPipe pose landmarks"""
    class MockLandmark():
        def __init__(self,x,y,visibility):
            self.x = x
            self.y = y
            self.visibility = visibility
            
            
    class MockLandmarks:
        def __init__(self):
            self.landmark = [
                 MockLandmark(0.5, 0.2, 0.9),   # NOSE
                MockLandmark(0.0, 0.0, 0.0),   # LEFT_EYE_INNER (unused)
                MockLandmark(0.0, 0.0, 0.0),   # LEFT_EYE (unused)
                MockLandmark(0.0, 0.0, 0.0),   # LEFT_EYE_OUTER (unused)
                MockLandmark(0.0, 0.0, 0.0),   # RIGHT_EYE_INNER (unused)
                MockLandmark(0.0, 0.0, 0.0),   # RIGHT_EYE (unused)
                MockLandmark(0.0, 0.0, 0.0),   # RIGHT_EYE_OUTER (unused)
                MockLandmark(0.0, 0.0, 0.0),   # LEFT_EAR (unused)
                MockLandmark(0.0, 0.0, 0.0),   # RIGHT_EAR (unused)
                MockLandmark(0.0, 0.0, 0.0),   # MOUTH_LEFT (unused)
                MockLandmark(0.0, 0.0, 0.0),   # MOUTH_RIGHT (unused)
                MockLandmark(0.45, 0.35, 0.9), # LEFT_SHOULDER
                MockLandmark(0.55, 0.35, 0.9), # RIGHT_SHOULDER
                MockLandmark(0.0, 0.0, 0.0),   # LEFT_ELBOW (unused)
                MockLandmark(0.0, 0.0, 0.0),   # RIGHT_ELBOW (unused)
                MockLandmark(0.0, 0.0, 0.0),   # LEFT_WRIST (unused)
                MockLandmark(0.0, 0.0, 0.0),   # RIGHT_WRIST (unused)
                MockLandmark(0.0, 0.0, 0.0),   # LEFT_PINKY (unused)
                MockLandmark(0.0, 0.0, 0.0),   # RIGHT_PINKY (unused)
                MockLandmark(0.0, 0.0, 0.0),   # LEFT_INDEX (unused)
                MockLandmark(0.0, 0.0, 0.0),   # RIGHT_INDEX (unused)
                MockLandmark(0.0, 0.0, 0.0),   # LEFT_THUMB (unused)
                MockLandmark(0.0, 0.0, 0.0),   # RIGHT_THUMB (unused)
                MockLandmark(0.45, 0.65, 0.9), # LEFT_HIP
                MockLandmark(0.55, 0.65, 0.9), # RIGHT_HIP
            ]
    return MockLandmarks()
        


@pytest.fixture
def slouched_landmarks():
    """Mock landmarks for slouched posture"""
    class MockLandmark:
        def __init__(self,x,y,visibility):
            self.x = x
            self.y = y
            self.visibility = visibility
    
    
    class MockLandmarks:
        def __init__(self):
            self.landmark =[
                MockLandmark(0.5,0.25,0.9), # NOSE (more forward)
                *[MockLandmark(0.0,0.0,0.0) for _ in range(10)],
                MockLandmark(0.45,0.4,0.9), # LEFT SHOULDER (hunched)
                MockLandmark(0.55,0.4,0.9), # RIGHT SHOULDER
                *[MockLandmark(0.0, 0.0, 0.0) for _ in range(10)],
                MockLandmark(0.45,0.55,0.9),
                MockLandmark(0.45,0.55,0.9), # LEFT_HIP
                MockLandmark(0.55,0.55,0.9)
                
            ]
    return MockLandmarks() 


def pytest_sessionfinish(session,exitstatus):
    if os.getenv("CI"):
        os._exit(exitstatus)