"""FR-006 活动中心：查看只进详情、领取记账、榜单开关与固定列。"""

from playwright.sync_api import expect


def test_list_view_opens_detail_without_outbound_toast(page, demo_server):
    page.goto(f"{demo_server}/activity-center-demo.html", wait_until="domcontentloaded")
    expect(page.locator('.activity-card[data-id="a2"] .card-subtitle')).to_contain_text("从选书到发布")
    page.locator('.activity-card[data-id="a2"]').click()
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    expect(page.locator("#detailHead")).to_contain_text("小说推文免费培训第 1 期")
    expect(page.locator("#detailHead img[alt='封面']")).to_be_visible()
    expect(page.locator("#toast")).not_to_contain_text("外跳")
    expect(page.locator("#toast")).not_to_have_class("show")


def test_banner_view_opens_detail_and_does_not_mark_participated(page, demo_server):
    page.goto(f"{demo_server}/activity-center-demo.html", wait_until="domcontentloaded")
    page.locator("#pinnedBanner .btn-banner").click()
    expect(page.locator("#screen-detail")).to_have_class("screen active")
    expect(page.locator("#detailHead")).to_contain_text("3天右豹生态公益培训营")
    expect(page.locator("#toast")).not_to_contain_text("外跳")
    page.locator("#detailBack").click()
    page.locator('#filterTabs button[data-filter="participated"]').click()
    expect(page.locator("#emptyState")).to_contain_text("暂无已参与的活动")
    expect(page.locator("#pinnedBanner")).to_contain_text("3天右豹生态公益培训营")
    expect(page.locator("#activityList")).not_to_contain_text("小说推文免费培训")


def test_view_only_does_not_seed_a2_into_participated(page, demo_server):
    page.goto(f"{demo_server}/activity-center-demo.html", wait_until="domcontentloaded")
    page.locator('.activity-card[data-id="a2"]').click()
    page.locator("#detailBack").click()
    page.locator('#filterTabs button[data-filter="participated"]').click()
    expect(page.locator("#emptyState")).to_contain_text("暂无已参与的活动")
    expect(page.locator("#activityList .activity-card")).to_have_count(0)


def test_tab_flow_lands_on_fe_business_flow(page, demo_server):
    page.goto(f"{demo_server}/fr-activity-center.html?tab=flow", wait_until="domcontentloaded")
    expect(page.locator('#view-fe')).to_have_class("page-view active")
    expect(page.locator('#fe-flow')).to_have_class("sub-view active")
    expect(page.locator('#view-fe .module-tab-bar button[data-sub="fe-flow"]')).to_have_class("active")
    expect(page.locator("#fe-flow")).to_contain_text("点查看进详情")
    expect(page.locator("#fe-flow")).not_to_contain_text("有跳转链接")


def test_detail_cta_records_participated(page, demo_server):
    page.goto(f"{demo_server}/activity-center-demo.html", wait_until="domcontentloaded")
    page.locator('.activity-card[data-id="a2"]').click()
    page.locator("#detailCta button").first.click()
    expect(page.locator("#toast")).to_contain_text("并记入已参与")
    page.locator("#detailBack").click()
    page.locator('#filterTabs button[data-filter="participated"]').click()
    expect(page.locator("#activityList")).to_contain_text("小说推文免费培训第 1 期")


def test_jump_fail_does_not_record_participated(page, demo_server):
    page.goto(
        f"{demo_server}/activity-center-demo.html?screen=detail&id=a7",
        wait_until="domcontentloaded",
    )
    page.locator("#detailCta button").first.click()
    expect(page.locator("#toast")).to_contain_text("跳转失败")
    page.locator("#detailBack").click()
    page.locator('#filterTabs button[data-filter="participated"]').click()
    expect(page.locator("#emptyState")).to_contain_text("暂无已参与的活动")


def test_upcoming_and_ended_claim_disabled(page, demo_server):
    page.goto(
        f"{demo_server}/activity-center-demo.html?scene=detail-upcoming",
        wait_until="domcontentloaded",
    )
    expect(page.locator("#detailCta button").first).to_be_disabled()
    page.goto(
        f"{demo_server}/activity-center-demo.html?scene=detail-ended",
        wait_until="domcontentloaded",
    )
    expect(page.locator("#detailCta button").first).to_be_disabled()
    expect(page.locator("#rewardBar")).to_have_count(0)
    expect(page.locator("#detailTabs button[data-tab='board']")).to_have_count(0)


