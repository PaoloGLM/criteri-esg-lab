"""
dynamic_fetch.py — Fetch HTML amb Playwright per webs JS dinàmiques.

Cal instal·lar: pip install playwright && playwright install chromium
"""
from playwright.sync_api import sync_playwright

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


def fetch_with_playwright(url: str, wait_seconds: int = 5) -> str | None:
    """Descarrega HTML renderitzat amb Playwright (Chromium headless)."""
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent=USER_AGENT, viewport={"width": 1920, "height": 1080})
            page = context.new_page()
            page.goto(url, wait_until="networkidle", timeout=45000)
            page.wait_for_timeout(wait_seconds * 1000)
            html = page.content()
            browser.close()
            return html
    except Exception as e:
        print(f"[playwright] ERROR: {e}")
        return None