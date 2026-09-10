"""FR-014 一键代发：feed 隐藏占用、领取门禁、购次、回填、后台页。"""

import re

from playwright.sync_api import expect


def test_feed_hides_occupied_and_claim_requires_keyword(page, demo_server):
    page.goto(f"{demo_server}/yijian-daifa-demo.html", wait_until="domcontentloaded")
    expect(page.locator("#screen-feed")).to_have_class("screen active")
    expect(page.locator("#feedList")).to_contain_text("掌心宠")
    expect(page.locator("#feedList")).not_to_contain_text("团宠解压图集")
    expect(page.locator("#feedList")).not_to_contain_text("银发军官")
    expect(page.locator("#feedList")).not_to_contain_text("待审口播样例")
    expect(page.locator("#feedList")).not_to_contain_text("驳回混剪样例")
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
    expect(page.locator("#projectRow")).to_contain_text("红果短剧")
    expect(page.locator("#projectRow")).to_contain_text("知乎故事")
    expect(page.locator("#projectRow")).to_contain_text("红果漫剧")
    expect(page.locator("#projectRow .proj-ico img")).to_have_count(4)
    expect(page.locator("#projectRow .proj-ico img").first).to_have_attribute("src", "assets/fr014/logo-fanqie.jpg")

    page.locator(".feed-card").filter(has_text="掌心宠").click()
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    expect(page.locator("#detailBody")).to_contain_text("分成比例")
    expect(page.locator("#detailBody")).to_contain_text("领取步骤")
    expect(page.locator("#detailBody")).to_contain_text("张")
    expect(page.locator("#detailBody")).to_contain_text("书籍 ID")
    expect(page.locator("#detailBody")).to_contain_text("7128491023")
    expect(page.locator("#detailBody .pills")).to_contain_text("甜宠")
    expect(page.locator("#detailNotice")).to_contain_text("24小时内")
    expect(page.locator("#detailNotice")).to_contain_text("终身未回填超过3次")
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
    expect(page.locator("#pubTips")).to_be_visible()
    expect(page.locator("#pubTips .tip-label")).to_have_text("发布技巧")
    expect(page.locator("#pubTips textarea")).to_be_visible()
    expect(page.locator("#detailBody")).not_to_contain_text("作品发布技巧")
    expect(page.locator("#detailBody")).not_to_contain_text("发布标题")
    expect(page.locator("#detailBody")).not_to_contain_text("发布描述")
    expect(page.locator("#detailBody")).not_to_contain_text("领取步骤")
    expect(page.locator("#copyTitle")).to_have_text("添加水印")
    expect(page.locator("#editWork")).to_have_text("下载稿件")
    page.locator("#pubTips [data-copy='tips']").click()
    expect(page.locator("#toast")).to_contain_text("已复制发布技巧")

    page.locator("#screenNav button", has_text="我的领取").click()
    expect(page.locator("#claimTabs .on")).to_contain_text("未回填")
    expect(page.locator("#claimList")).to_contain_text("掌心宠溺")
    expect(page.locator("#claimList")).to_contain_text("立即回填")
    expect(page.locator("#claimList")).to_contain_text("番茄小说")
    expect(page.locator("#claimList")).to_contain_text("还可下载")
    expect(page.locator("#claimList")).to_contain_text("下载时间")
    expect(page.locator("#claimProjects")).to_contain_text("番茄小说")
    expect(page.locator("#claimProjects")).not_to_contain_text("红果短剧")
    expect(page.locator("#claimProjects")).not_to_contain_text("知乎故事")
    expect(page.locator("#claimProjects")).not_to_contain_text("红果漫剧")
    expect(page.locator("[data-fill]").first).to_have_class("primary")


