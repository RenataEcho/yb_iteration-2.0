---
name: AI申词 H5
description: 选项目与类型后选手填或官方推荐，一次填数量，先申词再题词。推荐每批最多 10 本可更换；申词结果独立成块，主按钮左右并排。
status: draft
updated: 2026-09-09
sources:
  - _bmad-output/implementation-artifacts/spec-fr-013-ai-keyword.md
  - demo/iteration/ai-keyword-demo.html
  - demo/iteration/fr-ai-keyword.html
  - demo/iteration/ITERATION-FR-GUIDE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-08-23/mockups/ai-keyword-demo.html
---

## Foundation

- 形态：手机 H5，375 逻辑宽，单页滚动，不是分步向导。
- 视觉身份：见同目录 `DESIGN.md`（继承右豹 C 端橙色，不另起品牌）。
- 范围：只做独立「AI申词」H5，不改选书中心。

## Information Architecture

1. 导航：返回 + 标题「AI申词」
2. 项目 / 推广类型
3. 书籍来源 Tab：手填书籍 ID | 官方推荐（立即申词只取当前 Tab）
4. 申请数量（一次填，对本次全部书生效，1–10）
5. 「申词结果」独立卡片
6. 「立即申词」「立即题词」左右并排

## Voice and Tone

短句、点名缺项。Toast 示例：「请先选择项目」「请先选择推广类型」「请添加有效书籍 ID」「请先勾选推荐书」「请输入申请数量」「已申词 · N 本书」「已题词 · N 本书」「保存失败」。

## Component Patterns

- **手填书籍 ID**：约 2 行高的输入，占位 `BK-1001, BK-1002`。换行 / 逗号 / 空格分隔，按 ID 去重。未命中书库标「未匹配书名」仍可申。无单独「添加」按钮。
- **官方推荐**：顶部搜索书名 / 书籍 ID；列表每批最多 10 本（勾选 + 书名 + ID）；「更换」切下一批并循环。勾选在翻批后保留。搜索无结果：「没有找到符合的书」。下架书不出现。
- **申词结果**：每本书一行（ID、书名、词芯片、「移除」）。空态：「填写基础信息后点「立即申词」，结果会显示在这里」。
- **主按钮**：同一行左右并排、等宽。左橙「立即申词」，右炭灰「立即题词」。先申词再题词。

## State Patterns

| 场景 | 行为 |
|------|------|
| 未选项目 / 类型 / ID / 数量 | 立即申词 Toast 点名；不写结果 |
| 未申词 | 立即题词 Toast「请先立即申词」 |
| 推荐第 1 批 | 展示最多 10 本已上架拷贝 |
| 更换 | 展示下一批；不足一批时按钮禁用 |
| 搜索 | 过滤书名与 ID，重置到第 1 批 |
| 题词成功 | 写入本地批次，清空结果行 |

## Key Flows

林林（短剧推广）打开 AI申词 → 选番茄小说 + 图文 → 官方推荐勾 2 本（或手填两个 ID）→ 数量 3 → 立即申词 → 结果卡片出芯片 → 右侧立即题词进现有审核。高潮：两个主按钮并排，结果自己占一块。
