"""FR-022 广场与领取：运营模式 Tab、帐号运营跳过选词、中断不退次、任务协作仍选词。"""

from playwright.sync_api import expect


def _open(page, demo_server):
    page.add_init_script("localStorage.removeItem('fr022-yjd-ops-v1');")
    page.goto(f"{demo_server}/yijian-daifa-ops-demo.html", wait_until="domcontentloaded")
    expect(page.locator("#opsTabs button.on")).to_have_attribute("data-ops", "任务协作")


def _quota(page):
    return page.evaluate(
        """() => {
          var u = STORE.user;
          return (u.free || 0) + (u.bought || 0);
        }"""
    )


def _work(page, mid):
    return page.evaluate(
        """(mid) => {
          var it = STORE.works.find(function (w) { return w.id === mid; });
          return { occ: it.occ, opsMode: it.opsMode, boundKw: it.boundKw || '' };
        }""",
        mid,
    )


def test_tab_switch_keeps_project_and_uses_empty_state(page, demo_server):
    _open(page, demo_server)
    page.locator("#projectRow .proj", has_text="番茄小说").click()
    expect(page.locator("#projectRow .proj.on")).to_contain_text("番茄小说")
    expect(page.locator("#feedList")).to_contain_text("掌心宠")
    page.locator("#opsTabs button", has_text="帐号运营").click()
    expect(page.locator("#opsTabs button.on")).to_have_attribute("data-ops", "帐号运营")
    expect(page.locator("#projectRow .proj.on")).to_contain_text("番茄小说")
    expect(page.locator("#feedList .empty")).to_contain_text("没有可领取的稿件")
    page.locator("#opsTabs button", has_text="任务协作").click()
    expect(page.locator("#projectRow .proj.on")).to_contain_text("番茄小说")
    expect(page.locator("#feedList")).to_contain_text("掌心宠")


def test_account_ops_claim_skips_keyword_and_prompts_fillback(page, demo_server):
    _open(page, demo_server)
    before = _quota(page)
    page.locator("#opsTabs button", has_text="帐号运营").click()
    page.locator(".feed-card", has_text="末世囤货").click()
    expect(page.locator("#detailBody")).to_contain_text("帐号运营")
    expect(page.locator("#detailBody")).to_contain_text("25%")
    page.locator("#goClaim").click()
    expect(page.locator("#kwSheet")).not_to_have_class("kw-sheet show")
    expect(page.locator("#dlBox")).to_be_visible()
    expect(page.locator("#dlTitle")).to_have_text("正在下载稿件")
    expect(page.locator("#dlTitle")).to_have_text("已保存到相册", timeout=5000)
    expect(page.locator("#fillPrompt.show")).to_be_visible()
    saved = page.evaluate(
        """() => {
          var c = STORE.claims[0];
          return { kw: c && c.kw, shareSnapshot: c && c.shareSnapshot };
        }"""
    )
    assert saved["kw"] == "末世囤货"
    assert saved["shareSnapshot"] == "25%"
    expect(page.locator("#detailBody .stat", has_text="分成比例")).to_contain_text("25%")
    assert _quota(page) == before - 1
    assert _work(page, "M-02")["occ"] == "占用中"
    page.locator("#fillPromptLater").click()
    expect(page.locator("#fillPrompt")).not_to_have_class("pts-dialog show")
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    expect(page.locator("#detailBody")).to_contain_text("末世囤货")
    expect(page.locator("#detailBody .stat", has_text="分成比例")).to_contain_text("25%")


def test_account_ops_zero_quota_opens_exchange_only(page, demo_server):
    _open(page, demo_server)
    page.locator("#opsTabs button", has_text="帐号运营").click()
    page.locator(".feed-card", has_text="百日新娘").click()
    page.evaluate(
        """() => {
          var today = new Date();
          var p = function (n) { return (n < 10 ? '0' : '') + n; };
          STORE.user.freeDate = today.getFullYear() + '-' + p(today.getMonth() + 1) + '-' + p(today.getDate());
          STORE.user.free = 0;
          STORE.user.bought = 0;
          state.free = 0;
          state.bought = 0;
        }"""
    )
    page.locator("#goClaim").click()
    expect(page.locator("#toast")).to_contain_text("次数不足")
    expect(page.locator("#buySheet")).to_have_class("kw-sheet show")
    expect(page.locator("#kwSheet")).not_to_have_class("kw-sheet show")
    expect(page.locator("#dlBox")).to_be_hidden()
    assert _quota(page) == 0
    assert _work(page, "M-05")["occ"] == "空闲"


def test_account_ops_abort_keeps_charge_and_skips_prompt(page, demo_server):
    _open(page, demo_server)
    before = _quota(page)
    page.locator("#opsTabs button", has_text="帐号运营").click()
    page.locator(".feed-card", has_text="百日新娘").click()
    page.locator("#goClaim").click()
    expect(page.locator("#dlTitle")).to_have_text("正在保存到相册", timeout=5000)
    expect(page.locator("#dlAbort")).to_be_visible()
    page.locator("#dlAbort").click()
    expect(page.locator("#dlBox")).to_be_hidden()
    expect(page.locator("#fillPrompt")).to_be_hidden()
    page.wait_for_timeout(2000)
    expect(page.locator("#fillPrompt")).to_be_hidden()
    assert _quota(page) == before - 1
    assert _work(page, "M-05")["occ"] == "占用中"


def test_task_collab_requires_matching_keyword(page, demo_server):
    _open(page, demo_server)
    before = _quota(page)
    page.locator(".feed-card", has_text="掌心宠").click()
    expect(page.locator("#detailBody .stat", has_text="分成比例")).to_contain_text("50%")
    expect(page.locator("#detailBody")).not_to_contain_text("30%")
    page.locator("#goClaim").click()
    expect(page.locator("#kwSheet")).to_have_class("kw-sheet show")
    page.locator("#confirmKw").click()
    expect(page.locator("#toast")).to_contain_text("请先选择该项目已通过的关键关键词")
    assert _quota(page) == before
    page.locator("#kwList .kw-row", has_text="别暴躁别暴躁").click()
    page.locator("#confirmKw").click()
    expect(page.locator("#toast")).to_contain_text("请选择与该稿件书籍一致的已通过关键词")
    expect(page.locator("#dlBox")).to_be_hidden()
    assert _quota(page) == before
    page.locator("#kwList .kw-row", has_text="掌心宠溺").click()
    page.locator("#confirmKw").click()
    expect(page.locator("#dlBox")).to_be_visible()
    expect(page.locator("#fillPrompt.show")).to_be_visible(timeout=5000)
    assert _quota(page) == before - 1
    page.locator("#fillPromptGo").click()
    expect(page.locator("#screen-fillback")).to_have_class("screen active")


def test_ops_shell_loads_new_demo(page, demo_server):
    page.goto(f"{demo_server}/fr-yijian-daifa-ops.html", wait_until="domcontentloaded")
    expect(page.locator("h1")).to_contain_text("代发运营合作模式")
    expect(page.locator("#opsFrame")).to_have_attribute("src", "yijian-daifa-ops-demo.html?embed=1")
    frame = page.frame_locator("#opsFrame")
    expect(frame.locator("#opsTabs button.on")).to_have_attribute("data-ops", "任务协作")
    expect(page.locator("[data-iteration-sidebar] a", has_text="代发运营合作模式")).to_have_attribute(
        "href", "fr-yijian-daifa-ops.html"
    )
