import io
from contextlib import asynccontextmanager
from typing import Dict, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI(
    title = "Full Stack RAG",
    description = "Llamaindex with React",
    version = '0.1',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def welcome() -> Dict[str, str]:
    return {"hello": "there"}

@app.get("/health")
def health() -> Dict[str, str]:
    return {"health": "ok"}

@app.get("/predict")
async def predict():
    return {"result": "yoyoyoyo gets passed properly to react frontend"}