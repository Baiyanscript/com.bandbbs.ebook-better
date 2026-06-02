# 弦电子书（MiaoReader）Vela 端 - 功能增强版

## 项目信息
- 包名：`com.bandbbs.ebook.plus`
- 基于分支：`o66`（小米手环 10）
- 版本：V26.4.3.o66

## 修改文件清单

### 新增文件
| 文件路径 | 功能 |
|---------|------|
| `src/utils/common.js` | 公共返回+震动反馈（功能13） |
| `src/utils/testBookGenerator.js` | 测试书籍生成器（功能12） |
| `src/utils/qrcode-generator.js` | 二维码生成器（功能10） |
| `src/components/NumberKeyboard/NumberKeyboard.ux` | 数字键盘组件（功能8） |
| `src/pages/globalDimSetting/globalDimSetting.ux` | 全局暗化设置页（功能1） |
| `src/pages/edgeSwipeSetting/edgeSwipeSetting.ux` | 边缘滑动设置页（功能3） |
| `src/pages/privacyLock/privacyLock.ux` | 隐私锁屏页（功能8） |
| `src/pages/privacySetting/privacySetting.ux` | 隐私设置页（功能8） |
| `src/pages/shareDetail/shareDetail.ux` | 分享详情页（功能10） |
| `src/pages/shareQR/shareQR.ux` | 二维码展示页（功能10） |
| `src/pages/uxEnhancementSetting/uxEnhancementSetting.ux` | 体验增强设置页 |
| `src/README.md` | 本文档 |

### 修改文件
| 文件路径 | 修改内容 |
|---------|---------|
| `src/manifest.json` | 新增路由注册 + system.sensor 权限 |
| `src/app.ux` | 全局暗化遮罩 + 隐私模式启动检查 |
| `src/pages/more/more.ux` | 高级功能分区（含7个设置项+测试书籍按钮） |
| `src/pages/detail/detail.ux` | 老师屏增强/边缘滑动/震动/长按更多/书签跳转临时位置 |
| `src/pages/index/index.ux` | 彩色书架+长按跳详情+标题栏返回 |
| `src/pages/bookmarks/bookmarks.ux` | 长按删除+分享按钮+标题栏返回 |
| `src/pages/confirm/confirm.ux` | 隐私数据清除分支 |
| `src/pages/search/search.ux` | 搜索历史记录功能 |
| `src/pages/list/list.ux` | 章节位置标记 |

## 新增存储键列表

| 键名 | 类型 | 说明 |
|------|------|------|
| `EBOOK_GLOBAL_DIM_STRENGTH` | 0~100 | 全局暗化强度 |
| `EBOOK_TEACHER_SCREEN_ADVANCED` | bool | 老师屏增强开关 |
| `EBOOK_EDGE_SWIPE_ENABLED` | bool | 边缘左滑开关 |
| `EBOOK_EDGE_SWIPE_ACTION` | string | 边缘左滑动作 |
| `EBOOK_VIBRATE_CHAPTER_SWITCH` | bool | 章节切换震动 |
| `EBOOK_VIBRATE_ON_TOUCH` | bool | 点击操作震动 |
| `EBOOK_COLORFUL_SHELF_ENABLED` | bool | 彩色书架开关 |
| `EBOOK_BOOK_COLOR_MAP` | JSON | 书籍颜色映射 |
| `EBOOK_PRIVACY_MODE_ENABLED` | bool | 隐私模式开关 |
| `EBOOK_PRIVACY_UNLOCK_METHOD` | string | 解锁方式(tap/pin) |
| `EBOOK_PRIVACY_PIN` | string | 4位密码 |
| `EBOOK_PRIVACY_ASK_CLEAR_ON_FAIL` | bool | 错误清除提示 |
| `EBOOK_PRIVACY_FAIL_COUNT` | number | 密码错误次数 |
| `EBOOK_UX_SHELF_PROGRESS_BAR` | bool | 书架进度条 |
| `EBOOK_UX_BRIGHTNESS_GESTURE` | bool | 亮度手势调节 |
| `EBOOK_UX_SEARCH_HISTORY` | bool | 搜索历史记录 |
| `EBOOK_UX_AUTO_SPEED_CONTROL` | bool | 自动翻页调速 |
| `EBOOK_UX_CHAPTER_MARKER` | bool | 章节位置标记 |
| `EBOOK_SEARCH_HISTORY_LIST` | JSON | 搜索历史列表 |

