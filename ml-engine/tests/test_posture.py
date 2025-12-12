import pytest
from fastapi.testclient import TestClient
from main import app
import cv2
import numpy as np


client = TestClient(app)


def health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] =="healthy"
    
    
def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "service" in response.json()
    
    
