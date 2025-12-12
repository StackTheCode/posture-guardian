from fastapi import FastAPI,HTTPException,UploadFile,File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import logging
from prometheus_client import Counter,Histogram,generate_latest
from datetime import datetime,timezone
from schemas.posture import PostureAnalysisResponse
from services.analysis import PostureAnalysisService 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter("posture_analysis_requests_total", 'Total analysis requests')
REQUEST_DURATION = Histogram('posture_analysis_duration_seconds', 'Analysis duration')

app = FastAPI(
title="Posture Guardian ML Engine",
description="Posture detection service",
version="0.1.0"    
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Don't forget to include backend url in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize service
analysis_service = PostureAnalysisService()


@app.get("./")
async def root():
    return{
        "service":"Posture Guardian ML Service",
        "version":"0.1.0",
        "status":"healthy"
    }
    
@app.get('/health')
async def health_check():
    return {"status" :"healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.post("/analyze-posture", response_model=PostureAnalysisResponse)
async def analyze_posture(file: UploadFile = File(...)):
    """
    Analyze posture from uploaded image
    """
    REQUEST_COUNT.inc()
    
    try:
        with REQUEST_DURATION.time():
            # Read image
            image_bytes = await file.read()
            
            # Analyze
            result = await analysis_service.analyze_image(image_bytes)
            
            logger.info(f"Analysis complete: {result.posture_state}")
            return result
            
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    

@app.get('/metrics')
async def metrics():
    """Prometheus metrics endpoint"""
    return Response    (content=generate_latest(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0", port=8000)
    
                 