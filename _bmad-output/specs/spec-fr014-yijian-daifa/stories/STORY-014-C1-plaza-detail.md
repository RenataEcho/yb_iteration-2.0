---
title: 'STORY-014-C1 广场宫格 + 详情铺陈'
status: 'ready'
slice: 'C1'
---

# STORY-014-C1 · 广场宫格 + 详情铺陈

**闭环：** Demo · `YJD.KEY`=`fr014-yjd-v6`（store L3）· `VER=6` 不 bump · 禁止 fetch  
**端 / 切片：** 只改 C 端 C1。节点：作品广场宫格 + 项目直选；详情铺满素材 · 发起领取。

## 粘贴开工（新会话只贴这一节，不要贴 FR/合同/下文全文）

你只做 C1。打开本文件 §4/§6，再打开 `impl-prompts.md` L50–L51、`requirements.md` FR-014-08 / 09 / 10（只对号）。按 §6 红→绿。禁止另写规则，禁止改范围外文件，不 `fetch`，不 bump `VER`。

## 1. 角色

C 端 C1：宫格张数角标 + 筛选空态补测 + 详情「剪辑师」label。预览/Banner/换区已有，只钉缺口。

## 2. 指向

WHAT：FR-014-08 / 09 / 10。合同：`impl-prompts.md` L50、L51（js `c.steps` L25、L26）。判定/写/回/文案只读合同行。

## 3. Always / Never / Ask First

**Always**
- 先 `YJD.plazaEligible` 再筛。图集宫格 `.media-badge`=`imgs` 张；视频无「张」。`#feedList` 无金额/分成/积分。
- 详情 label「剪辑师」=`it.editor`。预览/试看/提词不 `persistFe`。`#goClaim` 走已有 `startClaim`，门禁顺序不改。
- 复用 §九已有 class。e2e 只追加。跨页 `embed=1`。

**Never**
- 不重做 C3，不改 `startClaim` / `confirmBuy` / `finishClaim`。不写回填/超时/水印/抖音。
- 不改 `requirements.md` / 节点表 / `yijian-daifa-impl-prompts.js` 的 `c.steps`。不 bump `VER`。

**Ask First**
- 必须改 seed / bump `VER` 才问。张数读已有 `imgs`。

## 4. Code Map（只列本刀改/钉的函数）

| 文件 | 锚点 | 行号 | 本切片 |
|------|------|------|--------|
| `yijian-daifa-demo.html` | `renderFeed` | L1087–1106 | 图集补 `.media-badge`；视频不渲染张数 |
| 同上 | `renderDetail` | L1126–1184 | label「稿件作者」→「剪辑师」 |
| 同上 | `visibleItems` / `#feedSearch` / `renderFilters` | L1016–1027 / L2106–2109 / L1071–1086 | 保持先资格再筛；不重写公式 |
| 同上 | `openAlbumPreview` / `startVideoPreview` | L1228–1235 / L1188–1208 | 不改逻辑；e2e 补不扣次 + 5s |
| `yijian-daifa-store.js` | `plazaEligible` / `KEY` | L741–750 / L3 | 只读；不 bump |
| `test_yijian_daifa.py` | feed / preview / banner | L8 / L518 / L577 | 已有，只追加 |

其余函数打开文件看，不要在会话里复述。

## 5. 接口 I/O（Demo）

只调 `YJD.plazaEligible` / `enabledProjects` / `enabledMats` / `tipText` 与页内渲染。本刀不写 store。拟接口不实现：`GET /feed|projects|works/:id|preview`。

## 6. Tasks（红 → 绿）

- [ ] RED：`#feedList` 无「分成」「积分」；掌心宠 `.media-badge`=`12 张`；末世囤货无「张」
- [ ] RED：搜索无命中 → `.empty`「没有可领取的稿件」；项目「红果短剧」、类型「视频」筛对
- [ ] RED：开预览前后次数不变；`#playVideo` 约 5s `#vEnd.show`，`#previewMask` 不开
- [ ] GREEN：`renderFeed` 张数角标；`renderDetail` label；不改领取/水印
- [ ] 旧 e2e 全绿后再留新断言

## 7. I/O 矩阵（仅缺口）

| Given | When | Then | Error |
|-------|------|------|-------|
| 图集 `imgs=12` / 视频 | 渲染宫格 | 图集「12 张」；视频无「张」 | 封面是 `img` |
| 搜索无命中 / 项目或类型筛 | 操作筛选 | 空态或只留命中 | 不写 store |
| 图集预览 / 视频试看 | 打开 | 次数不变；5s `#vEnd` | 预览不扣次；视频不进浮层 |

其余行已有 e2e（隐藏占用、Banner、换区、预览≤3），勿删。

## 8. 验收

FR-014-08 / 09 / 10 缺口点通。旧 e2e 不删。C3 / 回填 / 水印 / 其它端不动。
