# 弦电子书（MiaoReader）Vela 端 — 功能增强版

## 基本信息

| 项目 | 值 |
|------|-----|
| 包名 | `com.bandbbs.ebook.plus` |
| 基于分支 | `o66`（小米手环 10） |
| 版本号 | V26.4.3.o66 |
| 开发工具 | aiot-toolkit 2.0.5 |
| 设计宽度 | 212dp |

---

## 功能总览（13 项增强 + 5 项 UX 优化）

### 功能 1：全局暗化遮罩（软件二次压暗）

在 app.ux 根布局添加全屏黑色遮罩层，`pointer-events: none` 不拦截触摸事件，通过 opacity 绑定暗化强度。适用于夜间阅读场景，可在系统亮度最低的基础上进一步压暗屏幕。

- 存储键：`EBOOK_GLOBAL_DIM_STRENGTH`（0~100，默认 0）
- 设置入口：设置 → 高级功能 → 全局暗化强度
- 实时预览：设置页内含遮罩效果预览

### 功能 2：老师屏增强（熄屏自动退出）

开启后，阅读器中启用屏幕常亮时，系统每 2 秒检测一次屏幕亮度值。若检测到屏幕熄灭（亮度归零或读取失败），自动保存进度并退出应用。适用于课堂场景，老师关闭屏幕后学生端自动退出。

- 存储键：`EBOOK_TEACHER_SCREEN_ADVANCED`（bool，默认 false）
- 设置入口：设置 → 高级功能 → 老师屏增强
- 前置条件：需同时开启阅读器"屏幕常亮"

### 功能 3：右边缘左滑快捷操作

在阅读器中，从屏幕右边缘 30px 范围内向左滑动超过 50px，触发快捷跳转。支持 7 种可选动作：书签管理、本书详情、全局设置、字体亮度、章节列表、阅读时长、分享。

- 存储键：`EBOOK_EDGE_SWIPE_ENABLED`（bool）、`EBOOK_EDGE_SWIPE_ACTION`（string）
- 设置入口：设置 → 高级功能 → 边缘左滑快捷操作
- 兼容性：滚动模式和怀旧模式均支持

### 功能 4：震动反馈

两个独立开关：章节切换时震动、点击操作时震动。章节切换震动在 changeChapter 成功后触发；点击震动通过公共工具函数 vibrateIfEnabled() 在各页面按钮事件中调用。

- 存储键：`EBOOK_VIBRATE_CHAPTER_SWITCH`、`EBOOK_VIBRATE_ON_TOUCH`（bool）
- 设置入口：设置 → 高级功能 → 章节切换震动 / 点击操作震动
- 依赖：设备需支持 `system.vibrator`

### 功能 5：长按快捷管理

- 书架长按书籍 → 跳转书籍详情页（传递 dirName 参数）
- 书签管理长按书签 → 弹出删除确认（复用 confirm.ux）
- 长按时若震动开关开启，触发短震动

### 功能 6：书签跳转临时位置（留在此处/回到刚才）

跳转书签前，将当前阅读进度保存到 `globalThis._originalReadingProgress`。跳转后在阅读器顶部显示两个按钮："回到刚才"恢复原始进度，"留在此处"清除备份。退出阅读器时若未选择，自动恢复原位置。

- 实现位置：detail.ux 的 jumpToBookmarkWithTemp / restoreOriginalProgress / stayAtBookmarkPosition

### 功能 7：长按"更多"按钮直达全局设置

阅读器底部"更多"按钮支持长按事件，长按直接跳转全局设置页（pages/more），原有单击行为不变。通过防冲突标志 moreLongPressTriggered 避免长按后触发单击。

### 功能 8：隐私模式（五点连点/密码解锁）

应用启动时若隐私模式开启，先跳转锁屏页。支持两种解锁方式：
- **五点连击**：1 秒内快速点击屏幕 5 次
- **四位密码**：内置数字键盘输入 4 位数字

密码错误 3 次后弹出确认框，可选择清除所有数据。锁屏页通过 `onBackPress() { return true }` 阻止返回。

- 存储键：`EBOOK_PRIVACY_MODE_ENABLED`、`EBOOK_PRIVACY_UNLOCK_METHOD`、`EBOOK_PRIVACY_PIN`、`EBOOK_PRIVACY_ASK_CLEAR_ON_FAIL`、`EBOOK_PRIVACY_FAIL_COUNT`
- 设置入口：设置 → 高级功能 → 隐私模式

### 功能 9：彩色书架（预置暗色池）

为每本书分配半透明暗色背景（opacity 0.35），颜色映射持久化到存储。开启后书架列表项显示彩色背景条，视觉辨识度提升但不刺眼。

- 存储键：`EBOOK_COLORFUL_SHELF_ENABLED`（bool）、`EBOOK_BOOK_COLOR_MAP`（JSON）
- 设置入口：设置 → 高级功能 → 彩色书架
- 预置颜色：12 种低饱和度暗色

