import { buildVoiceUrl } from '@/utils/audio'

export const mockUserProfile = {
  nickName: 'Sora同学',
  avatarUrl: 'https://dummyimage.com/120x120/9ec8ff/ffffff&text=AI',
  level: 'JLPT N5',
  city: '上海',
  bio: '每天坚持 20 分钟，稳步提升日语表达力。'
}

export const mockDashboard = {
  todayCard: {
    title: '今日学习计划',
    progress: 68,
    duration: 22,
    target: '完成 N5 高频词 8 个 + 跟读 10 分钟',
    badge: '已坚持 17 天'
  },
  jlptLevels: [
    { id: 'N5', title: 'JLPT N5', desc: '入门基础，五十音与基础表达', color: '#6EA8FF' },
    { id: 'N4', title: 'JLPT N4', desc: '日常会话，掌握基础语法', color: '#7EC7FF' },
    { id: 'N3', title: 'JLPT N3', desc: '连接初中级，提升阅读能力', color: '#8CE0C1' },
    { id: 'N2', title: 'JLPT N2', desc: '商务与媒体表达强化', color: '#A5C8FF' },
    { id: 'N1', title: 'JLPT N1', desc: '高阶理解与精准表达', color: '#7A9EFF' }
  ],
  dailySentence: {
    japanese: '今日も一歩ずつ前に進みましょう。',
    kana: 'きょうも いっぽずつ まえに すすみましょう。',
    romaji: 'Kyou mo ippo zutsu mae ni susumimashou.',
    chinese: '今天也一步一步向前进吧。',
    audio: buildVoiceUrl('今日も一歩ずつ前に進みましょう。')
  },
  recentRecords: [
    { id: 1, title: 'N5 高频词复习', time: '今天 08:10', duration: '12 分钟', score: '92%' },
    { id: 2, title: '五十音 跟读练习', time: '昨天 21:00', duration: '15 分钟', score: '完成' },
    { id: 3, title: 'AI 敬语转换', time: '昨天 18:36', duration: '6 分钟', score: '3 轮对话' }
  ]
}

export const mockKanaGroups = {
  hiragana: [
    {
      title: '清音',
      list: [
        { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
        { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
        { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
        { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
        { kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' },
        { kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' },
        { kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' },
        { kana: 'や', romaji: 'ya' }, { kana: 'ゆ', romaji: 'yu' }, { kana: 'よ', romaji: 'yo' },
        { kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' },
        { kana: 'わ', romaji: 'wa' }, { kana: 'を', romaji: 'wo' }, { kana: 'ん', romaji: 'n' }
      ]
    }
  ],
  katakana: [
    {
      title: '清音',
      list: [
        { kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' },
        { kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' },
        { kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' },
        { kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' },
        { kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' },
        { kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' },
        { kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' },
        { kana: 'ヤ', romaji: 'ya' }, { kana: 'ユ', romaji: 'yu' }, { kana: 'ヨ', romaji: 'yo' },
        { kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' },
        { kana: 'ワ', romaji: 'wa' }, { kana: 'ヲ', romaji: 'wo' }, { kana: 'ン', romaji: 'n' }
      ]
    }
  ]
}

export const mockVocabularyList = [
  {
    id: 101,
    jlpt: 'N5',
    japanese: '学校',
    kana: 'がっこう',
    chinese: '学校',
    example: '学校へ行きます。',
    exampleZh: '我去学校。',
    audio: buildVoiceUrl('学校'),
    tags: ['场景', '高频']
  },
  {
    id: 102,
    jlpt: 'N5',
    japanese: '先生',
    kana: 'せんせい',
    chinese: '老师',
    example: '先生は親切です。',
    exampleZh: '老师很亲切。',
    audio: buildVoiceUrl('先生'),
    tags: ['人物']
  },
  {
    id: 103,
    jlpt: 'N5',
    japanese: '友達',
    kana: 'ともだち',
    chinese: '朋友',
    example: '友達と話します。',
    exampleZh: '和朋友聊天。',
    audio: buildVoiceUrl('友達'),
    tags: ['关系']
  },
  {
    id: 201,
    jlpt: 'N4',
    japanese: '準備',
    kana: 'じゅんび',
    chinese: '准备',
    example: '旅行の準備をしています。',
    exampleZh: '我正在做旅行准备。',
    audio: buildVoiceUrl('準備'),
    tags: ['动词名词']
  },
  {
    id: 202,
    jlpt: 'N4',
    japanese: '経験',
    kana: 'けいけん',
    chinese: '经验',
    example: '良い経験になりました。',
    exampleZh: '这成为了很好的经验。',
    audio: buildVoiceUrl('経験'),
    tags: ['抽象词']
  },
  {
    id: 301,
    jlpt: 'N3',
    japanese: '提案',
    kana: 'ていあん',
    chinese: '提案',
    example: '新しい提案をまとめました。',
    exampleZh: '我整理了新的提案。',
    audio: buildVoiceUrl('提案'),
    tags: ['商务']
  }
]

export const mockCheckinOverview = {
  signedToday: false,
  streakDays: 17,
  totalDays: 128,
  monthMinutes: 462,
  monthVocabulary: 96,
  calendar: [
    0, 1, 1, 0, 1, 1, 1,
    1, 0, 1, 1, 1, 1, 0,
    1, 1, 1, 0, 1, 1, 0,
    1, 1, 1, 1, 0, 0, 1,
    1, 0, 1
  ]
}

export const mockProfileStats = {
  totalMinutes: 1860,
  learnedWords: 324,
  conversationCount: 58,
  favoriteCount: 0,
  currentLevel: 'JLPT N5',
  targetLevel: 'JLPT N4'
}

