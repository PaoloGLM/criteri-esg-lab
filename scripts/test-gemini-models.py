"""Test Gemini amb la key nova. Prova diversos models."""
import os, sys
sys.path.insert(0, "./scripts")
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path("./assets/web/.env.local"))

from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Provar diversos models
models_to_try = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-flash-latest",
    "gemini-2.5-flash-lite",
]

for model_name in models_to_try:
    print(f"\n--- {model_name} ---")
    try:
        response = client.models.generate_content(
            model=model_name,
            contents="Respon només amb: OK",
            config=types.GenerateContentConfig(max_output_tokens=10),
        )
        text = response.text.strip()
        print(f"  ✓ Resposta: '{text}'")
    except Exception as e:
        msg = str(e)[:200]
        print(f"  ✗ Error: {msg}")
