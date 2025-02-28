// Données des kana et kanji
const hiraganaList = [
  // Voyelles de base
  'あ', 'い', 'う', 'え', 'お',
  // K
  'か', 'き', 'く', 'け', 'こ',
  // S
  'さ', 'し', 'す', 'せ', 'そ',
  // T
  'た', 'ち', 'つ', 'て', 'と',
  // N
  'な', 'に', 'ぬ', 'ね', 'の',
  // H
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  // M
  'ま', 'み', 'む', 'め', 'も',
  // Y
  'や', 'ゆ', 'よ',
  // R
  'ら', 'り', 'る', 'れ', 'ろ',
  // W
  'わ', 'を',
  // N
  'ん',
  // Dakuten (゛) : ajout des versions avec marque de voisement
  'が', 'ぎ', 'ぐ', 'げ', 'ご', // K + dakuten
  'ざ', 'じ', 'ず', 'ぜ', 'ぞ', // S + dakuten
  'だ', 'ぢ', 'づ', 'で', 'ど', // T + dakuten
  'ば', 'び', 'ぶ', 'べ', 'ぼ', // H + dakuten
  // Handakuten (゜) : ajout des versions avec marque de semi-voisement
  'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', // H + handakuten
  // Combinaisons avec "y" (petits ya, yu, yo)
  'きゃ', 'きゅ', 'きょ', // Ky + y
  'しゃ', 'しゅ', 'しょ', // Sh + y
  'ちゃ', 'ちゅ', 'ちょ', // Ch + y
  'にゃ', 'にゅ', 'にょ', // Ny + y
  'ひゃ', 'ひゅ', 'ひょ', // Hy + y
  'みゃ', 'みゅ', 'みょ', // My + y
  'りゃ', 'りゅ', 'りょ', // Ry + y
  'ぎゃ', 'ぎゅ', 'ぎょ', // Gy + y
  'じゃ', 'じゅ', 'じょ', // J + y
  'びゃ', 'びゅ', 'びょ', // By + y
  'ぴゃ', 'ぴゅ', 'ぴょ'  // Py + y
];

const katakanaList = [
  // Voyelles de base
  'ア', 'イ', 'ウ', 'エ', 'オ',
  // K
  'カ', 'キ', 'ク', 'ケ', 'コ',
  // S
  'サ', 'シ', 'ス', 'セ', 'ソ',
  // T
  'タ', 'チ', 'ツ', 'テ', 'ト',
  // N
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  // H
  'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  // M
  'マ', 'ミ', 'ム', 'メ', 'モ',
  // Y
  'ヤ', 'ユ', 'ヨ',
  // R
  'ラ', 'リ', 'ル', 'レ', 'ロ',
  // W
  'ワ', 'ヲ',
  // N
  'ン',
  // Dakuten (゛) : ajout des versions avec marque de voisement
  'ガ', 'ギ', 'グ', 'ゲ', 'ゴ', // K + dakuten
  'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', // S + dakuten
  'ダ', 'ヂ', 'ヅ', 'デ', 'ド', // T + dakuten
  'バ', 'ビ', 'ブ', 'ベ', 'ボ', // H + dakuten
  // Handakuten (゜) : ajout des versions avec marque de semi-voisement
  'パ', 'ピ', 'プ', 'ペ', 'ポ', // H + handakuten
  // Combinaisons avec "y" (petits ya, yu, yo)
  'キャ', 'キュ', 'キョ', // Ky + y
  'シャ', 'シュ', 'ショ', // Sh + y
  'チャ', 'チュ', 'チョ', // Ch + y
  'ニャ', 'ニュ', 'ニョ', // Ny + y
  'ヒャ', 'ヒュ', 'ヒョ', // Hy + y
  'ミャ', 'ミュ', 'ミョ', // My + y
  'リャ', 'リュ', 'リョ', // Ry + y
  'ギャ', 'ギュ', 'ギョ', // Gy + y
  'ジャ', 'ジュ', 'ジョ', // J + y
  'ビャ', 'ビュ', 'ビョ', // By + y
  'ピャ', 'ピュ', 'ピョ'  // Py + y
];

const kanjiN5List = ['一', '七', '万', '三', '上', '下', '中', '九', '二', '五', '人', '今', '休', '何', '先', '入', '八', '六', '円', '出', '分', '前', '北', '十', '千', '午', '半', '南', '友', '右', '名', '四', '国', '土', '外', '大', '天', '女', '子', '学', '小', '山', '川', '左', '年', '後', '日', '時', '書', '月', '木', '本', '来', '東', '校', '母', '毎', '気', '水', '火', '父', '生', '男', '白', '百', '聞', '行', '西', '見', '話', '語', '読', '車', '金', '長', '間', '雨', '電', '食', '高'];
const kanjiN4List = ['不', '世', '主', '事', '京', '代', '以', '会', '住', '体', '作', '使', '元', '公', '切', '別', '力', '動', '口', '台', '同', '品', '員', '問', '地', '場', '売', '多', '始', '安', '家', '少', '工', '広', '店', '度', '建', '強', '心', '思', '急', '意', '手', '持', '教', '文', '料', '新', '方', '明', '有', '朝', '業', '楽', '止', '正', '死', '海', '無', '物', '特', '理', '用', '田', '町', '画', '界', '病', '発', '目', '真', '着', '知', '研', '社', '私', '究', '空', '立', '終', '考', '者', '自', '言', '計', '質', '起', '足', '転', '近', '送', '通', '運', '道', '重', '野', '開', '院', '集', '題'];

