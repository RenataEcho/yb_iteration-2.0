"""FR-014 一键代发：feed 隐藏占用、领取门禁、购次、回填、后台页。"""

from playwright.sync_api import expect


def test_feed_hides_occupied_and_claim_requires_keyword(page, demo_server):
    page.goto(f"{demo_server}/yijian-daifa-demo.html", wait_until="domcontentloaded")
    expect(page.locator("#screen-feed")).to_have_class("screen active")
    expect(page.locator("#feedList")).to_contain_text("掌心宠")
    expect(page.locator("#feedList")).not_to_contain_text("团宠解压图集")
    expect(page.locator("#feedList")).not_to_contain_text("¥")
    expect(page.locator("#feedList")).not_to_contain_text("收益")
    expect(page.locator("#plazaBanner")).to_be_visible()
    expect(page.locator("#feedList img.cover-img").first).to_be_visible()
    expect(page.locator("#feedList [data-genre='小说']")).not_to_have_count(0)
    expect(page.locator("#feedList [data-genre='漫画']")).not_to_have_count(0)
    expect(page.locator("#feedList [data-genre='视频']")).not_to_have_count(0)
    expect(page.locator("#feedSearch")).to_be_visible()
    expect(page.locator("#projectRow")).to_be_visible()
    expect(page.locator("#projectRow")).to_contain_text("番茄小说")

    page.locator(".feed-card").filter(has_text="掌心宠").click()
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    expect(page.locator("#detailBody")).to_contain_text("分成比例")
    expect(page.locator("#detailBody")).to_contain_text("领取步骤")
    expect(page.locator("#detailBody")).to_contain_text("张")
    expect(page.locator("#detailBody")).not_to_contain_text("¥")
    expect(page.locator("#claimQuotaFoot")).to_contain_text("3")
    page.locator("#quickKw").click()
    expect(page.locator("#toast")).to_contain_text("跳转到对应项目的题词页面")
    page.locator("#goClaim").click()
    expect(page.locator("#kwSheet")).to_have_class("kw-sheet show")
    page.locator("#confirmKw").click()
    expect(page.locator("#toast")).to_contain_text("请先选择该项目已通过的关键关键词")

    page.locator("#kwList .kw-row").first.click()
    page.locator("#confirmKw").click()
    expect(page.locator("#loadText")).to_contain_text("正在下载稿件")
    expect(page.locator("#loadText")).to_contain_text("正在保存到相册")
    expect(page.locator("#loadText")).to_contain_text("已保存到相册")
    expect(page.locator("#toast")).to_contain_text("领取成功")
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    expect(page.locator("#footUnclaimed")).to_be_hidden()
    expect(page.locator("#footClaimed")).to_be_visible()
    expect(page.locator("#copyTitle")).to_be_visible()
    expect(page.locator("#editWork")).to_be_visible()

    page.locator("#screenNav button", has_text="我的领取").click()
    expect(page.locator("#claimTabs .on")).to_contain_text("未回填")
    expect(page.locator("#claimList")).to_contain_text("掌心宠溺")
    expect(page.locator("#claimList")).to_contain_text("立即回填")
    expect(page.locator("#claimList")).to_contain_text("番茄小说")
    expect(page.locator("#claimList")).to_contain_text("还可下载")
    expect(page.locator("#claimList")).to_contain_text("下载时间")
    expect(page.locator("#claimProjects")).to_contain_text("番茄小说")
    expect(page.locator("#claimProjects")).not_to_contain_text("知乎短篇")
    expect(page.locator("#claimProjects")).not_to_contain_text("悟空网文")
    expect(page.locator("#claimProjects")).not_to_contain_text("不鸣推文")
    expect(page.locator("[data-fill]").first).to_have_class("primary")


