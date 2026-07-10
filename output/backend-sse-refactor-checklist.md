# langChainDemo 后端改造清单

## 文档目的

本文档用于梳理 `D:\learn\langChainDemo` 从当前 `WebSocket` 聊天链路迁移到 `HTTP/SSE + session_id` 的后端改造项。

本次只输出改造清单，不包含实际代码改动。

---

## 一、改造目标

后端目标统一为以下形态：

- 新增或改造一个 `HTTP` 流式聊天接口
- 响应协议使用标准 `SSE`
- 请求参数显式携带 `session_id`
- 会话历史按 `session_id` 真正隔离
- 回复结束由后端显式返回 `done` 事件
- 回复异常由后端显式返回 `error` 事件

建议目标接口：

- `POST /chat/stream`

请求体：

```json
{
  "message": "你好",
  "session_id": "assistant_xxx"
}
```

响应类型：

- `Content-Type: text/event-stream; charset=utf-8`

---

## 二、当前后端现状

当前涉及文件：

- `D:\learn\langChainDemo\main.py`
- `D:\learn\langChainDemo\api\chat.py`
- `D:\learn\langChainDemo\services\chat_service.py`
- `D:\learn\langChainDemo\websocket\chat.py`
- `D:\learn\langChainDemo\session\manager.py`
- `D:\learn\langChainDemo\memory\history.py`

当前问题：

1. `api/chat.py` 里虽然已经有 `StreamingResponse`，但接口只收 `message`，没有 `session_id`。
2. `chat_service.py` 只是 `yield chunk`，不是标准 `SSE` 格式。
3. `session/manager.py` 表面按 `session_id` 管理，实际所有 session 都共用同一个 `chat_history`。
4. `memory/history.py` 当前是全局单例，无法支撑真正的多会话隔离。
5. 前端现在已经按多会话在管理 `session_id`，后端如果不改，切换会话后仍会串上下文。
6. 当前 WebSocket 流结束依赖前端推断，不够稳定。

---

## 三、推荐改造范围

建议本次后端只改以下范围：

- 保留原 WebSocket 接口，作为过渡和回退方案
- 新增一套完整的 `HTTP/SSE` 流式接口
- 补齐按 `session_id` 隔离的会话管理

不建议本次一起做的内容：

- 不先引入数据库持久化
- 不先做历史会话列表查询接口
- 不先做删除会话、重命名会话等扩展功能
- 不先重构 LangChain 链本身

---

## 四、接口契约改造清单

### 4.1 新增请求模型

建议新增请求体模型，例如：

- 文件建议：`D:\learn\langChainDemo\schemas\chat.py`

建议定义：

- `message: str`
- `session_id: str`

目的：

- 替代当前接口只收裸字符串的方式
- 明确后端需要的上下文归属
- 方便后续扩展更多字段，例如 `user_id`、`scene`、`mode`

### 4.2 标准化 SSE 响应格式

建议统一返回以下事件：

1. `chunk`
用于流式文本增量返回

示例：

```text
event: chunk
data: {"text":"你"}

```

2. `done`
用于显式结束一轮回复

示例：

```text
event: done
data: {"reply":"你好，很高兴见到你","suggestion":"你可以继续介绍自己"}

```

3. `error`
用于显式返回错误信息

示例：

```text
event: error
data: {"message":"模型调用失败"}

```

### 4.3 建议的响应头

建议确保返回头至少包含：

- `Content-Type: text/event-stream; charset=utf-8`
- `Cache-Control: no-cache`
- `Connection: keep-alive`

如部署到 Nginx，后续还应检查：

- 是否关闭响应缓冲

---

## 五、文件级改造清单

### 5.1 `D:\learn\langChainDemo\main.py`

改造目标：

- 保留现有 `WebSocket /ws/chat`
- 保留现有 `router` 挂载
- 不需要在这里做复杂逻辑

建议动作：

- 无需大改
- 只确认 `api.chat.router` 中新增的 `/chat/stream` 可以正常挂载