## 测试步骤

### 功能1：全局暗化
1. 设置 → 高级功能 → 全局暗化强度
2. 调整数值，返回阅读器查看效果

### 功能2：老师屏增强
1. 设置 → 高级功能 → 开启老师屏增强
2. 阅读器中开启屏幕常亮
3. 遮盖接近传感器 >3秒，应用应自动退出

### 功能3：边缘左滑
1. 设置 → 高级功能 → 边缘左滑快捷操作 → 开启
2. 在阅读器中从右边缘30px内左滑 >50px
3. 验证跳转到设定的页面

### 功能4：震动反馈
1. 设置 → 高级功能 → 开启章节切换震动/点击操作震动
2. 翻页/切换章节时应有震动

### 功能5：长按管理
1. 书架长按书籍 → 跳转书籍详情
2. 书签管理长按书签 → 弹出删除确认

### 功能6：书签跳转临时位置
1. 从书签跳转后，阅读器中可选择"回到刚才"或"留在此处"

### 功能7：长按更多按钮
1. 阅读器底部"更多"按钮长按 → 直达全局设置

### 功能8：隐私模式
1. 设置 → 高级功能 → 隐私模式 → 开启
2. 选择解锁方式（五点连击/数字密码）
3. 重启应用验证锁屏

### 功能9：彩色书架
1. 设置 → 高级功能 → 开启彩色书架
2. 返回书架查看彩色背景效果

### 功能10：分享功能
1. 阅读器中边缘左滑选择"分享"
2. 或书签管理中点击分享按钮
3. 选择段落范围，生成二维码

### 功能11：高级功能分区
1. 设置页面底部应有"高级功能"分区

### 功能12：测试书籍
1. 设置 → 高级功能 → 添加测试书籍
2. 返回书架查看新书

### 功能13：标题栏返回
1. 在任意非阅读器页面点击标题栏区域 → 返回上一级

### UX增强：书架进度条
1. 设置 → 高级功能 → 体验增强 → 开启书架进度条
2. 返回书架，书名下方应显示绿色进度条

### UX增强：亮度手势
1. 设置 → 高级功能 → 体验增强 → 开启亮度手势调节
2. 在阅读器中从左边缘上下滑动 → 调节屏幕亮度

### UX增强：搜索历史
1. 设置 → 高级功能 → 体验增强 → 开启搜索历史记录
2. 搜索书籍并打开 → 再次进入搜索页应显示历史记录

### UX增强：自动翻页调速
1. 设置 → 高级功能 → 体验增强 → 开启自动翻页调速
2. 开启自动翻页后，长按屏幕顶部 → 加速，长按底部 → 减速

### UX增强：章节标记
1. 设置 → 高级功能 → 体验增强 → 开启章节位置标记
2. 打开章节列表，当前章节名前应显示 ▶

## 注意事项
- 震动功能需要设备支持 `system.vibrator`
- 接近传感器需要 `system.sensor` 权限（已移除，改用亮度检测）
- 隐私模式清除数据会清除所有存储设置
- 发布版 RPK 已使用自签名证书（sign/release/）
- 二维码生成器为纯 JS 实现，支持中文文本
- UX 增强功能默认全部关闭，可在 设置→高级功能→体验增强 中开启

## UX 增强功能（默认关闭）

| 功能 | 存储键 | 说明 |
|------|--------|------|
| 书架进度条 | `EBOOK_UX_SHELF_PROGRESS_BAR` | 书名下方显示绿色进度条 |
| 亮度手势调节 | `EBOOK_UX_BRIGHTNESS_GESTURE` | 阅读器左边缘上下滑动调节亮度 |
| 搜索历史记录 | `EBOOK_UX_SEARCH_HISTORY` | 保存最近5次搜索词 |
| 自动翻页调速 | `EBOOK_UX_AUTO_SPEED_CONTROL` | 自动翻页时长按顶部加速/底部减速 |
| 章节位置标记 | `EBOOK_UX_CHAPTER_MARKER` | 章节列表当前章节前加 ▶ 标记 |