### 功能 10：分享功能（选择段落生成二维码）

新增 shareDetail.ux 和 shareQR.ux 两个页面。在阅读器中通过边缘左滑或书签管理的分享按钮进入。支持在同一章节内选择开始/结束段落，提取文本（限 180 汉字），生成纯 JS 二维码并展示。

- 入口：边缘左滑 → share / 书签管理 → 分享按钮
- 依赖：utils/qrcode-generator.js（纯 JS 实现，无外部依赖）

### 功能 11：高级功能分区

在 more.ux 设置页底部新增"高级功能"标题分组，包含所有新增设置项入口和开关。顺序：全局压暗 → 老师屏增强 → 边缘左滑 → 章节震动 → 点击震动 → 彩色书架 → 隐私模式 → 体验增强 → 添加测试书籍。

### 功能 12：添加测试书籍（手环端一键生成）

点击按钮生成一本测试书籍，书名"测试书籍N"递增。内容为 3 章完整中文段落（各约 500 字），完全模拟手机端传输流程：创建目录、lindex.txt、章节索引、章节内容，并更新 bookshelf.json。

- 入口：设置 → 高级功能 → 添加测试书籍
- 实现：utils/testBookGenerator.js

### 功能 13：全局标题栏单击返回上一级

新建 utils/common.js 提供 goBackWithVibration() 方法。在除 detail.ux 以外的所有页面，标题栏区域添加 onclick 事件调用此方法。返回时若震动开关开启，触发短震动。

---

## UX 增强功能（全部默认关闭）

设置入口：设置 → 高级功能 → 体验增强

### UX 1：书架进度条

开启后，书架书籍名称下方显示绿色细进度条（4px 高），直观展示阅读进度。进度数据复用已有的 getBookProgressPercent 计算逻辑。

- 存储键：`EBOOK_UX_SHELF_PROGRESS_BAR`（bool，默认 false）

### UX 2：亮度手势调节

开启后，阅读器中从左边缘 30px 范围内上下滑动调节屏幕亮度。上滑增亮，下滑变暗。松手后自动保存亮度值并关闭跟随系统。

- 存储键：`EBOOK_UX_BRIGHTNESS_GESTURE`（bool，默认 false）

### UX 3：搜索历史记录

开启后，搜索页在无输入时显示最近 5 次搜索词。点击历史词直接填充搜索框。打开书籍时自动保存搜索词。支持一键清除历史。

- 存储键：`EBOOK_UX_SEARCH_HISTORY`（bool）、`EBOOK_SEARCH_HISTORY_LIST`（JSON）

### UX 4：自动翻页实时调速

开启后，自动翻页状态下长按屏幕上 1/3 区域加速（每次减 0.5 秒，最低 1 秒），长按下 1/3 区域减速（每次加 0.5 秒，最高 10 秒），长按中间区域关闭自动翻页。

- 存储键：`EBOOK_UX_AUTO_SPEED_CONTROL`（bool，默认 false）

### UX 5：章节位置标记

开启后，章节列表中当前所在章节名称前显示 "▶" 前缀标记，配合已有的高亮样式，更醒目地标识当前位置。

- 存储键：`EBOOK_UX_CHAPTER_MARKER`（bool，默认 false）

---

## 新增存储键完整列表

| 键名 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `EBOOK_GLOBAL_DIM_STRENGTH` | number | 0 | 全局暗化强度 0~100 |
| `EBOOK_TEACHER_SCREEN_ADVANCED` | bool | false | 老师屏增强 |
| `EBOOK_EDGE_SWIPE_ENABLED` | bool | false | 边缘左滑开关 |
| `EBOOK_EDGE_SWIPE_ACTION` | string | bookmarks | 边缘左滑动作 |
| `EBOOK_VIBRATE_CHAPTER_SWITCH` | bool | false | 章节切换震动 |
| `EBOOK_VIBRATE_ON_TOUCH` | bool | false | 点击操作震动 |
| `EBOOK_COLORFUL_SHELF_ENABLED` | bool | false | 彩色书架 |
| `EBOOK_BOOK_COLOR_MAP` | string | {} | 书籍颜色映射 JSON |
| `EBOOK_PRIVACY_MODE_ENABLED` | bool | false | 隐私模式开关 |
| `EBOOK_PRIVACY_UNLOCK_METHOD` | string | tap | 解锁方式 tap/pin |
| `EBOOK_PRIVACY_PIN` | string | 0000 | 4 位密码 |
| `EBOOK_PRIVACY_ASK_CLEAR_ON_FAIL` | bool | true | 错误 3 次提示清除 |
| `EBOOK_PRIVACY_FAIL_COUNT` | number | 0 | 密码错误累计次数 |
| `EBOOK_UX_SHELF_PROGRESS_BAR` | bool | false | 书架进度条 |
| `EBOOK_UX_BRIGHTNESS_GESTURE` | bool | false | 亮度手势 |
| `EBOOK_UX_SEARCH_HISTORY` | bool | false | 搜索历史 |
| `EBOOK_SEARCH_HISTORY_LIST` | string | [] | 搜索历史列表 JSON |
| `EBOOK_UX_AUTO_SPEED_CONTROL` | bool | false | 自动翻页调速 |
| `EBOOK_UX_CHAPTER_MARKER` | bool | false | 章节位置标记 |

