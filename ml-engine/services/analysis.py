import cv2
import numpy as np
from typing import List
import logging
from models.posture_detector import PostureDetector
from schemas.posture import PostureAnalysisResponse,PostureState
from utils.image_processing import decode_image

logger = logging.getLogger(__name__)

class PostureAnalysisService:
    def __init__(self):
        self.detector = PostureDetector()
        self.recommendation_map = {
            PostureState.GOOD :[
                "Great posture! Keep it up!",
                "Remember to take breaks every 30 minutes"
            ],
            PostureState.FORWARD_LEAN:[
                  "Move your screen closer to eye level",
                "Adjust your chair height",
                "Ensure screen is arm's length away"
            ],
            PostureState.SLOUCHED:[
                  "Sit up straight with back against chair",
                "Check if your chair has proper lumbar support",
                "Consider a standing desk break"
            ],
            PostureState.SHOULDER_TILT:[
                "Check if your desk height is even",
                "Ensure your chair armrests are level",
                "You may have one shoulder habitually raised"
            ],
            PostureState.NO_PERSON_DETECTED:[
                "No person detected in frame",
                "Make sure there is proper lightining"
                 "Ensure proper lighting and camera position"
            ],
            PostureState.TWISTED_SPINE:[
                "Look at your back and adjust",
                "If you have medical condition, consult with specialist"
            ]
        }
        
        
    async def analyze_image(self,image_bytes:bytes) -> PostureAnalysisResponse:
        """
        Analyze posture from image bytes
        """
        
        try:
            # Decode image
            image = decode_image(image_bytes)
            
            if image is None or image.size == 0:
            # Raise a clear error if the image array is empty
              raise ValueError("Image decoding failed: Received empty image array.")
            # Detect posture
            posture_state,confidence,keypoints =self.detector.detect(image)
            
            # Calculate severity: ( 0-is good, 1- very bad)
            severity = self._calculate_severity(posture_state,confidence)
            
            # Get reccomendations
            recommendations = self.recommendation_map.get(posture_state, ["Unable to analyze posture"])
            
            return PostureAnalysisResponse(
                posture_state=posture_state,
                confidence=confidence,
                severity=severity,
                recommendations=recommendations,
                keypoints=keypoints
            )
        
        except Exception as e :
            logger.error(f"Analysis error: {str(e)}")
            raise
    
    
    
    
    def _calculate_severity(self, posture_state: PostureState, confidence: float) -> float:
        """
        Calculate severity score based on posture state
        """
        severity_map = {
            PostureState.GOOD: 0.0,
            PostureState.FORWARD_LEAN: 0.6,
            PostureState.SLOUCHED: 0.8,
            PostureState.SHOULDER_TILT: 0.5,
            PostureState.TWISTED_SPINE: 0.7,
            PostureState.NO_PERSON_DETECTED: 0.0
        }
        
        base_severity = severity_map.get(posture_state, 0.5)
        # Adjust by confidence
        return base_severity * confidence
    
    
    
    
    
        
        
    
            