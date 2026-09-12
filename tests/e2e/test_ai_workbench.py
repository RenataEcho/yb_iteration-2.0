"""FR-009 AI工作台 · 用户订单明细（FR-28）与项目已结算榜（FR-29）E2E。

覆盖 I/O 矩阵：单状态、组合状态、未点名状态、五个业务 title、
缺槽位澄清、用户不存在、FR-20 指定项目按日订单不被抢单，
以及 FR-29 番茄小说日期范围内已结算 Top N。
"""

from playwright.sync_api import expect

BIZ_TITLES = ["品牌业务", "海外故事", "海外短剧", "星图融合", "星图"]
BIZ_PROJECT = {
    "品牌业务": "品牌旗舰A",
    "海外故事": "北境传说",
    "海外短剧": "海外都市剧",
    "星图融合": "星图融合A",
    "星图": "星图种草",
}


def ask(page, text):
    page.locator("#chatInput").fill(text)
    page.locator("#sendBtn").click()
    page.locator("#resultBody .loading").wait_for(state="detached")
    return page.locator("#resultBody")


def project_table(page):
    return page.locator(".project-block").filter(has_text="项目明细")


def order_table(page):
    return page.locator(".project-block").filter(has_text="订单明细")


def table_statuses(block):
    return block.locator("tbody td:last-child").all_inner_texts()


def kpi_value(result, label):
    return result.locator(".kpi").filter(has_text=label).locator(".v")


def test_single_status_shows_kpi_and_reviewed_only(ai_page):
    result = ask(ai_page, "用户 1001 2026-08-01至2026-08-31 品牌业务 已审核待结算订单明细")

    expect(result.locator(".kpi")).to_have_count(4)
    expect(kpi_value(result, "日期范围订单量")).to_have_text("4")
    expect(kpi_value(result, "已审核累计收益")).to_contain_text("3,270.00")
    expect(kpi_value(result, "已结算累计收益")).to_contain_text("860.00")
    expect(kpi_value(result, "已退款累计收益")).to_contain_text("420.00")

    proj = project_table(ai_page)
    orders = order_table(ai_page)
    expect(proj).to_be_visible()
    expect(orders).to_be_visible()
    expect(orders).to_contain_text("夏日护肤套装")
    expect(orders).to_contain_text("秋季预售")
    expect(orders).to_contain_text("品牌旗舰A")
    expect(orders).to_contain_text("BO-88001")

    row = proj.locator("tbody tr")
    expect(row).to_have_count(1)
    expect(row).to_contain_text("品牌旗舰A")
    expect(row.locator("td").nth(1)).to_have_text("2")

    assert set(table_statuses(proj)) == {"已审核"}
    assert set(table_statuses(orders)) == {"已审核"}
    expect(orders).not_to_contain_text("会员续费礼包")
    expect(orders).not_to_contain_text("联名周边")
    expect(result).not_to_contain_text("他人订单")
    expect(result).not_to_contain_text("BO-99001")


def test_combined_status_excludes_reviewed(ai_page):
    ask(ai_page, "用户 1001 2026-08-01至2026-08-31 星图融合 已结算和退款订单明细")

    proj = project_table(ai_page)
    orders = order_table(ai_page)
    expect(orders).to_contain_text("融合投放包A")
    expect(orders).to_contain_text("融合投放包B")
    expect(orders).to_contain_text("达人联投")
    expect(orders).not_to_contain_text("待结算投放")

    assert set(table_statuses(proj)) == {"已结算", "已退款"}
    assert set(table_statuses(orders)) == {"已结算", "已退款"}
    assert "已审核" not in table_statuses(proj)
    assert "已审核" not in table_statuses(orders)


def test_unspecified_status_can_show_all_three(ai_page):
    ask(ai_page, "用户 1001 2026-08-01至2026-08-31 海外故事 订单明细")

    statuses = set(table_statuses(order_table(ai_page)))
    assert statuses == {"已审核", "已结算", "已退款"}
    expect(order_table(ai_page)).to_contain_text("北境传说第一章")
    expect(order_table(ai_page)).to_contain_text("南洋夜话试读")
    expect(order_table(ai_page)).to_contain_text("北境传说番外")


