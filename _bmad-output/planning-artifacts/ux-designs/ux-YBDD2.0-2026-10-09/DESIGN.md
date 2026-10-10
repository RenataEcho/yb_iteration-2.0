---
name: 一键代发 3.0 · 剪辑手 PC
description: 创作者中心「剪辑供稿」PC 的视觉增量。继承现有橙色工作台，只加书籍类型芯片和批量上传宽表。
status: draft
updated: 2026-10-10
topic: 一键代发3.0 · 剪辑手 PC 优化
sources:
  - demo/iteration/yijian-daifa-pc.html
  - demo/iteration/yijian-daifa-ops-pc.html
  - demo/iteration/yijian-daifa-pc-guide.md
  - _bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-10-09/prd.md
  - _bmad-output/implementation-artifacts/spec-fr022-daifa-ops-mode.md
colors:
  orange: '#ff6b1a'
  orange-light: '#fff3eb'
  orange-border: '#ffd4b8'
  nav: '#1a2332'
  bg: '#f4f5f7'
  surface: '#ffffff'
  text: '#1a2332'
  muted: '#8a93a0'
  border: '#e6e8eb'
  exist: '#94a3b8'
  canvas: '#d8dce3'
  field-bg: '#f8fafc'
  label: '#64748b'
typography:
  page-title:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 18px
    fontWeight: '700'
    lineHeight: '1.3'
  modal-title:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 17px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
  chip:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 8px
  md: 10px
  lg: 12px
  full: 9999px
spacing:
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '7': 28px
components:
  button-primary:
    background: '{colors.orange}'
    foreground: '{colors.surface}'
    radius: '{rounded.md}'
  book-type-field:
    background: '{colors.field-bg}'
    border: '{colors.border}'
    radius: '{rounded.md}'
    chip-background: '{colors.orange-light}'
    chip-foreground: '{colors.orange}'
    chip-radius: '{rounded.full}'
  batch-modal:
    background: '{colors.surface}'
    radius: '{rounded.lg}'
    width: min(1120px, calc(100% - 40px))
  upload-modal:
    background: '{colors.surface}'
    radius: '{rounded.lg}'
    width: min(920px, calc(100% - 40px))
---

## Brand & Style

剪辑供稿是创作者中心里的电脑工作台：深色顶栏、浅灰画布、白色内容面，橙色只表示当前步骤、主按钮和可点的导航。这一轮不换品牌。`[ASSUMPTION]` 视觉以 `demo/iteration/yijian-daifa-pc.html` 的 `:root` 和上传弹窗为准；运营模式字段的位置对照 `yijian-daifa-ops-pc.html`。这一轮新增：书籍类型芯片、比单条上传更宽的批量任务表、书籍链接旁边的关键词下拉、书籍分组下的剪辑师提醒文本域。

## Colors

- **Orange (`{colors.orange}`)**：主按钮、当前步骤圆点、输入焦点描边、芯片字色、侧栏当前项。
- **Orange light / border (`{colors.orange-light}` / `{colors.orange-border}`)**：当前导航底、已完成步骤、芯片底、焦点外圈 `rgba(255,107,26,.12)`。
- **Nav (`{colors.nav}`)**：顶栏。页面标题和正文同这一墨色 `{colors.text}`。
- **Canvas / bg / surface**：页面外 `{colors.canvas}`，主区 `{colors.bg}`，卡片和弹窗 `{colors.surface}`。
- **Muted / exist / label**：说明 `{colors.muted}`，未选导航 `{colors.exist}`，字段标签 `{colors.label}`。
- **Field**：输入静止底 `{colors.field-bg}`，焦点时改为 `{colors.surface}` 并套橙色描边。

橙色不拿来做错误色。失败沿用页面里已有的删除/失败标签色，本轮不新造。

## Typography

全文 `-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`。页标题 `{typography.page-title.fontSize}`，弹窗标题 `{typography.modal-title.fontSize}` 并略收字距。字段标签 `{typography.label.fontSize}`、字重 600。芯片 `{typography.chip.fontSize}`。说明文字 12px，颜色 `{colors.muted}`。

## Layout & Spacing

电脑页。内容壳最大宽度沿用 1180px。侧栏 200px。单条上传弹窗保持 `{components.upload-modal.width}`。批量上传弹窗加宽到 `{components.batch-modal.width}`，仍居中，最高 `calc(100% - 48px)`，正文区滚动，底栏固定。

弹窗内边距左右 `{spacing.7}`。字段行间距 14px。书籍链接和关键词并排时，两格等宽，间距与其它 `field-row` 相同。表格单元格横向 `{spacing.3}`，关键词列贴在书籍链接列右侧。芯片和「选文件夹」能坐在同一行高里，多芯片或提醒文本变高时单元格增高，不把表撑出弹窗。

## Elevation & Depth

工作台本身几乎平贴。弹窗是唯一浮层：`0 24px 64px rgba(0,0,0,.22)`，底下半透明遮罩。确认删除仍压在上传弹窗之上。批量表格不再开第二层弹窗；选文件夹、解压、行内错误都留在表格里。

## Shapes

输入和按钮 `{rounded.md}`。弹窗 `{rounded.lg}`。书籍类型芯片 `{rounded.full}`，和页面里已有的胶囊标签同一轮廓。步骤圆点保持正圆。

## Components

**书籍类型字段。** 一只圆角输入容器：里面从左到右排已添加的芯片，末尾是一条无边框文本。芯片底 `{colors.orange-light}`、字 `{colors.orange}`，右侧一个「×」。容器焦点环与其它输入相同。空态占位：「输入后回车添加」。

**关键词。** 出现时与书籍链接同一行，两格等宽。控件是下拉，一次显示一个已选词。外观与其它下拉相同：高与书籍链接输入一致，标签 `{typography.label.fontSize}`。站内任务协作时这一格不占位，书籍链接恢复整行。

**剪辑师提醒。** 书籍分组下方一只文本域，约 4 行高。标签就是「剪辑师提醒」。底 `{colors.field-bg}`，圆角 `{rounded.md}`，焦点时与其它输入同一圈橙色描边。页面上只有这一个输入，不再并排或上下叠两个文本域。

**批量上传弹窗。** 头、两步步骤条、正文、底栏，结构同单条上传。第一步仍是分组表单。第二步是一张横向表，表头固定，行在正文内滚动。主按钮停在底栏右侧。

**行内成片。** 单元格里两枚次按钮「文件夹」「压缩包」，选中后按钮文字换成文件名或文件夹名，旁边可清除。解压中时该单元格只显示「解压中」，行内其它格保持可编辑。

## Do's and Don'ts

- 沿用这套橙和工作台，不从迭代 2.0、迭代 3.0、收益池页借视觉。
- 书籍类型用芯片，不用多行文本，也不用下拉枚举。
- 批量任务用表，不用每本书再开一个弹窗。
- 站内、站外、运营模式用分段或下拉，和现有字段同一套标签与输入高度。
- 关键词紧挨书籍链接，不放到运营模式那一行。
- 剪辑师提醒只用一个文本域，标签只用这四个字。
- 不在芯片、表头、按钮上加新图标语言。
