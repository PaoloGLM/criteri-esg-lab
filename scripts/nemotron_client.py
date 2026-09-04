""" 
Client Nemotron 3 Ultra via OpenRouter.

Similar a gemini_client.py pero per Nemotron 3 Ultra via OpenRouter.
"""
import sys
import json
import os
import re
from pathlib import Path

sys.path.insert(0, "./scripts")
from config import get_openrouter_client

NEMOTRON_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"

def get_openrouter_nemotron_client():
    client = get_openrouter_client()
    return client

def call_nemotron(system_prompt: str, user_prompt: str, temperature: float = 0.3, max_tokens: int = 4096) -> str:
    import openai
    client = get_openrouter_client()
    
    response = client.chat.completions.create(
        model=NEMOTRON_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=temperature,
        max_tokens=max_tokens,
    )
    # Handle case where content is None (e.g., reasoning model with no final output)
    content = response.choices[0].message.content
    if content is None:
        # Check if there's reasoning content
        reasoning = getattr(response.choices[0].message, 'reasoning_content', None)
        if reasoning:
            return reasoning
        return ""
    return content


def call_nemotron_json(system_prompt: str, user_prompt: str, temperature: float = 0.3, max_tokens: int = 4096) -> dict:
    text = call_nemotron(system_prompt, user_prompt, temperature, max_tokens)
    
    # Handle markdown with YAML frontmatter or JSON code blocks
    text = text.strip()
    
    # If it starts with markdown code block
    if text.startswith("```"):
        import re
        m = re.search(r"```(?:json|yaml|yml)?\s*([\s\S]*?)\s*```", text)
        if m:
            text = m.group(1).strip()
    
    # If it starts with YAML frontmatter (---)
    if text.startswith("---"):
        import re
        # Extract content after frontmatter
        m = re.search(r"^---\s*\n[\s\S]*?\n---\s*\n(.*)$", text, re.MULTILINE)
        if m:
            text = m.group(1).strip()
        else:
            # Try to find JSON object after frontmatter
            first_brace = text.find('{')
            if first_brace != -1:
                text = text[first_brace:]
    
    # If still wrapped in markdown code block without language spec
    if text.strip().startswith("```"):
        import re
        m = re.search(r"```\s*([\s\S]*?)\s*```", text)
        if m:
            text = m.group(1).strip()
    
    # Try to find JSON object
    first_brace = text.find('{')
    last_brace = text.rfind('}')
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        text = text[first_brace:last_brace+1]
    
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
    print("=== Test Nemotron client ===")
    result = call_nemotron_json(
        "Ets un assistent. Torna un JSON.",
        'Digues Hola en catala. Torna {"ok": true, "missatge": "la teva resposta"}',
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
