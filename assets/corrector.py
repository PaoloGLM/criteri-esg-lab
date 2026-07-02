#!/usr/bin/env python3
"""
Corrector ortogràfic per a textos en català i castellà.
Usa LanguageTool API (gratuïta, suporta català i castellà).

Ús: python3 corrector.py <fitxer.txt> [ca|es]
Si no s'especifica idioma, detecta automàticament.
"""
import sys
import json
import urllib.request
import urllib.parse

def corregir(text, language='auto'):
    """Corregeix un text amb LanguageTool API."""
    data = urllib.parse.urlencode({
        'text': text,
        'language': language,
        'enabledOnly': 'false',
    }).encode('utf-8')
    
    req = urllib.request.Request(
        'https://api.languagetool.org/v2/check',
        data=data,
        method='POST'
    )
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    
    with urllib.request.urlopen(req, timeout=30) as response:
        result = json.loads(response.read().decode('utf-8'))
    
    matches = result.get('matches', [])
    
    if not matches:
        print("✓ No s'han trobat errors.")
        return text
    
    # Aplica correccions automàtiques quan hi ha una sola opció
    corrected_text = list(text)
    corrections = []
    
    for match in matches:
        offset = match['offset']
        length = match['length']
        message = match['message']
        replacements = match.get('replacements', [])
        context = match['context']['text']
        rule = match['rule']['description']
        
        word = text[offset:offset+length]
        
        if replacements:
            replacement = replacements[0]['value']
            corrections.append({
                'word': word,
                'replacement': replacement,
                'message': message,
                'rule': rule,
                'context': context.strip(),
                'auto': len(replacements) == 1
            })
            
            # Aplica la correcció automàtica si només hi ha una opció
            if len(replacements) == 1:
                for i in range(length):
                    corrected_text[offset + i] = ''
                corrected_text.insert(offset, replacement)
        else:
            corrections.append({
                'word': word,
                'replacement': '(cap suggeriment)',
                'message': message,
                'rule': rule,
                'context': context.strip(),
                'auto': False
            })
    
    corrected = ''.join(corrected_text)
    
    print(f"=== {len(matches)} errors trobats ({sum(1 for c in corrections if c['auto'])} auto-corregits) ===\n")
    
    for i, c in enumerate(corrections, 1):
        auto_str = "✓ AUTO" if c['auto'] else "✗ MANUAL"
        print(f"{i:2d}. [{auto_str}] '{c['word']}' → '{c['replacement']}'")
        print(f"    Regla: {c['rule']}")
        print(f"    Missatge: {c['message']}")
        print(f"    Context: ...{c['context']}...")
        print()
    
    auto_count = sum(1 for c in corrections if c['auto'])
    manual_count = len(corrections) - auto_count
    
    print(f"Resum: {auto_count} auto-corregits, {manual_count} requereixen revisió manual")
    
    return corrected

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Ús: python3 corrector.py <fitxer.txt> [ca|es]")
        print("  ca = català, es = castellà, auto = detecció automàtica (per defecte)")
        sys.exit(1)
    
    filepath = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else 'auto'
    
    # LanguageTool usa 'ca-ES' per català, 'es' per castellà, 'auto' per autodetecció
    if language == 'ca':
        language = 'ca-ES'
    elif language == 'es':
        language = 'es'
    else:
        language = 'auto'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    print(f"Corregint: {filepath} ({language})")
    print(f"Text: {len(text)} caràcters\n")
    
    corrected = corregir(text, language)
    
    # Guarda la versió corregida
    output_path = filepath.replace('.txt', '-corregit.txt')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(corrected)
    
    print(f"\nVersió corregida guardada a: {output_path}")
