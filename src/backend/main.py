from contextlib import asynccontextmanager
from typing import Dict

import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from llama_index.core import Settings, SimpleDirectoryReader, VectorStoreIndex
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.huggingface import HuggingFaceLLM
from loguru import logger
from transformers import (
    BitsAndBytesConfig,
)
from utils.fastapi_globals import g


torch_device = "cuda"

import warnings


warnings.filterwarnings('ignore')


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Booting the vector dbs and models")

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16
    )

    Settings.llm = HuggingFaceLLM(
        model_name="HuggingFaceH4/zephyr-7b-alpha",
        tokenizer_name="HuggingFaceH4/zephyr-7b-alpha",
        context_window=3900,
        max_new_tokens=512,
        model_kwargs={"quantization_config": bnb_config},
        generate_kwargs={"temperature": 0.1},
        device_map="cuda:0",
    )
    Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
    Settings.chunk_size = 512

    documents = SimpleDirectoryReader("data").load_data()
    index = VectorStoreIndex.from_documents(
        documents,
    )

    index_query_engine = index.as_query_engine(similarity_top_k=2)

    g.set_default("query_engine", index_query_engine)
    g.set_default("settings", Settings)

    yield
    g.cleanup()


app = FastAPI(
    title = "Full Stack RAG",
    description = "Llamaindex with React",
    version = '0.1',
    lifespan = lifespan
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
async def predict(prompt : str):
    response = g.query_engine.query(prompt)
    return {"result": response.response}