验收点：

- `POST /chat/stream` 可通过 `main.py` 暴露出去

### 5.2 `D:\learn\langChainDemo\api\chat.py`

改造目标：

- 将当前仅接收 `message: str` 的接口改为接收 JSON 请求体
- 增加新的 `stream` 路由，明确用于 `SSE`

建议动作：

1. 新增 `POST /chat/stream`
2. 入参改为请求模型，例如 `ChatStreamRequest`
3. 将 `message` 和 `session_id` 一并传给 service 层
4. 返回 `StreamingResponse(..., media_type="text/event-stream")`

建议结果：

- 不再依赖 `message` 的 query/body 简写形式
- service 层拿到完整上下文参数

验收点：

- `POST /chat/stream` 能接收 JSON
- 请求体缺少 `message` 或 `session_id` 时会正常报参数错误

### 5.3 `D:\learn\langChainDemo\services\chat_service.py`

改造目标：

- 从“裸文本流”改造成“标准 SSE 事件流”
- 从“全局单 history”改造成“按 session_id 取 history”

建议动作：

1. 方法签名改成类似：

- `chat_stream(message: str, session_id: str)`

2. 进入方法后先通过 `get_session(session_id)` 取得本轮会话历史

3. 调用 `chain.stream(...)` 时，将该 `history.messages` 传入链

4. 每收到一个 chunk，就输出一条标准 SSE：

- `event: chunk`
- `data: {"text": "..."}`

5. 所有 chunk 完成后：

- 汇总 `full_response`
- 写入 `history.add_user_message(message)`
- 写入 `history.add_ai_message(full_response)`

6. 历史写入完成后，再输出一条 `done` 事件

7. 增加异常捕获：

- 出错时输出 `error` 事件
- 避免直接抛出后中断连接，导致前端只能拿到“连接失败”

建议额外补充：

- 将 SSE 事件格式封装成一个小工具函数，例如 `build_sse_event(event, data)`

验收点：

- 返回内容为合法 `SSE` 文本
- 前端可区分 `chunk`、`done`、`error`
- 一轮回复结束后，不再依赖前端静默超时判断

### 5.4 `D:\learn\langChainDemo\session\manager.py`

改造目标：

- 真正按 `session_id` 管理独立会话历史

当前问题：

- `sessions[session_id] = chat_history` 仍然指向同一个单例对象

建议动作：

1. 当 `session_id` 不存在时，直接创建新的 `InMemoryChatMessageHistory`
2. 每个 `session_id` 对应一个独立实例
3. `get_session(session_id)` 返回该独立实例

建议结果：

- 同一个 `session_id` 可继承上下文
- 不同 `session_id` 互不串话

验收点：

- `session_a` 连续两次提问时能承接前文
- `session_b` 首次提问时不会带出 `session_a` 的历史

### 5.5 `D:\learn\langChainDemo\memory\history.py`

改造目标：

- 不再作为全局唯一聊天历史来源

建议动作：

二选一：

1. 保留该文件，但改成提供“创建 history 实例”的工厂函数
2. 或者直接让 `session/manager.py` 自己 import `InMemoryChatMessageHistory` 并创建实例

建议倾向：

- 第二种更简单，当前项目更适合

注意：

- 不建议继续保留 `chat_history = InMemoryChatMessageHistory()` 这种全局单例作为主逻辑

验收点：

- 后端代码里不再把所有会话统一绑到一个 `chat_history`

### 5.6 `D:\learn\langChainDemo\websocket\chat.py`

改造目标：

- 本次不强制删除
- 作为迁移期间的兼容链路保留

建议动作：

1. 暂时保留原实现
2. 如后续确认全部切到 SSE，再考虑下线
3. 如果要顺手修，也应同步改成按 `session_id` 真隔离

验收点：

- 不影响现有回退能力

---

## 六、推荐新增文件

建议新增以下文件以提升清晰度：

### 6.1 `D:\learn\langChainDemo\schemas\chat.py`

用途：

- 放聊天接口请求模型

