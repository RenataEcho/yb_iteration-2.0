"""FR-010 代理认证 · 管理后台 E2E。

覆盖列表展示、筛选/重置、资料预览、通过/驳回主路径与关键错误。
每个用例独立打开页面，不依赖执行顺序。
"""

from playwright.sync_api import expect


def cert_admin(page):
    return page.locator("#cert-admin")


def cert_row(page, agent_id):
    return page.locator("#certBody tr").filter(has_text=agent_id)


def query_cert(page, account="", status=""):
    admin = cert_admin(page)
    admin.locator("#accountQ").fill(account)
    admin.locator("#statusQ").select_option(status)
    admin.get_by_role("button", name="查询").click()


def expect_toast(page, text):
    toast = page.locator("#toast")
    expect(toast).to_have_text(text)
    expect(toast).to_have_class("toast show")


def test_list_shows_seed_rows_and_stats(cert_page):
    page = cert_page
    expect(page.get_by_role("heading", name="代理迭代V1.0")).to_be_visible()
    expect(page.get_by_role("tab", name="代理认证").first).to_be_visible()
    expect(page.locator("#statPending")).to_have_text("2")
    expect(page.locator("#statApproved")).to_have_text("2")
    expect(page.locator("#statRejected")).to_have_text("1")

    body = page.locator("#certBody")
    expect(body).to_contain_text("A-10086")
    expect(body).to_contain_text("agent_zhou")
    expect(body).to_contain_text("杭州周创文化传媒有限公司")
    expect(body).to_contain_text("社会编码 91330100MA2H1ABC1X")
    expect(body).to_contain_text("开户行 中国工商银行")
    expect(body).to_contain_text("增值税专用发票")
    expect(body).to_contain_text("查看合同")
    expect(body).to_contain_text("合同编号 YB-DL-20260904-10086-01")
    expect(body).to_contain_text("快递 顺丰速运 · SF1382910281938")
    expect(body).to_contain_text("营业执照不清晰")


def test_filter_by_account_and_status(cert_page):
    page = cert_page
    query_cert(page, account="agent_chen")
    body = page.locator("#certBody")
    expect(body).to_contain_text("agent_chen")
    expect(body).not_to_contain_text("agent_zhou")
    expect(page.locator("#statRejected")).to_have_text("1")
    expect(page.locator("#statPending")).to_have_text("0")

    query_cert(page, status="pending")
    expect(body).to_contain_text("待审核")
    expect(body).not_to_contain_text("已通过")
    expect(page.locator("#statPending")).to_have_text("2")
    expect(page.locator("#statApproved")).to_have_text("0")


def test_reset_clears_inputs_without_requery(cert_page):
    page = cert_page
    query_cert(page, account="agent_chen")
    expect(page.locator("#certBody")).to_contain_text("agent_chen")

    admin = cert_admin(page)
    admin.locator("#accountQ").fill("")
    admin.locator("#statusQ").select_option("pending")
    admin.get_by_role("button", name="重置").click()

    expect_toast(page, "筛选条件已重置")
    expect(admin.locator("#accountQ")).to_have_value("")
    expect(admin.locator("#statusQ")).to_have_value("")
    expect(page.locator("#certBody")).to_contain_text("agent_chen")
    expect(page.locator("#certBody")).not_to_contain_text("agent_zhou")


def test_empty_filter_shows_empty_state(cert_page):
    page = cert_page
    query_cert(page, account="no_such_agent")
    empty = page.locator("#certBody")
    expect(empty).to_contain_text("暂无数据")
    expect(empty).to_contain_text("当前筛选条件下没有认证记录")
    expect(page.locator("#statPending")).to_have_text("0")
    expect(page.locator("#statApproved")).to_have_text("0")
    expect(page.locator("#statRejected")).to_have_text("0")


def test_view_license_and_contract(cert_page):
    page = cert_page
    row = cert_row(page, "A-10086")

    row.get_by_role("button", name="查看营业执照").click()
    overlay = page.locator("#docOverlay")
    expect(overlay).to_have_class("modal-overlay open")
    expect(overlay).to_contain_text("杭州周创文化传媒有限公司")
    expect(overlay).to_contain_text("91330100MA2H1ABC1X")
    overlay.get_by_role("button", name="关闭").click()
    expect(overlay).not_to_have_class("modal-overlay open")

    row.get_by_role("button", name="查看合同").click()
    expect(overlay).to_have_class("modal-overlay open")
    expect(overlay).to_contain_text("周创-代理合作协议-盖章.pdf")
    expect(overlay).to_contain_text("加盖公章 PDF")
    expect(overlay).to_contain_text("YB-DL-20260904-10086-01")
    expect(overlay).to_contain_text("顺丰速运")
    expect(overlay).to_contain_text("SF1382910281938")
    overlay.get_by_role("button", name="关闭").click()
    expect(overlay).not_to_have_class("modal-overlay open")