const kanaToRomaji = {
  // Hiragana
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o', 
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  // Dakuten (゛)
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  // Handakuten (゜)
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  // Combinaisons avec "y"
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',

  // Katakana
  'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
  'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
  'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
  'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
  'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
  'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
  'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
  'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
  'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
  'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
  // Dakuten (゛)
  'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
  'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
  'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
  'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
  // Handakuten (゜)
  'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
  // Combinaisons avec "y"
  'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
  'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
  'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
  'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
  'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
  'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
  'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
  'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
  'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
  'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
  'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',

  // Kanji N5 avec traduction et emoji
  '一': 'ichi 🔢 (un)', '七': 'nana 🔢 (sept)', '万': 'man 🔢 (dix mille)', 
  '三': 'san 🔢 (trois)', '上': 'ue ⬆️ (haut)', '下': 'shita ⬇️ (bas)', 
  '中': 'naka ⚖️ (milieu)', '九': 'kyuu 🔢 (neuf)', '二': 'ni 🔢 (deux)', 
  '五': 'go 🔢 (cinq)', '人': 'hito 👤 (personne)', '今': 'ima ⏳ (maintenant)', 
  '休': 'yasumi 😴 (repos)', '何': 'nani ❓ (quoi)', '先': 'saki ⬆️ (devant)', 
  '入': 'iri 🚪 (entrer)', '八': 'hachi 🔢 (huit)', '六': 'roku 🔢 (six)', 
  '円': 'en 💴 (yen)', '出': 'de 🚪 (sortir)', '分': 'fun ⏱️ (minute)', 
  '前': 'mae ⬅️ (avant)', '北': 'kita 🌏 (nord)', '十': 'juu 🔢 (dix)', 
  '千': 'sen 🔢 (mille)', '午': 'go ⏰ (midi)', '半': 'han ➗ (moitié)', 
  '南': 'minami 🌏 (sud)', '友': 'tomo 🤝 (ami)', '右': 'migi ➡️ (droite)', 
  '名': 'na 📛 (nom)', '四': 'shi 🔢 (quatre)', '国': 'kuni 🗺️ (pays)', 
  '土': 'tsuchi 🌍 (terre)', '外': 'soto 🚪 (extérieur)', '大': 'dai 📏 (grand)', 
  '天': 'ten ☁️ (ciel)', '女': 'onna 👩 (femme)', '子': 'ko 👶 (enfant)', 
  '学': 'gaku 📚 (études)', '小': 'shou 📐 (petit)', '山': 'yama 🏞️ (montagne)', 
  '川': 'kawa 🌊 (rivière)', '左': 'hidari ⬅️ (gauche)', '年': 'nen 📅 (année)', 
  '後': 'ato ➡️ (après)', '日': 'hi ☀️ (jour)', '時': 'ji ⏰ (heure)', 
  '書': 'sho ✍️ (écrire)', '月': 'getsu 🌙 (mois)', '木': 'ki 🌳 (arbre)', 
  '本': 'hon 📖 (livre)', '来': 'rai 🚶‍➡️ (venir)', '東': 'higashi 🌏 (est)', 
  '校': 'kou 🏫 (école)', '母': 'haha 👩‍🦳 (mère)', '毎': 'mai 🔄 (chaque)', 
  '気': 'ki 💨 (air)', '水': 'mizu 💧 (eau)', '火': 'hi 🔥 (feu)', 
  '父': 'tou 👨‍🦳 (père)', '生': 'sei 🌱 (vie)', '男': 'otoko 👨 (homme)', 
  '白': 'shiro ⚪ (blanc)', '百': 'hyaku 🔢 (cent)', '聞': 'kiku 👂 (écouter)', 
  '行': 'iku 🚶 (aller)', '西': 'nishi 🌏 (ouest)', '見': 'mi 👀 (voir)', 
  '話': 'hanashi 💬 (parler)', '語': 'go 🗣️ (langue)', '読': 'yomu 📖 (lire)', 
  '車': 'kuruma 🚗 (voiture)', '金': 'kin 💰 (or)', '長': 'naga 📏 (long)', 
  '間': 'aida ⏳ (intervalle)', '雨': 'ame 🌧️ (pluie)', '電': 'den ⚡ (électricité)', 
  '食': 'ta 🍽️ (manger)', '高': 'taka ⛰️ (haut)',
  // Kanji N4 avec traduction et emoji
  '不': 'fu ❌ (non)', '世': 'yo 🌍 (monde)', '主': 'nu 🏠 (maître)', 
  '事': 'koto 💼 (affaire)', '京': 'kyou 🏯 (capitale)', '代': 'dai ⏳ (génération)', 
  '以': 'i ⬅️ (depuis)', '会': 'kai 🤝 (rencontre)', '住': 'ju 🏡 (vivre)', 
  '体': 'tai 💪 (corps)', '作': 'saku ✍️ (faire)', '使': 'shi 🀄️ (utiliser)', 
  '元': 'gen 💰 (origine)', '公': 'kou 🏛️ (public)', '切': 'kiri ✂️ (couper)', 
  '別': 'betsu 🔀 (séparer)', '力': 'riki 💪 (force)', '動': 'dou 🚶 (bouger)', 
  '口': 'kuchi 👄 (bouche)', '台': 'dai 📺 (plateforme)', '同': 'dou 👥 (même)', 
  '品': 'hin 📦 (article)', '員': 'in 👥 (membre)', '問': 'mon ❓ (question)', 
  '地': 'chi 🌍 (terre)', '場': 'ba 🏟️ (lieu)', '売': 'bai 🛒 (vendre)', 
  '多': 'ta 🔢 (plusieurs)', '始': 'shi 🏁 (commencer)', '安': 'an 💸 (bon marché)', 
  '家': 'ie 🏠 (maison)', '少': 'shou 📐 (peu)', '工': 'kou 🛠️ (travail)', 
  '広': 'hiro 🏞️ (large)', '店': 'ten 🏬 (magasin)', '度': 'do 📏 (degré)', 
  '建': 'tate 🏗️ (construire)', '強': 'tsuyo 💪 (fort)', '心': 'kokoro 💖 (cœur)', 
  '思': 'omo 💭 (penser)', '急': 'kyuu ⏩ (rapide)', '意': 'i 💡 (intention)', 
  '手': 'te ✋ (main)', '持': 'mo 🛠️ (tenir)', '教': 'kyou 📚 (enseigner)', 
  '文': 'bun 📜 (culture)', '料': 'ryou 🍲 (frais)', '新': 'shin 🌟 (nouveau)', 
  '方': 'hou ➡️ (direction)', '明': 'mei ☀️ (clair)', '有': 'yu ✅ (avoir)', 
  '朝': 'asa 🌞 (matin)', '業': 'gyou 💼 (travail)', '楽': 'raku 🎵 (plaisir)', 
  '止': 'tome ⛔ (arrêter)', '正': 'sei ✅ (correct)', '死': 'shi 💀 (mort)', 
  '海': 'umi 🌊 (mer)', '無': 'mu ❌ (rien)', '物': 'mono 🎁 (chose)', 
  '特': 'toku ⭐ (spécial)', '理': 'ri ⚖️ (raison)', '用': 'you 🛠️ (usage)', 
  '田': 'ta 🌾 (champ)', '町': 'machi 🏙️ (ville)', '画': 'ga 🎨 (peinture)', 
  '界': 'kai 🌍 (monde)', '病': 'byou 🤒 (maladie)', '発': 'hatsu 🚀 (lancer)', 
  '目': 'me 👀 (œil)', '真': 'shin ✅ (vrai)', '着': 'cha 👕 (porter)', 
  '知': 'chi 🧠 (savoir)', '研': 'ken 🔍 (recherche)', '社': 'sha 🏢 (société)', 
  '私': 'watashi 👤 (moi)', '究': 'kyuu 🔍 (recherche)', '空': 'sora ☁️ (ciel)', 
  '立': 'tatsu 🏞️ (debout)', '終': 'owari 🏁 (fin)', '考': 'kangae 💭 (penser)', 
  '者': 'sha 👤 (personne)', '自': 'ji 🚗 (soi)', '言': 'gen 💬 (parole)', 
  '計': 'kei 📏 (mesure)', '質': 'shitsu ⚖️ (qualité)', '起': 'oki 🌅 (se lever)', 
  '足': 'ashi 👣 (pied)', '転': 'ten 🔄 (tourner)', '近': 'chika 📍 (proche)', 
  '送': 'sou 📦 (envoyer)', '通': 'tsu 📞 (passer)', '運': 'un 🚚 (transporter)', 
  '道': 'michi 🛤️ (chemin)', '重': 'juu ⚖️ (lourd)', '野': 'no 🌾 (champ)', 
  '開': 'kai 🏁 (ouvrir)', '院': 'in 🏥 (institut)', '集': 'shu 👥 (rassembler)', 
  '題': 'dai ❓ (sujet)'
};

