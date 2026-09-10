---
title: 'FR-014 免费次数拆工作日/节假日'
type: 'feature'
created: '2026-09-10'
status: 'in-review'
review_loop_iteration: 0
baseline_commit: '802405c68a211981df8a591b8f4bf9813c62d6c0'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 次数商品页只有一个「免费次数」，无法按工作日 / 节假日给不同额度。

**Approach:** 改成平台级两个配置：工作日免费次数、节假日免费次数。C 端当日免费剩余按当天类型取对应值；领取仍先扣免费再扣已购。

## Boundaries & Constraints

**Always:**
- 两字段均须 ≥ 0 的数字；挂次数商品页头，不另开菜单。
- 节假日 = 周六日 ∪ 2026 国务院放假日 − 调休上班日；其余为工作日。
- 跨本地自然日把 `user.free` 重置为当日配置；`bought` 不重置。
- 保存「今日类型」对应字段后，当前演示用户 `user.free` 立刻改成该值（与现「保存即生效」一致）。
- 剩余次数仍 = 当日免费剩余 + 已购剩余。门禁顺序、先免费后已购、超时不退次不变。
- 种子工作日=1、节假日=1，工作日演示剩余仍为 3。不 bump `VER`，用 `syncFlags` 回填。

**Ask First:**
- 改放假日历来源（接真接口、改年份、不用国务院口径）。
- bump `VER` / 改 `fr014-yjd-v6`。

**Never:**
- 不改已购、SKU 原价划线、在售 4 档。
- 不新开后台菜单。不改 FR-001 / 002 / 012 / 013 文件。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 工作日保存 | 今日工作日，工作日=4，节假日=0 | `freeQuota` 写入；`user.free=4`；C 端剩余 4+2=6 | 任一字段非数字或 &lt;0 → toast，不写 |
| 节假日不误伤工作日 | 今日工作日，只改节假日=9 | 配置更新；`user.free` 保持当日工作日值 | N/A |
| 跨日重置 | `freeDate` 非今日，今日节假日，holiday=5 | `user.free=5`，`freeDate=今日`；bought 不变 | N/A |
| 节假日领取 | 国庆 2026-10-01，holiday=2，free=2 | 领 1 次后 free=1；剩余含 bought | 次数=0 仍开兑换、不开选词 |
| 调休上班 | 2026-10-10（周六但调休） | 按工作日取 weekday | N/A |
| 旧缓存 | 无 `freeQuota` 的 v6 包 | 回填 weekday=1、holiday=1，不整包重种 | N/A |

</frozen-after-approval>

## Code Map

- `demo/iteration/yijian-daifa-store.js:3` `KEY/VER` — 保持 `fr014-yjd-v6` / `6`
- `demo/iteration/yijian-daifa-store.js:82` `seed().user` — 现 `free:1`；新增 `freeQuota`、`user.freeDate`
- `demo/iteration/yijian-daifa-store.js:422` `syncFlags` — 回填 `freeQuota`；按日刷新 `user.free`
- `demo/iteration/yijian-daifa-store.js:820` `YJD` — 导出 `dayType` / `todayFree` / `applyFreeDay`
- `demo/iteration/fr-opc-yijian-daifa.html:1524` `#freeQuota` — 拆成两输入 + 今日类型只读
- `demo/iteration/fr-opc-yijian-daifa.html:3214` `saveFreeQuota` — 写双字段；仅今日类型改 `user.free`
- `demo/iteration/yijian-daifa-demo.html:924` `quota()` / `:1817` 扣次 — 只读 `state.free`，日切由 store 处理
- `demo/iteration/yijian-daifa-rules.js:696` `admin-skus`；`:104` 剩余次数；`:795` `user` 契约
- `_bmad-output/specs/spec-fr014-yijian-daifa/{requirements,glossary,surfaces,flows,SPEC}.md` — FR-014-13/26、CAP-6
- `tests/e2e/test_yijian_daifa.py:47` 剩余 `"3"`；`:125` SKU 后台；`:1013` `free=0`

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/yijian-daifa-store.js` -- 加 `freeQuota`、2026 放假/调休日、`dayType`/`todayFree`/`applyFreeDay`，`syncFlags` 回填并跨日重置 -- 单一日类型源
- [x] `demo/iteration/fr-opc-yijian-daifa.html` -- 页头两字段+今日类型；保存/回填；流程语文案 -- 配置落点
- [x] `demo/iteration/yijian-daifa-demo.html` -- 打开时走 `applyFreeDay`；扣次语义不变 -- C 端按日生效
- [x] `demo/iteration/yijian-daifa-rules.js` -- 次数商品/剩余次数/user 契约改双字段 -- 规则对齐
- [x] `_bmad-output/specs/spec-fr014-yijian-daifa/{requirements,glossary,surfaces,flows,SPEC}.md` -- FR-014-13/26 与 CAP-6 改双配置 -- 合同对齐
- [x] `tests/e2e/test_yijian_daifa.py` -- 工作日保存透传；节假日日（10-01）取 holiday；非法值不写 -- 覆盖矩阵

**Acceptance Criteria:**
- Given 工作日且 weekday=1，when 打开详情，then 剩余次数仍为 3
- Given 今日工作日，when 保存节假日=9，then C 端剩余不因节假日字段变
- Given 2026-10-01，when holiday=2，then 免费按 2 发放并可先扣免费

## Spec Change Log

- 2026-09-10 实现双字段免费次数：`freeQuota.weekday/holiday` + 2026 放假/调休日历；C 端按日取额、跨日重置；e2e 覆盖矩阵。

## Design Notes

日类型只看本地 `YYYY-MM-DD`。2026 放假：`01-01…01-03`、`02-15…02-23`、`04-04…04-06`、`05-01…05-05`、`06-19…06-21`、`10-01…10-08`。调休上班（工作日）：`01-04`、`02-14`、`02-28`、`05-09`、`09-20`、`10-10`。

```js
function dayType(d) {
  var key = ymd(d);
  if (MAKEUP[key]) return 'weekday';
  if (HOLIDAY[key]) return 'holiday';
  var w = d.getDay();
  return (w === 0 || w === 6) ? 'holiday' : 'weekday';
}
```

e2e 节假日用 Playwright `page.clock` 钉在 `2026-10-01T12:00:00+08:00`，勿 bump VER。

## Verification

**Commands:**
- `python3 -m pytest tests/e2e/test_yijian_daifa.py -k "sku or quota or buy or feed_hides" -q` -- 工作日旧断言仍绿；新增双字段用例绿

**Manual checks:**
- 后台次数商品页头两输入 +「今日按：工作日/节假日」；保存 weekday 后 embed 详情剩余立刻变
- 把系统日想成周六时，剩余跟节假日字段走
