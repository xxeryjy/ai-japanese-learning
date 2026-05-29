# AI 日语学习微信小程序项目说明

## 1. 完整项目目录结构

```text
ai-japanese-learning
├─ api
│  ├─ ai.js
│  ├─ auth.js
│  ├─ home.js
│  ├─ learning.js
│  └─ profile.js
├─ components
│  ├─ assistant
│  │  └─ AssistantModeTabs.vue
│  ├─ checkin
│  │  └─ CheckinCalendar.vue
│  ├─ common
│  │  ├─ AppCard.vue
│  │  ├─ PageShell.vue
│  │  └─ SectionHeader.vue
│  ├─ home
│  │  ├─ DailySentenceCard.vue
│  │  ├─ EntryGrid.vue
│  │  ├─ RecentRecordList.vue
│  │  └─ TodayStudyCard.vue
│  ├─ kana
│  │  └─ KanaGroup.vue
│  ├─ profile
│  │  └─ ProfileSummary.vue
│  └─ vocabulary
│     └─ WordCard.vue
├─ composables
│  └─ useAudioPlayer.js
├─ config
│  └─ index.js
├─ mock
│  ├─ data.js
│  └─ index.js
├─ pages
│  ├─ ai
│  │  └─ index.vue
│  ├─ checkin
│  │  └─ index.vue
│  ├─ index
│  │  └─ index.vue
│  ├─ jlpt
│  │  └─ index.vue
│  ├─ kana
│  │  └─ index.vue
│  ├─ login
│  │  └─ index.vue
│  ├─ profile
│  │  └─ index.vue
│  └─ vocabulary
│     └─ index.vue
├─ stores
│  ├─ assistant.js
│  ├─ learning.js
│  ├─ settings.js
│  └─ user.js
├─ utils
│  ├─ audio.js
│  ├─ auth.js
│  ├─ request.js
│  └─ storage.js
├─ .gitignore
├─ App.vue
├─ PROJECT_OVERVIEW.md
├─ index.html
├─ jsconfig.json
├─ main.js
├─ manifest.json
├─ package.json
├─ pages.json
├─ uni.scss
└─ vite.config.js
```

## 2. 页面划分

- `pages/login/index.vue`：微信登录、获取用户信息、游客体验入口
- `pages/index/index.vue`：首页、今日学习卡片、等级入口、每日一句、最近记录、AI 入口
- `pages/jlpt/index.vue`：JLPT N5-N1 等级入口
- `pages/kana/index.vue`：平假名、片假名、罗马音、发音、跟读
- `pages/vocabulary/index.vue`：单词列表、收藏、发音、例句、等级筛选
- `pages/ai/index.vue`：中文转日语、语法纠错、敬语转换、假名标注、罗马音标注、AI 对话
- `pages/checkin/index.vue`：每日签到、连续天数、统计、学习日历
- `pages/profile/index.vue`：学习数据、收藏单词、设置、深色模式

## 3. pages.json

项目的 `pages.json` 已完整落地在根目录：

- 开启 `easycom`
- 已配置 `uView Plus` 的 `u-` / `u--` / `up-` 组件映射
- 已注册全部页面
- 全局导航与背景风格统一为浅蓝白色系

## 4. API 模块

- `api/auth.js`：登录、获取用户信息
- `api/home.js`：首页数据
- `api/learning.js`：五十音、单词、打卡数据
- `api/ai.js`：AI 助手与 AI 对话
- `api/profile.js`：我的页面统计

当前默认 `config/index.js` 中 `useMock: true`，所以在未接后端前也能直接运行演示。

## 5. 状态管理结构

- `stores/user.js`
  - `token`
  - `profile`
  - 登录态持久化
- `stores/learning.js`
  - 首页数据
  - 五十音数据
  - 单词列表
  - 收藏词 ID
  - 打卡数据
- `stores/settings.js`
  - 深色模式
  - 自动播放发音
  - 推荐 JLPT 等级
- `stores/assistant.js`
  - AI 结果
  - AI 对话历史

## 6. 页面完整代码

所有页面均已写入 `pages/` 目录，对应功能完整可运行，不是伪代码。

## 7. 可直接运行代码

### 安装依赖

```bash
npm install
```

### 启动 H5

```bash
npm run dev:h5
```

### 启动微信小程序

```bash
npm run dev:mp-weixin
```

注意：

- `manifest.json` 里的 `appid` 需要替换成你自己的微信小程序 `AppID`
- 如果你要接真实后端，把 `config/index.js` 的 `useMock` 改成 `false`

## 8. 组件拆分方案

- 通用布局组件
  - `PageShell.vue`
  - `AppCard.vue`
  - `SectionHeader.vue`
- 首页组件
  - `TodayStudyCard.vue`
  - `EntryGrid.vue`
  - `DailySentenceCard.vue`
  - `RecentRecordList.vue`
- 学习组件
  - `KanaGroup.vue`
  - `WordCard.vue`
- AI 组件
  - `AssistantModeTabs.vue`
- 打卡组件
  - `CheckinCalendar.vue`
- 个人中心组件
  - `ProfileSummary.vue`

## 9. 请求封装

请求统一在 `utils/request.js`：

- 基于 `axios`
- 微信小程序端启用 `axios-miniprogram-adapter`
- 自动注入 `token`
- 统一响应拦截
- 401 自动清理登录态并跳回登录页
- 保留 `get/post/put` 三类基础方法

## 10. 小程序兼容注意事项

- 登录使用 `uni.login` + `uni.getUserProfile`
- `manifest.json` 已开启 `mergeVirtualHostAttributes`
- `uView Plus` 样式按官方要求分别接入 `uni.scss` 和 `App.vue`
- 小程序端音频使用 `uni.createInnerAudioContext`
- 尽量避免直接使用 DOM / `window` / `document`
- 所有路由使用 `uni.navigateTo` / `uni.reLaunch`
- 接真实后端时要把微信小程序业务域名加入小程序后台白名单
- 若修改了 `pages.json` 的 `easycom`，通常需要重新编译项目