def test_tab_data_opens_frontend_backend_interaction(page, demo_server):
    page.goto(f"{demo_server}/fr-activity-center.html?tab=data", wait_until="domcontentloaded")
    expect(page.locator("#view-data")).to_have_class("page-view active")
    expect(page.locator("#ix-fe")).to_be_visible()
    expect(page.locator(".page-tab-bar button[data-page='view-data']")).to_have_class("active")
    expect(page.locator('.page-tab-bar button[data-page="view-flow"]')).to_have_count(0)
    expect(page.locator(".page-tab-bar")).not_to_contain_text("业务流程")
    for label in ("前端交互", "管理后台", "前后端数据交互"):
        expect(page.locator(".page-tab-bar")).to_contain_text(label)
    expect(page.locator("#view-fe .module-tab-bar")).to_contain_text("业务流程")
    expect(page.locator("#view-fe .module-tab-bar")).to_contain_text("开发提示词")
    page.locator(".page-tab-bar button[data-page='view-admin']").click()
    expect(page.locator("#view-admin .module-tab-bar")).to_contain_text("业务流程")
    expect(page.locator("#view-admin .module-tab-bar")).to_contain_text("开发提示词")
    expect(page.locator("#admin-flow")).to_contain_text("活动状态=显示？")
    expect(page.locator("#admin-flow")).to_contain_text("C 端可读显示池")
    expect(page.locator("#view-admin .admin-tab-bar")).to_have_count(0)


def test_admin_enrolled_qualified_and_delete(page, demo_server):
    page.goto(f"{demo_server}/fr-activity-center.html?tab=admin", wait_until="domcontentloaded")
    expect(page.locator("#activityTableBody")).to_contain_text("达标用户")
    expect(page.locator("#activityTableBody")).to_contain_text("删除")
    page.locator("#activityTableBody .link-num").first.click()
    expect(page.locator("#listDrawerTitle")).to_contain_text("参与详情")
    expect(page.locator("#listDrawerHead")).to_contain_text("作品数")
    expect(page.locator("#listDrawerBody")).to_contain_text("U1001")
    page.locator("#listDrawer .drawer-close").click()
    page.locator("#activityTableBody button", has_text="达标用户").first.click()
    expect(page.locator("#listDrawerTitle")).to_contain_text("达标用户")
    expect(page.locator("#listDrawerHead")).to_contain_text("达标锚定数据")
    expect(page.locator("#listDrawerHead")).to_contain_text("奖励计算")
    expect(page.locator("#listDrawerBody")).to_contain_text("命中第1档")
    page.locator("#listDrawer .drawer-close").click()
    before = page.locator("#activityTableBody tr").count()
    page.once("dialog", lambda dialog: dialog.accept())
    page.locator("#activityTableBody button", has_text="删除").first.click()
    expect(page.locator("#activityTableBody tr")).to_have_count(before - 1)