def test_buy_then_claim_and_fillback(page, demo_server):
    page.goto(f"{demo_server}/yijian-daifa-demo.html?screen=buy", wait_until="domcontentloaded")
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    expect(page.locator("#buySheet")).to_have_class("kw-sheet show")
    expect(page.locator("#skuList .sku")).to_have_count(3)
    page.locator("#skuList .sku").nth(1).click()
    page.locator("#confirmBuy").click()
    expect(page.locator("#toast")).to_contain_text("兑换成功")
    expect(page.locator("#kwSheet")).to_have_class("kw-sheet show")
    page.locator("#kwList .kw-row").first.click()
    page.locator("#confirmKw").click()
    expect(page.locator("#toast")).to_contain_text("领取成功")
    expect(page.locator("#editWork")).to_be_visible()
    page.locator("#editWork").click()
    expect(page.locator("#screen-fillback")).to_have_class("screen active")
    page.locator("#doFill").click()
    expect(page.locator("#toast")).to_contain_text("回填完成")
    expect(page.locator("#claimTabs .on")).to_contain_text("已回填")
    expect(page.locator("#claimList")).to_contain_text("掌心宠溺")
    expect(page.locator("[data-fill]").first).to_have_class("primary")
    page.locator("[data-fill]").first.click()
    expect(page.locator("#toast")).to_contain_text("该稿件已回填")


def test_timeout_and_banned_scenes(page, demo_server):
    page.goto(f"{demo_server}/yijian-daifa-demo.html?screen=timeout", wait_until="domcontentloaded")
    expect(page.locator("#claimTabs .on")).to_contain_text("已超时")
    expect(page.locator("#claimList")).to_contain_text("掌心宠溺")
    expect(page.locator("#claimList")).to_contain_text("下载已过期")
    page.locator("[data-dl]").first.click()
    expect(page.locator("#toast")).to_contain_text("领取已超过 7 天，无法再下载")
    page.locator("[data-fill]").first.click()
    expect(page.locator("#toast")).to_contain_text("已超时，无法回填")
    page.goto(f"{demo_server}/yijian-daifa-demo.html?screen=banned", wait_until="domcontentloaded")
    expect(page.locator("#goClaim")).to_have_text("已被停权，无法领取")


def test_fr_shell_admin_and_flow(page, demo_server):
    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html", wait_until="domcontentloaded")
    expect(page.locator("h1")).to_contain_text("一键代发")
    expect(page.locator("#mockupFrame")).to_be_visible()
    page.locator('.page-tab-bar button[data-page="view-admin"]').click()
    expect(page.locator("#admin-editors")).to_be_visible()
    expect(page.locator("#edBody")).to_contain_text("林夏")
    page.locator('.admin-tab-bar button[data-admin="admin-skus"]').click()
    expect(page.locator("#skuBody")).to_contain_text("120")
    page.locator('.page-tab-bar button[data-page="view-flow"]').click()
    expect(page.locator(".flow-svg-wrap")).to_contain_text("已选通过关键词?")
    page.locator("#toggleRuleDrawer").click()
    expect(page.locator("#ruleDrawer")).to_have_class("drawer open")
    expect(page.locator("#rule-fe")).to_contain_text("作品广场")
    expect(page.locator(".badge-version")).to_contain_text("v2")


