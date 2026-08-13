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

# Comptatge de tokens per càlcul de costos (data/informes/state/token-usage.json)
USAGE_FILE = Path(__file__).resolve().parent.parent / "data" / "informes" / "state" / "token-usage.json"


def _record_usage(model: str, provider: str, prompt_tokens: int, completion_tokens: int):
    import json as _json
    import time as _time
    USAGE_FILE.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "ts": _time.strftime("%Y-%m-%dT%H:%M:%S"),
        "model": model,
        "provider": provider,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
    }
    data = []
    if USAGE_FILE.exists():
        try:
            data = _json.loads(USAGE_FILE.read_text(encoding="utf-8"))
        except Exception:
            data = []
    data.append(entry)
    USAGE_FILE.write_text(_json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


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
    try:
        u = response.usage
        _record_usage(DEEPSEEK_MODEL_NAME, "deepseek", u.prompt_tokens or 0, u.completion_tokens or 0)
    except Exception:
        pass
    content = response.choices[0].message.content or ""
    if not content.strip():
        # Si el thinking mode esgota el límit i content queda buit, fer servir reasoning_content
        rc = getattr(response.choices[0].message, "reasoning_content", None)
        if rc and rc.strip():
            content = rc
    return content


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