def test_buy_then_claim_and_fillback(page, demo_server):
    page.goto(f"{demo_server}/yijian-daifa-demo.html?screen=buy", wait_until="domcontentloaded")
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    expect(page.locator("#buySheet")).to_have_class("kw-sheet show")
    expect(page.locator("#skuList .sku")).to_have_count(3)
    page.locator("#skuList .sku").nth(1).click()
    page.locator("#confirmBuy").click()
    expect(page.locator("#toast")).to_contain_text("兑换成功")
    expect(page.locator("#buySheet")).not_to_have_class("kw-sheet show")
    expect(page.locator("#kwSheet")).not_to_have_class("kw-sheet show")
    page.locator("#goClaim").click()
    expect(page.locator("#kwSheet")).to_have_class("kw-sheet show")
    page.locator("#kwList .kw-row").first.click()
    page.locator("#confirmKw").click()
    expect(page.locator("#toast")).to_contain_text("领取成功")
    expect(page.locator("#copyTitle")).to_have_text("添加水印")
    expect(page.locator("#editWork")).to_have_text("下载稿件")
    page.locator("#screenNav button", has_text="我的领取").click()
    page.locator("[data-fill]").first.click()
    expect(page.locator("#screen-fillback")).to_have_class("screen active")
    page.locator("#doFill").click()
    expect(page.locator("#toast")).to_contain_text("回填完成")
    expect(page.locator("#claimTabs .on")).to_contain_text("已回填")
    expect(page.locator("#claimList")).to_contain_text("掌心宠溺")
    expect(page.locator("[data-fill]").first).to_have_class("primary")
    page.locator("#screenNav button", has_text="作品广场").click()
    expect(page.locator("#feedList")).not_to_contain_text("掌心宠")
    page.locator("#screenNav button", has_text="我的领取").click()
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
    expect(page.locator("#feDemo h2")).to_contain_text("前端交互 Demo")
    expect(page.locator("#feScenes")).to_contain_text("作品广场")
    expect(page.locator("#feScenes")).to_contain_text("招募海报")
    expect(page.locator("#feScenes")).to_contain_text("浮层兑换")
    expect(page.locator('[data-preview="fe"]')).to_have_text("全屏预览")
    expect(page.locator("#mockupFrame")).to_be_visible()
    page.evaluate(
        """() => {
          HTMLElement.prototype.requestFullscreen = function () {
            return Promise.reject(new Error('no-fs'));
          };
        }"""
    )
    page.locator('[data-preview="fe"]').click()
    expect(page.locator("body")).to_have_class("preview-fs-fallback")
    expect(page.locator("#feDemo")).to_have_class("demo-layout is-preview")
    expect(page.locator('[data-preview="fe"]')).to_have_text("退出全屏")
    page.locator('[data-preview="fe"]').click()
    expect(page.locator("body")).not_to_have_class("preview-fs-fallback")
    expect(page.locator('[data-preview="fe"]')).to_have_text("全屏预览")
    page.locator('.page-tab-bar button[data-page="view-admin"]').click()
    expect(page.locator("#admin-editors")).to_be_visible()
    expect(page.locator("#edBody")).to_contain_text("林夏")
    page.locator('.admin-tab-bar button[data-admin="admin-skus"]').click()
    expect(page.locator("#skuBody")).to_contain_text("120")
    expect(page.locator('.page-tab-bar button[data-page="view-flow"]')).to_have_count(0)
    expect(page.locator(".page-tab-bar")).not_to_contain_text("业务流程")
    expect(page.locator(".page-tab-bar")).to_contain_text("业务解释")
    expect(page.locator(".page-tab-bar")).to_contain_text("前后端数据交互")
    page.locator('.page-tab-bar button[data-page="view-explain"]').click()
    expect(page.locator("#view-explain")).to_contain_text("不会剪辑也能做项目")
    expect(page.locator("#view-explain")).to_contain_text("演示预览用现有封面凑 3 张，不是书内页。")
    expect(page.locator("#storyBoard")).to_be_visible()
    expect(page.locator("#storyStepTitle")).to_contain_text("扫码招募")
    expect(page.locator(".story-person")).to_have_count(4)
    expect(page.locator("#storyBoard")).to_contain_text("用户")
    expect(page.locator("#storyBoard")).to_contain_text("剪辑手")
    expect(page.locator("#storyDots button")).to_have_count(8)
    page.locator('.explain-nav button[data-explain="exp-overview"]').click()
    expect(page.locator("#exp-overview")).to_contain_text("做 / 不做")
    page.locator('.page-tab-bar button[data-page="view-data"]').click()
    expect(page.locator("#view-data")).to_contain_text("将落地契约")
    expect(page.locator("#view-data")).to_contain_text("本 Demo 无真实 HTTP")
    expect(page.locator("#view-data")).to_contain_text("状态机")
    expect(page.locator("#view-data")).to_contain_text("次数不足")
    expect(page.locator("#view-data")).to_contain_text("前端需求")
    expect(page.locator("#view-data")).to_contain_text("接口契约")
    expect(page.locator("#view-data")).to_contain_text("状态与异常")
    expect(page.locator("#view-data")).to_contain_text("用户收益入账")
    expect(page.locator("#view-data")).to_contain_text("交互清单")
    page.locator('[data-ix="ix-api"]').click()
    expect(page.locator("#ix-api")).to_contain_text("GET /api/yjd/feed")
    expect(page.locator("#ix-api")).to_contain_text("页面初始化数据流")
    expect(page.locator("#ix-api")).to_contain_text("POST /api/yjd/settlements/apply")
    page.locator('[data-ix="ix-state"]').click()
    expect(page.locator("#ix-state")).to_contain_text("刷新与幂等")
    page.locator('[data-ix="ix-payout"]').click()
    expect(page.locator("#ix-payout")).to_be_visible()
    expect(page.locator("#ix-payout")).to_contain_text("关键词结算入账必须先判代发")
    expect(page.locator("#ix-payout")).to_contain_text("您的账户于[2026-09-10 02:43:53]项目名称结算收益到账5元")
    expect(page.locator("#ix-payout")).to_contain_text("产生代发作品分账5元,实际结算5元")
    expect(page.locator("#ix-payout")).to_contain_text("您的账户于[2026-09-10 02:43:53]项目名称作品代发收益到账5元")
    expect(page.locator("#ix-payout")).to_contain_text("作品稿件「M-06」")
    expect(page.locator("#ix-payout")).to_contain_text("已结算")
    expect(page.locator("#ix-payout")).to_contain_text("业务流程")
    page.locator('#ix-payout [data-sub="ix-payout-flow"]').click()
    expect(page.locator("#ix-payout-flow")).to_be_visible()
    expect(page.locator("#ix-payout-flow")).to_contain_text("代发关键词?")
    expect(page.locator("#ix-payout-flow")).to_contain_text("原子写入成功?")
    expect(page.locator("#ix-payout-flow")).to_contain_text("整笔回滚")
    page.locator('[data-ix="ix-list"]').click()
    expect(page.locator("#ix-list")).to_be_visible()
    expect(page.locator("#ix-list")).to_contain_text("联调矩阵")
    expect(page.locator("#list-matrix")).to_contain_text("用户收益入账")
    page.locator('[data-list="list-fields"]').click()
    expect(page.locator("#list-fields")).to_contain_text("editors")
    expect(page.locator("#list-fields")).to_contain_text("settlements")
    page.locator('.page-tab-bar button[data-page="view-fe"]').click()
    page.locator('#view-fe .module-tab-bar button[data-sub="fe-flow"]').click()
    expect(page.locator("#fe-flow")).to_contain_text("已选通过关键词?")
    expect(page.locator("#fe-flow")).to_contain_text("稿件空闲未占用?")
    expect(page.locator("#fe-flow")).to_contain_text("后台手动恢复")
    page.locator('.page-tab-bar button[data-page="view-pc"]').click()
    page.locator('#view-pc .module-tab-bar button[data-sub="pc-flow"]').click()
    expect(page.locator("#pc-flow")).to_contain_text("项目已启用?")
    expect(page.locator("#pc-flow")).to_contain_text("审核通过?")
    page.locator('.page-tab-bar button[data-page="view-admin"]').click()
    page.locator('.admin-tab-bar button[data-admin="admin-works"]').click()
    page.locator('#admin-works .module-tab-bar button[data-sub="admin-works-flow"]').click()
    expect(page.locator("#admin-works-flow")).to_contain_text("审核通过?")
    page.locator("#toggleRuleDrawer").click()
    expect(page.locator("#ruleDrawer")).to_have_class("drawer open")
    expect(page.locator("#rule-fe")).to_contain_text("作品广场")
    expect(page.locator("#rule-fe")).to_contain_text("前端交互 → 业务流程")
    expect(page.locator("#rule-fe")).to_contain_text("plazaEligible")
    expect(page.locator("#ruleSubBar")).to_contain_text("稿件管理")
    expect(page.locator(".badge-version")).to_contain_text("v9")
    page.locator('.rule-tab-bar button[data-rule="rule-fe"]').click()
    expect(page.locator("#ruleSubBar")).to_contain_text("作品广场")
    expect(page.locator("#ruleSubBar")).to_contain_text("稿件详情")
    expect(page.locator("#rule-fe.rule-panel.active")).to_contain_text("本场景需求细则")
    expect(page.locator("#rule-fe.rule-panel.active")).to_contain_text("plazaEligible")
    page.locator("#ruleDrawer .drawer-close").click()
    expect(page.locator("#ruleDrawer")).not_to_have_class("drawer open")
    page.locator('.page-tab-bar button[data-page="view-pc"]').click()
    expect(page.locator("#pcDemo h2")).to_contain_text("PC端 Demo")
    expect(page.locator("#pcFrame")).to_be_visible()
    expect(page.locator("#pcScenes")).to_contain_text("剪辑供稿")
    expect(page.locator("#pcScenes")).to_contain_text("操作说明")
    expect(page.locator('[data-preview="pc"]')).to_have_text("全屏预览")
    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=flow", wait_until="domcontentloaded")
    expect(page.locator("#fe-flow")).to_be_visible()
    expect(page.locator("#fe-flow")).to_contain_text("已选通过关键词?")


