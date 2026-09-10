"""
Client GLM 5.3 Flash Free via OpenRouter.
Similar a nemotron_client.py però per GLM 5.3 Flash Free.
"""
import sys
import json
import re
from pathlib import Path

sys.path.insert(0, "./scripts")
from config import call_openrouter_auto


def call_glm_flash(system_prompt: str, user_prompt: str, temperature: float = 0.3, max_tokens: int = 4096) -> str:
    """Crida OpenRouter amb el model més barat disponible del pool de l'usuari.

    (Antigament fixat a GLM 5.3 Flash Free; des del selector de costos, el
    model el tria config.call_openrouter_auto segons OPENROUTER_MODEL_POOL.)
    """
    return call_openrouter_auto(system_prompt, user_prompt, temperature, max_tokens)


def call_glm_flash_json(system_prompt: str, user_prompt: str, temperature: float = 0.3, max_tokens: int = 4096) -> dict:
    """Crida GLM 5.3 Flash Free i parseja JSON."""
    text = call_glm_flash(system_prompt, user_prompt, temperature, max_tokens)

    # Intent 1: parsejar directament
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Intent 2: extreure el primer {...} de la resposta
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass

    # Intent 3: reparar problemes comuns
    try:
        fixed = re.sub(r",\s*([}\]])", r"\1", text)
        return json.loads(fixed)
    except json.JSONDecodeError as e:
        raise Exception(f"JSON parse failed: {e}. Resposta (300 chars): {text[:300]}")


if __name__ == "__main__":
    print("=== Test GLM 5.3 Flash Free client ===")
    result = call_glm_flash_json(
        "Ets un assistent. Torna un JSON.",
        'Digues Hola en català. Torna {"ok": true, "missatge": "la teva resposta"}',
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))