// Variables globales
let selectedKana = [], selectedRomaji = [], currentKana, score = 0, mistakes = 0, lastKana = null, streak = 0;
let hardcoreMode = false, soundEnabled = true, invertedMode = false, playerLogin = localStorage.getItem('playerLogin') || null;
let timerInterval, uniqueCorrect = 0, correctlyIdentified = new Set();

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const editPseudoScreen = document.getElementById('edit-pseudo-screen');
const settingsScreen = document.getElementById('settings-screen');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const hiraganaCheck = document.getElementById('hiragana-check');
const katakanaCheck = document.getElementById('katakana-check');
const kanjiN5Check = document.getElementById('kanji-n5-check');
const kanjiN4Check = document.getElementById('kanji-n4-check');
const hardcoreCheck = document.getElementById('hardcore-check');
const invertedCheck = document.getElementById('inverted-check');
const soundCheck = document.getElementById('sound-check');
const startBtn = document.getElementById('start-btn');
const pseudoDisplay = document.getElementById('pseudo-display');
const pseudoInput = document.getElementById('pseudo-input');
const playerPseudoInput = document.getElementById('player-pseudo');
const savePseudoBtn = document.getElementById('save-pseudo-btn');
const kanaDisplay = document.getElementById('kana-display');
const choicesDiv = document.getElementById('choices');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('high-score');
const recordDateSpan = document.getElementById('record-date');
const livesDiv = document.getElementById('lives');
const timerDiv = document.getElementById('timer');
const recordOverlay = document.getElementById('record-overlay');
const highScoresDiv = document.getElementById('high-scores');
const playAgainBtn = document.getElementById('play-again');
const restartBtn = document.getElementById('restart-btn');
const inGameRestartBtn = document.getElementById('in-game-restart-btn');
const characterCount = document.getElementById('character-count');
const streakDisplay = document.getElementById('streak-display');
const streakMessage = document.getElementById('streak-message');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const streakLeaderboard = document.getElementById('streak-leaderboard');
const scoreLeaderboard = document.getElementById('score-leaderboard');
const backBtn = document.getElementById('back-btn');
const editPseudoLink = document.getElementById('edit-pseudo-link');
const editPseudoInput = document.getElementById('edit-pseudo');
const saveEditPseudoBtn = document.getElementById('save-edit-pseudo-btn');
const backToStartBtn = document.getElementById('back-to-start-btn');
const settingsBtn = document.getElementById('settings-btn');
const cleanRankingBtn = document.getElementById('clean-ranking-btn');
const backToStartSettingsBtn = document.getElementById('back-to-start-settings-btn');

