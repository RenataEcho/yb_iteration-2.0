# Test Automation Summary

**项目**：YBDD2.0  
**功能**：FR-010 代理认证  
**日期**：2026-09-07  
**框架**：pytest 9 + Playwright Python（pytest-playwright）  
**入口**：`demo/iteration/fr-agent-cert.html`

本 Demo 无真实后端接口，故不生成 API 测试。E2E 对着静态管理后台页面，覆盖主路径与关键错误。

## Generated Tests

### API Tests

- [ ] 不适用 — 页面为前端 Demo，无真实 HTTP API / 持久化

### E2E Tests

- [x] `tests/e2e/test_agent_cert.py` — 代理认证管理后台工作流
- [x] Demo 页「代理认证 → QA用例」Tab（业务流程旁）列出上述 10 条并对齐流程节点
  - `test_list_shows_seed_rows_and_stats` — 列表种子数据、聚合列、表头统计
  - `test_filter_by_account_and_status` — 代理帐号模糊筛选 + 审核状态筛选
  - `test_reset_clears_inputs_without_requery` — 重置清空条件且不自动查询
  - `test_empty_filter_shows_empty_state` — 无匹配结果空态
  - `test_view_license_and_contract` — 营业执照 / 盖章合同预览
  - `test_approve_pending_record` — 待审核通过后写审核时间、操作变为「已审核」
  - `test_reject_requires_reason_then_succeeds` — 空原因阻断 + 填写后驳回成功
  - `test_reviewed_rows_have_no_review_actions` — 已通过 / 已驳回不再提供审核操作
  - `test_reject_overlay_mask_does_not_close` — 驳回遮罩点击不关闭（防丢失原因）
  - `test_flow_tab_and_rules_drawer` — 业务流程节点 + 需求规则抽屉

## Coverage

- API endpoints：0/0（无真实接口）
- UI 功能（代理认证）：10/10 核心路径已覆盖
  - 已覆盖：列表展示、筛选、重置、空态、执照/合同预览、通过、驳回校验、已审核操作态、危险弹窗遮罩、流程/规则
  - 未覆盖（本轮范围外）：代理提现、代理价格、代理通知；代理端填写页（规则写明本轮不交付）

## How to run

```bash
# 使用本机 Playwright 浏览器缓存（不要覆盖 PLAYWRIGHT_BROWSERS_PATH）
unset PLAYWRIGHT_BROWSERS_PATH
python3 -m pytest tests/e2e/test_agent_cert.py --browser chromium
```

本次执行结果：`10 passed`。

## Next Steps

- 接入 CI 时安装 `pytest`、`pytest-playwright`，并执行 `playwright install chromium`
- 若需要提现 / 价格 / 通知的同等覆盖，按同一夹具继续补 `tests/e2e/test_agent_*.py`
- 需要风险分级、质量门禁或更完整覆盖分析时，可安装 [Test Architect (TEA)](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)
