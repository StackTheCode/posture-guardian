from pydantic import BaseModel,Field
from typing import Optional ,List
from enum import Enum 

class PostureState(str,Enum):
    GOOD = "good"
    FORWARD_LEAN ="forward_lean"
    SLOUCHED = "slouched"
    TWISTED_SPINE = "twisted_spine"
    SHOULDER_TILT = "shoulder_tilt"
    NO_PERSON_DETECTED ="no_person_detected"

