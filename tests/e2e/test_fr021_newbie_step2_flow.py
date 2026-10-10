"""FR-021 新手学院 STEP 2：页内「业务流程」一张图，以及规则里的一句指针。"""

import re
from pathlib import Path
from xml.etree import ElementTree as ET

from playwright.sync_api import expect

ROOT = Path(__file__).resolve().parents[2]
PAGE = ROOT / "demo" / "iteration" / "fr-creator-home-2-opt.html"
RULES = ROOT / "demo" / "iteration" / "fr-creator-home-2-opt-rules.html"


def _svg_text():
    html = PAGE.read_text()
    return re.search(r'<svg width="1360"[\s\S]*?</svg>', html).group(0)


def _shapes(svg):
    root = ET.fromstring(svg)

    def local(tag):
        return tag.rsplit("}", 1)[-1]

    rects = []
    polys = []
    for el in root.iter():
        name = local(el.tag)
        if name == "rect" and el.get("fill") not in (None, "none"):
            rects.append(
                (float(el.get("x")), float(el.get("y")), float(el.get("width")), float(el.get("height")))
            )
        elif name == "polygon":
            polys.append(
                [(float(a), float(b)) for a, b in re.findall(r"(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)", el.get("points"))]
            )
    return rects, polys


def _inside(x, y, rects, polys, eps=1.2):
    for left, top, width, height in rects:
        if left + eps < x < left + width - eps and top + eps < y < top + height - eps:
            return True
    for pts in polys:
        inside = False
        for i, (x1, y1) in enumerate(pts):
            x2, y2 = pts[(i + 1) % len(pts)]
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / ((y2 - y1) or 1e-12) + x1:
                inside = not inside
        if not inside:
            continue
        nearest = 1e9
        for i, (x1, y1) in enumerate(pts):
            x2, y2 = pts[(i + 1) % len(pts)]
            dx, dy = x2 - x1, y2 - y1
            length = dx * dx + dy * dy or 1
            t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / length))
            nearest = min(nearest, ((x - (x1 + t * dx)) ** 2 + (y - (y1 + t * dy)) ** 2) ** 0.5)
        if nearest > eps:
            return True
    return False


def _on_edge(x, y, rects, polys, tol=2.0):
    for left, top, width, height in rects:
        right, bottom = left + width, top + height
        if left - tol <= x <= right + tol and top - tol <= y <= bottom + tol:
            if min(abs(x - left), abs(x - right), abs(y - top), abs(y - bottom)) <= tol:
                return True
    for pts in polys:
        for i, (x1, y1) in enumerate(pts):
            x2, y2 = pts[(i + 1) % len(pts)]
            dx, dy = x2 - x1, y2 - y1
            length = dx * dx + dy * dy or 1
            t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / length))
            if ((x - (x1 + t * dx)) ** 2 + (y - (y1 + t * dy)) ** 2) ** 0.5 <= tol:
                return True
    return False


def test_open_flow_tab_and_unknown_falls_back_to_frontend(page, demo_server):
    page.goto(f"{demo_server}/fr-creator-home-2-opt.html?tab=flow", wait_until="domcontentloaded")
    expect(page.locator('.page-tab-bar button[data-page="view-flow"]')).to_have_class(re.compile(r"\bactive\b"))
    expect(page.locator("#view-flow.active svg")).to_have_count(1)
    expect(page.locator("#view-flow")).not_to_contain_text("流程1")
    assert "max-height: 72vh" in PAGE.read_text()
    expect(page.locator("#view-flow .flow-svg-wrap")).to_have_css("overflow-y", "auto")
    expect(page.locator("#view-flow .flow-legend")).to_be_visible()
    expect(page).to_have_url(re.compile(r"[?&]tab=flow(?:&|$)"))

    page.goto(f"{demo_server}/fr-creator-home-2-opt.html?tab=nope", wait_until="domcontentloaded")
    expect(page.locator("#view-fe")).to_have_class(re.compile(r"\bactive\b"))
    expect(page.locator("#view-flow")).not_to_have_class(re.compile(r"\bactive\b"))
    expect(page).to_have_url(re.compile(r"[?&]tab=fe(?:&|$)"))


