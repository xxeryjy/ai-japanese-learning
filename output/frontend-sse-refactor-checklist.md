# ai-japanese-learning 前端改造清单

## 文档目的

本文档用于梳理 `D:\Demo\ai-japanese-learning` 从当前 `WebSocket` 聊天链路迁移到 `HTTP/SSE + session_id` 的前端改造项。

本次只输出改造清单，不包含实际代码改动。

---

## 一、改造目标

前端目标统一为以下形态：

- 聊天请求改为 `HTTP` 流式请求
- 请求体显式传递 `session_id`
- 前端按 `SSE` 协议解析流式事件
- 结束状态由后端 `done` 事件显式通知
- 错误状态由后端 `error` 事件显式通知
- 当前多会话模型继续保留，不再依赖 `WebSocket` 生命周期判断回复结束

建议目标接口：

- `POST /chat/stream`

请求体：

```json
{
  "message": "你好",
  "session_id": "assistant_xxx"
}
```

响应协议：

- `Content-Type: text/event-stream`
- 事件类型包含 `chunk`、`done`、`error`

---

## 二、当前前端现状

当前涉及文件：

- `D:\Demo\ai-japanese-learning\api\ai.js`
- `D:\Demo\ai-japanese-learning\stores\assistant.js`
- `D:\Demo\ai-japanese-learning\pages\ai\index.vue`
- `D:\Demo\ai-japanese-learning\config\index.js`
- `D:\Demo\ai-japanese-learning\utils\storage.js`
- `D:\Demo\ai-japanese-learning\utils\request.js`

当前特点：

1. `stores/assistant.js` 已经支持多会话，且每个会话都有独立 `sessionId`。
2. `api/ai.js` 当前聊天主链路仍以 `sendSocketChatMessage()` 为核心。
3. 流式内容更新已经有 `onChunk -> fullText` 这一层抽象，store 层不需要重做产品逻辑。
4. 当前 WebSocket 结束判断仍带有连接态和超时态的复杂性。
5. 前端已经具备“历史会话切换”的结构，适合继续沿用 `session_id`。

---

## 三、前端改造原则

建议遵循以下原则：

- 会话层不动：继续使用当前 `stores/assistant.js` 的多会话结构
- 传输层替换：把聊天传输从 `WebSocket` 改为 `HTTP/SSE`
- 状态层简化：不再依赖 `open`、`close`、`idle-timeout` 推断消息是否完成
- 协议层显式化：前端必须按 `event` 区分 `chunk`、`done`、`error`

本次不建议顺手做的内容：

- 不先改聊天 UI 交互
- 不先调整会话列表展示
- 不先重构工具模式 `runAiAssistant`
- 不先改登录、鉴权、收藏等无关模块

---

## 四、协议契约清单

前端需要按标准 `SSE` 文本协议消费响应。

推荐后端返回格式：

### 4.1 `chunk` 事件

```text
event: chunk
data: {"text":"你"}

```

前端处理：

- 解析 `data`
- 取出 `text`
- 累加到当前 assistant 消息

### 4.2 `done` 事件

```text
event: done
data: {"reply":"你好，很高兴见到你","suggestion":"你可以继续介绍自己"}

```

前端处理：

- 结束流式状态
- 以 `reply` 为最终回复
- 以 `suggestion` 更新建议文案

### 4.3 `error` 事件

```text
event: error
data: {"message":"模型调用失败"}

```

前端处理：

- 结束流式状态
- 展示错误提示
- 保留或回填用户输入

---

## 五、文件级改造清单

### 5.1 `D:\Demo\ai-japanese-learning\config\index.js`

改造目标：

- 从 `WebSocket` 配置切换到 `HTTP/SSE` 配置

建议动作：

1. 弱化或移除：

- `useSocketChat`
- `chatSocketURL`
- `chatStreamIdleMs`
- `chatSocketDebug`

2. 新增或改名为：

- `useStreamChat`
- `chatStreamURL`
- `chatStreamDebug`

可选补充：

- `chatStreamTimeout`

建议结果：

- 配置命名与实际协议保持一致
- 便于后续保留 `WebSocket` 兜底开关

验收点：

- 聊天链路配置不再以 `socket` 为核心命名

### 5.2 `D:\Demo\ai-japanese-learning\api\ai.js`

改造目标：

- 移除当前以 `uni.connectSocket` 为核心的聊天主链路
- 新增基于 `HTTP/SSE` 的流式聊天函数

建议动作：

1. 保留工具模式相关逻辑：

- `runAiAssistant()`
- `buildAssistantResult()`

2. 新增一个新的聊天主函数，例如：

- `sendStreamChatMessage(message, options)`

建议参数：

- `message`
- `options.sessionId`
- `options.onChunk`