def test_covers_banner_poster_and_claim_detail(page, demo_server):
    page.goto(f"{demo_server}/yijian-daifa-demo.html", wait_until="domcontentloaded")
    expect(page.locator("#feedList .art")).to_have_count(0)
    expect(page.locator("#feedList img.cover-img").first).to_have_attribute("src", "assets/fr014/cover-m01.jpg")
    expect(page.locator("#plazaBanner .bn-slide")).to_have_count(5)
    expect(page.locator("#plazaBanner .bn-dot")).to_have_count(5)
    first_bn = page.locator("#plazaBanner .bn-slide.on").get_attribute("data-bn")
    page.wait_for_function(
        """(prev) => {
          const on = document.querySelector('#plazaBanner .bn-slide.on');
          return on && on.getAttribute('data-bn') !== prev;
        }""",
        arg=first_bn,
        timeout=8000,
    )
    page.locator("#plazaBanner .bn-dot").nth(2).click()
    expect(page.locator("#plazaBanner .bn-slide").nth(2)).to_have_class("bn-slide on")
    expect(page.locator("#plazaBanner .bn-dot").nth(2)).to_have_class("bn-dot on")
    page.locator("#plazaBanner .bn-dot").nth(0).click()
    expect(page.locator("#plazaBanner .bn-slide").nth(0)).to_have_class("bn-slide on")
    page.locator('#plazaBanner .bn-slide[data-bn="recruit"]').click()
    expect(page.locator("#screen-poster")).to_have_class("screen active")
    expect(page.locator("#screen-poster")).to_contain_text("卖点")
    expect(page.locator("#screen-poster")).to_contain_text("适合谁")
    expect(page.locator("#screen-poster .qr")).to_be_visible()
    expect(page.locator("#screen-poster input")).to_have_count(0)
    expect(page.locator("#screen-poster form")).to_have_count(0)
    expect(page.locator("#screen-poster h2")).not_to_have_text("无站内申请表")

    page.evaluate(
        """() => {
          BANNERS.forEach(function (b, i) { b.on = i === 0; });
          renderPlazaBanner();
        }"""
    )
    page.locator("#screenNav button", has_text="作品广场").click()
    expect(page.locator("#plazaBanner .bn-slide")).to_have_count(1)
    expect(page.locator("#plazaBanner .bn-dot")).to_have_count(0)
    page.evaluate(
        """() => {
          BANNERS.forEach(function (b) { b.on = false; });
          renderPlazaBanner();
        }"""
    )
    expect(page.locator("#plazaBanner")).to_be_hidden()

    page.goto(f"{demo_server}/yijian-daifa-demo.html?screen=claims", wait_until="domcontentloaded")
    page.locator("#claimTabs button", has_text="已回填").click()
    expect(page.locator("#claimList img.cover-img").first).to_be_visible()
    expect(page.locator("#claimList")).to_contain_text("番茄小说")
    expect(page.locator("#claimList")).to_contain_text("下载时间")
    expect(page.locator("#claimList")).to_contain_text("还可下载")
    expect(page.locator("[data-fill]").first).to_have_class("primary")
    page.locator("[data-fill]").first.click()
    expect(page.locator("#toast")).to_contain_text("该稿件已回填")
    page.locator("#claimList .c-hit").first.click()
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    expect(page.locator("#detailBody img.cover-img")).to_be_visible()
    expect(page.locator("#detailBody .art")).to_have_count(0)
    expect(page.locator("#copyTitle")).to_be_visible()
    expect(page.locator("#editWork")).to_be_visible()
    expect(page.locator("#footClaimed")).not_to_have_class("hidden")
    page.locator("#screen-detail .back").click()
    expect(page.locator("#screen-claims")).to_have_class("screen active")

    page.goto(f"{demo_server}/yijian-daifa-demo.html?screen=fillback", wait_until="domcontentloaded")
    expect(page.locator("#screen-fillback")).to_have_class("screen active")
    page.locator("#screenNav button", has_text="我的领取").click()
    expect(page.locator("#claimTabs .on")).to_contain_text("未回填")
    page.locator("[data-fill]").first.click()
    expect(page.locator("#screen-fillback")).to_have_class("screen active")


def test_admin_banner_limit_and_work_detail(page, demo_server):
    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-banners"]').click()
    expect(page.locator("#admin-banners")).to_be_visible()
    expect(page.locator("#bannerBody tr")).to_have_count(5)
    page.locator("#addBannerBtn").click()
    expect(page.locator("#toast")).to_contain_text("最多 5 条")

    page.locator('.admin-tab-bar button[data-admin="admin-claims"]').click()
    page.locator("#clBody button", has_text="稿件详情").first.click()
    expect(page.locator("#detailDrawer")).to_have_class("drawer open")
    expect(page.locator("#detailTitle")).to_contain_text("稿件详情")
    expect(page.locator("#detailBody")).to_contain_text("掌心宠")
    expect(page.locator("#detailBody")).to_contain_text("番茄小说")
    page.locator("#detailDrawer .drawer-close").click()
    page.locator("#clBody button", has_text="详情").first.click()
    expect(page.locator("#detailBody")).to_contain_text("回填")
