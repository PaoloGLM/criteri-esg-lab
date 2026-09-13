"""
Gate d'idiomes: detecta text CA barrejat en fitxers ES (i a l'inrevés).

Motiu (13-set-2026): el pas 4 va generar un .es.md mig en català (EPA/EEA
clean-energy-jobs) i el pas 5 (ortografia Gemini) NO ho va detectar.
Aquest script es fa servir COM A BLOQUEIG abans de publicar:
si un fitxer .es.md conté frases en català, surt amb codi d'error 1.

Detecció: llista de paractors catalans exclusius (amb context de paraula
completa) que pràcticament mai apareixen en castellà estàndard.

Ús:
    scripts/.venv/bin/python scripts/check-idiomes.py <fitxer.md> [...]
    scripts/.venv/bin/python scripts/check-idiomes.py data/informes/3-fets/*.es.md
"""
import re
import sys
from pathlib import Path

# Paractors nom-CATALANS (no existeixen en castellà). Sensible a majúscules
# només a l'inici de motgràcia a \b i la classe explícita.
CA_MARKERS = [
    "els", "les", "una", "uns", "dones", "d'un", "d'una", "l'informe",
    "aquest", "aquesta", "també", "però", "molt", "menys", "entre",
    "treball", "treballadors", "ocupació", "ocupacional", "qualificació",
    "qualitat", "institució", "àmbit", "cobertura", "bretxa", "mitjà",
    "mitjana", "construcció", "formació", "inclusió", "transició",
    "polític", "política", "econòmic", "econòmica", "tècnic", "tècnica",
    "segons", "només", "encara", "gènere", "salari", "salari-minim",
    "comunitats", "empreses", "reguladors", "ciutadans", "connexions",
    "accions", "recomanades", "resum", "executiu", "fitxa", "bloc",
    "cross-reference", "semàfor", "metodològic", "dades", "clau",
    "implicacions", "sense", "sobre", "s'ha", "ha", "han", "cal",
    "punts", "gràcies", "perquè", "així", "cada", "cap", "cert",
    "centenars", "milers", "prop", "davant", "manca", "apuntar",
    "denuncien", "buig", "buits", "prioritzar", "acollir", "vinculants",
    "ajuts", "metges", "mentelatge", "mentoratge",
]

# Excepcions de paraules compostes vàlides en ES que contenen "ha"/"cal"/"una"
# dins d'una paraula més llarga — \b ja ho gestiona, però mantenim una llista
# de tokens ES legítims que NO s'han de comptar com a CA.
ES_FALSE_FRIENDS = {
    "ha", "han", "cal", "una", "cada", "cap", "cert", "sobre", "entre",
    "sin", "con", "por", "cu", "ya",
}

# Marcadors de SECCIÓ/FRASE catalans inconfusibles (multi-paraula, prioritat alta)
CA_PHRASES = [
    "resum executiu", "fitxa tècnica", "implicacions per a", "més enllà del",
    "dades clau", "accions recomanades", "qualitat laboral", "ocupació",
    "l'informe", "d'una", "d'un", "s'ha", "aquesta", "aquest",
    "el sector", "els treballadors", "les dones", "no obstant",
]

WORD_RE = re.compile(r"[a-zàèéíòóúüç·]+", re.IGNORECASE)


def analyze(path: Path) -> tuple[int, list[str]]:
    """Retorna (puntuació_de_risc, mostres). Puntuació = nombre de coincidències
    de frases catalanes (pes 3) + paractors CA exclusius (pes 1)."""
    text = path.read_text(encoding="utf-8")
    # Normalitza per a cerca de frases
    lower = text.lower()

    phrase_hits = 0
    samples = []
    for ph in CA_PHRASES:
        count = len(re.findall(r"(?<!\w)" + re.escape(ph) + r"(?!\w)", lower))
        if count:
            phrase_hits += count
            samples.append(f"frase «{ph}» x{count}")

    # Paraules individuals: compta paraactors CA exclusius no exclosos
    word_hits = 0
    words = WORD_RE.findall(text)
    for w in words:
        wl = w.lower()
        if wl in ES_FALSE_FRIENDS:
            continue
        if wl in CA_MARKERS:
            word_hits += 1

    # Llindar: un ES net amb cites puntuals pot tenir <15; mig en català en té 100+
    score = phrase_hits * 3 + word_hits
    return score, samples[:12]


def is_es_file(path: Path) -> bool:
    return ".es." in path.name


def main() -> int:
    paths = [Path(p) for p in sys.argv[1:]]
    if not paths:
        print(__doc__)
        return 2

    exit_code = 0
    for p in paths:
        if not p.exists():
            print(f"✗ no existeix: {p}")
            exit_code = 1
            continue
        score, samples = analyze(p)
        if is_es_file(p):
            if score > 60:
                print(f"✗ {p.name}: BARRAJO IDIOMÀTIC (puntuació CA={score}). "
                      f"Sembla català etiquetat com a ES. Mostres: {samples}")
                exit_code = 1
            elif score > 15:
                print(f"⚠ {p.name}: possible contaminació CA (puntuació={score}). "
                      f"Revisar manualment. Mostres: {samples}")
            else:
                print(f"✓ {p.name}: ES net (puntuació CA={score})")
        else:
            # Fitxer CA o altre: només informatiu
            print(f"· {p.name}: puntuació marcadors CA={score} (no aplicable, només ES es bloqueja)")
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