def test_album_preview_limit_and_no_save(page, demo_server):
    page.goto(f"{demo_server}/yijian-daifa-demo.html?screen=detail", wait_until="domcontentloaded")
    expect(page.locator("#albumPreview .media-badge")).to_contain_text("12 张")
    page.evaluate(
        """() => {
          window.__dlCalls = 0;
          const orig = window.downloadManuscript;
          window.downloadManuscript = function () {
            window.__dlCalls += 1;
            if (typeof orig === 'function') return orig.apply(this, arguments);
          };
        }"""
    )
    page.locator("#albumPreview").click()
    expect(page.locator("#previewMask")).to_have_class("preview-mask show")
    expect(page.locator("#previewCount")).to_have_text("1 / 3")
    expect(page.locator("#previewImg")).to_have_attribute("src", re.compile(r"cover-m01"))
    expect(page.locator("#previewWm")).to_contain_text("U-10086")
    expect(page.locator("#loadMask")).not_to_have_class(re.compile(r"\bshow\b"))
    expect(page.locator("#toast")).not_to_contain_text("保存到相册")
    assert page.evaluate("() => window.__dlCalls") == 0

    page.evaluate(
        """() => {
          Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
          document.dispatchEvent(new Event('visibilitychange'));
        }"""
    )
    expect(page.locator("#previewStage")).to_have_class(re.compile(r"is-blur"))
    page.evaluate(
        """() => {
          Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
          document.dispatchEvent(new Event('visibilitychange'));
        }"""
    )
    expect(page.locator("#previewStage")).to_have_class(re.compile(r"is-blur"))
    expect(page.locator("#previewWm")).to_contain_text("U-10086")

    page.locator("#previewClose").click()
    page.evaluate(
        """() => {
          const w = STORE.works.find((x) => x.id === 'M-01');
          w.preview = [];
          YJD.save(STORE);
          renderDetail();
        }"""
    )
    page.locator("#albumPreview").click()
    expect(page.locator("#previewCount")).to_have_text("1 / 3")
    expect(page.locator("#previewImg")).to_have_attribute("src", re.compile(r"cover-m01"))
    page.locator("#previewClose").click()

    page.evaluate("state.current = 'M-02'; showScreen('detail')")
    expect(page.locator("#previewMask")).not_to_have_class(re.compile(r"\bshow\b"))
    page.locator("#playVideo").click()
    expect(page.locator("#previewMask")).not_to_have_class(re.compile(r"\bshow\b"))
    expect(page.locator("#albumPreview")).to_have_count(0)


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
    page.locator("#plazaBanner .bn-slide.on").click()
    expect(page.locator("#screen-poster")).to_have_class("screen active")
    expect(page.locator("#screen-poster")).to_contain_text("卖点")
    expect(page.locator("#screen-poster")).to_contain_text("适合谁")
    expect(page.locator("#screen-poster .qr")).to_be_visible()
    expect(page.locator("#screen-poster form")).to_have_count(0)
    expect(page.locator("#screen-editor-upload")).to_have_count(0)
    page.locator("#screen-poster .back").click()
    expect(page.locator("#screen-feed")).to_have_class("screen active")

    page.evaluate(
        """() => {
          BANNERS.forEach(function (b) { b.on = b.id === 'B-02'; });
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
    expect(page.locator("#copyTitle")).to_have_text("添加水印")
    expect(page.locator("#editWork")).to_have_text("下载稿件")
    expect(page.locator("#footClaimed")).not_to_have_class("hidden")
    expect(page.locator("#pubTips")).to_be_visible()
    expect(page.locator("#pubTips .tip-label")).to_have_text("发布技巧")
    expect(page.locator("#detailBody")).not_to_contain_text("作品发布技巧")
    expect(page.locator("#detailBody")).not_to_contain_text("发布标题")
    expect(page.locator("#detailBody")).not_to_contain_text("发布描述")
    expect(page.locator("#pubTips textarea")).to_have_value(re.compile(r"银发军官把我宠上天｜年代图集"))
    expect(page.locator("#detailBody")).to_contain_text("书籍 ID")
    expect(page.locator("#detailBody")).to_contain_text("7482019356")
    expect(page.locator("#detailBody .pills")).to_contain_text("年代")
    expect(page.locator("#detailNotice")).to_be_visible()
    page.locator("#pubTips [data-copy='tips']").click()
    expect(page.locator("#toast")).to_contain_text("已复制发布技巧")
    page.locator("#copyTitle").click()
    expect(page.locator("#screen-watermark")).to_have_class("screen active")
    expect(page.locator("#wmMark")).to_contain_text("年代甜宠")
    expect(page.locator("#wmTabs")).to_contain_text("字体")
    expect(page.locator("#wmTabs")).to_contain_text("水印")
    expect(page.locator("#wmFonts")).to_contain_text("思源黑体")
    expect(page.locator("#wmFonts")).to_contain_text("站酷快乐体")
    h0 = page.locator("#wmPanes").bounding_box()["height"]
    page.locator("#wmTabs button", has_text="字色").click()
    expect(page.locator("#wmColorA")).to_be_visible()
    h1 = page.locator("#wmPanes").bounding_box()["height"]
    page.locator("#wmTabs button", has_text="水印").click()
    h2 = page.locator("#wmPanes").bounding_box()["height"]
    assert abs(h0 - h1) < 2 and abs(h1 - h2) < 2
    expect(page.locator("#wmModes")).to_contain_text("每2张打10张水印")
    page.locator("#wmText").click()
    expect(page.locator("#wmText")).to_be_focused()
    expect(page.locator("#wmText")).to_be_in_viewport()
    expect(page.locator("#wmTabs")).to_be_in_viewport()
    expect(page.locator("#dlWm")).to_be_in_viewport()
    page.locator("#dlWm").click()
    expect(page.locator("#loadText")).to_contain_text("正在打水印")
    expect(page.locator("#loadText")).to_contain_text("正在下载")
    expect(page.locator("#loadSub")).to_contain_text("张")
    expect(page.locator("#toast")).to_contain_text("水印稿件已保存到相册")
    page.locator("#screen-watermark .back").click()
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    page.locator("#editWork").click()
    expect(page.locator("#loadText")).to_contain_text("正在下载")
    expect(page.locator("#loadSub")).to_contain_text("张")
    expect(page.locator("#toast")).to_contain_text("稿件已保存到相册")
    page.locator("#screen-detail .back").click()
    expect(page.locator("#screen-claims")).to_have_class("screen active")

    page.goto(f"{demo_server}/yijian-daifa-demo.html?screen=fillback", wait_until="domcontentloaded")
    expect(page.locator("#screen-fillback")).to_have_class("screen active")
    page.locator("#screenNav button", has_text="我的领取").click()
    expect(page.locator("#claimTabs .on")).to_contain_text("未回填")
    page.locator("[data-fill]").first.click()
    expect(page.locator("#screen-fillback")).to_have_class("screen active")


def test_admin_editors_works_projects(page, demo_server):
    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    expect(page.locator('.admin-tab-bar button[data-admin="admin-banners"]')).to_have_count(0)
    expect(page.locator("#edBody")).to_contain_text("YB10086")
    expect(page.locator("#edBody")).to_contain_text("50%")
    expect(page.locator("#edBody")).to_contain_text("主力口播")
    page.locator("#admin-editors button", has_text="录入").click()
    expect(page.locator("#appModal")).to_contain_text("右豹 ID")
    expect(page.locator("#appModal")).to_contain_text("分成比例")
    expect(page.locator("#appModal")).to_contain_text("备注")
    expect(page.locator("#appModal")).to_contain_text("稿件需要审核")
    expect(page.locator('input[name="mNeedReview"][value="1"]')).to_be_checked()
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("请填写右豹 ID、分成比例、备注")
    page.locator("#mYb").fill("YB19999")
    page.locator("#mName").fill("新剪辑")
    page.locator("#mShare").fill("45%")
    page.locator("#mNote").fill("客服新录入")
    page.locator("#modalOk").click()
    expect(page.locator("#edBody")).to_contain_text("YB19999")

    expect(page.locator("#edBody tr", has_text="庭宇")).to_contain_text("已上传")
    expect(page.locator("#edBody tr", has_text="庭宇")).to_contain_text("已被领取")
    expect(page.locator("#edBody tr", has_text="庭宇")).to_contain_text("已结算")
    expect(page.locator("#edBody tr", has_text="庭宇")).to_contain_text("待结算")
    expect(page.locator("#edBody tr", has_text="庭宇")).to_contain_text("186")
    expect(page.locator("#edBody tr", has_text="林夏")).to_contain_text("待结算 90")
    page.locator("#edBody tr", has_text="庭宇").locator("button", has_text="收益").click()
    expect(page.locator("#detailDrawer")).to_have_class("drawer open")
    expect(page.locator("#detailTitle")).to_contain_text("庭宇")
    expect(page.locator("#detailBody")).to_contain_text("按日")
    expect(page.locator("#detailBody")).to_contain_text("按月")
    expect(page.locator("#detailBody")).to_contain_text("186")
    expect(page.locator("#detailBody tbody td").first).to_have_text(re.compile(r"^\d{4}-\d{2}-\d{2}$"))
    page.locator("#detailBody button", has_text="按月").click()
    expect(page.locator("#detailBody")).to_contain_text("月份")
    expect(page.locator("#detailBody")).to_contain_text("186")
    expect(page.locator("#detailBody tbody td").first).to_have_text(re.compile(r"^\d{4}-\d{2}$"))
    page.locator("#detailDrawer .drawer-close").click()

    page.locator('.admin-tab-bar button[data-admin="admin-works"]').click()
    expect(page.locator("#wkBody")).to_contain_text("番茄小说")
    expect(page.locator("#wkBody")).to_contain_text("书籍 ID 7128491023")
    expect(page.locator("#wkBody")).to_contain_text("18.6 MB (12)")
    expect(page.locator("#wkBody")).to_contain_text("https://ybdd.demo/ms/M-01")
    expect(page.locator("#wkBody")).to_contain_text("被偏爱的感觉藏不住｜掌心宠口播")
    expect(page.locator("#wkBody tr", has_text="末世囤货混剪")).to_contain_text("(1)")
    page.locator("#wkBody button", has_text="详情").first.click()
    expect(page.locator("#detailDrawer")).to_have_class("drawer open")
    expect(page.locator("#detailBody")).to_contain_text("书籍 ID")
    expect(page.locator("#detailBody")).to_contain_text("文件大小")
    expect(page.locator("#detailBody")).to_contain_text("18.6 MB (12)")
    expect(page.locator("#detailBody")).to_contain_text("发布技巧")
    page.locator("#detailDrawer .drawer-close").click()

    page.locator('.admin-tab-bar button[data-admin="admin-projects"]').click()
    expect(page.locator("#pjBody")).to_contain_text("番茄小说")
    expect(page.locator("#pjBody")).to_contain_text("启用")
    page.locator("#admin-projects button", has_text="添加").click()
    expect(page.locator("#pjKw")).to_have_count(0)
    expect(page.locator("#pjBrandList")).to_contain_text("番茄小说")
    expect(page.locator("#pjBrandList")).to_contain_text("点众小说")
    expect(page.locator("#pjBrandList")).to_contain_text("已添加")
    page.locator("#pjBrandList .brand-item", has_text="点众小说").click()
    expect(page.locator("#pjName")).to_have_value("点众小说")
    page.locator("#pjSort").fill("9")
    page.locator("#modalOk").click()
    expect(page.locator("#pjBody")).to_contain_text("点众小说")
    page.locator("#admin-projects button", has_text="添加").click()
    page.locator("#pjBrandList .brand-item", has_text="番茄小说").click()
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("该品牌项目已添加")
    page.locator("#appModal button", has_text="取消").click()
    page.locator("#pjBody button", has_text="编辑").first.click()
    expect(page.locator("#pjKw")).to_have_count(0)
    expect(page.locator("#appModal")).to_contain_text("项目名称")
    expect(page.locator("#appModal")).to_contain_text("Logo 信息")
    expect(page.locator("#pjName")).to_be_disabled()
    page.locator("#pjOn").select_option("禁用")
    page.locator("#modalOk").click()
    expect(page.locator("#pjBody")).to_contain_text("禁用")

    page.locator('.admin-tab-bar button[data-admin="admin-skus"]').click()
    expect(page.locator("#admin-skus thead")).to_contain_text("购买人数")
    expect(page.locator("#skuBody")).to_contain_text("128")

    page.locator('.admin-tab-bar button[data-admin="admin-claims"]').click()
    expect(page.locator("#admin-claims thead")).to_contain_text("项目名称")
    expect(page.locator("#admin-claims thead")).to_contain_text("书籍信息")
    expect(page.locator("#admin-claims thead")).to_contain_text("剪辑手")
    expect(page.locator("#clBody")).to_contain_text("番茄小说")
    expect(page.locator("#clBody")).to_contain_text("YB10330 庭宇")
    expect(page.locator("#clBody")).to_contain_text("https://channels.weixin.qq.com/demo/C-01")
    expect(page.locator("#clBody button").filter(has_text=re.compile(r"^详情$"))).to_have_count(0)
    expect(page.locator("#clBody button", has_text="稿件详情")).not_to_have_count(0)
    page.locator("#clBody button", has_text="稿件详情").first.click()
    expect(page.locator("#detailDrawer")).to_have_class("drawer open")
    expect(page.locator("#detailTitle")).to_contain_text("稿件详情")
    expect(page.locator("#detailBody")).to_contain_text("银发军官")
    expect(page.locator("#detailBody")).to_contain_text("番茄小说")
    page.locator("#detailDrawer .drawer-close").click()


def test_watermark_video_progress(page, demo_server):
    page.goto(f"{demo_server}/yijian-daifa-demo.html", wait_until="domcontentloaded")
    page.evaluate(
        """() => {
          var it = item('M-02');
          it.occupied = true;
          state.claims.unshift(makeClaim(it, { id: 'C-v', kw: '末世囤货', status: '未回填' }));
          state.current = 'M-02';
        }"""
    )
    page.locator("#screenNav button", has_text="添加水印").click()
    expect(page.locator("#screen-watermark")).to_have_class("screen active")
    page.locator(".phone-frame").scroll_into_view_if_needed()
    expect(page.locator("#wmMark")).to_contain_text("末世囤货")
    expect(page.locator("#dlWm")).to_be_in_viewport()
    expect(page.locator("#wmText")).to_be_in_viewport()
    page.locator("#wmTabs button", has_text="字色").click()
    expect(page.locator("#wmColors .wm-sw")).to_have_count(10)
    page.locator("#wmTabs button", has_text="背景").click()
    expect(page.locator("#wmBgs .wm-sw")).to_have_count(11)
    page.locator("#dlWm").click()
    expect(page.locator("#loadText")).to_contain_text("正在打水印")
    expect(page.locator("#loadBarWrap")).to_have_class("load-bar show")
    expect(page.locator("#loadSub")).to_contain_text("%")
    expect(page.locator("#toast")).to_contain_text("水印稿件已保存到相册")


def test_pc_recruit_board_and_upload_list(page, demo_server):
    page.goto(f"{demo_server}/yijian-daifa-pc.html?screen=home", wait_until="domcontentloaded")
    expect(page.locator("#recruitBn")).to_be_visible()
    expect(page.locator("#stAuth")).to_contain_text("2")
    expect(page.locator("#stUp")).to_contain_text("2")
    expect(page.locator("#stClaim")).to_contain_text("1")
    expect(page.locator("#stEarn")).to_contain_text("186")
    expect(page.locator("#authChips")).to_contain_text("番茄小说")
    expect(page.locator("#authChips")).to_contain_text("红果漫剧")
    expect(page.locator("#boardEmpty")).to_be_hidden()
    expect(page.locator("#goGuide")).to_be_visible()
    page.locator("#goGuide").click()
    expect(page.locator("#view-guide")).to_have_class("view on")
    expect(page.locator("#guideBody")).to_contain_text("怎样算传完")
    expect(page.locator("#guideBody")).to_contain_text("操作说明")
    page.locator("#guideBack").click()
    expect(page.locator("#view-home")).to_have_class("view on")
    expect(page.locator("#recentBox")).to_contain_text("项目名称")
    expect(page.locator("#recentBox")).to_contain_text("书籍信息")
    expect(page.locator("#recentBox")).to_contain_text("稿件类型")
    expect(page.locator("#recentBox")).to_contain_text("审核状态")
    expect(page.locator("#recentBox")).to_contain_text("红果漫剧")
    expect(page.locator("#recentBox")).to_contain_text("6641029385")
    expect(page.locator("#recentBox")).to_contain_text("走入没有你的夜")
    expect(page.locator("#recentBox")).to_contain_text("https://ybdd.demo/book/6641029385")
    expect(page.locator("#recentBox")).to_contain_text("21.8 MB")
    expect(page.locator("#recentBox")).to_contain_text("图集")
    expect(page.locator("#recentBox")).to_contain_text("已通过")
    expect(page.locator("#recentBox")).to_contain_text("1小时前")

    page.locator("#recruitBn").click()
    expect(page.locator("#recruitDrawer")).to_have_class("drawer open")
    expect(page.locator("#recruitDrawer")).to_contain_text("卖点")
    expect(page.locator("#recruitDrawer")).to_contain_text("适合谁")
    expect(page.locator("#recruitDrawer .qr")).to_be_visible()
    expect(page.locator("#recruitDrawer input")).to_have_count(0)
    expect(page.locator("#recruitDrawer form")).to_have_count(0)
    page.locator("#recruitClose").click()
    expect(page.locator("#recruitDrawer")).not_to_have_class("drawer open")

    page.goto(f"{demo_server}/yijian-daifa-pc.html?screen=guest", wait_until="domcontentloaded")
    expect(page.locator("#recruitBn")).to_be_visible()
    expect(page.locator("#boardEmpty")).to_be_visible()
    expect(page.locator("#boardEmpty")).to_contain_text("还不是剪辑手")
    expect(page.locator("#boardReady")).to_be_hidden()
    expect(page.locator("#goUpload")).to_be_hidden()
    expect(page.locator("#goGuide")).to_be_visible()
    page.locator("#boardEmpty button", has_text="查看操作说明").click()
    expect(page.locator("#view-guide")).to_have_class("view on")
    expect(page.locator("#guideBody")).to_contain_text("未录入也能看")

    page.goto(f"{demo_server}/yijian-daifa-pc.html?screen=list", wait_until="domcontentloaded")
    expect(page.locator("#listBox")).to_contain_text("书籍 ID")
    expect(page.locator("#listBox")).to_contain_text("已通过")
    expect(page.locator("#listBox")).not_to_contain_text("ybdd.demo/ms")
    expect(page.locator("#listBox tr", has_text="银发军官图集").locator("button", has_text="删除")).to_be_disabled()


def test_admin_fe_store_loop(page, demo_server):
    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-projects"]').click()
    page.locator("#pjBody tr", has_text="知乎故事").locator("button", has_text="编辑").click()
    page.locator("#pjOn").select_option("禁用")
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("已更新项目")

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    expect(page.locator("#projectRow")).to_contain_text("番茄小说")
    expect(page.locator("#projectRow")).not_to_contain_text("知乎故事")
    expect(page.locator("#feedList")).not_to_contain_text("百日新娘")

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-projects"]').click()
    page.locator("#pjBody tr", has_text="番茄小说").locator("button", has_text="编辑").click()
    page.locator("#pjOn").select_option("禁用")
    page.locator("#modalOk").click()
    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1&screen=detail", wait_until="domcontentloaded")
    expect(page.locator("#goClaim")).to_have_text("当前不可领")
    expect(page.locator("#goClaim")).to_be_disabled()

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-projects"]').click()
    page.locator("#pjBody tr", has_text="番茄小说").locator("button", has_text="编辑").click()
    page.locator("#pjOn").select_option("启用")
    page.locator("#modalOk").click()

    page.goto(f"{demo_server}/yijian-daifa-pc.html?embed=1&screen=upload", wait_until="domcontentloaded")
    expect(page.locator("#upModal")).to_have_class("up-modal open")
    page.locator("#upBook").fill("闭环测试书")
    page.locator("#upBookId").fill("B-LOOP")
    page.locator("#upBookLink").fill("https://ybdd.demo/book/B-LOOP")
    page.locator("#upNext").click()
    page.locator("#upPackZip").click()
    page.locator("#upUseDemo").click()
    expect(page.locator("#upPackSum")).to_contain_text("解压中")
    expect(page.locator("#upExcel")).to_contain_text("闭环测试书", timeout=5000)
    expect(page.locator("#upExcelMeta")).to_contain_text("共 3 条")
    expect(page.locator("#upExcel .tip-edit")).to_have_count(3)
    expect(page.locator("#upExcel .tip-edit").first).to_have_value("")
    page.locator("#upAiTips").click()
    expect(page.locator("#pcConfirm")).to_have_class(re.compile(r"\bopen\b"))
    expect(page.locator("#pcConfirm")).to_contain_text("你是代发文案助手")
    expect(page.locator("#pcConfirm")).to_contain_text("【约束】")
    expect(page.locator("#pcConfirm")).to_contain_text("【规则】")
    expect(page.locator("#upExcel .tip-edit").first).to_have_value("")
    page.locator("#pcConfirmCancel").click()
    expect(page.locator("#pcConfirm")).not_to_have_class(re.compile(r"\bopen\b"))
    expect(page.locator("#upExcel .tip-edit").first).to_have_value("")
    page.locator("#upAiTips").click()
    page.locator("#pcConfirmOk").click()
    expect(page.locator("#toast")).to_contain_text("已为全表生成发布技巧")
    expect(page.locator("#upExcel .tip-edit").first).to_have_value(re.compile(r"闭环测试书"))
    expect(page.locator("#upExcel .tip-edit").first).to_have_value(re.compile(r"#"))
    fail_tip = page.locator("#upExcel .tip-edit").nth(2).input_value()
    page.locator("#doPublish").click()
    expect(page.locator("#toast")).to_contain_text("已加入上传队列")
    expect(page.locator("#listBox")).to_contain_text("闭环测试书")
    loop_row = page.locator("#listBox tbody tr").filter(has=page.locator("td:nth-child(2)", has_text="闭环测试书"))
    expect(loop_row).to_contain_text("已上传", timeout=8000)
    expect(loop_row).to_contain_text("审核中")
    expect(loop_row).to_contain_text("不另编情节")
    expect(page.locator("#listBox")).to_contain_text("B-LOOP")
    expect(page.locator("#listBox")).not_to_contain_text("ybdd.demo/ms")
    fail_row = page.locator("#listBox tbody tr").filter(has=page.locator("td:nth-child(2)", has_text="失败样例"))
    expect(fail_row).to_contain_text("上传失败", timeout=8000)
    fail_row.locator("button", has_text="重新上传").click()
    expect(fail_row).to_contain_text("已上传", timeout=5000)
    tip_kept = page.evaluate(
        """() => {
          var data = JSON.parse(localStorage.getItem('fr014-yjd-v4'));
          var w = (data.works || []).find(function (x) {
            return x.title === '失败样例' && x.bookId === 'B-LOOP';
          });
          return w ? (w.pubTips || '') : '';
        }"""
    )
    assert tip_kept == fail_tip

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    expect(page.locator("#feedList")).not_to_contain_text("闭环测试书")

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-works"]').click()
    expect(page.locator("#wkBody")).to_contain_text("闭环测试书")
    expect(page.locator("#wkBody")).to_contain_text("审核中")
    expect(page.locator('#wkBody tr[data-title="闭环测试书"]')).to_contain_text("不另编情节")
    page.locator('#wkBody tr[data-title="闭环测试书"]').locator("button", has_text="通过").click()
    expect(page.locator("#toast")).to_contain_text("已通过")

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    expect(page.locator("#feedList")).to_contain_text("闭环测试书")
    expect(page.locator("#feedList")).not_to_contain_text("待审口播样例")
    expect(page.locator("#feedList")).not_to_contain_text("驳回混剪样例")

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-works"]').click()
    page.locator("#wkBody tr", has_text="待审口播样例").locator("button", has_text="驳回").click()
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("请填写驳回原因")
    page.locator("#rjReason").fill("封面缺失")
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("已驳回")
    expect(page.locator("#wkBody tr", has_text="待审口播样例")).to_contain_text("封面缺失")
    expect(page.locator('#wkBody tr[data-title="闭环测试书"]').locator("button", has_text="驳回")).to_have_count(0)

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    expect(page.locator("#feedList")).not_to_contain_text("待审口播样例")

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-projects"]').click()
    page.locator("#pjBody tr", has_text="番茄小说").locator("button", has_text="编辑").click()
    page.locator("#pjOn").select_option("禁用")
    page.locator("#modalOk").click()
    page.goto(f"{demo_server}/yijian-daifa-pc.html?embed=1&screen=upload", wait_until="domcontentloaded")
    expect(page.locator("#upProject")).not_to_contain_text("番茄小说")
    expect(page.locator("#upProject")).to_contain_text("红果漫剧")

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-projects"]').click()
    page.locator("#pjBody tr", has_text="番茄小说").locator("button", has_text="编辑").click()
    page.locator("#pjOn").select_option("启用")
    page.locator("#modalOk").click()

    page.goto(f"{demo_server}/yijian-daifa-pc.html?embed=1&screen=list", wait_until="domcontentloaded")
    page.locator("#listBox tbody tr").filter(has=page.locator("td:nth-child(2)", has_text="闭环测试书")).locator("button", has_text="删除").click()
    page.locator("#pcConfirmOk").click()
    expect(page.locator("#toast")).to_contain_text("已删除")
    expect(page.locator("#listBox tbody tr").filter(has=page.locator("td:nth-child(2)", has_text="闭环测试书"))).to_have_count(0)


def test_plaza_hides_disabled_mat_and_editor(page, demo_server):
    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-mats"]').click()
    page.locator("#matBody tr", has_text="口播").locator("button", has_text="停用").click()
    expect(page.locator("#toast")).to_contain_text("广场筛选不再列出")

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    expect(page.locator("#feedList")).not_to_contain_text("掌心宠")
    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1&screen=detail", wait_until="domcontentloaded")
    expect(page.locator("#goClaim")).to_have_text("当前不可领")
    expect(page.locator("#goClaim")).to_be_disabled()
    quota_before = page.locator("#claimQuotaFoot").inner_text()
    page.evaluate("startClaim()")
    expect(page.locator("#kwSheet")).to_have_class("kw-sheet show")
    expect(page.locator("#claimQuotaFoot")).to_have_text(quota_before)
    page.locator("#kwList .kw-row").first.click()
    page.locator("#confirmKw").click()
    expect(page.locator("#toast")).to_contain_text("稿件当前不可领")
    expect(page.locator("#claimQuotaFoot")).to_have_text(quota_before)

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-mats"]').click()
    page.locator("#matBody tr", has_text="口播").locator("button", has_text="启用").click()
    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    expect(page.locator("#feedList")).to_contain_text("掌心宠")

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator("#edBody tr", has_text="林夏").locator("button", has_text="停用").click()
    expect(page.locator("#toast")).to_contain_text("占用中")
    page.locator("#edBody tr", has_text="阿凯").locator("button", has_text="停用").click()
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("已停用")

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    expect(page.locator("#feedList")).not_to_contain_text("末世囤货混剪")
    page.evaluate("state.current = 'M-02'; showScreen('detail')")
    expect(page.locator("#goClaim")).to_have_text("当前不可领")
    expect(page.locator("#goClaim")).to_be_disabled()
    quota_m02 = page.locator("#claimQuotaFoot").inner_text()
    page.evaluate("startClaim()")
    expect(page.locator("#kwSheet")).to_have_class("kw-sheet show")
    expect(page.locator("#claimQuotaFoot")).to_have_text(quota_m02)
    page.locator("#kwList .kw-row").first.click()
    page.locator("#confirmKw").click()
    expect(page.locator("#toast")).to_contain_text("稿件当前不可领")
    expect(page.locator("#claimQuotaFoot")).to_have_text(quota_m02)

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator("#edBody tr", has_text="阿凯").locator("button", has_text="启用").click()
    page.locator("#modalOk").click()
    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    expect(page.locator("#feedList")).to_contain_text("末世囤货混剪")


def test_project_keywords_editor_checks_and_timeout_guard(page, demo_server):
    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-projects"]').click()
    page.locator("#pjBody tr", has_text="番茄小说").locator("button", has_text="编辑").click()
    before = page.evaluate("() => JSON.parse(localStorage.getItem('fr014-yjd-v4')).keywords['番茄小说']")
    expect(page.locator("#pjKw")).to_have_count(0)
    page.locator("#pjOn").select_option("启用")
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("已更新项目")
    after = page.evaluate("() => JSON.parse(localStorage.getItem('fr014-yjd-v4')).keywords['番茄小说']")
    assert after == before

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1&screen=detail", wait_until="domcontentloaded")
    page.evaluate("state.kw = '年代甜宠'")
    page.locator("#goClaim").click()
    expect(page.locator("#kwSheet")).to_have_class("kw-sheet show")
    expect(page.locator("#kwList .kw-row.on")).to_have_count(0)
    expect(page.locator("#kwList")).to_contain_text("掌心宠溺")
    quota_pref = page.locator("#claimQuotaFoot").inner_text()
    page.locator("#confirmKw").click()
    expect(page.locator("#toast")).to_contain_text("请先选择该项目已通过的关键关键词")
    expect(page.locator("#claimQuotaFoot")).to_have_text(quota_pref)

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1&screen=detail", wait_until="domcontentloaded")
    page.evaluate(
        """() => {
          STORE.keywords['番茄小说'] = [];
          persistFe();
        }"""
    )
    quota_empty = page.locator("#claimQuotaFoot").inner_text()
    page.locator("#goClaim").click()
    expect(page.locator("#kwSheet")).to_have_class("kw-sheet show")
    expect(page.locator("#kwList")).to_contain_text("暂无已通过申词")
    page.locator("#confirmKw").click()
    expect(page.locator("#toast")).to_contain_text("请先选择该项目已通过的关键关键词")
    expect(page.locator("#claimQuotaFoot")).to_have_text(quota_empty)

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1&screen=detail", wait_until="domcontentloaded")
    page.evaluate(
        """() => {
          state.free = 0;
          state.bought = 0;
          persistFe();
        }"""
    )
    page.locator("#goClaim").click()
    expect(page.locator("#buySheet")).to_have_class("kw-sheet show")
    expect(page.locator("#kwSheet")).not_to_have_class("kw-sheet show")

    page.goto(f"{demo_server}/yijian-daifa-pc.html?embed=1&screen=list", wait_until="domcontentloaded")
    expect(page.locator("#listBox")).to_contain_text("21.8 MB (16)")
    expect(page.locator("#listBox")).to_contain_text("15.2 MB (8)")
    expect(page.locator("#listBox")).not_to_contain_text("ybdd.demo/ms")

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator("#admin-editors button", has_text="录入").click()
    expect(page.locator("#mProj input[type='checkbox']")).not_to_have_count(0)
    expect(page.locator("input#mProj")).to_have_count(0)
    page.locator("#mYb").fill("YB17701")
    page.locator("#mName").fill("多选剪辑")
    page.locator("#mShare").fill("33%")
    page.locator("#mNote").fill("勾选两项")
    page.locator("#mProj input[value='番茄小说']").check()
    page.locator("#mProj input[value='红果短剧']").check()
    page.locator("#modalOk").click()
    expect(page.locator("#edBody")).to_contain_text("YB17701")
    multi = page.evaluate(
        """() => {
          var data = JSON.parse(localStorage.getItem('fr014-yjd-v4'));
          return (data.editors.find(function (e) { return e.ybId === 'YB17701'; }) || {}).projects;
        }"""
    )
    assert multi == "番茄小说 / 红果短剧"

    page.locator("#admin-editors button", has_text="录入").click()
    page.locator("#mYb").fill("YB17702")
    page.locator("#mName").fill("零授权")
    page.locator("#mShare").fill("20%")
    page.locator("#mNote").fill("不勾选")
    page.locator("#modalOk").click()
    zero = page.evaluate(
        """() => {
          var data = JSON.parse(localStorage.getItem('fr014-yjd-v4'));
          return (data.editors.find(function (e) { return e.ybId === 'YB17702'; }) || {}).projects;
        }"""
    )
    assert zero == "—"

    page.goto(f"{demo_server}/yijian-daifa-pc.html?embed=1&screen=upload", wait_until="domcontentloaded")
    expect(page.locator("#upProject")).to_contain_text("番茄小说")
    expect(page.locator("#upProject")).to_contain_text("红果漫剧")

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator("#edBody tr", has_text="庭宇").locator("button", has_text="编辑").click()
    expect(page.locator("#mProj input[value='番茄小说']")).to_be_checked()
    expect(page.locator("#mProj input[value='红果漫剧']")).to_be_checked()
    page.locator("#modalOk").click()
    kept = page.evaluate(
        """() => {
          var data = JSON.parse(localStorage.getItem('fr014-yjd-v4'));
          return (data.editors.find(function (e) { return e.name === '庭宇'; }) || {}).projects;
        }"""
    )
    assert kept == "番茄小说 / 红果漫剧"
    page.locator("#edBody tr", has_text="庭宇").locator("button", has_text="编辑").click()
    boxes = page.locator("#mProj input[type='checkbox']")
    for i in range(boxes.count()):
        boxes.nth(i).uncheck()
    page.locator("#modalOk").click()
    page.goto(f"{demo_server}/yijian-daifa-pc.html?embed=1&screen=upload", wait_until="domcontentloaded")
    expect(page.locator("#upProject")).to_contain_text("暂无可用项")

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.evaluate(
        """() => {
          STORE.editors.forEach(function (e) { e.status = '已停用'; });
          persist();
          renderEditors();
        }"""
    )
    page.locator('.admin-tab-bar button[data-admin="admin-works"]').click()
    page.locator("#wkBody button", has_text="编辑").first.click()
    expect(page.locator("#wTitle")).to_be_visible()
    page.locator("#appModal button", has_text="取消").click()
    page.locator("#admin-works button", has_text="录入").click()
    expect(page.locator("#toast")).to_contain_text("请先录入剪辑手")

    page.locator('.admin-tab-bar button[data-admin="admin-works"]').click()
    page.locator("#wkBody tr", has_text="掌心宠 · 口播切片").locator("button", has_text="删除").click()
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("已删除")
    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1&screen=timeout", wait_until="domcontentloaded")
    expect(page.locator("#toast")).to_contain_text("演示稿件已删除")
    expect(page.locator("#screen-claims")).to_have_class("screen active")


def test_admin_batch_audit_and_delete(page, demo_server):
    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-works"]').click()
    expect(page.locator("#wkBatchBar.show")).to_have_count(0)
    page.locator('#wkBody tr[data-title="待审口播样例"] input[type="checkbox"]').check()
    page.locator('#wkBody tr[data-title="驳回混剪样例"] input[type="checkbox"]').check()
    expect(page.locator("#wkBatchBar.show")).to_be_visible()
    expect(page.locator("#wkBatchInfo")).to_contain_text("已选 2 项")
    page.locator("#wkBatchBar button", has_text="批量审核").click()
    expect(page.locator("#appModal")).to_contain_text("批量审核")
    expect(page.locator('input[name="batchAuditAct"][value="pass"]')).to_be_checked()
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("已通过 2 条")
    expect(page.locator('#wkBody tr[data-title="待审口播样例"]')).to_contain_text("已通过")
    expect(page.locator('#wkBody tr[data-title="驳回混剪样例"]')).to_contain_text("已通过")
    expect(page.locator("#wkBatchBar.show")).to_have_count(0)

    page.locator('#wkBody tr[data-title="走入没有你的夜"] input[type="checkbox"]').check()
    page.locator('#wkBody tr[data-title="团宠解压图集"] input[type="checkbox"]').check()
    page.locator("#wkBatchBar button", has_text="批量删除").click()
    expect(page.locator("#appModal")).to_contain_text("即将删除")
    expect(page.locator("#appModal")).to_contain_text("跳过")
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("已删除 1 条")
    expect(page.locator('#wkBody tr[data-title="走入没有你的夜"]')).to_have_count(0)
    expect(page.locator('#wkBody tr[data-title="团宠解压图集"]')).to_have_count(1)


def test_skip_review_editor_upload_auto_pass(page, demo_server):
    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    expect(page.locator("#edBody tr", has_text="阿凯")).to_contain_text("否")
    expect(page.locator("#edBody tr", has_text="林夏")).to_contain_text("是")
    page.locator("#edBody tr", has_text="庭宇").locator("button", has_text="编辑").click()
    page.locator('input[name="mNeedReview"][value="0"]').check()
    page.locator("#modalOk").click()
    expect(page.locator("#toast")).to_contain_text("已更新剪辑手")
    expect(page.locator("#edBody tr", has_text="庭宇")).to_contain_text("否")

    page.goto(f"{demo_server}/yijian-daifa-pc.html?embed=1&screen=upload", wait_until="domcontentloaded")
    page.locator("#upBook").fill("免审闭环书")
    page.locator("#upBookId").fill("B-SKIP")
    page.locator("#upBookLink").fill("https://ybdd.demo/book/B-SKIP")
    page.locator("#upNext").click()
    page.locator("#upPackZip").click()
    page.locator("#upUseDemo").click()
    expect(page.locator("#upExcel")).to_contain_text("闭环测试书", timeout=5000)
    page.locator("#doPublish").click()
    expect(page.locator("#toast")).to_contain_text("已加入上传队列")
    skip_row = page.locator("#listBox tbody tr").filter(has_text="B-SKIP").filter(has_text="闭环测试书")
    expect(skip_row).to_contain_text("已上传", timeout=8000)
    expect(skip_row).to_contain_text("已通过")
    expect(skip_row).not_to_contain_text("审核中")
    expect(skip_row).to_contain_text("—")
    night_row = page.locator("#listBox tbody tr").filter(has_text="B-SKIP").filter(has_text="夜色切片")
    expect(night_row).to_contain_text("已上传", timeout=8000)
    expect(night_row).to_contain_text("已通过")

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    expect(page.locator("#feedList")).to_contain_text("闭环测试书")
    expect(page.locator("#feedList")).to_contain_text("夜色切片")


def test_publish_tips_single_block(page, demo_server):
    custom = "手改技巧正文给闭环验收用 #手改"
    page.goto(f"{demo_server}/yijian-daifa-pc.html?embed=1&screen=upload", wait_until="domcontentloaded")
    page.evaluate("askAiTips()")
    expect(page.locator("#toast")).to_contain_text("请先解析成片")
    page.locator("#upBook").fill("手改技巧书")
    page.locator("#upBookId").fill("B-EDIT")
    page.locator("#upBookLink").fill("https://ybdd.demo/book/B-EDIT")
    page.locator("#upNext").click()
    page.locator("#upPackZip").click()
    page.locator("#upUseDemo").click()
    expect(page.locator("#upExcel .tip-edit").first).to_have_value("", timeout=5000)
    page.locator("#upExcel .tip-edit").first.fill(custom)
    page.locator("#doPublish").click()
    expect(page.locator("#toast")).to_contain_text("已加入上传队列")
    edit_row = page.locator("#listBox tbody tr").filter(has=page.locator("td:nth-child(2)", has_text="闭环测试书")).filter(has_text="B-EDIT")
    expect(edit_row).to_contain_text("已上传", timeout=8000)
    expect(edit_row).to_contain_text(custom)

    page.goto(f"{demo_server}/fr-opc-yijian-daifa.html?tab=admin", wait_until="domcontentloaded")
    page.locator('.admin-tab-bar button[data-admin="admin-works"]').click()
    expect(page.locator('#wkBody tr[data-title="闭环测试书"]').filter(has_text="B-EDIT")).to_contain_text(custom)
    page.locator('#wkBody tr[data-title="闭环测试书"]').filter(has_text="B-EDIT").locator("button", has_text="详情").click()
    expect(page.locator("#detailBody")).to_contain_text("发布技巧")
    expect(page.locator("#detailBody")).to_contain_text(custom)
    expect(page.locator("#detailBody")).not_to_contain_text("作品标题")
    expect(page.locator("#detailBody")).not_to_contain_text("作品描述")
    page.locator("#detailDrawer .drawer-close").click()
    page.locator('#wkBody tr[data-title="闭环测试书"]').filter(has_text="B-EDIT").locator("button", has_text="通过").click()

    page.goto(f"{demo_server}/yijian-daifa-demo.html?embed=1", wait_until="domcontentloaded")
    page.evaluate(
        """() => {
          var w = STORE.works.find(function (x) { return x.bookId === 'B-EDIT' && x.title === '闭环测试书'; });
          if (!w) return;
          w.occupied = true;
          w.occ = '占用中';
          state.claims.unshift(makeClaim(w, { id: 'C-edit', kw: '掌心宠溺', status: '未回填' }));
          persistFe();
          state.current = w.id;
          showScreen('detail');
        }"""
    )
    expect(page.locator("#pubTips textarea")).to_have_value(custom)
    expect(page.locator("#pubTips .tip-label")).to_have_text("发布技巧")
    expect(page.locator("#detailBody")).not_to_contain_text("作品发布技巧")
    expect(page.locator("#detailBody")).not_to_contain_text("发布标题")
    expect(page.locator("#detailBody")).not_to_contain_text("发布描述")
    page.locator("#pubTips [data-copy='tips']").click()
    expect(page.locator("#toast")).to_contain_text("已复制发布技巧")

    page.evaluate(
        """() => {
          var w = item(state.current);
          w.pubTips = '';
          w.pubTitle = '不应回落的旧标题';
          w.pubDesc = '不应回落的旧描述';
          persistFe();
          renderDetail();
        }"""
    )
    expect(page.locator("#pubTips textarea")).to_have_value("")
    expect(page.locator("#pubTips .tip-label")).to_have_text("发布技巧")
    page.locator("#pubTips [data-copy='tips']").click()
    expect(page.locator("#toast")).to_contain_text("暂无发布技巧")

    page.evaluate(
        """() => {
          var w = STORE.works.find(function (x) { return x.id === 'M-06'; });
          delete w.pubTips;
          w.pubTitle = '旧标题段';
          w.pubDesc = '旧描述段';
          persistFe();
          state.current = 'M-06';
          showScreen('detail');
        }"""
    )
    expect(page.locator("#pubTips textarea")).to_have_value("旧标题段\n旧描述段")
    expect(page.locator("#detailBody")).not_to_contain_text("发布标题")
    expect(page.locator("#detailBody")).not_to_contain_text("发布描述")
