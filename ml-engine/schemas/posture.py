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
    
 
 
class PostureAnalysisRequest(BaseModel):
       image_request64 =Optional[str] = None
       timestamp =Optional[str] = None


class KeyPoint(BaseModel):
    x:float
    y:float
    confidence:float
    
    

class PostureAnalysisResponse:
    json_schema_extra ={
        "example":{
            "posture_state":"forward_lean",
            "confidence": 0.87,
            "severity": 0.65,
            "recommendations":[
                   "Adjust your screen height",
                    "Move screen closer to eye level"
            ]
            
        }
    }