def test_admin_cover_cases_and_signup_flow(page, demo_server):
    page.goto(f"{demo_server}/fr-activity-center.html?tab=admin", wait_until="domcontentloaded")
    page.locator("#activityTableBody button", has_text="编辑").first.click()
    expect(page.locator("#activityEditor")).to_have_class("editor-page open")
    expect(page.locator("#actCover")).to_be_visible()
    expect(page.locator("#previewTabs")).to_contain_text("介绍")
    expect(page.locator("#previewTabs")).to_contain_text("案例")
    expect(page.locator("#previewTabs")).to_contain_text("榜单")
    expect(page.locator("#previewPane")).to_contain_text("3天学会选赛道")
    page.locator('#previewTabs button[data-ptab="cases"]').click()
    expect(page.locator("#previewPane")).to_contain_text("培训现场")
    expect(page.locator('.detail-tabs button[data-dtab="board"]')).to_contain_text("榜单")
    page.locator('.detail-tabs button[data-dtab="board"]').click()
    expect(page.locator("#actBoardGroup")).to_contain_text("开启")
    expect(page.locator("#actBoardLimitWrap")).to_be_visible()
    expect(page.locator("#actBoardLimitWrap")).to_contain_text("前")
    expect(page.locator("#actBoardLineDesc")).to_have_value("短剧推广")
    expect(page.locator("#actBoardPeriodDesc")).to_have_value("7日收益")
    top_box = page.locator("#actBoardLimit").bounding_box()
    line_box = page.locator("#actBoardLineDesc").bounding_box()
    assert top_box and line_box and abs(top_box["y"] - line_box["y"]) < 8
    expect(page.locator("#previewPane")).to_contain_text("TOP 1")
    expect(page.locator("#previewPane")).to_contain_text("****山")
    expect(page.locator("#previewPane")).to_contain_text("99999.99元")
    expect(page.locator("#previewPane")).not_to_contain_text("右豹KOC")
    expect(page.locator(".board-row")).to_have_count(10)
    expect(page.locator("#actDescription")).to_be_visible()
    expect(page.locator("#actDescription")).to_have_value("3天学会选赛道·做项目")
    expect(page.locator("#actTagChips")).to_contain_text("公益")
    expect(page.locator("#actTagChips")).not_to_have_text("3天学会选赛道·做项目")
    expect(page.locator("#awardSlotSample")).to_have_count(0)
    expect(page.locator("#dtab-board")).not_to_contain_text("恭喜获奖")
    expect(page.locator("#dtab-board .pv-award")).to_have_count(0)
    page.locator('.detail-tabs button[data-dtab="cases"]').click()
    expect(page.locator("#caseList")).to_contain_text("案例名称")
    expect(page.locator("#caseList")).to_contain_text("案例组成")
    expect(page.locator("[data-case-del]")).to_have_count(2)
    case_a = page.locator(".case-item").nth(0).bounding_box()
    case_b = page.locator(".case-item").nth(1).bounding_box()
    assert case_a and case_b and abs(case_a["y"] - case_b["y"]) < 4
    page.locator('[data-case-del="1"]').click()
    expect(page.locator(".case-item")).to_have_count(1)
    expect(page.locator("#previewTabs")).to_contain_text("案例")
    page.locator('#editorStepNav button[data-estep="2"]').click()
    expect(page.locator("#editorStepNav")).to_contain_text("活动规则")
    expect(page.locator('#editorStepNav button[data-estep="3"]')).to_have_count(0)
    expect(page.locator(".sec-jump")).to_contain_text("是否需要领取按钮")
    expect(page.locator(".sec-reward")).to_contain_text("显示用户获奖/未获奖信息")
    expect(page.locator(".sec-jump")).to_have_css("background-color", "rgb(255, 255, 255)")
    expect(page.locator(".sec-reward")).to_have_css("background-color", "rgb(255, 255, 255)")
    expect(page.locator("#actShowUserAward")).to_be_checked()
    expect(page.locator("#previewBody .pv-award")).to_contain_text("恭喜获奖")
    page.locator("#actShowUserAward").uncheck()
    expect(page.locator("#previewBody .pv-award")).to_have_count(0)
    page.locator("#actShowUserAward").check()
    expect(page.locator("#actNeedClaim")).to_be_checked()
    expect(page.locator("#claimList")).to_contain_text("按钮文案")
    expect(page.locator("#claimList")).to_contain_text("是否需要跳转")
    expect(page.locator('[data-claim-i="0"] [data-cf="url"]')).to_be_visible()
    expect(page.locator('[data-claim-i="1"] [data-cf="clicked"]')).to_be_visible()
    page.locator('[data-claim-i="0"] [data-cf="jump"]').select_option("0")
    expect(page.locator('[data-claim-i="0"] [data-cf="clicked"]')).to_be_visible()
    page.locator("#actNeedClaim").uncheck()
    expect(page.locator("#claimList")).to_be_hidden()
    expect(page.locator("#previewCta")).to_be_hidden()
    page.locator("#actNeedClaim").check()
    expect(page.locator("#claimList")).to_be_visible()
    expect(page.locator(".sec-reward .panel-title-row")).to_contain_text("添加规则")
    expect(page.locator("#addRewardRule")).to_be_visible()
    expect(page.locator("#rewardRuleList")).to_contain_text("播放奖")
    expect(page.locator("[data-rule-brand] [data-brand-trigger]")).to_contain_text("番茄小说")
    expect(page.locator("[data-rule-biz] [data-biz-trigger]")).to_contain_text("商单")
    expect(page.locator("#rewardRuleList")).not_to_contain_text("排除项目")
    expect(page.locator("#rewardRuleList")).not_to_contain_text("参与项目")
    page.locator("[data-rule-brand] [data-brand-trigger]").click()
    expect(page.locator("[data-brand-search]")).to_be_visible()
    expect(page.locator("#ruleBrand-2 .ms-options label").filter(has_text="番茄小说")).to_be_visible()
    expect(page.locator("#ruleBrand-2 .ms-options label").filter(has_text="知乎故事")).to_be_visible()
    expect(page.locator("#ruleBrand-2 .ms-options label").filter(has_text="红果漫剧APP")).to_be_visible()
    page.locator("[data-brand-search]").fill("番茄")
    expect(page.locator("#ruleBrand-2 .ms-options label").filter(has_text="番茄小说")).to_be_visible()
    expect(page.locator("#ruleBrand-2 .ms-options label").filter(has_text="知乎故事")).to_be_hidden()
    page.locator("[data-brand-search]").fill("")
    page.locator("[data-rule-biz] [data-biz-trigger]").click()
    expect(page.locator("#ruleBiz-2 .ms-options label").filter(has_text="商单")).to_be_visible()
    expect(page.locator("#ruleBiz-2 .ms-options label").filter(has_text="快手星火")).to_be_visible()
    expect(page.locator('[data-rf="playsFrom"]').first).to_have_attribute("placeholder", "x")
    expect(page.locator("[data-add-play]")).to_contain_text("添加阶梯")
    expect(page.locator("[data-ladder-del]")).to_have_count(2)
    expect(page.locator("#rewardRuleList")).to_contain_text("阶梯一")
    expect(page.locator("#rewardRuleList")).to_contain_text("奖品类型")
    expect(page.locator('[data-rf="prizeKind"]').first).to_have_value("cash")
    play_row = page.locator(".rule-item").nth(0).locator(".ladder-row").first
    play_from = play_row.locator('[data-rf="playsFrom"]').bounding_box()
    play_kind = play_row.locator('[data-rf="prizeKind"]').bounding_box()
    assert play_from and play_kind
    assert abs(play_from["y"] - play_kind["y"]) < 3
    expect(page.locator('[data-rf="rankFrom"]').first).to_have_attribute("placeholder", "x")
    expect(page.locator("[data-add-rank]")).to_contain_text("添加阶梯")
    expect(page.locator("[data-rank-del]")).to_have_count(2)
    expect(page.locator("#rewardRuleList")).to_contain_text("阶梯1")
    rank_row = page.locator("[data-rule-brand] .ladder-row").first
    rank_from = rank_row.locator('[data-rf="rankFrom"]').bounding_box()
    rank_kind = rank_row.locator('[data-rf="prizeKind"]').bounding_box()
    assert rank_from and rank_kind
    assert abs(rank_from["y"] - rank_kind["y"]) < 3
    page.locator("#addRewardRule").click()
    expect(page.locator(".rule-item")).to_have_count(4)


