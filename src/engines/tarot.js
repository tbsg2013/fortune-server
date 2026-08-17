// 塔罗牌：22张大阿尔卡纳 + 56张小阿尔卡纳（简化正逆位关键词），AI负责深度解读
const MAJOR = [
  { num: 0, name: '愚者', en: 'The Fool', upright: ['开始', '冒险', '纯真', '自由'], reversed: ['鲁莽', '犹豫', '停滞'] },
  { num: 1, name: '魔术师', en: 'The Magician', upright: ['创造', '意志', '行动', '资源'], reversed: ['欺骗', '操纵', '浪费才能'] },
  { num: 2, name: '女祭司', en: 'The High Priestess', upright: ['直觉', '潜意识', '智慧', '神秘'], reversed: ['忽视直觉', '秘密', '表面化'] },
  { num: 3, name: '皇后', en: 'The Empress', upright: ['丰饶', '滋养', '母性', '创造力'], reversed: ['依赖', '过度保护', '创造受阻'] },
  { num: 4, name: '皇帝', en: 'The Emperor', upright: ['权威', '稳定', '领导', '秩序'], reversed: ['专制', '固执', '失控'] },
  { num: 5, name: '教皇', en: 'The Hierophant', upright: ['传统', '信仰', '指引', '学习'], reversed: ['教条', '反叛', '质疑权威'] },
  { num: 6, name: '恋人', en: 'The Lovers', upright: ['爱情', '结合', '选择', '和谐'], reversed: ['失衡', '优柔寡断', '价值观冲突'] },
  { num: 7, name: '战车', en: 'The Chariot', upright: ['胜利', '意志力', '前进', '自律'], reversed: ['失控', '方向迷失', '受阻'] },
  { num: 8, name: '力量', en: 'Strength', upright: ['勇气', '内在力量', '耐心', '温柔'], reversed: ['自我怀疑', '软弱', '失控'] },
  { num: 9, name: '隐者', en: 'The Hermit', upright: ['内省', '独处', '追寻真理', '指引'], reversed: ['孤立', '逃避', '固执己见'] },
  { num: 10, name: '命运之轮', en: 'Wheel of Fortune', upright: ['转机', '命运', '循环', '好运'], reversed: ['厄运', '抗拒变化', '停滞'] },
  { num: 11, name: '正义', en: 'Justice', upright: ['公正', '平衡', '因果', '诚实'], reversed: ['不公', '失衡', '逃避责任'] },
  { num: 12, name: '倒吊人', en: 'The Hanged Man', upright: ['牺牲', '换位思考', '暂停', '顿悟'], reversed: ['无谓牺牲', '拖延', '抗拒'] },
  { num: 13, name: '死神', en: 'Death', upright: ['结束', '转变', '重生', '放手'], reversed: ['抗拒结束', '停滞', '恐惧改变'] },
  { num: 14, name: '节制', en: 'Temperance', upright: ['平衡', '调和', '耐心', '适度'], reversed: ['失衡', '过度', '急躁'] },
  { num: 15, name: '恶魔', en: 'The Devil', upright: ['束缚', '欲望', '诱惑', '执着'], reversed: ['挣脱', '觉醒', '放下'] },
  { num: 16, name: '高塔', en: 'The Tower', upright: ['剧变', '觉醒', '崩塌', '释放'], reversed: ['灾难预警', '逃避真相', '延迟爆发'] },
  { num: 17, name: '星星', en: 'The Star', upright: ['希望', '疗愈', '灵感', '信念'], reversed: ['失望', '缺乏信心', '悲观'] },
  { num: 18, name: '月亮', en: 'The Moon', upright: ['潜意识', '迷茫', '幻象', '不安'], reversed: ['拨云见日', '真相浮现', '释然'] },
  { num: 19, name: '太阳', en: 'The Sun', upright: ['成功', '喜悦', '活力', '光明'], reversed: ['暂时阴霾', '过度乐观', '延迟'] },
  { num: 20, name: '审判', en: 'Judgement', upright: ['觉醒', '重生', '召唤', '回顾'], reversed: ['自我怀疑', '逃避审判', '错失机会'] },
  { num: 21, name: '世界', en: 'The World', upright: ['圆满', '完成', '成就', '整合'], reversed: ['未竟之事', '缺憾', '迟来圆满'] },
];

const MINOR_SUITS = ['权杖', '圣杯', '宝剑', '星币'];
const MINOR_RANKS = ['王牌', '二', '三', '四', '五', '六', '七', '八', '九', '十', '侍从', '骑士', '王后', '国王'];
const MINOR_THEMES = {
  权杖: '行动、热情、事业与创造力',
  圣杯: '情感、人际、爱与直觉',
  宝剑: '思维、沟通、挑战与真相',
  星币: '物质、金钱、健康与实务',
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 类型：single(单张) / three(过去-现在-未来) / cross(凯尔特十字简版)
export function drawTarot({ type = 'three', question = '' } = {}) {
  const deck = [];
  for (const c of MAJOR) deck.push({ kind: 'major', num: c.num, name: c.name, en: c.en, upright: c.upright, reversed: c.reversed });
  for (const suit of MINOR_SUITS) {
    for (const rank of MINOR_RANKS) {
      deck.push({ kind: 'minor', suit, rank: rank + (rank === '王牌' ? '' : ''), fullName: rank + suit, theme: MINOR_THEMES[suit] });
    }
  }
  const shuffled = shuffle(deck);
  const count = type === 'single' ? 1 : type === 'cross' ? 10 : 3;
  const positions = type === 'three' ? ['过去', '现在', '未来'] : type === 'cross' ? ['现状', '阻碍', '潜意识', '过去', '目标', '近期', '自我', '环境', '希望与恐惧', '结果'] : ['当下'];
  const cards = shuffled.slice(0, count).map((c, i) => {
    const reversed = Math.random() < 0.3;
    return { ...c, position: positions[i] || '第' + (i + 1) + '位', reversed };
  });
  return { type, question, cards, spreadName: type === 'single' ? '单张指引' : type === 'three' ? '时间之流' : '凯尔特十字', deckSize: deck.length };
}