def test_approve_pending_record(cert_page):
    page = cert_page
    row = cert_row(page, "A-10086")
    row.get_by_role("button", name="通过").click()

    dialog = page.locator("#approveOverlay")
    expect(dialog).to_have_class("modal-overlay open")
    expect(dialog).to_contain_text("周创作者工作室")
    expect(dialog).to_contain_text("agent_zhou")
    dialog.get_by_role("button", name="确认通过").click()

    expect_toast(page, "已通过「周创作者工作室」的认证")
    expect(row).to_contain_text("已通过")
    expect(row.locator("td").last).to_have_text("已审核")
    expect(row.locator("td").nth(8)).not_to_have_text("—")
    expect(page.locator("#statPending")).to_have_text("1")
    expect(page.locator("#statApproved")).to_have_text("3")


def test_reject_requires_reason_then_succeeds(cert_page):
    page = cert_page
    row = cert_row(page, "A-10089")
    row.get_by_role("button", name="驳回").click()

    dialog = page.locator("#rejectOverlay")
    expect(dialog).to_have_class("modal-overlay open")
    dialog.get_by_role("button", name="确认驳回").click()
    expect_toast(page, "请填写驳回原因")
    expect(dialog).to_have_class("modal-overlay open")
    expect(row).to_contain_text("待审核")

    page.locator("#rejectReason").fill("对公帐号与营业执照主体不一致")
    dialog.get_by_role("button", name="确认驳回").click()

    expect_toast(page, "已驳回「吴氏影视」的认证")
    expect(row).to_contain_text("已驳回")
    expect(row).to_contain_text("对公帐号与营业执照主体不一致")
    expect(row.locator("td").last).to_have_text("已审核")
    expect(page.locator("#statPending")).to_have_text("1")
    expect(page.locator("#statRejected")).to_have_text("2")


def test_reviewed_rows_have_no_review_actions(cert_page):
    page = cert_page
    approved = cert_row(page, "A-10087")
    expect(approved.locator("td").last).to_have_text("已审核")
    expect(approved.get_by_role("button", name="通过")).to_have_count(0)
    expect(approved.get_by_role("button", name="驳回")).to_have_count(0)

    rejected = cert_row(page, "A-10088")
    expect(rejected.locator("td").last).to_have_text("已审核")
    expect(rejected).to_contain_text("营业执照不清晰")
    expect(rejected.get_by_role("button", name="通过")).to_have_count(0)


def test_reject_overlay_mask_does_not_close(cert_page):
    page = cert_page
    cert_row(page, "A-10086").get_by_role("button", name="驳回").click()

    overlay = page.locator("#rejectOverlay")
    expect(overlay).to_have_class("modal-overlay open")
    page.locator("#rejectReason").fill("执照模糊")
    overlay.click(position={"x": 8, "y": 8})
    expect(overlay).to_have_class("modal-overlay open")
    expect(page.locator("#rejectReason")).to_have_value("执照模糊")


def test_flow_tab_and_rules_drawer(cert_page):
    page = cert_page
    tabs = page.locator("#view-cert .module-tab-bar")
    expect(tabs.get_by_role("tab", name="业务流程")).to_be_visible()
    expect(tabs.get_by_role("tab", name="QA用例")).to_be_visible()

    tabs.get_by_role("tab", name="业务流程").click()
    flow = page.locator("#cert-flow")
    expect(flow).to_have_class("sub-view active")
    expect(flow).to_contain_text("进入后台审核列表")
    expect(flow).to_contain_text("审核通过?")
    expect(flow).to_contain_text("QA用例")
    expect(flow).not_to_contain_text("对话区")

    tabs.get_by_role("tab", name="QA用例").click()
    qa = page.locator("#cert-qa")
    expect(qa).to_have_class("sub-view active")
    expect(qa).to_contain_text("tests/e2e/test_agent_cert.py")
    expect(qa).to_contain_text("test_approve_pending_record")
    expect(qa).to_contain_text("审核通过? → 状态=已通过")
    expect(qa).to_contain_text("请填写驳回原因")
    expect(page.locator("#qaCertTable tbody tr")).to_have_count(10)

    page.get_by_role("button", name="需求规则").click()
    drawer = page.locator("#ruleDrawer")
    expect(drawer).to_have_class("drawer open")
    rule = page.locator("#rule-cert")
    expect(rule).to_contain_text("代理帐号")
    expect(rule).to_contain_text("动态渲染")
    expect(rule).to_contain_text("加盖公章")
    expect(rule).to_contain_text("代理回传")
    expect(rule).to_contain_text("驳回必须填写原因")
    expect(rule).to_contain_text("QA用例")
