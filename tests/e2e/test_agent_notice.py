"""FR-010 代理通知 · 管理后台 E2E。

覆盖列表操作列删除、确认弹窗、删除后列表与统计联动，以及规则口径。
每个用例独立打开页面，不依赖执行顺序。
"""

from playwright.sync_api import expect


def notice_admin(page):
    return page.locator("#nt-admin")


def notice_row(page, notice_id):
    return page.locator("#ntBody tr").filter(has_text=notice_id)


def expect_toast(page, text):
    toast = page.locator("#toast")
    expect(toast).to_have_text(text)
    expect(toast).to_have_class("toast show")


def test_list_shows_delete_action(notice_page):
    page = notice_page
    expect(page.get_by_role("tab", name="代理通知").first).to_be_visible()
    expect(page.locator("#ntStatAll")).to_have_text("6")
    row = notice_row(page, "N-1001")
    expect(row.get_by_role("button", name="详情")).to_be_visible()
    expect(row.get_by_role("button", name="删除")).to_be_visible()


def test_delete_requires_confirm_then_syncs_away(notice_page):
    page = notice_page
    row = notice_row(page, "N-1001")
    row.get_by_role("button", name="删除").click()

    modal = page.locator("#ntDeleteOverlay")
    expect(modal).to_have_class("modal-overlay open")
    expect(modal).to_contain_text("确认删除？")
    expect(modal).to_contain_text("代理工作台改版上线")
    expect(modal).to_contain_text("后台与代理端会同步移除")

    modal.get_by_role("button", name="确认删除").click()
    expect(notice_row(page, "N-1001")).to_have_count(0)
    expect(page.locator("#ntStatAll")).to_have_text("5")
    expect_toast(page, "已删除「代理工作台改版上线」，代理端已同步移除")


def test_delete_cancel_keeps_row(notice_page):
    page = notice_page
    notice_row(page, "N-1002").get_by_role("button", name="删除").click()
    modal = page.locator("#ntDeleteOverlay")
    expect(modal).to_have_class("modal-overlay open")
    modal.get_by_role("button", name="取消").click()
    expect(modal).not_to_have_class("open")
    expect(notice_row(page, "N-1002")).to_be_visible()
    expect(page.locator("#ntStatAll")).to_have_text("6")


def test_rules_mention_agent_side_sync(notice_page):
    page = notice_page
    page.get_by_role("button", name="需求规则").click()
    drawer = page.locator("#ruleDrawer")
    expect(drawer).to_have_class("drawer open")
    rule = page.locator("#rule-notice")
    expect(rule).to_contain_text("操作：详情、删除")
    expect(rule).to_contain_text("同步删除代理端对应消息")
    expect(rule).to_contain_text("后台删除后代理端同一条消息同步消失")
