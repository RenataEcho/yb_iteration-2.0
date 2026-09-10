"""FR-013 AI申词 E2E：Tab 源、批量数量、立即申词 / 立即题词。"""

import re

from playwright.sync_api import expect


LISTED_TITLES = [
    "我成了老公掌心宠",
    "我给死对头当了百日新娘",
    "被偷听心声后我成了全村团宠",
    "银发军官把我宠上天",
]


def open_demo(page, demo_server, screen=None, embed=False):
    qs = []
    if embed:
        qs.append("embed=1")
    if screen:
        qs.append(f"screen={screen}")
    suffix = ("?" + "&".join(qs)) if qs else ""
    page.goto(f"{demo_server}/ai-keyword-demo.html{suffix}", wait_until="domcontentloaded")
    page.locator("#screen-form .nav-bar .title").wait_for()
    return page


def toast(page):
    return page.locator("#toast")


def test_recommend_batch_submit_and_admin(page, demo_server):
    open_demo(page, demo_server)
    page.evaluate("localStorage.removeItem('ybdd-fr013-batches')")
    expect(page.locator("#screen-form .nav-bar .title")).to_have_text("AI申词")
    page.select_option("#projectSelect", "fanqie-novel")
    page.select_option("#promoSelect", "图文")
    page.locator('.src-tab[data-src="recommend"]').click()
    rec = page.locator("#recommendList")
    expect(rec).to_be_visible()
    expect(page.locator("#recommendList .rec-item")).to_have_count(10)
    for title in LISTED_TITLES:
        expect(rec).to_contain_text(title)
    expect(rec).not_to_contain_text("末世里我带全家躺赢")
    expect(rec).not_to_contain_text("我给反派当了三年白月光")
    expect(page.locator("#recRefresh")).to_be_enabled()
    page.locator("#recRefresh").click()
    expect(page.locator("#recommendList")).to_contain_text("我给反派当了三年白月光")
    expect(page.locator("#recommendList .rec-item")).to_have_count(3)
    page.fill("#recSearch", "BK-1001")
    expect(page.locator("#recommendList")).to_contain_text("我成了老公掌心宠")
    expect(page.locator("#recommendList .rec-item")).to_have_count(1)
    page.fill("#recSearch", "没有这本书")
    expect(page.locator("#recommendEmpty")).to_contain_text("没有找到符合的书")
    page.fill("#recSearch", "")
    expect(page.locator("#recommendList .rec-item")).to_have_count(10)

    rec.locator(".rec-item").filter(has_text="我成了老公掌心宠").locator("input").check()
    rec.locator(".rec-item").filter(has_text="我给死对头当了百日新娘").locator("input").check()
    page.fill("#applyQty", "3")
    page.locator("#applyKw").click()
    expect(page.locator(".kw-row")).to_have_count(2)
    expect(page.locator(".ai-chip")).to_have_count(6)
    page.locator("#submitKw").click()
    expect(toast(page)).to_contain_text("已题词")
    expect(toast(page)).to_contain_text("2 本书")
    expect(page.locator(".kw-row")).to_have_count(0)

    stored = page.evaluate("JSON.parse(localStorage.getItem('ybdd-fr013-batches') || '[]')")
    assert isinstance(stored, list) and stored
    new_batch = stored[0]
    assert new_batch["id"] != "BAT-9001"
    assert str(new_batch["id"]).startswith("BAT-")
    book_ids = [book["id"] for book in new_batch.get("books") or []]
    assert "BK-1001" in book_ids
    assert "BK-1002" in book_ids

    page.goto(f"{demo_server}/fr-ai-keyword.html?tab=admin", wait_until="domcontentloaded")
    first = page.locator("#batchBody tr").first
    expect(first.locator("td").first).to_have_text(new_batch["id"])
    expect(first.locator("td").first).not_to_have_text("BAT-9001")
    expect(first).to_contain_text("我成了老公掌心宠")
    expect(first).to_contain_text("我给死对头当了百日新娘")
    first.get_by_role("button", name="详情").click()
    detail = page.locator("#detailDrawer")
    expect(detail).to_contain_text("我成了老公掌心宠")
    expect(detail).to_contain_text("我给死对头当了百日新娘")
    expect(detail.locator(".word-chip").first).to_be_visible()


def test_manual_unmatched_dedupe_and_qty(page, demo_server):
    open_demo(page, demo_server)
    page.select_option("#projectSelect", "fanqie-novel")
    page.select_option("#promoSelect", "图文")
    expect(page.locator("#pane-manual")).to_have_class(re.compile(r"active"))
    book_box = page.locator("#bookIds").bounding_box()
    assert book_box and book_box["height"] <= 64

    page.fill("#bookIds", "BK-1001\nBK-1003")
    page.fill("#applyQty", "3")
    page.locator("#applyKw").click()
    expect(page.locator(".kw-row")).to_have_count(2)
    expect(page.locator('.kw-row[data-id="BK-1001"]')).to_contain_text("我成了老公掌心宠")
    expect(page.locator('.kw-row[data-id="BK-1003"]')).to_contain_text("我在八零年代当后妈")
    expect(page.locator(".ai-chip")).to_have_count(6)

    page.fill("#bookIds", "BK-1001, BK-1001, BK-9999")
    page.locator("#applyKw").click()
    expect(toast(page)).to_contain_text("已去重")
    expect(page.locator(".kw-row")).to_have_count(2)
    expect(page.locator('.kw-row[data-id="BK-9999"]')).to_contain_text("未匹配书名")

    page.fill("#applyQty", "12")
    page.locator("#applyKw").click()
    expect(page.locator('.kw-row[data-id="BK-9999"] .ai-chip')).to_have_count(10)
    expect(page.locator("#applyQty")).to_have_value("10")

    page.fill("#applyQty", "0")
    page.locator("#applyKw").click()
    expect(page.locator('.kw-row[data-id="BK-9999"] .ai-chip')).to_have_count(1)
    expect(page.locator("#applyQty")).to_have_value("1")

    page.fill("#applyQty", "")
    page.locator("#applyKw").click()
    expect(toast(page)).to_contain_text("请输入申请数量")

    page.fill("#applyQty", "2")
    page.locator("#applyKw").click()
    expect(page.locator(".ai-chip")).to_have_count(4)
    page.locator("#submitKw").click()
    expect(toast(page)).to_contain_text("已题词")
    expect(toast(page)).not_to_contain_text("请先")