const maxLives = 3;
const liveEmoji = '❤️';
const lostEmoji = '💔';

// Sons
const startScreenMusic = new Audio('sounds/japanese-tv-meme-compilation.mp3');
startScreenMusic.loop = true;
const correctSound = new Audio('sounds/wow-anime-voice-accent.mp3');
const wrongSound = new Audio('sounds/Steve-Harvey-Nani.mp3');
const gameOverSound = new Audio('sounds/12322.mp3');

// Messages hilarants
const goodMessages = [
  "Tu es une machine à tuer les kana !", "Kanji-kun t’aime !", "Waouh, tu es un maître weeb !", 
  "Incroyable, continue à casser du kana !", "Tu es un dieu du japonais !"
];
const badMessages = [
  "Baka, essaie encore !", "Oh non, tu es une honte pour les fans d’anime !", 
  "Weeb fail, recommence !", "Ton otaku intérieur pleure...", "Rattrape-toi, loser !"
];
const milestoneMessages = [
  "10 bonnes réponses : Es-tu un dieu du japonais ?", "20 bonnes : Tu es trop OP, weeb !", 
  "30 bonnes : Le Japon te salue, maître !", "40 bonnes : Tu es un légendaire kana-slayer !",
  "50 bonnes : Incroyable, tu domines !", "60 bonnes : Hyper speed weeb !",
  "70 bonnes : Maître absolu du kana !", "80 bonnes : Légende vivante !",
  "90 bonnes : Dépassement des limites !", "100 bonnes : Dieu du japonais !"
];

// Thèmes de streak (10 paliers)
const streakThemes = {
  0: { background: 'rgba(255, 105, 180, 0.9)', border: '#00ffff' },
  10: { background: 'linear-gradient(45deg, #FF00FF, #00FFFF)', border: '#00FFFF' },
  20: { background: 'linear-gradient(45deg, #FFD700, #FF00FF)', border: '#FFD700' },
  30: { background: 'linear-gradient(45deg, #00FF00, #FFFF00)', border: '#00FF00' },
  40: { background: 'linear-gradient(45deg, #FF4500, #FF00FF)', border: '#FF4500' },
  50: { background: 'linear-gradient(45deg, #1E90FF, #00FFFF)', border: '#1E90FF' },
  60: { background: 'linear-gradient(45deg, #32CD32, #FFD700)', border: '#32CD32' },
  70: { background: 'linear-gradient(45deg, #FF69B4, #FF00FF)', border: '#FF69B4' },
  80: { background: 'linear-gradient(45deg, #20B2AA, #00FFFF)', border: '#20B2AA' },
  90: { background: 'linear-gradient(45deg, #DAA520, #FFD700)', border: '#DAA520' },
  100: { background: 'linear-gradient(45deg, #FF1493, #FF00FF)', border: '#FF1493' }
};

