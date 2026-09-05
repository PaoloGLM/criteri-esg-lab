"""
Client GLM 5.3 Flash Free via OpenRouter.
Similar a nemotron_client.py però per GLM 5.3 Flash Free.
"""
import sys
import json
import re
from pathlib import Path

sys.path.insert(0, "./scripts")
from config import get_openrouter_client, GLM_53_FLASH_MODEL


def call_glm_flash(system_prompt: str, user_prompt: str, temperature: float = 0.3, max_tokens: int = 4096) -> str:
    """Crida GLM 5.3 Flash Free via OpenRouter."""
    client = get_openrouter_client()

    response = client.chat.completions.create(
        model=GLM_53_FLASH_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content


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