建议内容：

- `ChatStreamRequest`

### 6.2 `D:\learn\langChainDemo\utils\sse.py`

用途：

- 统一格式化 SSE 事件文本

建议职责：

- 输入 `event_name` 和 `data`
- 输出标准 SSE 文本块

例如职责类似：

- `build_sse_event("chunk", {"text": "你"})`

输出：

```text
event: chunk
data: {"text":"你"}

```

这样可以避免在 service 里手写字符串拼接。

---

## 七、建议的后端处理流程

建议后端新链路按下面的顺序工作：

1. 前端 `POST /chat/stream`
2. 后端解析 `message` 和 `session_id`
3. 后端通过 `get_session(session_id)` 获取独立历史
4. 调用 `chain.stream(...)`
5. 每个 chunk 立即封装成 `chunk` 事件返回
6. 全部完成后保存本轮用户消息和 AI 回复
7. 返回 `done` 事件
8. 如果异常则返回 `error` 事件

---

## 八、测试清单

### 8.1 接口级测试

至少验证以下场景：

1. 正常请求，能持续收到多个 `chunk`
2. 最后一定能收到 `done`
3. 异常时能收到 `error`
4. 空 `message` 时后端能正确拦截
5. 缺失 `session_id` 时后端能正确拦截

### 8.2 会话隔离测试

至少验证以下场景：

1. `session_a` 连续两轮提问，第二轮有上下文记忆
2. `session_b` 发起首轮提问，不带 `session_a` 上下文
3. 切回 `session_a` 后，仍能继续原上下文

### 8.3 联调测试

至少验证以下场景：

1. uni-app 前端切换聊天会话后，上下文不串
2. 新建对话后，后端上下文确实重置到新 `session_id`
3. 服务端显式 `done` 到达时，前端立即结束流式状态

---

## 九、上线前风险点

### 9.1 小程序端流式兼容性

虽然协议是 `SSE`，但 uni-app / 小程序端通常不是浏览器原生 `EventSource` 模式。

需要确认前端最终采用的流式接收方式是否能稳定拿到 chunk。

如果前端运行环境不能稳定消费流式 chunk，则需要预备降级方案：

- `HTTP 非流式 + session_id`

### 9.2 反向代理缓冲

如果后端后续挂到 Nginx 或其他网关后面，需要确认代理层不会把流式响应缓冲成整包再返回。

否则前端会看到“最后一次性返回全部内容”，失去流式效果。

### 9.3 内存会话生命周期

当前设计仍然是内存级会话：

- 服务重启后会丢失
- 会话过多会占内存

这不影响当前联调和单机开发，但后续若要正式化，需要再考虑：

- TTL 清理
- 持久化存储

---

## 十、建议实施顺序

建议按以下顺序推进：

1. 先改 `session/manager.py`，把会话隔离做真
2. 再改 `services/chat_service.py`，输出标准 SSE
3. 再改 `api/chat.py`，补 `POST /chat/stream`
4. 用 `curl` 或 Postman 验证事件流格式
5. 前端再切到新的 HTTP/SSE 链路
6. 稳定后再评估是否下线 WebSocket

---

## 十一、后端改造完成后的验收标准

后端改造完成后，应满足以下标准：

- `POST /chat/stream` 可用
- 请求体包含 `message` 和 `session_id`
- 返回为标准 `text/event-stream`
- 流式过程中有多个 `chunk` 事件
- 流结束时有显式 `done` 事件
- 异常时有显式 `error` 事件
- 不同 `session_id` 之间上下文完全隔离
- 同一 `session_id` 能连续继承上下文

---

## 十二、结论

本次后端改造的核心，不是单纯把 `WebSocket` 改成 `HTTP`，而是同时完成这三件事：

1. 输出标准 `SSE` 协议
2. 显式接收并使用 `session_id`
3. 真正实现按 `session_id` 的会话历史隔离

如果只改接口形态，不改会话管理，前端多会话切换后仍然会串上下文，这一点需要优先解决。