// Configuration Airtable
const AIRTABLE_BASE_ID = 'appPzjIoDIbgVSApx';
const AIRTABLE_STREAK_TABLE_NAME = 'streak'; // Utilisation du nom de la table au lieu de l'ID
const AIRTABLE_SCORE_TABLE_NAME = 'score';   // Utilisation du nom de la table au lieu de l'ID
const AIRTABLE_TOKEN = 'patkSqxQl9IP6aECB.4b8096b8c8af259c1f9e46767f6750b71f9ecd2b773e8070b3a613dd8f2ab164';

document.addEventListener('DOMContentLoaded', () => {
  startScreenMusic.play().catch(error => {
      console.log("La lecture automatique a été bloquée. L'utilisateur doit interagir pour démarrer la musique.");
  });

  // Vérifier et gérer le login au chargement
  checkLogin();

  // Initialiser le pseudo si existant
  if (playerLogin) {
      document.getElementById('current-pseudo').textContent = playerLogin;
      pseudoDisplay.classList.remove('hidden');
      pseudoInput.classList.add('hidden');
  } else {
      pseudoDisplay.classList.add('hidden');
      pseudoInput.classList.remove('hidden');
  }

  savePseudoBtn.onclick = () => {
      const login = playerPseudoInput.value.trim();
      if (login) {
          playerLogin = login;
          localStorage.setItem('playerLogin', playerLogin);
          pseudoDisplay.querySelector('#current-pseudo').textContent = playerLogin;
          pseudoDisplay.classList.remove('hidden');
          pseudoInput.classList.add('hidden');
          updateLeaderboard();
      } else {
          alert('Veuillez entrer un pseudo valide !');
      }
  };

  editPseudoLink.onclick = (e) => {
      e.preventDefault();
      startScreen.classList.add('hidden');
      editPseudoScreen.classList.remove('hidden');
      editPseudoInput.value = playerLogin || '';
  };

  saveEditPseudoBtn.onclick = () => {
      const newLogin = editPseudoInput.value.trim();
      if (newLogin) {
          playerLogin = newLogin;
          localStorage.setItem('playerLogin', playerLogin);
          editPseudoScreen.classList.add('hidden');
          startScreen.classList.remove('hidden');
          document.getElementById('current-pseudo').textContent = playerLogin;
          updateLeaderboard();
      } else {
          alert('Veuillez entrer un pseudo valide !');
      }
  };

  backToStartBtn.onclick = () => {
      editPseudoScreen.classList.add('hidden');
      startScreen.classList.remove('hidden');
  };

  settingsBtn.onclick = () => {
      startScreen.classList.add('hidden');
      settingsScreen.classList.remove('hidden');
  };

  cleanRankingBtn.onclick = () => {
      if (confirm('大掃除オタクを実行しますか？ (Nettoyer tous les classements ?)')) {
          cleanAirtableRankings();
      }
  };

  backToStartSettingsBtn.onclick = () => {
      settingsScreen.classList.add('hidden');
      startScreen.classList.remove('hidden');
  };

  // Charger et afficher le classement initial
  updateLeaderboard();
});

// Fonction pour vérifier et demander le login
function checkLogin() {
  if (!playerLogin) {
      pseudoDisplay.classList.add('hidden');
      pseudoInput.classList.remove('hidden');
  } else {
      pseudoDisplay.classList.remove('hidden');
      pseudoInput.classList.add('hidden');
      document.getElementById('current-pseudo').textContent = playerLogin;
  }
}