def test_each_biz_title_resolves_without_unknown_clarify(ai_page):
    for title in BIZ_TITLES:
        result = ask(ai_page, f"用户 1001 2026-08-01至2026-08-31 {title} 订单明细")
        expect(result).not_to_contain_text("还缺业务名称")
        expect(result).not_to_contain_text("未知业务")
        expect(result).to_contain_text("项目明细")
        expect(result).to_contain_text("订单明细")
        expect(order_table(ai_page)).to_contain_text(BIZ_PROJECT[title])
        if title == "品牌业务":
            expect(result).not_to_contain_text("七月清仓")
            expect(result).not_to_contain_text("BO-77000")
        if title == "星图":
            expect(order_table(ai_page)).not_to_contain_text("星图融合A")


def test_missing_user_id_clarifies_without_table(ai_page):
    result = ask(ai_page, "2026-08-01至2026-08-31 品牌业务 已结算订单明细")
    expect(result).to_contain_text("还缺用户ID")
    expect(result).not_to_contain_text("项目明细")
    expect(result).not_to_contain_text("订单ID")
    expect(result.locator("table")).to_have_count(0)


def test_missing_date_clarifies_without_table(ai_page):
    result = ask(ai_page, "用户 1001 品牌业务 已结算订单明细")
    expect(result).to_contain_text("还缺时间范围")
    expect(result).not_to_contain_text("项目明细")
    expect(result).not_to_contain_text("订单ID")
    expect(result.locator("table")).to_have_count(0)


def test_missing_biz_title_lists_five_titles(ai_page):
    result = ask(ai_page, "用户 1001 2026-08-01至2026-08-31 已结算订单明细")
    expect(result).to_contain_text("还缺业务名称")
    for title in BIZ_TITLES:
        expect(result).to_contain_text(title)
    expect(result).not_to_contain_text("项目明细")
    expect(result).not_to_contain_text("订单ID")
    expect(result.locator("table")).to_have_count(0)


def test_unknown_user_no_table(ai_page):
    result = ask(ai_page, "用户 9999 2026-08-01至2026-08-31 品牌业务 订单明细")
    expect(result).to_contain_text("用户不存在")
    expect(result).not_to_contain_text("项目明细")
    expect(result).not_to_contain_text("订单ID")
    expect(result.locator("table")).to_have_count(0)


def test_biz_aliases_resolve_without_clarify(ai_page):
    brand = ask(ai_page, "用户 1001 2026-08-01至2026-08-31 品牌 订单明细")
    expect(brand).not_to_contain_text("还缺业务名称")
    expect(order_table(ai_page)).to_contain_text("品牌旗舰A")

    fusion = ask(ai_page, "用户 1001 2026-08-01至2026-08-31 融合 订单明细")
    expect(fusion).not_to_contain_text("还缺业务名称")
    expect(order_table(ai_page)).to_contain_text("星图融合A")


def test_combo_punctuation_excludes_reviewed(ai_page):
    ask(ai_page, "用户 1001 2026-08-01至2026-08-31 星图融合 已结算、退款订单明细")

    proj = project_table(ai_page)
    orders = order_table(ai_page)
    expect(orders).to_contain_text("融合投放包A")
    expect(orders).to_contain_text("融合投放包B")
    expect(orders).not_to_contain_text("待结算投放")
    assert set(table_statuses(proj)) == {"已结算", "已退款"}
    assert set(table_statuses(orders)) == {"已结算", "已退款"}
    assert "已审核" not in table_statuses(proj)
    assert "已审核" not in table_statuses(orders)


def test_fr20_project_daily_orders_not_stolen(ai_page):
    result = ask(ai_page, "星河小说按日订单数据")
    expect(result).to_contain_text("按日订单")
    expect(result).to_contain_text("出单关键词数量")
    expect(result).to_contain_text("出单人数")
    expect(result).not_to_contain_text("订单ID")
    expect(result).not_to_contain_text("夏日护肤套装")
    expect(result).not_to_contain_text("有效拉新量")
    expect(result.get_by_role("columnheader", name="关键词", exact=True)).to_have_count(0)


