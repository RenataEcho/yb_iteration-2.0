import http.server
import socketserver
import threading
from pathlib import Path

import pytest

DEMO_DIR = Path(__file__).resolve().parents[1] / "demo" / "iteration"


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DEMO_DIR), **kwargs)

    def log_message(self, format, *args):
        return


@pytest.fixture(scope="session")
def demo_server():
    httpd = socketserver.TCPServer(("127.0.0.1", 0), _QuietHandler)
    httpd.allow_reuse_address = True
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    host, port = httpd.server_address
    yield f"http://{host}:{port}"
    httpd.shutdown()
    httpd.server_close()


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "viewport": {"width": 1440, "height": 900},
        "locale": "zh-CN",
    }


@pytest.fixture
def cert_page(page, demo_server):
    page.goto(f"{demo_server}/fr-agent-cert.html", wait_until="domcontentloaded")
    page.locator("#certBody tr").first.wait_for()
    return page


@pytest.fixture
def settle_page(page, demo_server):
    page.goto(f"{demo_server}/fr-agent-cert.html?tab=settle", wait_until="domcontentloaded")
    page.locator("#stBody tr").first.wait_for()
    return page
