"""FR-020 需求规则改为表格页，抽屉用 iframe 嵌进去。"""

from playwright.sync_api import expect

TABS = [
    ("功能索引", "p-index"),
    ("作品广场", "p-plaza"),
    ("稿件详情", "p-detail"),
    ("帐号运营", "p-account"),
    ("任务协作", "p-task"),
    ("已领回填", "p-claims"),
    ("收益日历", "p-earn"),
    ("剪辑手 PC", "p-pc"),
    ("管理后台", "p-admin"),
    ("边界", "p-edge"),
]


def _open(page, demo_server, tab=""):
    url = f"{demo_server}/fr-yijian-daifa-iter3.html"
    if tab:
        url += f"?tab={tab}"
    page.goto(url, wait_until="domcontentloaded")
    page.locator("#toggleRuleDrawer").click()
    expect(page.locator("#ruleDrawer")).to_have_class("drawer open")
    return page.frame_locator("#ruleDrawer iframe")


def test_open_rules_drawer_embeds_table(page, demo_server):
    frame = _open(page, demo_server)
    expect(page.locator("#ruleDrawer")).to_be_visible()
    width = page.locator("#ruleDrawer").evaluate("el => getComputedStyle(el).width")
    assert width == "960px"
    detail_width = page.locator("#detailDrawer").evaluate("el => getComputedStyle(el).width")
    assert detail_width == "480px"
    expect(page.locator("#ruleDrawer a")).to_have_text("新窗口打开 / 打印")
    expect(page.locator("#closeRule")).to_be_visible()
    expect(page.locator("#rule-fe")).to_have_count(0)
    expect(page.locator("#rule-be")).to_have_count(0)
    expect(page.locator("#ruleDrawer .rule-content")).to_have_count(0)
    expect(frame.locator("table.tpl").first).to_be_visible()
    expect(frame.locator("#p-index")).to_have_class("panel active")
    expected_top = page.evaluate(
        """() => {
          const bar = document.querySelector('.page-tab-bar');
          const bottom = bar ? bar.getBoundingClientRect().bottom : 0;
          let top = Math.max(0, Math.ceil(bottom + 8));
          if (top > window.innerHeight - 160) top = 0;
          return top;
        }"""
    )
    drawer_top = page.locator("#ruleDrawer").evaluate("el => el.getBoundingClientRect().top")
    assert abs(drawer_top - expected_top) <= 1


def test_rule_tabs_show_one_table(page, demo_server):
    page.goto(f"{demo_server}/fr-yijian-daifa-iter3-rules.html", wait_until="domcontentloaded")
    expect(page.locator("h1")).to_contain_text("需求规则")
    for label, panel_id in TABS:
        page.locator(".rule-tab-bar button", has_text=label).click()
        active = page.locator(".panel.active")
        expect(active).to_have_count(1)
        expect(active).to_have_id(panel_id)
        rows = active.locator("table.tpl tbody tr")
        assert rows.count() >= 1
        for i in range(rows.count()):
            assert rows.nth(i).inner_text().strip()
        for other_label, other_id in TABS:
            if other_id == panel_id:
                continue
            expect(page.locator(f"#{other_id}")).to_be_hidden()
    page.locator(".rule-tab-bar button", has_text="功能索引").click()
    summaries = page.locator("#p-index tbody tr td:nth-child(2)")
    assert summaries.count() == 11
    for i in range(summaries.count()):
        text = summaries.nth(i).inner_text().strip()
        assert text
        assert "领走之后不能再领" not in text
    whole = page.locator("body").evaluate("el => el.textContent")
    assert whole.count("领走之后不能再领") == 1


def test_close_rule_drawer_keeps_demo_tab(page, demo_server):
    _open(page, demo_server, tab="pc")
    expect(page.locator("#view-pc")).to_be_visible()
    page.locator("#closeRule").click()
    expect(page.locator("#ruleDrawer")).not_to_have_class("drawer open")
    expect(page.locator("#view-pc")).to_be_visible()
    expect(page.locator("#view-admin")).to_be_hidden()

    page.locator("#toggleRuleDrawer").click()
    expect(page.locator("#ruleDrawer")).to_have_class("drawer open")
    expect(page.frame_locator("#ruleDrawer iframe").locator("table.tpl").first).to_be_visible()
    page.locator("#ruleOverlay").click(position={"x": 8, "y": 8})
    expect(page.locator("#ruleDrawer")).not_to_have_class("drawer open")
    expect(page.locator("#view-pc")).to_be_visible()


def test_open_rules_in_new_window_and_print(page, demo_server):
    _open(page, demo_server)
    with page.expect_popup() as popup_info:
        page.locator("#ruleDrawer a", has_text="新窗口打开 / 打印").click()
    popup = popup_info.value
    popup.wait_for_load_state("domcontentloaded")
    expect(popup.locator("table.tpl").first).to_be_visible()
    expect(popup.locator(".rule-tab-bar button")).to_have_count(len(TABS))
    popup.emulate_media(media="print")
    breaks = popup.locator(".panel").evaluate_all(
        "els => els.map(el => getComputedStyle(el).pageBreakBefore)"
    )
    assert len(breaks) == len(TABS)
    assert breaks[0] == "avoid"
    assert breaks[1:] == ["always"] * (len(TABS) - 1)
    displays = popup.locator(".panel").evaluate_all(
        "els => els.map(el => getComputedStyle(el).display)"
    )
    assert displays == ["block"] * len(TABS)


def test_admin_tab_while_rules_open_keeps_table(page, demo_server):
    errors = []
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    frame = _open(page, demo_server)
    frame.locator(".rule-tab-bar button", has_text="边界").click()
    expect(frame.locator("#p-edge")).to_have_class("panel active")
    page.locator('.page-tab-bar button[data-page="view-admin"]').click()
    expect(page.locator("#view-admin")).to_be_visible()
    expect(page.locator("#pane-editors")).to_be_visible()
    expect(frame.locator("#p-edge")).to_have_class("panel active")
    expect(frame.locator("#p-edge table.tpl")).to_be_visible()
    expect(page.locator("#rule-fe")).to_have_count(0)
    expect(page.locator("#ruleDrawer .rule-content ul")).to_have_count(0)
    assert errors == []

    page.locator("#closeRule").click()
    expect(page.locator("#view-admin")).to_be_visible()
    page.locator("#openEditor").click()
    expect(page.locator("#edOverlay")).to_have_class("modal-overlay open")
    page.locator("#edYb").fill("YB10999")
    page.locator("#edName").fill("试用")
    page.locator("#edNote").fill("客服接入")
    page.locator("#edPlatforms input[value='右豹']").check()
    page.locator("#edSave").click()
    expect(page.locator("#toast")).to_have_text("至少选一个合作模式")
    expect(page.locator("#edOverlay")).to_have_class("modal-overlay open")
