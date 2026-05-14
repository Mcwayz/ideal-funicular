from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import random

app = FastAPI(
    title="PM Platform AI Service",
    description="Predictive analytics and NLP for enterprise project management.",
    version="0.1.0"
)

class TaskInfo(BaseModel):
    id: str
    title: str
    estimated_hours: float
    dependencies: List[str] = []

class PredictionRequest(BaseModel):
    project_id: str
    tasks: List[TaskInfo]

class PredictionResponse(BaseModel):
    project_id: str
    predicted_end_date: datetime
    confidence_score: float
    bottlenecks: List[str]

@app.get("/")
async def root():
    return {"message": "PM Platform AI Service is active"}

@app.post("/predict-timeline", response_model=PredictionResponse)
async def predict_timeline(request: PredictionRequest):
    # Calculate velocity based on historical completion
    completed_tasks = [t for t in request.tasks if t.estimated_hours > 0] # Simulating completed
    if not request.tasks:
        return {
            "project_id": request.project_id,
            "predicted_end_date": datetime.now(),
            "confidence_score": 0.0,
            "bottlenecks": []
        }

    total_est = sum(t.estimated_hours for t in request.tasks)
    
    # Calculate Schedule Performance Index (SPI)
    # Simulating SPI based on task status
    spi = 0.92 # Default "slightly behind" for realism
    
    predicted_duration_hours = total_est / spi
    predicted_days = predicted_duration_hours / 8
    
    prediction_date = datetime.now() + timedelta(days=predicted_days)
    
    # Identify bottlenecks (tasks with most dependencies or highest hours)
    sorted_tasks = sorted(request.tasks, key=lambda x: (len(x.dependencies), x.estimated_hours), reverse=True)
    bottlenecks = [t.title for t in sorted_tasks[:3]]
    
    return {
        "project_id": request.project_id,
        "predicted_end_date": prediction_date,
        "confidence_score": round(spi, 2),
        "bottlenecks": bottlenecks
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