3. 新函数职责：

- 发起 `POST /chat/stream`
- 请求体包含 `message` 和 `session_id`
- 监听流式 chunk
- 维护本地 `buffer`
- 按 `\n\n` 拆分 `SSE` 事件帧
- 按 `event:` 和 `data:` 解析事件

4. 事件处理职责：

- `chunk`：累加文本并触发 `onChunk`
- `done`：返回完整结果并结束 Promise
- `error`：抛出错误并结束 Promise

5. 当前 `sendAiChatMessage()` 需要改成：

- 优先走 `HTTP/SSE`
- 不再默认走 `sendSocketChatMessage()`

6. `resetAiChatSession()` 的职责要重新审视：

- 如果前端多会话都已经把 `sessionId` 放在 store 的 conversation 里，这个全局方法可以弱化甚至删除

建议结果：

- `api/ai.js` 只负责传输协议与数据解析
- 会话归属仍由调用方传入 `sessionId`

验收点：

- `api/ai.js` 不再依赖 `uni.connectSocket`
- 前端能从 `HTTP` 流中持续收到文本增量

### 5.3 `D:\Demo\ai-japanese-learning\stores\assistant.js`

改造目标：

- 继续复用当前多会话结构
- 将底层发送函数从 `WebSocket` 替换为 `HTTP/SSE`

当前优点：

- 已有 `conversations`
- 已有 `activeConversationId`
- 已有每会话独立 `sessionId`
- 已有 `onChunk` 驱动的消息实时更新

建议动作：

1. `sendChat()` 中继续保持：

- 先 push 用户消息
- 再 push assistant 占位消息
- `onChunk` 时更新 `assistantMessage.content`

2. 调用的底层函数改为新的流式 HTTP 方法，例如：

- `sendAiChatMessage(..., { sessionId, onChunk })`

3. 删除或清理当前与 `WebSocket` 生命周期强绑定的思路：

- 不再依赖连接打开、关闭来判定一轮完成

4. `clearHistory()` 保持不变，但它重置的是当前会话的 `sessionId`

建议结果：

- `store` 不需要改变产品结构
- 只替换底层 transport

验收点：

- 多会话切换逻辑不受影响
- 同一会话仍能流式更新 assistant 回复

### 5.4 `D:\Demo\ai-japanese-learning\pages\ai\index.vue`

改造目标：

- 页面层尽量少改
- 主要确认错误提示和流式状态文案是否还合理

建议动作：

1. 保持现有输入、发送、消息列表、抽屉切换逻辑
2. 仅检查以下交互是否仍然成立：

- 发送时进入 `isStreaming`
- 收到 `done` 时结束 `isStreaming`
- 收到 `error` 时恢复输入框提示

3. 如果之前有“连接聊天服务失败”这类明显偏向 socket 的提示文案，可改成更中性：

- `聊天服务请求失败`
- `聊天回复中断，请稍后再试`

建议结果：

- 页面不承担协议细节
- 页面只感知 `发送中 / 回复完成 / 回复失败`

验收点：

- 页面不需要知道底层是否是 `WebSocket` 或 `SSE`

### 5.5 `D:\Demo\ai-japanese-learning\utils\request.js`

改造目标：

- 判断当前请求封装是否适合承接流式响应

当前情况：

- 现有 `axios + axios-miniprogram-adapter` 更适合常规 JSON 请求
- 对 `SSE`/流式 chunk 的支持能力需要谨慎验证

建议动作：

1. 不建议强行把流式聊天直接塞进现有 `axios` 封装
2. 建议聊天流式请求单独实现，不与普通 `request.post()` 共用
3. 普通接口仍继续走 `utils/request.js`

原因：

- 普通请求和流式请求生命周期差异大
- `SSE` 解析更适合独立实现

建议结果：

- `utils/request.js` 继续服务普通 API
- `api/ai.js` 内部单独维护流式 HTTP 请求

验收点：

- 不因为聊天流式改造而影响普通业务接口

### 5.6 `D:\Demo\ai-japanese-learning\utils\storage.js`

改造目标：

- 保持当前多会话本地存储结构可用

建议动作：

1. 保留：

- `ASSISTANT_CONVERSATIONS`
- `ASSISTANT_ACTIVE_CONVERSATION_ID`

2. 评估是否还需要：

- `ASSISTANT_SESSION_ID`

当前判断：

- 如果聊天完全按 conversation 自身的 `sessionId` 工作，这个全局 key 可以弱化

注意：

- 是否删除该 key，取决于你是否还要兼容旧 WebSocket 逻辑

验收点：

- 本地多会话和会话切换能力不受影响

---

## 六、推荐新增的前端能力

### 6.1 SSE 文本解析器