def test_missing_fields_and_own_library(page, demo_server):
    open_demo(page, demo_server)
    page.locator("#applyKw").click()
    expect(toast(page)).to_contain_text("请先选择项目")
    page.locator("#submitKw").click()
    expect(toast(page)).to_contain_text("请先选择项目")

    page.select_option("#projectSelect", "fanqie-novel")
    page.locator("#applyKw").click()
    expect(toast(page)).to_contain_text("请先选择推广类型")

    page.select_option("#promoSelect", "图文")
    page.locator("#applyKw").click()
    expect(toast(page)).to_contain_text("请添加有效书籍 ID")
    page.locator("#submitKw").click()
    expect(toast(page)).to_contain_text("请先立即申词")

    page.fill("#bookIds", "BK-1001")
    page.locator("#applyKw").click()
    expect(page.locator(".kw-row")).to_have_count(1)

    page.select_option("#projectSelect", "fanqie-comic")
    expect(page.locator("#projectSelect")).to_have_value("fanqie-comic")
    page.locator('.src-tab[data-src="recommend"]').click()
    expect(page.locator("#recommendList")).to_contain_text("我成了老公掌心宠")
    page.locator('.src-tab[data-src="manual"]').click()
    page.fill("#bookIds", "BK-1004")
    page.locator("#applyKw").click()
    expect(page.locator('.kw-row[data-id="BK-1004"]')).to_be_visible()

    page.select_option("#projectSelect", "fanqie-short")
    expect(page.locator("#promoSelect option")).to_have_count(6)
    page.locator('.src-tab[data-src="manual"]').click()
    page.fill("#bookIds", "BK-1001")
    page.locator("#applyKw").click()
    expect(page.locator('.kw-row[data-id="BK-1001"]')).to_be_visible()


def test_embed_preview_and_unknown_screen(page, demo_server):
    open_demo(page, demo_server, screen="preview", embed=True)
    expect(page.locator("body")).to_have_class(re.compile(r"embed-mode"))
    expect(page.locator("#projectSelect")).to_have_value("fanqie-novel")
    expect(page.locator("#promoSelect")).to_have_value("图文")
    expect(page.locator("#pane-recommend")).to_have_class(re.compile(r"active"))
    expect(page.locator(".kw-row")).to_have_count(2)
    expect(page.locator(".ai-chip")).to_have_count(6)
    expect(page.locator("#applyKw")).to_have_text("立即申词")
    expect(page.locator("#submitKw")).to_have_text("立即题词")
    result_box = page.locator("#resultBlock").bounding_box()
    apply_box = page.locator("#applyKw").bounding_box()
    submit_box = page.locator("#submitKw").bounding_box()
    assert result_box and apply_box and submit_box
    assert result_box["width"] > apply_box["width"]
    assert apply_box["x"] < submit_box["x"]
    assert abs(apply_box["y"] - submit_box["y"]) < 8

    open_demo(page, demo_server, screen="not-a-screen", embed=True)
    expect(page.locator("#projectSelect")).to_have_value("")
    expect(page.locator(".kw-row")).to_have_count(0)


def test_fr_shell_iframe_admin_and_flow(page, demo_server):
    page.goto(f"{demo_server}/fr-ai-keyword.html", wait_until="domcontentloaded")
    expect(page.get_by_role("heading", name="AI申词")).to_be_visible()
    expect(page.locator(".nav-item.active")).to_contain_text("AI申词")
    frame = page.frame_locator("#mockupFrame")
    expect(frame.locator("#screen-form .nav-bar .title")).to_have_text("AI申词")
    expect(frame.locator("#applyKw")).to_have_text("立即申词")

    page.locator(".scene-list").get_by_role("button", name="官方推荐").click()
    expect(frame.locator("#recommendList")).to_contain_text("我成了老公掌心宠")

    page.get_by_role("tab", name="管理后台").click()
    expect(page.locator("#batchBody")).to_contain_text("BAT-9001")
    expect(page.locator("#batchBody")).to_contain_text("番茄小说")
    expect(page.locator("#batchBody")).to_contain_text("我成了老公掌心宠")
    expect(page.locator("#batchBody")).to_contain_text("我给死对头当了百日新娘")

    page.get_by_role("tab", name="业务流程").click()
    expect(page.locator(".flow-svg-wrap")).to_contain_text("推广类型")
    expect(page.locator(".flow-svg-wrap")).to_contain_text("官方推荐")
    expect(page.locator(".flow-svg-wrap")).to_contain_text("立即申词")
    expect(page.locator(".flow-svg-wrap")).to_contain_text("立即题词")
