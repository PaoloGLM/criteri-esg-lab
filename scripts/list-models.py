"""Llista models Gemini disponibles amb la nostra key."""
import os
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path("./assets/web/.env.local"))
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
print("=== Models disponibles (generateContent) ===")
for model in client.models.list():
    name = model.name
    methods = getattr(model, "supported_actions", None) or []
    print(f"  {name}")