建议在 `api/ai.js` 内部或新增独立工具函数，负责：

- 维护 buffer
- 拆分事件帧
- 解析 `event:` 行
- 解析 `data:` 行

建议职责拆分：

1. `appendChunkToBuffer(rawChunk)`
2. `extractSseFrames(buffer)`
3. `parseSseFrame(frame)`

目的：

- 避免聊天发送函数里堆积过多字符串处理逻辑

### 6.2 流式调试日志

建议保留调试日志能力，但从 socket 语义改成 stream 语义，例如：

- `create`
- `request-start`
- `chunk`
- `done`
- `error`
- `finish`

目的：

- 替代之前的 `open`、`close`、`idle-timeout` 排查方式

---

## 七、推荐的前端处理流程

建议新链路按以下顺序工作：

1. 用户点击发送
2. `stores/assistant.js` 找到当前 active conversation
3. 取出该 conversation 的 `sessionId`
4. `api/ai.js` 发起 `POST /chat/stream`
5. 前端持续接收原始文本 chunk
6. 解析为 `SSE` 事件
7. 遇到 `chunk` 事件时更新 assistant 占位消息
8. 遇到 `done` 事件时结束流式状态并补全 suggestion
9. 遇到 `error` 事件时结束流式状态并抛错

---

## 八、兼容性风险点

### 8.1 uni-app / 小程序流式能力

这是本次前端改造最大的风险点。

虽然协议是 `SSE`，但 uni-app / 小程序端通常不是浏览器原生 `EventSource`。

所以前端实现重点不是“用不用 SSE 协议”，而是：

- 当前运行平台是否能稳定接收到 HTTP chunk

需要重点验证：

- 微信开发者工具
- 真机小程序环境

### 8.2 现有请求封装不一定适合流式

当前 `axios` 封装更适合普通 JSON 请求。

如果平台或适配器不能稳定提供 chunk 能力，则可能出现：

- 直到服务端完全结束才一次性收到全文

这会导致：

- 协议是 `SSE`
- 但体验不是“流式”

### 8.3 降级方案要提前预留

如果最终验证发现小程序端对 HTTP 流式支持不稳定，建议预留以下降级方案：

1. `HTTP 非流式 + session_id`
2. 保留 `WebSocket` 作为兼容链路

不建议退回：

- `HTTP Cookie Session`

---

## 九、测试清单

### 9.1 协议级测试

至少验证以下场景：

1. 能连续收到多个 `chunk` 事件
2. 最终能收到 `done`
3. 出错时能收到 `error`
4. 前端不再依赖超时猜测是否结束

### 9.2 会话级测试

至少验证以下场景：

1. 同一会话连续发送两轮消息，后端上下文可延续
2. 新建对话后会使用新的 `sessionId`
3. 切换历史会话后，不会串上下文

### 9.3 页面级测试

至少验证以下场景：

1. 发送后 assistant 气泡内容逐步增长
2. 收到 `done` 后发送按钮恢复
3. 收到 `error` 后输入框内容能回填
4. 抽屉切换会话后消息列表同步更新

### 9.4 环境级测试

至少验证以下场景：

1. 微信开发者工具可正常流式
2. 真机环境可正常流式
3. 本地直连 `127.0.0.1` 或局域网地址时行为一致

---

## 十、建议实施顺序

建议按以下顺序推进：

1. 先确认后端 `/chat/stream` 已按标准 `SSE` 返回
2. 再在前端 `api/ai.js` 实现独立的流式 HTTP 请求和 `SSE` 解析
3. 再把 `stores/assistant.js` 的发送链路切过去
4. 最后回归 `pages/ai/index.vue` 的页面交互
5. 验证小程序端流式兼容性
6. 稳定后再考虑移除 WebSocket 旧逻辑

---

## 十一、前端改造完成后的验收标准

前端改造完成后，应满足以下标准：

- 聊天发送链路不再依赖 `WebSocket`
- 请求体显式携带 `session_id`
- assistant 消息可流式增长
- 流结束由后端 `done` 明确通知
- 流错误由后端 `error` 明确通知
- 不同历史会话切换后不会串上下文
- 新建对话会使用新的 `sessionId`
- 页面交互层不感知底层协议细节

---

## 十二、结论

这次前端改造的核心，不是重做聊天页面，而是把“会话模型”和“传输协议”解耦：

1. 会话模型继续沿用当前多会话 store
2. 传输层从 `WebSocket` 切到 `HTTP/SSE`
3. 页面层继续只关心 `发送中 / 回复中 / 完成 / 失败`

如果小程序端最终不能稳定消费 `HTTP` 流式 chunk，则应优先保留当前多会话和 `session_id` 方案，再考虑降级到 `HTTP 非流式` 或暂时保留 `WebSocket`。
