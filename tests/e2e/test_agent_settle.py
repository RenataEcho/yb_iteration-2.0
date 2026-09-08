"""FR-010 代理结算单 · 管理后台 E2E。

覆盖列表展示、筛选/重置、查看明细抽屉与规则/流程入口。
每个用例独立打开页面，不依赖执行顺序。
"""

from playwright.sync_api import expect


def settle_admin(page):
    return page.locator("#st-admin")


def settle_row(page, settle_no):
    return page.locator("#stBody tr").filter(has_text=settle_no)


def query_settle(page, name="", month="", gen="", status=""):
    admin = settle_admin(page)
    admin.locator("#stNameQ").fill(name)
    admin.locator("#stMonthQ").select_option(month)
    admin.locator("#stGenQ").select_option(gen)
    admin.locator("#stStatusQ").select_option(status)
    admin.get_by_role("button", name="查询").click()


def expect_toast(page, text):
    toast = page.locator("#toast")
    expect(toast).to_have_text(text)
    expect(toast).to_have_class("toast show")


def test_list_shows_seed_rows_and_stats(settle_page):
    page = settle_page
    expect(page.get_by_role("tab", name="代理结算单").first).to_be_visible()
    expect(page.locator("#stStatDraft")).to_have_text("1")
    expect(page.locator("#stStatReady")).to_have_text("6")
    expect(page.locator("#stStatNone")).to_have_text("2")
    expect(page.locator("#stStatPaid")).to_have_text("1")
    expect(page.locator("#stAmtDraft")).to_have_text("¥38,760.00")
    expect(page.locator("#stAmtReady")).to_have_text("¥231,908.98")
    expect(page.locator("#stAmtNone")).to_have_text("¥177,108.98")
    expect(page.locator("#stAmtPaid")).to_have_text("¥23,600.00")

    body = page.locator("#stBody")
    expect(body).to_contain_text("赵氏内容科技")
    expect(body).to_contain_text("吴氏影视")
    expect(body).to_contain_text("SET-202608-01")
    expect(body).to_contain_text("2026-08")
    expect(body).to_contain_text("¥170,458.98")
    expect(body).to_contain_text("已生成")
    expect(body).to_contain_text("未生成")
    expect(body).to_contain_text("未提现")
    expect(body).to_contain_text("提现中")
    expect(body).to_contain_text("已提现")
    expect(body).to_contain_text("查看明细")


def test_filter_by_name_month_and_status(settle_page):
    page = settle_page
    query_settle(page, name="赵氏")
    body = page.locator("#stBody")
    expect(body).to_contain_text("赵氏内容科技")
    expect(body).not_to_contain_text("周创作者工作室")
    expect(page.locator("#stBody tr")).to_have_count(2)

    query_settle(page, month="2026-07")
    expect(body).to_contain_text("SET-202607-01")
    expect(body).not_to_contain_text("SET-202608-01")
    expect(page.locator("#stStatPaid")).to_have_text("1")
    expect(page.locator("#stStatNone")).to_have_text("0")

    query_settle(page, status="none")
    expect(body).to_contain_text("未提现")
    expect(body).not_to_contain_text("已提现")
    expect(page.locator("#stStatNone")).to_have_text("2")

    query_settle(page, gen="draft")
    expect(body).to_contain_text("未生成")
    expect(body).to_contain_text("拓拔")
    expect(body).not_to_contain_text("赵氏内容科技")
    expect(page.locator("#stStatDraft")).to_have_text("1")


def test_reset_clears_inputs_without_requery(settle_page):
    page = settle_page
    query_settle(page, name="拓拔")
    expect(page.locator("#stBody")).to_contain_text("拓拔")
    expect(page.locator("#stBody")).not_to_contain_text("赵氏内容科技")

    admin = settle_admin(page)
    admin.locator("#stNameQ").fill("")
    admin.locator("#stGenQ").select_option("ready")
    admin.locator("#stStatusQ").select_option("paid")
    admin.get_by_role("button", name="重置").click()

    expect_toast(page, "筛选条件已重置")
    expect(admin.locator("#stNameQ")).to_have_value("")
    expect(admin.locator("#stMonthQ")).to_have_value("")
    expect(admin.locator("#stGenQ")).to_have_value("")
    expect(admin.locator("#stStatusQ")).to_have_value("")
    expect(page.locator("#stBody")).to_contain_text("拓拔")
    expect(page.locator("#stBody")).not_to_contain_text("赵氏内容科技")


