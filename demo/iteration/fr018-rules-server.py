#!/usr/bin/env python3
"""把 FR-018 需求规则的编辑结果写回需求页。"""
import json
import re
import traceback
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HTML = Path(__file__).resolve().parent / "fr-yijian-daifa-iter2.html"
MD = ROOT / "_bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-09-25/fr018-rules.md"
START = "<!-- fr018-rules:start -->"
END = "<!-- fr018-rules:end -->"


def clean(html: str) -> str:
    html = re.sub(r"(?is)<\s*script\b.*?</\s*script\s*>", "", html)
    html = re.sub(r"(?i)\s+on\w+\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)", "", html)
    html = re.sub(r"""\s+data-cursor-[a-z0-9-]+=(?:"[^"]*"|'[^']*')""", "", html)
    html = re.sub(r"""\s+contenteditable=(?:"[^"]*"|'[^']*')""", "", html, flags=re.I)
    return html.strip()


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def render_html(sections: list) -> str:
    parts = []
    for i, sec in enumerate(sections, 1):
        title = esc(str(sec.get("title") or "").strip()) or "未命名"
        body = clean(str(sec.get("html") or ""))
        parts.append(
            "      <div class=\"rule-section\">\n"
            f"        <h3><span>{i}</span>{title}</h3>\n"
            "        <div class=\"rule-content\">\n"
            f"          {body}\n"
            "        </div>\n"
            "      </div>"
        )
    return "\n".join(parts)


def inline_md(html: str) -> str:
    text = re.sub(r"(?i)<br\s*/?>", "\n", html)
    text = re.sub(r"(?i)</p>", "\n", text)
    text = re.sub(r"(?i)<li[^>]*>", "- ", text)
    text = re.sub(r"(?i)</li>", "\n", text)
    text = re.sub(r"(?i)<strong>(.*?)</strong>", r"**\1**", text)
    text = re.sub(r"(?i)<b>(.*?)</b>", r"**\1**", text)
    text = re.sub(r"(?i)<code>(.*?)</code>", r"`\1`", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = (
        text.replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
    )
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)


def render_md(sections: list) -> str:
    parts = ["# FR-018 · 一键代发迭代 2.0 需求规则", ""]
    for i, sec in enumerate(sections, 1):
        title = str(sec.get("title") or "").strip() or "未命名"
        parts.append(f"## {i}. {title}")
        parts.append("")
        parts.append(inline_md(str(sec.get("html") or "")))
        parts.append("")
    return "\n".join(parts).rstrip() + "\n"


def write_rules(sections: list) -> None:
    if not sections:
        raise ValueError("empty")
    block = render_html(sections)
    text = HTML.read_text(encoding="utf-8")
    if START not in text or END not in text:
        raise ValueError("markers missing")
    updated = re.sub(
        re.escape(START) + r"[\s\S]*?" + re.escape(END),
        START + "\n" + block + "\n      " + END,
        text,
        count=1,
    )
    HTML.write_text(updated, encoding="utf-8")
    MD.parent.mkdir(parents=True, exist_ok=True)
    MD.write_text(render_md(sections), encoding="utf-8")


class Handler(BaseHTTPRequestHandler):
    def _cors(self) -> None:
        origin = self.headers.get("Origin") or ""
        if origin.startswith("http://127.0.0.1:") or origin.startswith("http://localhost:"):
            self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self) -> None:
        if self.path.split("?", 1)[0] != "/fr018/rules":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > 200_000:
            self.send_error(400)
            return
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            sections = payload.get("sections")
            if not isinstance(sections, list) or len(sections) > 40:
                raise ValueError("bad sections")
            write_rules(sections)
        except Exception:
            traceback.print_exc()
            self.send_error(400)
            return
        body = b'{"ok":true}'
        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt: str, *args) -> None:
        print("[fr018-rules]", fmt % args)


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 19889), Handler).serve_forever()
