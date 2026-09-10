"""FR-012 选书中心 E2E：列表筛选、详情推广类型、申请关键词 / AI申词。"""

import re

from playwright.sync_api import expect


def test_list_search_filter_and_detail_tabs(page, demo_server):
    page.goto(f"{demo_server}/book-select-demo.html", wait_until="domcontentloaded")
    expect(page.locator("#screen-list .nav-bar .title")).to_have_text("选书中心")
    expect(page.locator("#catScroll")).to_contain_text("番茄小说")
    expect(page.locator("#catScroll")).to_contain_text("番茄短剧")
    expect(page.locator("#catScroll")).to_contain_text("番茄漫剧")
    expect(page.locator(".book-card")).to_have_count(14)
    expect(page.locator("body")).not_to_contain_text("AI换词")

    page.fill("#searchInput", "掌心")
    expect(page.locator(".book-card")).to_have_count(2)
    expect(page.locator(".book-card").first).to_contain_text("掌心宠")

    page.fill("#searchInput", "")
    page.locator("#filterTrigger").click()
    expect(page.locator("#filterSheet")).to_have_class(re.compile(r"show"))
    page.locator('#filterBody .tag-btn[data-key="status"][data-val="完本"]').click()
    page.locator("#filterOk").click()
    expect(page.locator("#filterSheet")).not_to_have_class(re.compile(r"show"))
    expect(page.locator(".book-card")).to_have_count(11)
    expect(page.locator("#bookGrid")).not_to_contain_text("未完本")

    page.locator(".book-card").filter(has_text="被偷听心声").click()
    expect(page.locator("#screen-detail")).to_have_class(re.compile(r"active"))
    expect(page.locator(".detail-name")).to_have_text("被偷听心声后我成了全村团宠")
    expect(page.locator("#bookIdVal")).to_have_text("FQ72810005")
    expect(page.locator("#bookLinkVal")).to_contain_text("fanqienovel.com/page/FQ72810005")
    page.locator("#copyBookId").click()
    expect(page.locator("#toast")).to_contain_text("书籍ID已复制")
    expect(page.locator("#promoSelect")).to_be_visible()
    expect(page.locator("#promoSelect")).to_contain_text("真人出镜")
    expect(page.locator("#promoSelect")).to_contain_text("图文")
    expect(page.locator("#promoSelect")).to_contain_text("解压TTS")
    expect(page.locator("#promoSelect")).to_contain_text("解说混剪")
    expect(page.locator("#promoSelect")).to_contain_text("AIGC")
    expect(page.locator(".kw-tab[data-tab='manual']")).to_be_visible()
    expect(page.locator(".kw-tab[data-tab='ai']")).to_be_visible()
    expect(page.locator("body")).not_to_contain_text("AI换词")

    expect(page.locator("#submitKw")).to_have_text("立即题词")
    page.locator("#submitKw").click()
    expect(page.locator("#toast")).to_contain_text("请先选择推广类型")

    page.select_option("#promoSelect", "图文")
    page.fill("#kwInput", "掌心宠溺")
    page.locator("#submitKw").click()
    expect(page.locator("#toast")).to_contain_text("已题词「掌心宠溺」")

    page.locator(".kw-tab[data-tab='ai']").click()
    expect(page.locator("#pane-ai")).to_have_class(re.compile(r"active"))
    expect(page.locator("#promoSelect")).to_have_value("图文")
    expect(page.locator("#pane-ai")).not_to_contain_text("申请数量")
    expect(page.locator("#aiSwap")).to_have_text("更换")
    expect(page.locator("#aiSwapIn")).to_have_text("申请")
    page.fill("#aiQty", "12")
    page.locator("#aiSwapIn").click()
    expect(page.locator(".ai-chip")).to_have_count(10)
    page.locator("#submitKw").click()
    expect(page.locator("#toast")).to_contain_text("已题词 10 个AI关键词")


def test_fr_shell_iframe_and_admin(page, demo_server):
    page.goto(f"{demo_server}/fr-book-select.html", wait_until="domcontentloaded")
    expect(page.get_by_role("heading", name="选书中心")).to_be_visible()
    expect(page.locator(".nav-item.active")).to_contain_text("选书中心")
    frame = page.frame_locator("#mockupFrame")
    expect(frame.locator(".book-card").first).to_be_visible()

    page.get_by_role("tab", name="管理后台").click()
    expect(page.locator("#bookBody")).to_contain_text("BK-1001")
    page.get_by_role("tab", name="申词记录").click()
    expect(page.locator("#applyBody")).to_contain_text("AI申词")
    expect(page.locator("#applyBody")).to_contain_text("图文")

    page.get_by_role("tab", name="业务流程").click()
    expect(page.locator(".flow-svg-wrap")).to_contain_text("推广类型")
    expect(page.locator(".flow-svg-wrap")).to_contain_text("AI申词")

    page.locator("#toggleRuleDrawer").click()
    expect(page.locator("#ruleDrawer")).to_have_class(re.compile(r"open"))
    expect(page.locator(".prompt-block")).to_contain_text("书籍ID：{book_id}")
    expect(page.locator(".prompt-block")).to_contain_text("作品简介：{intro}")
    expect(page.locator(".prompt-block")).to_contain_text("4 到 10 个连续汉字")