---

## 文件变更清单

### 新增文件（12 个）

| 路径 | 说明 |
|------|------|
| `src/utils/common.js` | 公共返回+震动工具函数 |
| `src/utils/testBookGenerator.js` | 测试书籍生成器 |
| `src/utils/qrcode-generator.js` | 纯 JS 二维码生成器 |
| `src/components/NumberKeyboard/NumberKeyboard.ux` | 数字键盘组件（备用） |
| `src/pages/globalDimSetting/globalDimSetting.ux` | 全局暗化设置 |
| `src/pages/edgeSwipeSetting/edgeSwipeSetting.ux` | 边缘滑动设置 |
| `src/pages/privacyLock/privacyLock.ux` | 隐私锁屏页 |
| `src/pages/privacySetting/privacySetting.ux` | 隐私设置页 |
| `src/pages/shareDetail/shareDetail.ux` | 分享详情页 |
| `src/pages/shareQR/shareQR.ux` | 二维码展示页 |
| `src/pages/uxEnhancementSetting/uxEnhancementSetting.ux` | 体验增强设置 |
| `src/README.md` | 项目文档 |

### 修改文件（10 个）

| 路径 | 修改内容 |
|------|---------|
| `src/manifest.json` | 新增 7 条路由注册 |
| `src/app.ux` | 全局暗化遮罩 + 隐私模式启动检查 |
| `src/pages/more/more.ux` | 高级功能分区（9 个设置项） |
| `src/pages/detail/detail.ux` | 老师屏/边缘滑动/震动/长按更多/书签跳转/亮度手势/自动调速 |
| `src/pages/index/index.ux` | 彩色书架+进度条+长按跳详情+标题栏返回 |
| `src/pages/bookmarks/bookmarks.ux` | 长按删除+分享按钮+标题栏返回 |
| `src/pages/confirm/confirm.ux` | 隐私数据清除分支 |
| `src/pages/search/search.ux` | 搜索历史记录 |
| `src/pages/list/list.ux` | 章节位置标记 |
| `src/pages/screenBrightness/screenBrightness.ux` | （未改动，保持原样） |

---

## 构建与安装

```bash
# 安装依赖
npm install --registry=https://registry.npmmirror.com/

# 构建 debug 版
aiot build

# 构建 release 版（需要 sign/release/ 下的证书）
aiot release

# RPK 输出位置
ls dist/*.rpk
```

### 签名证书

项目包含自签名证书（`sign/release/`），仅用于开发测试。正式发布需替换为小米官方签发的证书。

---

## 测试步骤

| 功能 | 验证方法 |
|------|---------|
| 全局暗化 | 设置 → 高级功能 → 全局暗化 → 调节数值 → 返回阅读器查看遮罩效果 |
| 老师屏增强 | 开启屏幕常亮 + 老师屏增强 → 按电源键熄屏 → 应用自动退出 |
| 边缘左滑 | 开启边缘左滑 → 阅读器中从右边缘左滑 → 跳转对应页面 |
| 震动反馈 | 开启章节震动 → 翻页切换章节 → 感受震动 |
| 长按管理 | 书架长按书籍 → 跳转详情；书签长按 → 删除确认 |
| 书签临时位置 | 从书签跳转 → 点击"回到刚才" → 恢复原位 |
| 长按更多 | 阅读器底部更多按钮长按 → 直达全局设置 |
| 隐私模式 | 开启隐私模式 → 设密码 → 重启应用 → 出现锁屏 |
| 彩色书架 | 开启彩色书架 → 返回书架 → 看到暗色背景 |
| 分享 | 边缘左滑选分享 → 选段落 → 生成二维码 |
| 测试书籍 | 设置 → 添加测试书籍 → 书架出现新书 |
| 标题栏返回 | 任意设置页点击标题栏 → 返回上一页 |
| 书架进度条 | 开启后书架书名下方显示绿色条 |
| 亮度手势 | 开启后阅读器左边缘上下滑调节亮度 |
| 搜索历史 | 搜索并打开书 → 再进搜索页看到历史 |
| 自动调速 | 自动翻页中长按顶部/底部 → 调速 |
| 章节标记 | 开启后章节列表当前章节前显示 ▶ |

---

## 注意事项

1. 震动功能依赖设备 `system.vibrator` 支持
2. 隐私模式的"清除数据"会清除所有存储键（包括阅读进度）
3. 二维码生成器为纯 JS 实现，最大支持约 180 个汉字
4. 所有新增功能默认关闭，不会影响原有使用体验
5. 自签名证书仅供开发测试，正式发布需申请小米官方证书
