#!/usr/bin/env python3
"""
Auditoria: passa el corrector LanguageTool per tots els textos públics
generats fins ara i genera un informe honest.

Fitxers auditats:
- HTML pilot (informe Forética, semàfors)
- HTML plantilles informe estil A/B/C
- HTML plantilles newsletter estil A/B
- HTML informe model v3 i v3.1
"""
import sys
sys.path.insert(0, '/home/z/my-project/scripts')
from corrector_wrapper import check_file, CheckResult
from pathlib import Path
import json

# Fitxers a auditar
FILES_TO_AUDIT = [
    # Pilot Forética (el més important)
    ('/home/z/my-project/download/pilot-informe-foretica-amb-semafor-i-mes-enlla.html', 'ca'),
    # Proves format
    ('/home/z/my-project/download/semafor-format-A-compacte.html', 'ca'),
    ('/home/z/my-project/download/semafor-format-B-horitzontal.html', 'ca'),
    # Criteri informe exemple
    ('/home/z/my-project/download/criteri-informe-exemple.html', 'ca'),
    # Plantilles informe
    ('/home/z/my-project/scripts/informe_estil_A.html', 'ca'),
    ('/home/z/my-project/scripts/informe_estil_B.html', 'ca'),
    ('/home/z/my-project/scripts/informe_estil_B_homog.html', 'ca'),
    ('/home/z/my-project/scripts/informe_estil_B_v2.html', 'ca'),
    ('/home/z/my-project/scripts/informe_estil_C.html', 'ca'),
    ('/home/z/my-project/scripts/informe_model_v3.html', 'ca'),
    ('/home/z/my-project/scripts/informe_model_v3_1.html', 'ca'),
    # Plantilles newsletter
    ('/home/z/my-project/scripts/newsletter_estil_A.html', 'ca'),
    ('/home/z/my-project/scripts/newsletter_estil_A_homog.html', 'ca'),
    ('/home/z/my-project/scripts/newsletter_estil_A_v2.html', 'ca'),
    ('/home/z/my-project/scripts/newsletter_estil_B.html', 'ca'),
]

def main():
    print("=" * 70)
    print("AUDITORIA CORRECTOROR LANGUAGETOOL")
    print("Textos públics generats per Criteri ESG (juny-juliol 2026)")
    print("=" * 70)
    print()

    results = []
    total_errors = 0
    total_auto = 0
    total_manual = 0
    files_with_errors = 0

    for filepath, lang in FILES_TO_AUDIT:
        if not Path(filepath).exists():
            print(f"⚠ No trobat: {filepath}")
            continue
        print(f"Auditant: {Path(filepath).name}")
        result = check_file(filepath, lang)
        results.append(result)
        total_errors += len(result.corrections)
        total_auto += len(result.auto_corrections)
        total_manual += len(result.manual_corrections)
        if result.has_errors:
            files_with_errors += 1
        # Guarda log individual
        log_path = filepath + '.corrector.log'
        result.save_log(filepath)
        real_total = len(result.auto_corrections) + len(result.manual_corrections)
        ignored = len(result.ignored_corrections)
        print(f"  → {real_total} errors reals ({len(result.auto_corrections)} auto, {len(result.manual_corrections)} manual) [{ignored} ignorats]")
        print()

    # ============ Informe resum ============
    print()
    print("=" * 70)
    print("INFORME RESUM")
    print("=" * 70)
    print()
    print(f"Fitxers auditats: {len(results)}")
    print(f"Fitxers amb errors: {files_with_errors}/{len(results)}")
    print(f"Total errors: {total_errors}")
    print(f"  - Auto-corregits: {total_auto}")
    print(f"  - Manual (requereixen revisió): {total_manual}")
    print()

    # Top errors per fitxer
    print("=" * 70)
    print("DETALL PER FITXER (errors reals, filtrant whitelist)")
    print("=" * 70)
    for r in results:
        status = "✓" if r.ok else "✗"
        real_total = len(r.auto_corrections) + len(r.manual_corrections)
        ignored = len(r.ignored_corrections)
        print(f"{status} {Path(r.source).name}: {real_total} errors reals "
              f"({len(r.auto_corrections)} auto, {len(r.manual_corrections)} manual) "
              f"[{ignored} ignorats per whitelist]")
    print()

    # Top 20 errors més freqüents (només errors reals, no ignorats)
    print("=" * 70)
    print("TOP 20 ERRORS REALS MÉS FREQÜENTS (filtrant whitelist)")
    print("=" * 70)
    from collections import Counter
    all_corrections = []
    for r in results:
        for c in r.corrections:
            if not c.ignored:
                all_corrections.append((c.word, c.replacement, c.rule))
    freq = Counter([(c[0], c[2]) for c in all_corrections])
    for (word, rule), count in freq.most_common(20):
        replacement = next((c[1] for c in all_corrections if c[0] == word and c[2] == rule), '?')
        print(f"  {count}× '{word}' → '{replacement}' ({rule})")
    print()

    # Informe honest final
    print("=" * 70)
    print("CONCLUSIÓ HONESTA")
    print("=" * 70)
    if total_errors == 0:
        print("✓ Tots els fitxers estan nets. No cal acció.")
    else:
        print(f"✗ S'han trobat {total_errors} errors reals en {files_with_errors} fitxers.")
        print(f"  D'aquests, {total_auto} s'han auto-corregit i {total_manual} requereixen revisió manual.")
        if total_manual > 0:
            print()
            print("ACCIONS REQUERIDES:")
            print("  1. Revisar manualment els fitxers marcats amb ✗")
            print("  2. Aplicar les correccions manuals necessàries")
            print("  3. Re-guardar els fitxers corregits")
            print("  4. Verificar que les correccions automàtiques són correctes")
    print()
    print(f"Logs detallats guardats al costat de cada fitxer (*.corrector.log)")

    # Guarda informe en JSON
    audit_path = Path('/home/z/my-project/download/auditoria-corrector-2026-07-05.json')
    audit_data = {
        'date': '2026-07-05',
        'files_audited': len(results),
        'files_with_errors': files_with_errors,
        'total_errors': total_errors,
        'auto_corrections': total_auto,
        'manual_corrections': total_manual,
        'files': [
            {
                'file': r.source,
                'language': r.language,
                'errors': len(r.corrections),
                'auto': len(r.auto_corrections),
                'manual': len(r.manual_corrections),
            } for r in results
        ],
        'top_errors': [
            {'word': w, 'replacement': next((c[1] for c in all_corrections if c[0] == w and c[2] == rule), '?'),
             'rule': rule, 'count': count}
            for (w, rule), count in freq.most_common(20)
        ],
    }
    audit_path.write_text(json.dumps(audit_data, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"\nInforme JSON guardat a: {audit_path}")

if __name__ == '__main__':
    main()
