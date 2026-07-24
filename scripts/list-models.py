"""Llista els models disponibles amb la nostra API key de Gemini."""
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent.parent / "assets" / "web" / ".env.local")

from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("=== Models disponibles ===")
for model in client.models.list():
    name = model.name
    # Filtrar els que suporten generateContent
    methods = getattr(model, "supported_generation_methods", None)
    if methods and "generateContent" in methods:
        print(f"  {name}")