def test_admin_preview_defaults_to_intro_without_cases(page, demo_server):
    page.goto(f"{demo_server}/fr-activity-center.html?tab=admin&editor=ACT-003", wait_until="domcontentloaded")
    expect(page.locator("#activityEditor")).to_have_class("editor-page open")
    expect(page.locator("#previewTabs")).to_be_hidden()
    expect(page.locator("#previewPane")).to_contain_text("实操带练")
    expect(page.locator("#previewPane")).not_to_contain_text("案例图")


def test_detail_cases_named_and_claim_cta(page, demo_server):
    page.goto(f"{demo_server}/activity-center-demo.html", wait_until="domcontentloaded")
    page.locator("#pinnedBanner .btn-banner").click()
    expect(page.locator("#detailCta")).to_contain_text("立即领取")
    page.locator('#detailTabs button[data-tab="cases"]').click()
    expect(page.locator("#detailBody")).to_contain_text("培训现场")
    expect(page.locator("#detailBody")).to_contain_text("直播回放")
    case_a = page.locator(".case-block").nth(0).bounding_box()
    case_b = page.locator(".case-block").nth(1).bounding_box()
    assert case_a and case_b and case_b["y"] > case_a["y"] + case_a["height"] - 2
    expect(page.locator("#detailBody video")).to_have_attribute("src", "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4")
    expect(page.locator("#detailCta")).to_be_hidden()
    page.locator("#detailBody .case-media img").first.click()
    expect(page.locator("#caseLightbox")).to_be_visible()
    page.locator("#caseLightbox").click()
    expect(page.locator("#caseLightbox")).to_be_hidden()
    page.locator('#detailTabs button[data-tab="intro"]').click()
    expect(page.locator("#detailCta")).to_contain_text("加入社群")
    page.locator("#detailCta button", has_text="立即领取").click()
    expect(page.locator("#detailCta")).to_contain_text("已领取")
    expect(page.locator("#toast")).to_contain_text("已记入已参与")
    page.locator("#detailBack").click()
    page.locator('#filterTabs button[data-filter="participated"]').click()
    expect(page.locator("#activityList")).to_contain_text("3天右豹生态公益培训营")


