"""
Client del model actiu del pipeline Criteri ESG (passos 2 i 4).

Des del 16-set-2026, la variable d'entorn PIPELINE_LLM permet substituir
temporalment el pool OpenRouter (z-ai/glm-5.2) per DeepSeek v4 Pro (API
oficial, preu meitat a les hores off-peak UTC):

    PIPELINE_LLM=deepseek  →  DeepSeek v4 Pro (api.deepseek.com)
    (buit / qualsevol altre valor)  →  OpenRouter, model base z-ai/glm-5.2

Totes les crides dels passos 2 (destil·lació) i 4 (redacció) passen per
aquest client, de manera que el canvi de model es fa AQUÍ i només aquí.

DeepSeek v4 Pro (API oficial) — finestres de preu:
    - PEAK: 01:00-04:00 i 06:00-10:00 UTC, dilluns a divendres (preu ple)
    - OFF-PEAK: la resta (preu MEITAT)
    - Gate: DEEPSEEK_OFFPEAK_ONLY=1 BLOQUEJA crides en hora punta
      (per defecte només avisa per pantalla).
    - Cada crida registra tokens a data/informes/state/token-usage.json
"""
import sys
import os
import json
import re
import time as _time

sys.path.insert(0, "./scripts")


def _use_deepseek() -> bool:
    """True si PIPELINE_LLM=deepseek."""
    return os.getenv("PIPELINE_LLM", "").strip().lower() == "deepseek"


# Finestres punta DeepSeek en hores UTC [inici, fi)
_PEAK_WINDOWS_UTC = [(1, 4), (6, 10)]


def _deepseek_peak_now() -> bool:
    """True si ara és hora punta DeepSeek (01-04 o 06-10 UTC, dl-dv)."""
    t = _time.gmtime()
    if t.tm_wday >= 5:  # dissabte=5, diumenge=6 → mai punta
        return False
    h = t.tm_hour
    return any(a <= h < b for a, b in _PEAK_WINDOWS_UTC)


def _gate_deepseek():
    """Avisa (o bloqueja amb DEEPSEEK_OFFPEAK_ONLY=1) si és hora punta."""
    if not _deepseek_peak_now():
        return
    msg = ("DeepSeek: ara es HORA PUNTA (01-04 / 06-10 UTC dl-dv) - cost x2. "
           "Executa a off-peak (resta del dia) per pagar la meitat.")
    if os.getenv("DEEPSEEK_OFFPEAK_ONLY", "").strip() == "1":
        raise RuntimeError(msg + " [DEEPSEEK_OFFPEAK_ONLY=1 → bloquejat]")
    print(f"WARN: {msg}")


def call_glm_flash(system_prompt: str, user_prompt: str, temperature: float = 0.3, max_tokens: int = 4096) -> str:
    """Crida el model actiu del pipeline.

    - PIPELINE_LLM=deepseek → DeepSeek v4 Pro (amb gate off-peak i registre d'ús)
    - altrament → OpenRouter amb el model base triat per Paolo (z-ai/glm-5.2)
    """
    if _use_deepseek():
        from deepseek_client import call_deepseek
        _gate_deepseek()
        return call_deepseek(system_prompt, user_prompt, temperature, max_tokens)
    from config import call_openrouter_auto
    return call_openrouter_auto(system_prompt, user_prompt, temperature, max_tokens)


def _neteja_tanques(text: str) -> str:
    """Trau tanques markdown ```json ... ``` (fix bd53dac, abans de parsejar)."""
    s = text.strip()
    if s.startswith("```"):
        s = re.sub(r"^```[a-zA-Z]*\s*", "", s)
        s = re.sub(r"\s*```$", "", s)
    return s


def call_glm_flash_json(system_prompt: str, user_prompt: str, temperature: float = 0.3, max_tokens: int = 4096) -> dict:
    """Crida el model actiu i parseja JSON (amb neteja de tanques markdown)."""
    text = _neteja_tanques(call_glm_flash(system_prompt, user_prompt, temperature, max_tokens))

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
    font = "DeepSeek v4 Pro" if _use_deepseek() else "OpenRouter (z-ai/glm-5.2)"
    print(f"=== Test client pipeline (model actiu: {font}) ===")
    result = call_glm_flash_json(
        "Ets un assistent. Torna un JSON.",
        'Digues Hola en català. Torna {"ok": true, "missatge": "la teva resposta"}',
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