def test_empty_filter_shows_empty_state(settle_page):
    page = settle_page
    query_settle(page, name="不存在的代理")
    empty = page.locator("#stBody")
    expect(empty).to_contain_text("暂无数据")
    expect(empty).to_contain_text("当前筛选条件下没有结算单")
    expect(page.locator("#stStatDraft")).to_have_text("0")
    expect(page.locator("#stStatReady")).to_have_text("0")
    expect(page.locator("#stStatNone")).to_have_text("0")
    expect(page.locator("#stStatPaid")).to_have_text("0")


def test_view_bill_detail_drawer(settle_page):
    page = settle_page
    settle_row(page, "SET-202608-01").get_by_role("button", name="查看明细").click()

    drawer = page.locator("#stDetailDrawer")
    expect(drawer).to_have_class("drawer bill open")
    expect(drawer).to_contain_text("2026-08 账单明细")
    expect(drawer).to_contain_text("SET-202608-01")
    expect(drawer).to_contain_text("已生成，已推送给代理")
    expect(drawer).to_contain_text("小云雀挂载")
    expect(drawer).to_contain_text("2,481")
    expect(drawer).to_contain_text("¥42,310.18")
    expect(drawer).to_contain_text("5%")
    expect(drawer).to_contain_text("结算完成")
    expect(drawer).to_contain_text("CapCut拉新")
    expect(drawer.locator("#stDetailTotal")).to_have_text("¥170,458.98")
    expect(drawer).to_contain_text("收益金额 × (1 - 服务费比例)")
    expect(drawer).to_contain_text("订单日期")

    drawer.get_by_role("button", name="关闭").click()
    expect(drawer).not_to_have_class("drawer bill open")


def test_ungenerated_bill_has_pending_project(settle_page):
    page = settle_page
    row = settle_row(page, "SET-202608-05")
    expect(row).to_contain_text("未生成")
    expect(row).to_contain_text("—")
    row.get_by_role("button", name="查看明细").click()

    drawer = page.locator("#stDetailDrawer")
    expect(drawer).to_contain_text("未生成，尚有项目订单未结算，不推送给代理")
    expect(drawer).to_contain_text("结算中")
    expect(drawer).to_contain_text("结算完成")
    expect(drawer).to_contain_text("知乎故事")


def test_flow_tab_and_rules_drawer(settle_page):
    page = settle_page
    tabs = page.locator("#view-settle .module-tab-bar")
    expect(tabs.get_by_role("tab", name="业务流程")).to_be_visible()

    tabs.get_by_role("tab", name="业务流程").click()
    flow = page.locator("#st-flow")
    expect(flow).to_have_class("sub-view active")
    expect(flow).to_contain_text("按订单日期归集当月订单")
    expect(flow).to_contain_text("未认证代理不跳过")
    expect(flow).to_contain_text("各项目都")
    expect(flow).to_contain_text("结算完成?")
    expect(flow).to_contain_text("结算单=未生成")
    expect(flow).to_contain_text("结算单=已生成")
    expect(flow).not_to_contain_text("未认证代理跳过")

    page.get_by_role("button", name="需求规则").click()
    drawer = page.locator("#ruleDrawer")
    expect(drawer).to_have_class("drawer open")
    rule = page.locator("#rule-settle")
    expect(rule).to_contain_text("代理结算单表")
    expect(rule).to_contain_text("SET-{YYYYMM}-{当月序数}")
    expect(rule).to_contain_text("收益金额 × (1 - 服务费比例)")
    expect(rule).to_contain_text("查看明细")
    expect(rule).to_contain_text("未认证代理不跳过")
    expect(rule).to_contain_text("不推送给代理")