def test_fr29_settled_top100_fanqie_august(ai_page):
    result = ask(ai_page, "番茄小说 2026.8.1-2026.8.31 已结算订单前100名")

    expect(result).to_contain_text("已结算订单 Top 100")
    expect(result).to_contain_text("2026-08-01 至 2026-08-31")
    expect(result).to_contain_text("结算字段随项目动态下发")
    expect(result.get_by_role("columnheader", name="用户ID")).to_be_visible()
    expect(result.get_by_role("columnheader", name="用户昵称")).to_be_visible()
    expect(result.get_by_role("columnheader", name="有效拉新量")).to_be_visible()
    expect(result.get_by_role("columnheader", name="拉失活量")).to_be_visible()
    expect(result.get_by_role("columnheader", name="拉活量")).to_be_visible()
    expect(result.get_by_role("columnheader", name="总收益")).to_be_visible()
    expect(result.locator("tbody tr")).to_have_count(100)
    expect(result.locator("tbody tr").first).to_contain_text("1001")
    expect(result.locator("tbody tr").first).to_contain_text("林小北")
    expect(result).not_to_contain_text("出单关键词数量")
    expect(result).not_to_contain_text("订单ID")
    expect(result).not_to_contain_text("项目明细")


def test_fr29_iso_date_and_top10(ai_page):
    result = ask(ai_page, "番茄小说 2026-08-01至2026-08-31 已结算订单前10名")
    expect(result).to_contain_text("已结算订单 Top 10")
    expect(result.locator("tbody tr")).to_have_count(10)
    expect(result).to_contain_text("有效拉新量")
    expect(result).to_contain_text("总收益")


def test_fr29_missing_project_clarifies(ai_page):
    result = ask(ai_page, "2026.8.1-2026.8.31 已结算订单前100名")
    expect(result).to_contain_text("还缺项目名称")
    expect(result).to_contain_text("番茄小说")
    expect(result.locator("table")).to_have_count(0)


def test_fr29_missing_range_clarifies(ai_page):
    result = ask(ai_page, "番茄小说 已结算订单前100名")
    expect(result).to_contain_text("还缺时间范围")
    expect(result.locator("table")).to_have_count(0)


def test_fr29_empty_window_no_fake_rows(ai_page):
    result = ask(ai_page, "番茄小说 2026.7.1-2026.7.31 已结算订单前100名")
    expect(result).to_contain_text("暂无数据")
    expect(result.locator("tbody tr")).to_have_count(1)
    expect(result).not_to_contain_text("林小北")


def test_fr30_range_over_31_days_does_not_query(ai_page):
    result = ask(ai_page, "番茄小说 2026.8.1-2026.9.30 已结算订单前100名")
    expect(result).to_contain_text("日期范围不能超过 31 天")
    expect(result).to_contain_text("61 天")
    expect(result.locator("table")).to_have_count(0)
    expect(result).not_to_contain_text("林小北")
    expect(result).not_to_contain_text("有效拉新量")


def test_fr30_user_orders_over_31_days_does_not_query(ai_page):
    result = ask(ai_page, "用户 1001 2026-08-01至2026-12-31 品牌业务 已结算订单明细")
    expect(result).to_contain_text("日期范围不能超过 31 天")
    expect(result.locator("table")).to_have_count(0)
    expect(result).not_to_contain_text("项目明细")
    expect(result).not_to_contain_text("会员续费礼包")


def test_fr30_exactly_31_days_still_queries(ai_page):
    result = ask(ai_page, "番茄小说 2026.8.1-2026.8.31 已结算订单前100名")
    expect(result).not_to_contain_text("日期范围不能超过 31 天")
    expect(result).to_contain_text("已结算订单 Top 100")
    expect(result.locator("tbody tr")).to_have_count(100)
