import mediapipe as mp
import cv2
import numpy as np
from typing import Optional, Tuple
import logging
from schemas.posture import PostureState, KeyPoint
logger = logging.getLogger(__name__)

class PostureDetector:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose  = self.mp_pose.Pose(
            static_image_mode =True,
            model_complexity=1,
            enable_segmentation=False,
            min_detection_confidence=0.5
        )
    
    def detect(self, image: np.ndarray) -> Tuple[Optional[PostureState], float, dict]:
         """
        Detect posture from image
        Returns: (posture_state, confidence, keypoints)
        """
        # Convert BGR to RGB
         image_rgb =cv2.cvtColor(image,cv2.COLOR_BGR2RGB)
         results= self.pose.process(image_rgb)
         # Process
         if not results.pose_landmarks:
             return PostureState.NO_PERSON_DETECTED,0.0,{}
        #  Landmarks
         landmarks = results.pose_landmarks.landmark
         
         # Get important points
         nose = landmarks[self.mp_pose.PoseLandmark.NOSE]
         left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER]
         right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER]
         left_hip = landmarks[self.mp_pose.PoseLandmark.LEFT_HIP]
         right_hip = landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP]
         
        #  Calculate posture metrics
         posture_state,confidence = self.classify_posture(
             nose,left_shoulder,right_shoulder,left_hip,right_hip
         )
         
         keypoints = {
             "nose":{"x": nose.x, "y": nose.y, "confidence":nose.visibility},
             "left_shoulder":{"x":left_shoulder.x,"y": left_shoulder.y,"confidence":left_shoulder.visibility},
             "right_shoulder" :{"x":right_shoulder.x,"y": right_shoulder.y,"confidence":right_shoulder.visibility}
             
         }
         return posture_state,confidence,keypoints
     
     
    
    
    def classify_posture(self,nose,left_shoulder,right_shoulder,left_hip,right_hip) -> Tuple[PostureState,float]:
        """
        Classify posture based on landmark positions
        """
        shoulder_center_y = (left_shoulder.y + right_shoulder.y) / 2
        hip_center_y = (left_hip.y + right_hip.y) / 2
        
        # Forward lean detection
        # if nose is significantly forward relative to shoulders
        forward_offset = nose.y - shoulder_center_y
        
        if forward_offset < -0.15: #Nose is above shoulders(leaning forward)
            severity = abs(forward_offset) * 10
            return PostureState.FORWARD_LEAN,min(0.9,0.6+severity)
        
        # Slouch detection: If shoulders are way too forawrd relative to hips
        slouch_offset = shoulder_center_y - hip_center_y
        torso_length = abs(shoulder_center_y - hip_center_y)
        if torso_length < 0.20:# Compressed torso = slouching
            return PostureState.SLOUCHED,0.75 
        
        # Shoulder tilt detection
        shoulder_tilt = abs(left_shoulder.y - right_shoulder.y)
        
        if shoulder_tilt > 0.08 :
            return PostureState.SHOULDER_TILT,0.70
        
        return PostureState.GOOD, 0.85
    
    def __del__(self):
        self.pose.close()
        
            