def test_switching_tabs_keeps_scene_board_and_admin(page, demo_server):
    page.goto(f"{demo_server}/fr-creator-home-2-opt.html?tab=flow", wait_until="domcontentloaded")
    page.get_by_role("tab", name="前端交互").click()
    expect(page).to_have_url(re.compile(r"[?&]tab=fe(?:&|$)"))
    expect(page.locator("#feSceneList .scene-btn")).to_have_count(19)
    expect(page.locator("#view-fe iframe")).to_have_count(19)
    expect(page.locator("#view-fe")).to_be_visible()

    page.get_by_role("tab", name="管理后台").click()
    expect(page).to_have_url(re.compile(r"[?&]tab=admin(?:&|$)"))
    expect(page.locator("#adminDemoFrame")).to_be_visible()
    expect(page.locator("#adminDemoFrame")).not_to_have_attribute("src", "about:blank")
    expect(page.locator("#feSceneList .scene-btn")).to_have_count(19)

    page.get_by_role("tab", name="业务流程").click()
    expect(page).to_have_url(re.compile(r"[?&]tab=flow(?:&|$)"))
    expect(page.locator("#view-flow svg")).to_have_count(1)


def test_flow_diagram_covers_step2_exits():
    svg = _svg_text()
    for phrase in (
        "选择项目",
        "领词前可改选",
        "领词后收成一行",
        "还有可分配的词？",
        "领取关键词",
        "一个词只给一个人",
        "准备发布稿件",
        "官方还是自己的？",
        "使用官方稿件",
        "使用自己的稿件",
        "不在这里上传",
        "可改回官方",
        "该书还有可领稿件？",
        "稿件不足",
        "自行制作视频",
        "客服二维码",
        "我知道了",
        "改用自己的稿件",
        "领取次数够？",
        "次数不足，请先",
        "兑换领取次数",
        "领取并下载稿件",
        "按书随机一份、扣次",
        "不进作品广场",
        "稿件已准备？",
        "回填不可点",
        "稿件没准备好",
        "我已发布，立即回填",
        "开发规则",
        "打开对应项目的回填页面",
        "带入当前关键词",
        "模拟回填成功",
        "做得好，第一次发布",
        "完成啦！",
        "本次回填待审核",
        "去做项目",
        "现有变现页",
        "稍后再去",
        "停在 STEP 2",
        "去申请关键词",
        "稍后再说",
        "现有申请关键词页",
        "关键词不足",
        "官方词已领完",
    ):
        assert phrase in svg, phrase
    assert "已记入" not in svg
    assert "兑换页" not in svg
    assert "mermaid" not in svg.lower()
    assert svg.count("<svg") == 1
    assert 'id="flow-arrow-1"' in svg

    rects, polys = _shapes(svg)
    root = ET.fromstring(svg)

    def local(tag):
        return tag.rsplit("}", 1)[-1]

    ends = []
    segments = []
    for el in root.iter():
        name = local(el.tag)
        if name == "line":
            a = (float(el.get("x1")), float(el.get("y1")))
            b = (float(el.get("x2")), float(el.get("y2")))
            segments.append((a, b))
            ends.extend((a, b))
        elif name == "polyline":
            pts = [(float(a), float(b)) for a, b in re.findall(r"(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)", el.get("points"))]
            segments.extend(zip(pts, pts[1:]))
            ends.extend((pts[0], pts[-1]))

    for a, b in segments:
        ax, ay = a
        bx, by = b
        for i in range(1, 40):
            t = i / 40
            x = ax + (bx - ax) * t
            y = ay + (by - ay) * t
            if min(((x - ax) ** 2 + (y - ay) ** 2) ** 0.5, ((x - bx) ** 2 + (y - by) ** 2) ** 0.5) < 3:
                continue
            assert not _inside(x, y, rects, polys), (a, b, (x, y))
    for x, y in ends:
        assert _on_edge(x, y, rects, polys), (x, y)

    choose_top = [pt for pt in ends if abs(pt[1] - 36) <= 2 and 400 <= pt[0] <= 760]
    prep_top = [pt for pt in ends if abs(pt[1] - 324) <= 2 and 400 <= pt[0] <= 760]
    assert len(choose_top) >= 2
    assert len(prep_top) >= 4


def test_rules_pointer_does_not_rewrite_step2_table():
    text = RULES.read_text()
    match = re.search(
        r"<h2>业务流程</h2>\s*<p class=\"lead\">(.*?)</p>\s*<h2>STEP 2 · 跟着 4 步，完成首次发布</h2>",
        text,
    )
    assert match, "业务流程一节应紧挨 STEP 2 标题之前"
    assert match.group(1) == "见页内 Tab「业务流程」。"
    assert "领取新手关键词" in text
    assert "我已发布，立即回填" in text
    assert text.count("见页内 Tab「业务流程」。") == 1
