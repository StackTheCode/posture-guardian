import cv2
import numpy as np
from typing import Union
import base64

def decode_image(image_data: Union[bytes, str]) -> np.ndarray:
    """
    Decode image from bytes or base64 string
    """
    
    # 1. Handle Base64 String Input
    if isinstance(image_data, str):
        # Convert the Base64 string to raw bytes
        image_data = base64.b64decode(image_data)
        

    # 2. Convert raw bytes to NumPy array buffer
    nparr = np.frombuffer(image_data, np.uint8)
    
    
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        
        raise ValueError("Image decoding failed: cv2.imdecode returned an empty result. Check input data or file format.")
        
    return image
    
def resize_image(image:np.ndarray,max_width:int =640) -> np.ndarray:
    """
    Resize image  while maintaining aspect ratio
    """
    
    height,width =image.shape[:2]
        
    if width > max_width:
        ratio = max_width / width
        new_width= max_width
        new_height = int (height * ratio)
        image = cv2.resize(image,(new_width,new_height))
        
    
    return image    