def test_leaderboard_hidden_when_off(page, demo_server):
    page.goto(
        f"{demo_server}/activity-center-demo.html?screen=detail&id=a6",
        wait_until="domcontentloaded",
    )
    expect(page.locator('#detailTabs button[data-tab="board"]')).to_have_count(0)
    expect(page.locator(".board-row")).to_have_count(0)


def test_leaderboard_tab_format(page, demo_server):
    page.goto(
        f"{demo_server}/activity-center-demo.html?screen=detail&id=pinned",
        wait_until="domcontentloaded",
    )
    page.locator('#detailTabs button[data-tab="board"]').click()
    expect(page.locator("#detailTabs button")).to_have_count(3)
    expect(page.locator("#detailAward")).to_contain_text("恭喜获奖")
    expect(page.locator("#detailCta")).to_be_hidden()
    expect(page.locator("#detailBody")).to_contain_text("TOP 1")
    expect(page.locator("#detailBody")).to_contain_text("****山")
    expect(page.locator("#detailBody")).to_contain_text("99999.99元")
    expect(page.locator("#detailBody")).to_contain_text("短剧推广")
    expect(page.locator("#detailBody")).not_to_contain_text("右豹KOC")
    expect(page.locator("#detailBody")).not_to_contain_text("别暴躁别暴躁")
    expect(page.locator("#boardMe")).to_contain_text("****躁")
    expect(page.locator("#boardMe")).to_contain_text("排名·999+")
    expect(page.locator("#boardMe")).to_contain_text("7日收益")
    expect(page.locator(".board-row")).to_have_count(10)
    expect(page.locator(".board-rank")).to_have_count(10)
    expect(page.locator(".board-metric").first).to_have_css("color", "rgb(156, 163, 175)")
    expect(page.locator(".board-period").first).to_have_css("color", "rgb(156, 163, 175)")
    row0 = page.locator(".board-row").first
    av = row0.locator(".board-av-wrap").bounding_box()
    nick = row0.locator(".board-nick").bounding_box()
    val = row0.locator(".board-val").bounding_box()
    assert av and nick and val
    av_cy = av["y"] + av["height"] / 2
    assert abs((nick["y"] + nick["height"] / 2) - av_cy) < 6
    assert abs((val["y"] + val["height"] / 2) - av_cy) < 6
    box3 = page.locator(".board-row").nth(2).locator(".board-rank").bounding_box()
    box4 = page.locator(".board-row").nth(3).locator(".board-rank").bounding_box()
    assert box3 and box4 and abs(box3["x"] - box4["x"]) < 2
    expect(page.locator(".board-podium")).to_have_count(0)
    expect(page.locator(".detail-card")).to_be_visible()
    expect(page.locator(".detail-main")).to_be_visible()


def test_detail_intro_only_hides_tabs(page, demo_server):
    page.goto(
        f"{demo_server}/activity-center-demo.html?screen=detail&id=a3",
        wait_until="domcontentloaded",
    )
    expect(page.locator("#detailTabs")).to_be_hidden()
    expect(page.locator("#detailBody")).to_contain_text("实操带练")
    expect(page.locator("#detailAward")).to_be_hidden()


def test_detail_not_won_award_slot(page, demo_server):
    page.goto(
        f"{demo_server}/activity-center-demo.html?screen=detail&id=a8",
        wait_until="domcontentloaded",
    )
    expect(page.locator("#detailAward")).to_contain_text("未获奖")
    expect(page.locator('#detailTabs button[data-tab="board"]')).to_be_visible()