// Fonctions Airtable
async function fetchAirtableData(tableName, fields = ['login', 'score', 'date']) {
  try {
      console.log(`Fetching data from table: ${tableName}, fields: ${fields.join(', ')}`);
      const response = await axios.get(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`,
          {
              headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
              params: { fields, maxRecords: 5, view: 'Grid view' } // Ajout des paramètres pour correspondre à curl
          }
      );
      console.log('Airtable response:', response.data);
      return response.data.records.map(record => ({
          login: record.fields.login || 'Anonyme',
          score: record.fields.score || 0,
          date: record.fields.date ? new Date(record.fields.date).toLocaleString() : new Date().toLocaleString()
      }));
  } catch (error) {
      console.error('Erreur lors de la récupération des données Airtable:', error);
      alert('エラー：データ取得失敗！ (Erreur : Échec de récupération des données !)');
      return [];
  }
}

async function updateAirtableData(tableName, data) {
  try {
      console.log(`Updating table ${tableName} with data:`, data);

      // Validation pour s'assurer que score > 0
      if (data.score < 1) {
          console.warn('Score doit être supérieur à 0. Ajustement à 1.');
          data.score = 1; // Forcer un score positif minimum
      }

      // Formater la date en ISO 8601 sans millisecondes
      data.date = new Date(data.date).toISOString().split('T')[0];

      if (data.score < 1) {
        console.warn('Score doit être supérieur ou égal à 1. Ajustement à 1.');
        data.score = 1; // Forcer un score minimum de 1
      }
      if (!data.login || data.login.trim() === '') {
          throw new Error('Login ne peut pas être vide.');
      }

      await axios.post(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`,
          { fields: data },
          { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
      );
  } catch (error) {
      console.error('Erreur lors de la mise à jour des données Airtable:', error.response ? error.response.data : error);
      alert('エラー：データ保存失敗！ (Erreur : Échec de sauvegarde des données !)');
  }
}

async function cleanAirtableRankings() {
  try {
      // Nettoyer la table des streaks
      const streakRecords = await fetchAirtableData(AIRTABLE_STREAK_TABLE_NAME);
      for (const record of streakRecords) {
          await axios.delete(
              `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_STREAK_TABLE_NAME}/${record.id}`,
              { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
          );
      }
      // Nettoyer la table des scores
      const scoreRecords = await fetchAirtableData(AIRTABLE_SCORE_TABLE_NAME);
      for (const record of scoreRecords) {
          await axios.delete(
              `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_SCORE_TABLE_NAME}/${record.id}`,
              { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
          );
      }
      updateLeaderboard();
      alert('大掃除オタク完了！ (Classements nettoyés !)');
  } catch (error) {
      console.error('Erreur lors du nettoyage des classements:', error);
      alert('エラー：大掃除オタク失敗！ (Erreur : Nettoyage échoué !)');
  }
}

async function updateHighScores(finalScore, finalStreak) {
  if (!playerLogin) {
      alert('Veuillez entrer un pseudo avant de sauvegarder les scores !');
      return;
  }

  // Vérifier que les scores sont positifs
  if (finalScore < 1 || !finalScore) finalScore = 1;
  if (finalStreak < 1 || !finalStreak) finalStreak = 1;

  // Sauvegarder le score dans Airtable
  await updateAirtableData(AIRTABLE_SCORE_TABLE_NAME, {
    login: playerLogin,
    score: finalScore,
    date: new Date().toISOString().split('T')[0]
  });
  
  // Sauvegarder le streak dans Airtable
  await updateAirtableData(AIRTABLE_STREAK_TABLE_NAME, {
      login: playerLogin,
      score: finalStreak,
      date: new Date().toISOString().split('T')[0]
  });

  // Mettre à jour les meilleurs scores affichés
  const scores = await fetchAirtableData(AIRTABLE_SCORE_TABLE_NAME);
  const streaks = await fetchAirtableData(AIRTABLE_STREAK_TABLE_NAME);

  const topScore = scores.reduce((max, current) => (current.score > max.score ? current : max), { score: 0 }).score;
  const topStreak = streaks.reduce((max, current) => (current.score > max.score ? current : max), { score: 0 }).score;

  highScoreSpan.textContent = topScore;
  recordDateSpan.textContent = scores.find(s => s.score === topScore)?.date || '-';

  if (finalScore > topScore || finalStreak > topStreak) {
      recordOverlay.classList.remove('hidden');
      setTimeout(() => recordOverlay.classList.add('hidden'), 3000);
  }

  updateLeaderboard();
}

async function updateLeaderboard() {
  const scores = await fetchAirtableData(AIRTABLE_SCORE_TABLE_NAME);
  const streaks = await fetchAirtableData(AIRTABLE_STREAK_TABLE_NAME);

  // Classement des scores (tri par score descendant)
  const sortedScores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  scoreLeaderboard.innerHTML = sortedScores.map((s, i) => `<p>${i + 1}. ${s.login} - ${s.score} (${s.date})</p>`).join('');

  // Classement des streaks (tri par streak descendant)
  const sortedStreaks = streaks.sort((a, b) => b.score - a.score).slice(0, 5);
  streakLeaderboard.innerHTML = sortedStreaks.map((s, i) => `<p>${i + 1}. ${s.login} - ${s.score} (${s.date})</p>`).join('');
}

// Fonctions utilitaires
function getRandomKana(exclude = null) {
  let kana;
  do {
      kana = selectedKana[Math.floor(Math.random() * selectedKana.length)];
  } while (kana === exclude);
  return kana;
}

function getRandomRomaji(exclude) {
  let romaji;
  do {
      romaji = selectedRomaji[Math.floor(Math.random() * selectedRomaji.length)];
  } while (romaji === exclude);
  return romaji;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateLives() {
  livesDiv.textContent = liveEmoji.repeat(maxLives - mistakes) + lostEmoji.repeat(mistakes);
}

function launchConfetti() {
  confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
  });
}

function startTimer() {
  let timeLeft = 5;
  timerDiv.style.display = 'block';
  timerDiv.textContent = `TIME LEFT: ${timeLeft}s`;
  timerInterval = setInterval(() => {
      timeLeft--;
      timerDiv.textContent = `TIME LEFT: ${timeLeft}s`;
      if (timeLeft <= 3) {
          timerDiv.style.animation = 'pulse 0.5s infinite';
          timerDiv.textContent += " Dépêche-toi, weeb !";
      }
      if (timeLeft <= 0) {
          clearInterval(timerInterval);
          if (soundEnabled) wrongSound.play();
          mistakes++;
          updateLives();
          if (mistakes >= maxLives) {
              gameOver();
          } else {
              nextKana();
          }
      }
  }, 1000);
}

function updateTheme() {
  let themeKey = 0;
  if (streak >= 10) themeKey = 10;
  if (streak >= 20) themeKey = 20;
  if (streak >= 30) themeKey = 30;
  if (streak >= 40) themeKey = 40;
  if (streak >= 50) themeKey = 50;
  if (streak >= 60) themeKey = 60;
  if (streak >= 70) themeKey = 70;
  if (streak >= 80) themeKey = 80;
  if (streak >= 90) themeKey = 90;
  if (streak >= 100) themeKey = 100;
  const theme = streakThemes[themeKey] || streakThemes[0];
  gameScreen.style.background = theme.background;
  gameScreen.style.borderColor = theme.border;
  for (let i = 0; i <= 100; i += 10) {
      if (streak >= i) gameScreen.classList.add(`streak-${i}`);
      else gameScreen.classList.remove(`streak-${i}`);
  }
}

function updateCharacterCount() {
  const totalChars = selectedKana.length;
  const percentage = Math.round((correctlyIdentified.size / totalChars) * 100);
  characterCount.textContent = `${correctlyIdentified.size}/${totalChars} (${percentage}%)`;
}

// Fonctions de jeu
function initializeChoices() {
  selectedKana = [];
  selectedRomaji = [];
  if (hiraganaCheck.checked) {
      selectedKana.push(...hiraganaList);
      selectedRomaji.push(...hiraganaList.map(k => kanaToRomaji[k]));
  }
  if (katakanaCheck.checked) {
      selectedKana.push(...katakanaList);
      selectedRomaji.push(...katakanaList.map(k => kanaToRomaji[k]));
  }
  if (kanjiN5Check.checked) {
      selectedKana.push(...kanjiN5List);
      selectedRomaji.push(...kanjiN5List.map(k => kanaToRomaji[k].split(' ')[0]));
  }
  if (kanjiN4Check.checked) {
      selectedKana.push(...kanjiN4List);
      selectedRomaji.push(...kanjiN4List.map(k => kanaToRomaji[k].split(' ')[0]));
  }
  hardcoreMode = hardcoreCheck.checked;
  invertedMode = invertedCheck.checked;
  soundEnabled = soundCheck.checked;
  uniqueCorrect = 0;
  score = 0;
  mistakes = 0;
  streak = 0;
  correctlyIdentified.clear(); // Réinitialiser le Set des caractères identifiés
  scoreSpan.textContent = '0';
  updateLives();
  updateCharacterCount();
  updateTheme();
  lastKana = null;
  streakMessage.classList.add('hidden');
  streakMessage.textContent = '';
}

function nextKana() {
  if (hardcoreMode) {
      clearInterval(timerInterval);
      startTimer();
  } else {
      timerDiv.style.display = 'none';
  }
  let kana;
  do {
      kana = getRandomKana(lastKana);
  } while (kana === lastKana);
  currentKana = kana;
  lastKana = kana;
  kanaDisplay.textContent = invertedMode ? kanaToRomaji[kana].split(' ')[0] : kana;
  kanaDisplay.classList.remove('correct-answer'); // Retirer l'effet clignotant
  const correctAnswer = invertedMode ? kana : kanaToRomaji[kana].split(' ')[0];
  
  let choices = [correctAnswer];
  while (choices.length < 4) {
      let randomChoice = invertedMode ? 
          getRandomKana(correctAnswer) : 
          getRandomRomaji(correctAnswer);
      if (!choices.includes(randomChoice)) choices.push(randomChoice);
  }
  choices = shuffle(choices);
  
  choicesDiv.innerHTML = '';
  choices.forEach(choice => {
      const btn = document.createElement('button');
      const isKanji = kanjiN5List.includes(currentKana) || kanjiN4List.includes(currentKana);
      if (invertedMode) {
          const kanjiForChoice = Object.entries(kanaToRomaji).find(([k, v]) => k === choice);
          if (kanjiForChoice) {
              const parts = kanaToRomaji[kanjiForChoice[0]].split(' ');
              const emoji = parts[1] !== undefined ? parts[1] : '';
              const translation = parts[2] !== undefined ? `(${parts[2].replace('<small>', '').replace('</small>', '')})` : '';
              btn.innerHTML = `${choice} ${emoji}${translation ? `<br>${translation}` : ''}`;
          } else {
              btn.textContent = choice;
          }
      } else if (isKanji) {
          const kanjiForChoice = Object.entries(kanaToRomaji).find(([k, v]) => v.startsWith(choice));
          if (kanjiForChoice) {
              const parts = kanaToRomaji[kanjiForChoice[0]].split(' ');
              const emoji = parts[1] !== undefined ? parts[1] : '';
              const translation = parts[2] !== undefined ? `(${parts[2].replace('<small>', '').replace('</small>', '')})` : '';
              btn.innerHTML = `${choice} ${emoji}${translation ? `<br>${translation}` : ''}`;
          } else {
              btn.textContent = choice;
          }
      } else {
          btn.textContent = choice;
      }
      btn.onclick = () => checkAnswer(choice);
      choicesDiv.appendChild(btn);
  });
  streakDisplay.textContent = `Streak: ${streak}`;
}

function checkAnswer(selected) {
  if (hardcoreMode) clearInterval(timerInterval);
  const correctAnswer = invertedMode ? currentKana : kanaToRomaji[currentKana].split(' ')[0];
  const correct = selected === correctAnswer;

  const button = Array.from(choicesDiv.children).find(btn => btn.textContent.includes(selected.split(' ')[0]));
  if (correct) {
      if (soundEnabled) correctSound.play();
      launchConfetti();
      button.classList.add('correct');
      score++;
      streak++;
      if (!correctlyIdentified.has(currentKana) && !invertedMode) {
          correctlyIdentified.add(currentKana);
          uniqueCorrect++;
      }
      scoreSpan.textContent = score;
      updateTheme();
      updateCharacterCount();
      if (streak % 10 === 0 && streak > 0) {
          const milestone = milestoneMessages[Math.floor(streak / 10) - 1] || "Tu es un légendaire kana-slayer !";
          streakMessage.textContent = milestone;
          streakMessage.classList.remove('hidden');
          setTimeout(() => streakMessage.classList.add('hidden'), 3000); // Cacher après 3 secondes
      }
      setTimeout(() => {
          button.classList.remove('correct');
          nextKana();
      }, 500); // Passer à la question suivante plus rapidement (500 ms)
  } else {
      if (soundEnabled) wrongSound.play();
      button.classList.add('wrong');
      streak = 0;
      updateTheme();
      mistakes++;
      updateLives();
      const correctKanji = Object.entries(kanaToRomaji).find(([k, v]) => (invertedMode ? k === correctAnswer : v.startsWith(correctAnswer)));
      if (correctKanji) {
          kanaDisplay.textContent = invertedMode ? correctKanji[0] : correctKanji[0]; // Afficher le kanji/kana correct
          kanaDisplay.classList.add('correct-answer');
          setTimeout(() => {
              kanaDisplay.classList.remove('correct-answer');
              nextKana();
          }, 2000); // Passer à la question suivante plus rapidement (2000 ms)
      } else {
          nextKana();
      }
      if (mistakes >= maxLives) {
          gameOver();
      }
  }
  setTimeout(() => {
      button.classList.remove('wrong');
  }, 500);
}

function gameOver() {
  if (soundEnabled) gameOverSound.play();
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  const finalScore = score;
  const finalStreak = streak;
  updateHighScores(finalScore, finalStreak);
}

// Écouteurs d'événements
startBtn.onclick = () => {
  if (!hiraganaCheck.checked && !katakanaCheck.checked && !kanjiN5Check.checked && !kanjiN4Check.checked) {
      alert('Au moins une option doit être sélectionnée !');
      return;
  }
  if (!playerLogin) {
      alert('Veuillez entrer un pseudo avant de commencer !');
      return;
  }
  startScreenMusic.pause();
  initializeChoices();
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  nextKana();
};

playAgainBtn.onclick = () => {
  score = 0;
  mistakes = 0;
  scoreSpan.textContent = '0';
  updateLives();
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  startScreenMusic.play();
};

restartBtn.onclick = () => {
  score = 0;
  mistakes = 0;
  scoreSpan.textContent = '0';
  updateLives();
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  startScreenMusic.play();
};

inGameRestartBtn.onclick = () => {
  score = 0;
  mistakes = 0;
  scoreSpan.textContent = '0';
  updateLives();
  gameScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  startScreenMusic.play();
};

leaderboardBtn.onclick = () => {
  startScreen.classList.add('hidden');
  leaderboardScreen.classList.remove('hidden');
  updateLeaderboard();
};

backBtn.onclick = () => {
  leaderboardScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
};

// Jouer la musique de l'écran de démarrage au chargement
window.onload = () => {
  startScreenMusic.play().catch(error => {
      console.log("La lecture automatique a été bloquée. L'utilisateur doit interagir pour démarrer la musique.");
  });
};