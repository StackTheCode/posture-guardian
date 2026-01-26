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
     
     
    def classify_posture(self, nose, left_shoulder, right_shoulder, left_hip, right_hip) -> Tuple[PostureState, float]:
    # 1. Centers and Reference Lengths
     shoulder_center_y = (left_shoulder.y + right_shoulder.y) / 2
     hip_center_y = (left_hip.y + right_hip.y) / 2
     torso_length = abs(shoulder_center_y - hip_center_y)
    
    # Avoid division by zero if person is not fully in frame
     if torso_length < 0.1: return PostureState.GOOD, 0.5

    # 2. Shoulder Tilt (Normalize by torso length)
     shoulder_tilt = abs(left_shoulder.y - right_shoulder.y) / torso_length
     if shoulder_tilt > 0.15:  # Relative tilt
         return PostureState.SHOULDER_TILT, 0.8

    # 3. Forward Lean (Horizontal head displacement)
    # Detects when the head is projected forward relative to the shoulder center
    # Uses X-axis offset (not Y) because forward lean is a front–back issue,
    # not a vertical one.
     shoulder_center_x = (left_shoulder.x + right_shoulder.x) / 2
     nose_forward_offset = abs(nose.x - shoulder_center_x)
     
     # If the nose is significantly offset from the shoulder center,
# the head is leaning forward
     if nose_forward_offset > 0.07:
         return PostureState.FORWARD_LEAN,0.85


    # 4. Slouching (Compressed Torso)
    # Use your saved debug frames to find your 'perfect' torso_length
    # then check if current length is < 80% of that.
     if torso_length < 0.20:
        return PostureState.SLOUCHED, 0.9

    # 5. Alignment Score
     shoulder_center_x = (left_shoulder.x + right_shoulder.x) / 2
     hip_center_x = (left_hip.x + right_hip.x) / 2
     alignment_offset = abs(shoulder_center_x - hip_center_x)

     if alignment_offset > 0.1:
         return PostureState.SLOUCHED, 0.7

     return PostureState.GOOD, 0.95 
    
   
    
    def __del__(self):
        self.pose.close()
        
            