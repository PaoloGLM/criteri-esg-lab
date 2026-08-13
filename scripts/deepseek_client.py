""" 
Client DeepSeek v4 Pro (API oficial).

Pasos 2 (destil·lació) i 4 (redacció) del flux Criteri ESG.

Ús:
    scripts/.venv/bin/python scripts/deepseek_client.py  # test ràpid
"""
import sys
import json
import re
from pathlib import Path

sys.path.insert(0, "./scripts")
from config import get_deepseek_client, DEEPSEEK_MODEL

DEEPSEEK_MODEL_NAME = DEEPSEEK_MODEL  # deepseek-v4-pro


def call_deepseek(system_prompt: str, user_prompt: str, temperature: float = 0.4, max_tokens: int = 8000) -> str:
    client = get_deepseek_client()
    response = client.chat.completions.create(
        model=DEEPSEEK_MODEL_NAME,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content


def call_deepseek_json(system_prompt: str, user_prompt: str, temperature: float = 0.4, max_tokens: int = 8000) -> dict:
    text = call_deepseek(system_prompt, user_prompt, temperature, max_tokens)

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

    # Intent 3: reparar problemes comuns (comes finals)
    try:
        fixed = re.sub(r",\s*([}\]])", r"\1", text)
        return json.loads(fixed)
    except json.JSONDecodeError as e:
        raise Exception(f"JSON parse failed: {e}. Resposta (300 chars): {text[:300]}")


if __name__ == "__main__":
    print("=== Test DeepSeek client ===")
    result = call_deepseek_json(
        "Ets un assistent. Torna un JSON.",
        'Digues Hola en catala. Torna {"ok": true, "missatge": "la teva resposta"}',
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
