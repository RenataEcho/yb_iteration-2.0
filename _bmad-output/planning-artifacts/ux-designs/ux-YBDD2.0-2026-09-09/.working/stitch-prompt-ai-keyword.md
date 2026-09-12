# Google Stitch 提示词 · AI申词 H5

把下面整段贴进 [Google Stitch](https://stitch.withgoogle.com)。产出：手机 H5 高保真（375×812）+ 可下载的 DESIGN.md / HTML。保存到：

`_bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-09-09/`

---

## Prompt（复制从此处开始）

Design a **mobile H5 (375×812)** screen for a Chinese book-promotion tool called **「AI申词」**. This is a **single scrollable page**, not a multi-step wizard. Inherit the existing 右豹 C-end look: warm orange primary (`#ff6b1a`), orange-soft chips (`#fff6ee` / `#c2410c`), light gray page bg (`#f4f5f7`), white rounded cards (`12px`), PingFang SC. Do **not** invent a new brand, dark theme, or desktop layout.

### Job to be done

A promoter already knows book IDs, or wants official recommended books. They pick a project and promo type, choose a book source, set one quantity, generate AI keywords, then submit.

### Locked flow (do not reorder)

1. Nav: back + title「AI申词」
2. Card — **项目** dropdown (番茄小说 / 番茄漫剧 / 番茄短剧) and **推广类型** dropdown (真人出镜 / 图文 / 解压TTS / 解说混剪 / AIGC)
3. Card — **source tabs**:「手填书籍 ID」|「官方推荐」(underline active tab in orange; only one pane visible)
4. Card — **申请数量** single number field, helper:「一次填写，对本次全部书籍生效，最多 10 个」
5. **申词结果** is its own full-width card. Below it, two equal buttons **side by side**:「立即申词」(orange, left) and「立即题词」(charcoal `#1a2332`, right). Do **not** put buttons in a right-hand column beside the results.

### Tab: 手填书籍 ID — optimize the input

Current problem: the textarea is **too tall**. Make it compact:
- Single-line or **2-line max** input, height about 40–56px, not an 88px box
- Placeholder: `BK-1001, BK-1002`
- Tiny helper under:「换行 / 逗号 / 空格分隔。未匹配书库仍可申，按 ID 去重。」
- Do not add a separate「添加」button; IDs are consumed when tapping「立即申词」

### Tab: 官方推荐

- Search field at top of the pane: placeholder「搜索书名 / 书籍ID」
- List shows **at most 10** books at a time (checkbox + title + ID like `BK-1001`)
- A text-style control「更换」to swap in the next batch of 10
- Empty search:「没有找到符合的书」
- Sample books (use these titles, do not invent English):
  - 我成了老公掌心宠 · BK-1001
  - 我给死对头当了百日新娘 · BK-1002
  - 我在八零年代当后妈 · BK-1003
  - 被偷听心声后我成了全村团宠 · BK-1004
  - 我在末世囤了亿万物资 · BK-1005
  - 银发军官把我宠上天 · BK-1007

### 申词结果 (left column)

Each row: book ID, title, keyword chips (e.g. 掌心宠溺、年代团宠、闪婚宠妻), optional「移除」.
Empty state:「填写基础信息后点立即申词」
Show **two books already generated** in the hero mock (preview state).

### States to output (separate screens or sections)

1. Default — 手填 tab, compact ID field, empty results, buttons on the right
2. 官方推荐 — search + 10-item cap +「更换」visible
3. Preview — results filled, both buttons enabled
4. Validation toast example:「请先选择推广类型」(dark pill toast)

### Senior UI pass (structure only, keep tokens)

- Tighten vertical rhythm so first screen shows: fields + split results/actions without burying CTAs
- Card padding ~14px; section titles 15/700; labels 13/700
- One accent (orange) for 立即申词 and active tab; 立即题词 is secondary-dark, not a second rainbow color
- No illustrations, no bottom tab bar, no hamburger

### Output

- One 375×812 hero for state 3 (preview)
- One 375×812 for state 2 (推荐+搜索)
- Optional state 1
- Also emit DESIGN.md tokens matching the orange H5 system above

## Prompt（复制到此结束）

---

回存时把 HTML / DESIGN.md 放到本工作区根或 `imports/`，然后说一声，走 Update 写入 EXPERIENCE.md。