def test_list_description_is_not_tags_and_award_follows_switch(page, demo_server):
    page.goto(f"{demo_server}/activity-center-demo.html", wait_until="domcontentloaded")
    expect(page.locator('.activity-card[data-id="a2"] .card-subtitle')).to_contain_text("从选书到发布")
    expect(page.locator('.activity-card[data-id="a2"] .card-subtitle')).not_to_contain_text("培训")
    page.goto(
        f"{demo_server}/activity-center-demo.html?screen=detail&id=a2",
        wait_until="domcontentloaded",
    )
    expect(page.locator("#detailHead")).to_contain_text("培训")
    expect(page.locator("#detailAward")).to_be_hidden()


def test_fe_scene_fullscreen_preview_and_claim_scenes(page, demo_server):
    page.goto(f"{demo_server}/fr-activity-center.html?tab=fe", wait_until="domcontentloaded")
    expect(page.locator("#feDemo .btn-preview")).to_contain_text("全屏预览")
    expect(page.locator("#fe-scene .scene-list")).to_contain_text("列表 · 全部")
    expect(page.locator("#fe-scene .scene-list")).to_contain_text("详情 · 三 Tab 已获奖")
    expect(page.locator("#fe-scene .scene-list")).not_to_contain_text("筛选 · 进行中")
    expect(page.locator("#fe-scene .scene-list")).not_to_contain_text("详情 · 仅介绍")
    expect(page.locator("#fe-scene .scene-list")).not_to_contain_text("详情 · 未获奖")
    expect(page.locator("#sceneRulesList")).to_contain_text("在右侧 Demo 内点切换")
    expect(page.locator("#sceneRulesList")).to_contain_text("整张列表卡片可点")
    expect(page.locator("#sceneRulesList")).to_contain_text("浏览量")
    expect(page.locator("#sceneRulesList")).to_contain_text("数值越大越靠前")
    expect(page.locator("#sceneRulesList")).to_contain_text("没有「待开始」筛选")
    expect(page.locator("#sceneRulesList")).to_contain_text("深链打开隐藏活动")
    expect(page.locator("#sceneRulesList")).to_contain_text("列表卡片不打")
    page.locator('#fe-scene .scene-btn[data-scene="detail-camp"]').click()
    expect(page.locator("#sceneRulesDetail")).to_be_visible()
    expect(page.locator("#sceneRulesDetail")).to_contain_text("三 Tab 显示规则")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("按钮点击规则")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("奖品显示规则")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("未获奖，再接再厉")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("leaderboardLineDesc")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("leaderboardPeriodDesc")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("后台第 1 步")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("闭合边界")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("fe-be-contract.md")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("无介绍 Tab")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("客户端成功调起")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("不绑榜单开关")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("第一条命中即停")
    expect(page.locator("#sceneRulesDetail")).to_contain_text("置顶冲突拒绝保存")
    expect(page.locator("#sceneRulesList")).to_be_hidden()
    page.locator(".page-tab-bar button[data-page='view-data']").click()
    page.locator('#view-data [data-ix="ix-e2e"]').click()
    expect(page.locator("#ix-e2e")).to_be_visible()
    expect(page.locator("#ix-e2e")).to_contain_text("点查看进详情")
    expect(page.locator("#ix-e2e")).to_contain_text("写已参与")
    expect(page.locator("#ix-e2e")).to_contain_text("隐藏深链")
    expect(page.locator("#ix-e2e")).to_contain_text("无介绍无 CTA")
    expect(page.locator("#ix-e2e")).to_contain_text("展位不绑榜单")
    page.locator('#view-data [data-ix="ix-fe"]').click()
    expect(page.locator("#ix-fe")).to_contain_text("活动榜单")
    expect(page.locator("#ix-fe")).to_contain_text("fe-be-contract.md")


def test_hidden_activity_detail_stays_on_list(page, demo_server):
    page.goto(
        f"{demo_server}/activity-center-demo.html?screen=detail&id=a5",
        wait_until="domcontentloaded",
    )
    expect(page.locator("#screen-activity-center")).to_have_class("screen active")
    expect(page.locator("#screen-detail.active")).to_have_count(0)
