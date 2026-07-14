export const xiaoheDailyScene = {
  dateLabel: '7月13日 星期日',
  homeTitle: '今天，轻轻开口。',
  homeSubtitle: '小和已经帮你准备好了，不用选，直接开始。',
  title: '便利店先问一句',
  shortTitle: '便利店先问一句',
  reason: '昨天你已经会开头了，今天只要把一句话自然说完整。',
  target: '问出价格',
  sceneTag: '旅行场景',
  durationTag: '5 分钟',
  assistTag: '我会接住你',
  japaneseLine: 'すみません、これはいくらですか？',
  chineseLine: '不好意思，请问这个多少钱？',
  finishTitle: '先和我问出了一句价格。',
  finishSummary: '今天没有很多，只往前走了一小步。'
}

export const xiaoheTimelineItems = [
  {
    id: '2025-07-13',
    date: '7月13日',
    title: '第一次把价格问完整',
    scene: '便利店场景',
    description: '你先看了中文，然后跟着小和把“请问这个多少钱”完整说了出来。',
    memory: '小和记住了：你紧张时，会想先看中文。',
    action: '继续走一点',
    tone: 'pink'
  },
  {
    id: '2025-07-12',
    date: '7月12日',
    title: '第一次说出敬语开头',
    scene: '',
    description: '你开始能稳稳地说出“不好意思”。',
    memory: '那天，小和发现你越慢越自然。',
    action: '再看这天',
    tone: 'mist'
  },
  {
    id: '2025-07-11',
    date: '7月11日',
    title: '第一次愿意直接开口',
    scene: '',
    description: '你没有先去选功能，而是直接跟小和说了第一句。',
    memory: '从这天开始，主线才真的成立。',
    action: '',
    tone: 'warm'
  }
]

export const xiaoheTimelineDetails = {
  '2025-07-13': {
    id: '2025-07-13',
    date: '7月13日',
    title: '第一次把价格问完整',
    scene: '便利店场景',
    summary: '你先看了中文，然后跟着小和把“请问这个多少钱”完整说了出来。',
    growth: '今天不是学了很多，而是第一次把一句真实提问稳稳说完整。',
    memory: '小和记住了：你一紧张，就会想先看中文。下次我会先把提示放轻一点。',
    keySentence: '不好意思，请问这个多少钱？',
    nextHint: '明天，我们可以继续把下一句回应接上。',
    excerpts: [
      {
        role: 'assistant',
        content: '好，我们先从最简单的一句开始。'
      },
      {
        role: 'assistant',
        content: 'すみません、これはいくらですか？'
      },
      {
        role: 'user',
        content: '我想先看中文。'
      },
      {
        role: 'assistant',
        content: '可以，这句话就是：不好意思，请问这个多少钱？'
      }
    ]
  },
  '2025-07-12': {
    id: '2025-07-12',
    date: '7月12日',
    title: '第一次说出敬语开头',
    scene: '开口准备',
    summary: '那天你开始能稳稳地说出“不好意思”，不再一上来就卡住。',
    growth: '你开始抓住句子的开头，这让后面的表达轻松了很多。',
    memory: '小和记住了：你越慢越自然，所以催你往下说并不会更好。',
    keySentence: '不好意思……',
    nextHint: '第二天，小和才敢把完整提问交给你。',
    excerpts: [
      {
        role: 'assistant',
        content: '今天我们先不急着把整句说完。'
      },
      {
        role: 'assistant',
        content: '先把“不好意思”稳稳说出来就够了。'
      },
      {
        role: 'user',
        content: '不好意思……'
      },
      {
        role: 'assistant',
        content: '对，就是这样，慢一点反而更自然。'
      }
    ]
  },
  '2025-07-11': {
    id: '2025-07-11',
    date: '7月11日',
    title: '第一次愿意直接开口',
    scene: '第一次开始',
    summary: '你没有先去选功能，而是直接跟小和说了第一句。',
    growth: '这一天真正建立了主线感，你开始愿意跟着小和往前走。',
    memory: '小和记住了：只要入口够轻，你就愿意先开口。',
    keySentence: '我们开始吧。',
    nextHint: '从这天以后，时间线才慢慢长出来。',
    excerpts: [
      {
        role: 'assistant',
        content: '今天不用选功能，我们直接开始。'
      },
      {
        role: 'user',
        content: '好，那我们开始吧。'
      },
      {
        role: 'assistant',
        content: '好，我会陪你慢慢来。'
      }
    ]
  }
}
