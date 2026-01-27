import pytest
import numpy as np
import cv2
import base64
from utils.image_processing import decode_image,resize_image



class TestImageProcessing:
    
    def test_decode_image_from_bytes(self):
        """Test decoding image from bytes """
        original = np.zeros((100,100,3), dtype=np.uint8)
        _,encoded = cv2.imencode('.jpg',original)
        image_bytes = encoded.tobytes()
        
        
        # Decode
        decoded = decode_image(image_bytes)
        
        assert decoded is not None
        assert decoded.shape == (100,100,3)
        
    
    
    def test_decode_image_from_base64(self):
        """ Test decoding image from base64 string """
        original = np.zeros((100,100,3),dtype=np.uint8)
        _,encoded = cv2.imencode(".jpg",original)
        base64_str = base64.b64encode(encoded.tobytes()).decode('utf-8')
        
        decoded = decode_image(base64_str)
        
        assert decoded is not None
        assert decoded.shape == (100,100,3)
        
        
        
    def test_decode_image_from_invalid_data(self):
        """ Test that invalid data raises exception"""
        invalid_data =b"not an image"
        
        with pytest.raises(ValueError, match="Image decoding failed: cv2.imdecode returned an empty result. Check input data or file format."):
          decode_image(invalid_data) 
          
          
    def resize_image_large(self):
        """Test resizing large image"""
        large_image = np.zeros((1080,1920,3),dtype=np.uint8)
        
        resized_image = resize_image(large_image,max_width=640)
        
        assert resized_image.shape[1] == 640
        assert resized_image.shape[0] < 1080
        
        
    def resize_image_small(self):
        """Test that small images are not upscaled"""
        small_image = np.zeros((480,320,3 ), dtype=np.uint8)
        resized_image = resize_image(small_image,max_width=640)
        
        assert resized_image.shape == small_image.shape
        
    
    def test_resize_maintains_aspect_ratio(self):
        """Test that resize maintains aspect ratio"""
        original = np.zeros((1080,1920,3),dtype=np.uint8)
        
        resized = resize_image(original,max_width=640)
        
        original_ratio = original.shape[1] / original.shape[0]
        resized_ratio = resized.shape[1] / resized.shape[0]
        
        assert abs(original_ratio - resized_ratio) < 0.01