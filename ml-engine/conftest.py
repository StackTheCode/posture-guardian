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
           self.landmark = [MockLandmark(0.0, 0.0, 0.0)] * 33 # Initialize all 33
            
            # --- GOOD POSTURE COORDINATES ---
            # Center X is 0.5. 
           self.landmark[0] = MockLandmark(0.5, 0.15, 0.9)   # NOSE (slightly above ears)
            
            # EARS: Align these with the shoulders (X=0.45/0.55) to minimize lean angle
           self.landmark[7] = MockLandmark(0.48, 0.2, 0.9)   # LEFT_EAR
           self.landmark[8] = MockLandmark(0.52, 0.2, 0.9)   # RIGHT_EAR
            
            # SHOULDERS: 
           self.landmark[11] = MockLandmark(0.45, 0.35, 0.9) # LEFT_SHOULDER
           self.landmark[12] = MockLandmark(0.55, 0.35, 0.9) # RIGHT_SHOULDER
            
            # HIPS:
           self.landmark[23] = MockLandmark(0.45, 0.65, 0.9) # LEFT_HIP
           self.landmark[24] = MockLandmark(0.55, 0.65, 0.9) # RIGHT_HIP

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