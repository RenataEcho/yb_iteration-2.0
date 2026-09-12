---
title: 'FR-014 一键代发：封面 / Banner / 招募 / 领取进详情'
type: 'feature'
created: '2026-09-09'
status: 'done'
baseline_commit: '9d8682202e3e9476a3fc11c10aa5ac6174a7c075'
review_loop_iteration: 0
context:
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
  - '{project-root}/_bmad-output/specs/spec-fr014-yijian-daifa/SPEC.md'
  - '{project-root}/_bmad-output/specs/spec-fr014-yijian-daifa/surfaces.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 封面是纯色块；广场 BN 只有一条静态招募条；海报缺招募感；领取记录进不了稿件详情。

**Approach:** 封面改本地真实风格图；BN 最多 5 条自动幻灯片；招募做成有氛围的海报详情；领取记录可进同一套稿件详情。

## Boundaries & Constraints

**Always:**
- 只改 FR-014 Demo / 规则 / 本增量伴生 SPEC。不改 FR-001/002/012/013。
- 封面必须是图，禁止 `.art.v0–v4` 纯色块。题材含小说、漫画、视频封面；本地相对路径，可离线。
- BN 可配 0–5 条。≥2 条自动轮播（指示点+循环）；1 条不轮播；0 条隐藏。点招募帧进海报详情。
- 海报有招募氛围（卖点 / 适合谁 / 底部客服二维码）。无站内申请表。
- C 端「我的领取」点卡片信息区（不含灰底三按钮）进该 `mid` 详情，底栏为已领取。后台领取记录加「稿件详情」抽屉。
- C 端橙色；Mockup 只 iframe；无真实接口。版本 `v2 当前`。

**Ask First:** BN 强制含招募；或整卡（含操作条）点击进详情。

**Never:** 不改门禁/占用/次数/24h/黑名单；列表不展示金额；不用 Mermaid；不改 Sidebar。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 真实封面 | 广场 / 详情 / 已领 | 封面是图片，题材含小说/漫画/视频 | 加载失败用书名底图，不回 `.art.v*` |
| BN 轮播 | 后台 5 条启用 | 5 帧自动切，指示点可跳 | 不可第 6 条 |
| BN 招募 | 点招募帧 | 海报详情：卖点 + 底部二维码 | 无申请表 |
| BN 1/0 | 1 或 0 条 | 1 条静止；0 条不渲染 | N/A |
| 领取进详情 | 点封面/标题区 | 稿件详情 + 已领底栏 | 灰底三按钮不跳详情 |
| 后台详情 | 点「稿件详情」 | Drawer 出示稿件字段 | 原「详情」仍看回填 |

</frozen-after-approval>

## Code Map

- `demo/iteration/yijian-daifa-demo.html` — `ITEMS[].cover` + `.art.v0–v4`（117–121、539–544、661、838）；`#recruitBanner` 静态一条（366、1055）；`#screen-poster`（455–468）；`renderClaims` 无进详情（823–866）。轮播后锚 `#plazaBanner`，招募帧 `data-bn="recruit"`。
- `demo/iteration/fr-opc-yijian-daifa.html` — 规则「招募 Banner」单数（516）；无 BN 表；领取「详情」只出回填（675–685）；`v1`（214、499）；iframe `v=5`（779）。
- `tests/e2e/test_yijian_daifa.py` — 断言 `#recruitBanner`；未测进详情。
- `_bmad-output/specs/spec-fr014-yijian-daifa/{SPEC,surfaces}.md` — 同步 BN≤5 与领取进详情，不推翻门禁。
- `demo/iteration/assets/fr014/` — 新建本地封面/BN 图。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/assets/fr014/` -- 本地小说/漫画/视频封面与 BN 图
- [x] `demo/iteration/yijian-daifa-demo.html` -- 真封面、BN 幻灯片、海报重设计、领取卡进详情
- [x] `demo/iteration/fr-opc-yijian-daifa.html` -- v2、Admin BN≤5、领取「稿件详情」、规则同步
- [x] `_bmad-output/specs/spec-fr014-yijian-daifa/{SPEC,surfaces}.md` -- 同步增量
- [x] `tests/e2e/test_yijian_daifa.py` -- 封面、轮播、海报、领取进详情、BN 上限

**Acceptance Criteria:**
- Given 广场，when 看宫格与详情，then 封面是图且含小说/漫画/视频题材。
- Given 5 条 BN，when 停广场，then 自动轮播；点招募进海报且无申请表。
- Given 后台已 5 条 BN，when 再新增，then 拦截并提示最多 5 条。
- Given 我的领取有记录，when 点信息区，then 进对应详情且为已领底栏；「立即回填」仍只去回填页。
- Given 后台领取记录，when 点「稿件详情」，then Drawer 展示稿件字段。

## Spec Change Log

## Design Notes

```js
{ id: 'B-01', title: '剪辑手招募', kind: 'recruit', on: true, img: 'assets/fr014/bn-recruit.jpg' }
```

`kind === 'recruit'` → `setScreen('poster')`。海报主文走招募，不要把「无站内申请表」当标题。封面字段 `cover: 'assets/fr014/cover-m01.jpg'`，渲染 `<img class="cover-img">`。

## Verification

**Commands:**
- `python3 -m pytest tests/e2e/test_yijian_daifa.py -q` -- 全部通过

## Suggested Review Order

**封面与广场**

- 稿件改为本地小说/漫画/视频封面图
  [`yijian-daifa-demo.html:644`](../../demo/iteration/yijian-daifa-demo.html#L644)

- 统一渲染 `<img>`，失败用书名底图
  [`yijian-daifa-demo.html:693`](../../demo/iteration/yijian-daifa-demo.html#L693)

**广场 Banner**

- 最多 5 条 mock，招募帧进海报
  [`yijian-daifa-demo.html:636`](../../demo/iteration/yijian-daifa-demo.html#L636)

- 0 隐藏、1 静止、≥2 轮播+指示点
  [`yijian-daifa-demo.html:713`](../../demo/iteration/yijian-daifa-demo.html#L713)

- 后台满 5 条拦截新增
  [`fr-opc-yijian-daifa.html:763`](../../demo/iteration/fr-opc-yijian-daifa.html#L763)

**招募海报**

- 招募氛围：卖点、岗位、底部客服码
  [`yijian-daifa-demo.html:531`](../../demo/iteration/yijian-daifa-demo.html#L531)

**领取进详情**

- 信息区进详情，返回回领取页
  [`yijian-daifa-demo.html:862`](../../demo/iteration/yijian-daifa-demo.html#L862)

- 卡片信息区绑定，灰底按钮不跳
  [`yijian-daifa-demo.html:1039`](../../demo/iteration/yijian-daifa-demo.html#L1039)

- 后台领取记录打开稿件字段
  [`fr-opc-yijian-daifa.html:736`](../../demo/iteration/fr-opc-yijian-daifa.html#L736)

**领取门禁（未改口径）**

- 次数足够后浮层选词，再 loading 三态
  [`yijian-daifa-demo.html:1111`](../../demo/iteration/yijian-daifa-demo.html#L1111)

**测试**

- 封面、轮播、海报、领取进详情
  [`test_yijian_daifa.py:116`](../../tests/e2e/test_yijian_daifa.py#L116)

- 后台 BN 上限与稿件详情
  [`test_yijian_daifa.py:189`](../../tests/e2e/test_yijian_daifa.py#L189)
