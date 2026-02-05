import mediapipe as mp
import cv2
import numpy as np
import math
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
    
    def detect(self, image: np.ndarray) -> Tuple[Optional[PostureState], float, dict, dict]:
    # Convert and process
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.pose.process(image_rgb)

        if not results.pose_landmarks:
           return PostureState.NO_PERSON_DETECTED, 0.0, {}# when testing add {} for metrics

        lm = results.pose_landmarks.landmark
    
    # Extract points for readability
        nose = lm[self.mp_pose.PoseLandmark.NOSE]
        l_sh = lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER]
        r_sh = lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER]
        l_ear = lm[self.mp_pose.PoseLandmark.LEFT_EAR]
        r_ear = lm[self.mp_pose.PoseLandmark.RIGHT_EAR]
        l_hip = lm[self.mp_pose.PoseLandmark.LEFT_HIP]
        r_hip = lm[self.mp_pose.PoseLandmark.RIGHT_HIP]

    # --- GEOMETRIC MATH ---
    # Midpoints
        sh_x, sh_y = (l_sh.x + r_sh.x) / 2, (l_sh.y + r_sh.y) / 2
        ear_x, ear_y = (l_ear.x + r_ear.x) / 2, (l_ear.y + r_ear.y) / 2
        hip_y = (l_hip.y + r_hip.y) / 2
        sh_width = abs(l_sh.x - r_sh.x)

    # Calculate metrics dictionary
        metrics = {
        "lean_angle": math.degrees(math.atan2(abs(ear_x - sh_x), abs(ear_y - sh_y))),
        "nose_drop": nose.y - sh_y,
        "torso_ratio": abs(sh_y - hip_y) / (sh_width if sh_width > 0 else 0.1),
        "tilt_ratio": abs(l_sh.y - r_sh.y) / (sh_width if sh_width > 0 else 0.1)
        }

    # Get state from classifier
        state, confidence = self.classify_posture(metrics)

    # Keypoints for drawing (can be nose and shoulder center)
        keypoints = {
        "nose": {"x": nose.x, "y": nose.y, "confidence": getattr(nose, 'visibility', 0.0)},
        "shoulder_center": {"x": sh_x, "y": sh_y, "confidence": (l_sh.visibility + r_sh.visibility)/2},
        "left_shoulder": {"x": l_sh.x, "y": l_sh.y, "confidence": l_sh.visibility},  
        "right_shoulder": {"x": r_sh.x, "y": r_sh.y, "confidence": r_sh.visibility}
        }

        return state, confidence, keypoints
     
     
  
    def classify_posture(self, metrics: dict) -> Tuple[PostureState, float]:
    # Default state
        best_state = PostureState.GOOD
        max_confidence = 0.95
    
    
    
    # 1. Check for Shoulder Tilt
        if metrics['tilt_ratio'] > 0.12:
           best_state = PostureState.SHOULDER_TILT
           max_confidence = 0.8
        
    # 2. Check for Slouching (Higher priority than tilt)
        if metrics['torso_ratio'] < 1.76:
           best_state = PostureState.SLOUCHED
           max_confidence = 0.85

    # 3. Check for Forward Lean (Highest priority)
    # Note: We can make this threshold a bit more forgiving to avoid false positives
        if metrics['lean_angle'] > 15 or metrics['nose_drop'] < -0.38:
           best_state = PostureState.FORWARD_LEAN
           max_confidence = 0.9

        return best_state, max_confidence
   
    
    def __del__(self):
        self.pose.close()
    