<template>
        <FloatingShapesBackground/>
        <div class="monk-message-system">
                <header>
                        <div class="container">
                                <div class="logo">
                                        <span>🪷</span>
                                        <span>法師留言系統</span>
                                </div>
                                <div class="user-info">
                                        <div class="user-avatar">{{ userInfo.firstChar }}</div>
                                        <div class="user-details">
                                                <h3>{{ userInfo.name }}</h3>
                                                <span class="user-level">{{ userInfo.level }}</span>
                                        </div>
                                </div>
                        </div>
                </header>

                <div class="container">
                        <div class="tabs">
                                <button v-for="(tab, index) in tabs" :key="index" class="tab-button"
                                        :class="{ active: activeTab === index }" @click="activeTab = index">
                                        {{ tab }}
                                </button>
                        </div>

                        <div class="card">
                                <div class="card-header">
                                        <h3 class="card-title">法師留言</h3>
                                        <span>💬</span>
                                </div>

                                <div class="filter-options">
                                        <button v-for="(filter, index) in filters" :key="index" class="filter-button"
                                                :class="{ active: activeFilter === index }"
                                                @click="activeFilter = index">
                                                {{ filter }}
                                        </button>
                                </div>

                                <div v-if="showNewQuestionForm" class="message-form">
                                        <h3 class="form-title">提出新問題</h3>
                                        <div class="form-group">
                                                <label class="form-label" for="question-title">問題標題</label>
                                                <input type="text" id="question-title" class="form-input"
                                                        placeholder="請輸入問題標題" v-model="newQuestion.title" />
                                        </div>
                                        <div class="form-group">
                                                <label class="form-label" for="question-category">問題分類</label>
                                                <select id="question-category" class="form-input"
                                                        v-model="newQuestion.category">
                                                        <option value="">請選擇問題分類</option>
                                                        <option value="scripture">經典解析</option>
                                                        <option value="practice">修行方法</option>
                                                        <option value="confusion">心靈困惑</option>
                                                        <option value="application">佛法應用</option>
                                                </select>
                                        </div>
                                        <div class="form-group">
                                                <label class="form-label" for="question-content">問題內容</label>
                                                <textarea id="question-content" class="form-textarea"
                                                        placeholder="請詳細描述您的問題或困惑..."
                                                        v-model="newQuestion.content"></textarea>
                                        </div>
                                        <button class="submit-button" @click="submitQuestion">提交問題</button>
                                </div>

                                <div class="message-list">
                                        <div v-for="(message, index) in filteredMessages" :key="index"
                                                class="message-item">
                                                <div class="message-header">
                                                        <div class="monk-info">
                                                                <div class="monk-avatar">{{ message.authorFirstChar }}
                                                                </div>
                                                                <div>
                                                                        <span class="monk-name">{{ message.author
                                                                        }}</span>
                                                                        <span class="monk-title">{{ message.title
                                                                        }}</span>
                                                                </div>
                                                        </div>
                                                        <div class="message-date">{{ message.date }}</div>
                                                </div>
                                                <div class="message-content">
                                                        <span v-for="(tag, tagIndex) in message.tags" :key="tagIndex"
                                                                class="topic-tag">
                                                                {{ tag }}
                                                        </span>
                                                        <h4>{{ message.subject }}</h4>
                                                        <div v-html="message.content"></div>
                                                        <div v-if="message.scripture" class="message-scripture">
                                                                {{ message.scripture }}
                                                        </div>
                                                </div>
                                                <div class="message-footer">
                                                        <div>
                                                                {{ message.isQuestion ? '提問於 ' : '回覆於 '
                                                                }}{{ message.responseDate || message.date }}
                                                        </div>
                                                        <div class="message-actions">
                                                                <div v-if="!message.isQuestion" class="action-button"
                                                                        @click="thankMessage(index)">
                                                                        <span>🙏</span>
                                                                        <span>感恩({{ message.thanks }})</span>
                                                                </div>
                                                                <div v-if="message.isQuestion" class="action-button"
                                                                        @click="watchQuestion(index)">
                                                                        <span>👁️</span>
                                                                        <span>關注({{ message.watchers }})</span>
                                                                </div>
                                                                <div class="action-button"
                                                                        @click="toggleReplyForm(index)">
                                                                        <span>💬</span>
                                                                        <span>回覆</span>
                                                                </div>
                                                                <div class="action-button"
                                                                        @click="bookmarkMessage(index)">
                                                                        <span>⭐</span>
                                                                        <span>收藏</span>
                                                                </div>
                                                        </div>
                                                </div>
                                                <div v-if="message.showReplyForm" class="reply-form">
                                                        <textarea class="form-textarea"
                                                                style="min-height: 80px; margin-bottom: 10px"
                                                                placeholder="請輸入您的回覆..."
                                                                v-model="message.replyText"></textarea>
                                                        <button class="submit-button"
                                                                style="padding: 8px 15px; font-size: 14px"
                                                                @click="submitReply(index)">
                                                                提交回覆
                                                        </button>
                                                </div>
                                        </div>
                                </div>

                                <div class="pagination">
                                        <div v-for="(page, index) in pages" :key="index" class="page-button"
                                                :class="{ active: activePage === page }" @click="activePage = page">
                                                {{ page }}
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
// 添加類型定義
interface UserInfo {
        name: string;
        firstChar: string;
        level: string;
}

interface NewQuestion {
        title: string;
        category: string;
        content: string;
}

interface Message {
        author: string;
        authorFirstChar: string;
        title: string;
        date: string;
        responseDate?: string;
        tags: string[];
        subject: string;
        content: string;
        scripture?: string;
        thanks?: number;
        watchers?: number;
        isQuestion: boolean;
        showReplyForm: boolean;
        replyText: string;
}

import { ref, computed, onMounted } from 'vue';
import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';

// 用戶信息
const userInfo = ref<UserInfo>({
        name: '王小明',
        firstChar: '王',
        level: '修行者・初階'
});

// 頁籤與過濾選項
const tabs = ref<string[]>(['所有留言', '未回覆', '已回覆', '我的提問']);
const activeTab = ref<number>(0);

const filters = ref<string[]>(['全部主題', '經典解析', '修行方法', '心靈困惑', '佛法應用']);
const activeFilter = ref<number>(0);

// 新問題表單
const showNewQuestionForm = ref<boolean>(true);
const newQuestion = ref<NewQuestion>({
        title: '',
        category: '',
        content: ''
});

// 分頁
const pages = ref<(number | string)[]>([1, 2, 3, 4, 5, '...', 10]);
const activePage = ref<number | string>(2);

// 留言數據
const messages = ref<Message[]>([
        {
                author: '妙法法師',
                authorFirstChar: '妙',
                title: '常住法師',
                date: '2025/05/10 14:30',
                responseDate: '2025/05/10',
                tags: ['經典解析', '心經'],
                subject: '如何理解心經中的「色不異空，空不異色」？',
                content: `
      <p>「色不異空，空不異色」是心經中非常深奧的一句話，它表達了佛法中對於「空性」和「色相」關係的深刻理解。</p>
      <p>「色」指的是物質世界的一切現象，包括我們的身體、周圍的環境等有形有相的事物。「空」則是指這些現象本身沒有恆常不變的自性，是由眾多因緣條件和合而成的。</p>
      <p>這句話的意思是，物質現象（色）和空性（空）並非兩個對立的概念，而是一體的兩面。物質世界的存在正是因為它具有空性，才能夠產生變化和流轉；而空性也不是虛無，而是通過物質現象來表現的。</p>
    `,
                scripture: '「觀自在菩薩，行深般若波羅蜜多時，照見五蘊皆空，度一切苦厄。舍利子，色不異空，空不異色，色即是空，空即是色，受想行識，亦復如是。」——《般若波羅蜜多心經》',
                thanks: 23,
                isQuestion: false,
                showReplyForm: false,
                replyText: ''
        },
        {
                author: '智慧法師',
                authorFirstChar: '智',
                title: '客座法師',
                date: '2025/05/09 10:15',
                responseDate: '2025/05/09',
                tags: ['修行方法', '禪修'],
                subject: '初學者如何開始禪修練習？',
                content: `
      <p>對於初學者來說，禪修可能看起來很神秘，但實際上它是一種非常實用的心靈鍛鍊方法。以下是幾個簡單的步驟：</p>
      <p>1. <strong>姿勢</strong>：找一個安靜的地方，採取舒適但挺直的坐姿。可以盤腿坐在墊子上，也可以坐在椅子上，重要的是保持脊椎挺直。</p>
      <p>2. <strong>呼吸</strong>：將注意力放在自然的呼吸上。不需要刻意控制呼吸，只需要觀察它的來去。</p>
      <p>3. <strong>時間</strong>：剛開始可以從5-10分鐘開始，逐漸延長到20-30分鐘。</p>
      <p>4. <strong>專注</strong>：當心思飄走時（這是必然會發生的），溫和地將注意力帶回呼吸。這個「覺察到走神並帶回」的過程本身就是修行。</p>
      <p>5. <strong>持續</strong>：每天堅持練習，比偶爾長時間練習更有效。</p>
    `,
                scripture: '「若人靜坐一須臾，勝造恆沙七寶塔；寶塔畢竟化為塵，一念淨心成正覺。」——《六祖壇經》',
                thanks: 17,
                isQuestion: false,
                showReplyForm: false,
                replyText: ''
        },
        // 其他訊息保持不變，省略以節省空間...
        {
                author: '圓滿法師',
                authorFirstChar: '圓',
                title: '住持',
                date: '2025/05/07 16:45',
                responseDate: '2025/05/07',
                tags: ['心靈困惑', '情緒管理'],
                subject: '如何面對生活中的挫折和負面情緒？',
                content: `
      <p>生活中的挫折和負面情緒是每個人都會經歷的。從佛法的角度來看，這些都是無常的表現。以下是一些方法可以幫助我們面對：</p>
      <p>1. <strong>覺察</strong>：首先是覺察到自己的情緒，不壓抑也不縱容，只是客觀地觀察它。</p>
      <p>2. <strong>接納</strong>：接受這些情緒的存在，理解它們是自然反應，不必為有這些情緒而自責。</p>
      <p>3. <strong>觀照</strong>：觀察情緒背後的想法和觀念，往往是我們的執著和期待導致了痛苦。</p>
      <p>4. <strong>放下</strong>：嘗試放下對結果的執著，理解一切都在變化中，沒有永恆不變的事物。</p>
      <p>5. <strong>慈悲</strong>：對自己和他人培養慈悲心，理解每個人都在各自的苦難中掙扎。</p>
    `,
                scripture: '「心若不生塵念，自性常清淨；自心起見，自性起智，不受一切苦，即是解脫自在。」——《六祖壇經》',
                thanks: 29,
                isQuestion: false,
                showReplyForm: false,
                replyText: ''
        },
        {
                author: '林心如',
                authorFirstChar: '林',
                title: '居士',
                date: '2025/05/06 20:10',
                tags: ['佛法應用', '日常生活'],
                subject: '在忙碌的工作中如何保持正念？',
                content: `
      <p>我是一名上班族，每天工作很忙碌，經常感到壓力很大。我想知道有什麼方法可以在工作中保持正念，不被壓力和負面情緒所困擾？</p>
      <p>我嘗試過在午休時間短暫禪修，但回到工作中很快又會陷入緊張和焦慮中。有沒有什麼簡單實用的方法可以在工作過程中應用？</p>
    `,
                watchers: 12,
                isQuestion: true,
                showReplyForm: false,
                replyText: ''
        },
        {
                author: '慈悲法師',
                authorFirstChar: '慈',
                title: '副住持',
                date: '2025/05/06 21:30',
                responseDate: '2025/05/06',
                tags: ['回覆', '佛法應用'],
                subject: '回覆：在忙碌的工作中如何保持正念？',
                content: `
      <p>林居士您好，這是非常實用的問題。在忙碌的現代生活中保持正念確實具有挑戰性，以下是一些可以在工作中應用的方法：</p>
      <p>1. <strong>呼吸覺察</strong>：在工作間隙，或者感到壓力時，可以把注意力放在呼吸上3-5次。這只需要幾秒鐘，但能有效重置你的注意力。</p>
      <p>2. <strong>微小覺察</strong>：在日常動作中保持覺察，例如感受雙腳踩在地面的感覺，喝水時感受水的溫度，打字時感受指尖的觸感。</p>
      <p>3. <strong>轉換心態</strong>：將工作視為修行的一部分，每個任務都是培養專注和耐心的機會。</p>
      <p>4. <strong>設置提醒</strong>：可以在手機或電腦上設置定時提醒，每隔一段時間提醒自己回到當下，哪怕只是短暫地覺察一下自己的呼吸和身體。</p>
      <p>5. <strong>善用通勤時間</strong>：上下班的路上可以練習觀察周圍的環境而不加評判，或者專注於呼吸和身體感受。</p>
    `,
                scripture: '「若能一切時中看見自己過愆，即是功德。若能見他人非，與自己過愆，即是惡業。」——《六祖壇經》',
                thanks: 15,
                isQuestion: false,
                showReplyForm: false,
                replyText: ''
        }
]);

// 過濾留言
const filteredMessages = computed(() => {
        // 根據選定的標籤和過濾器過濾留言
        let filtered = [...messages.value];

        // 根據標籤過濾
        if (activeTab.value === 1) { // 未回覆
                filtered = filtered.filter(msg => msg.isQuestion && !messages.value.some(reply =>
                        reply.subject === `回覆：${msg.subject}`
                ));
        } else if (activeTab.value === 2) { // 已回覆
                filtered = filtered.filter(msg => !msg.isQuestion || messages.value.some(reply =>
                        reply.subject === `回覆：${msg.subject}`
                ));
        } else if (activeTab.value === 3) { // 我的提問
                filtered = filtered.filter(msg => msg.isQuestion && msg.author === userInfo.value.name);
        }

        // 根據主題過濾
        if (activeFilter.value !== 0) { // 不是"全部主題"
                const filterTopic = filters.value[activeFilter.value];
                if (filterTopic) {
                        filtered = filtered.filter(msg => msg.tags.includes(filterTopic));
                }
        }

        return filtered;
});

// 方法
const submitQuestion = () => {
        if (!newQuestion.value.title.trim()) {
                alert('請輸入問題標題');
                return;
        }

        if (!newQuestion.value.category) {
                alert('請選擇問題分類');
                return;
        }

        if (!newQuestion.value.content.trim()) {
                alert('請輸入問題內容');
                return;
        }

        // 模擬新增問題到留言列表
        // const categoryMap: Record<string, string> = {
        //         'scripture': '經典解析',
        //         'practice': '修行方法',
        //         'confusion': '心靈困惑',
        //         'application': '佛法應用'
        // };

        const now = new Date();
        const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // 確保我們有一個有效的類別，如果沒有匹配的類別，使用預設值
        const category = newQuestion.value.category;

        // 直接使用更強的類型斷言確保結果是字符串
        let displayCategory: string;

        if (category === 'scripture') {
                displayCategory = '經典解析';
        } else if (category === 'practice') {
                displayCategory = '修行方法';
        } else if (category === 'confusion') {
                displayCategory = '心靈困惑';
        } else if (category === 'application') {
                displayCategory = '佛法應用';
        } else {
                displayCategory = '佛法應用'; // 預設值
        }

        messages.value.unshift({
                author: userInfo.value.name,
                authorFirstChar: userInfo.value.firstChar,
                title: '居士',
                date: dateStr,
                tags: [displayCategory], // 現在 displayCategory 保證是字符串
                subject: newQuestion.value.title,
                content: `<p>${newQuestion.value.content}</p>`,
                watchers: 0,
                isQuestion: true,
                showReplyForm: false,
                replyText: ''
        });

        alert('您的提問已提交，法師將盡快回覆。');

        // 重置表單
        newQuestion.value.title = '';
        newQuestion.value.category = '';
        newQuestion.value.content = '';
};

const toggleReplyForm = (index: number) => {
        const message = messages.value[index];
        if (message) {
                message.showReplyForm = !message.showReplyForm;
        }
};

const submitReply = (index: number) => {
        const message = messages.value[index];

        if (!message) {
                return;
        }

        if (!message.replyText.trim()) {
                alert('請輸入回覆內容');
                return;
        }

        alert('您的回覆已提交');
        message.showReplyForm = false;
        message.replyText = '';
};

const thankMessage = (index: number) => {
        const message = messages.value[index];
        if (message && message.thanks !== undefined) {
                message.thanks++;
        }
};

const watchQuestion = (index: number) => {
        const message = messages.value[index];
        if (message && message.watchers !== undefined) {
                message.watchers++;
        }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bookmarkMessage = (index: number) => {
        alert('已加入收藏');
};

// 生命週期鉤子
onMounted(() => {
        console.log('法師留言系統已加載');
});
</script>

<style scoped>
/* 在scoped style中，:root選擇器不會應用到全局 */
/* 改為在當前組件的根元素中定義變量 */
.monk-message-system {
        /* CSS變量定義 */
        --primary: #4a6fa0;
        --secondary: #e8f0fb;
        --accent: #6d8cb0;
        --light: #ffffff;
        --dark: #333333;
        --success: #4ca873;
        --warning: #f0ae54;
        --border: #eaeaea;
        --text-light: #777777;
}

* {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
}

.monk-message-system {
        font-family: 'Arial', '微軟正黑體', sans-serif;
        color: var(--dark);
        line-height: 1.6;
        background-color: #f5f7fa;
}

.container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
}

header {
        background-color: white;
        color: var(--primary);
        padding: 20px 0;
        margin-bottom: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border);
}

header .container {
        display: flex;
        align-items: center;
        justify-content: space-between;
}

.logo {
        font-size: 24px;
        font-weight: bold;
        display: flex;
        align-items: center;
}

.logo span:first-child {
        margin-right: 10px;
}

.user-info {
        display: flex;
        align-items: center;
}

.user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: var(--primary);
        font-size: 20px;
        font-weight: bold;
        border: 2px solid var(--primary);
}

.user-details h3 {
        font-size: 18px;
        margin-bottom: 5px;
        color: var(--primary);
}

.user-level {
        background-color: var(--primary);
        color: white;
        padding: 3px 8px;
        border-radius: 10px;
        font-size: 12px;
}

.tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        background-color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
}

.tab-button {
        padding: 10px 20px;
        background-color: var(--secondary);
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        color: var(--dark);
        transition: all 0.3s ease;
}

.tab-button.active {
        background-color: var(--primary);
        color: white;
}

.card {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease;
        margin-bottom: 20px;
}

.card:hover {
        transform: translateY(-3px);
}

.card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        border-bottom: 1px solid var(--secondary);
        padding-bottom: 10px;
}

.card-title {
        font-size: 20px;
        color: var(--primary);
        font-weight: bold;
}

.message-list {
        max-height: none;
        overflow-y: auto;
        border: 1px solid var(--secondary);
        border-radius: 8px;
        padding: 10px;
        background-color: var(--light);
        margin-bottom: 20px;
}

.message-item {
        padding: 15px;
        border-bottom: 1px solid var(--secondary);
        margin-bottom: 15px;
}

.message-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
}

.message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
}

.monk-info {
        display: flex;
        align-items: center;
}

.monk-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        color: var(--primary);
        font-size: 16px;
        font-weight: bold;
        border: 2px solid var(--primary);
}

.monk-name {
        font-weight: bold;
        color: var(--primary);
}

.monk-title {
        font-size: 12px;
        color: var(--text-light);
        margin-left: 5px;
}

.message-date {
        color: var(--text-light);
        font-size: 14px;
}

.message-content {
        line-height: 1.8;
        color: var(--dark);
        margin-bottom: 10px;
}

.message-content h4 {
        margin: 10px 0;
}

.message-scripture {
        font-style: italic;
        color: var(--primary);
        background-color: var(--secondary);
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 14px;
        border-left: 3px solid var(--primary);
}

.message-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;
        color: var(--text-light);
}

.message-actions {
        display: flex;
        gap: 15px;
}

.action-button {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        transition: all 0.2s ease;
}

.action-button:hover {
        color: var(--primary);
}

.message-form {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
}

.form-title {
        font-size: 18px;
        color: var(--primary);
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--secondary);
}

.form-group {
        margin-bottom: 15px;
}

.form-label {
        display: block;
        margin-bottom: 5px;
        color: var(--dark);
        font-weight: bold;
}

.form-input,
.form-textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border);
        border-radius: 5px;
        font-family: 'Arial', '微軟正黑體', sans-serif;
        font-size: 16px;
        color: var(--dark);
        transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(74, 111, 160, 0.2);
}

.form-textarea {
        min-height: 150px;
        resize: vertical;
}

.submit-button {
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
}

.submit-button:hover {
        background-color: var(--accent);
        transform: translateY(-2px);
}

.filter-options {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
}

.filter-button {
        background-color: var(--secondary);
        border: none;
        border-radius: 20px;
        padding: 5px 15px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--dark);
}

.filter-button.active {
        background-color: var(--primary);
        color: white;
}

.filter-button:hover {
        background-color: var(--accent);
        color: white;
}

.pagination {
        display: flex;
        justify-content: center;
        gap: 5px;
        margin-top: 20px;
}

.page-button {
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border);
        border-radius: 5px;
        background-color: var(--light);
        cursor: pointer;
        transition: all 0.3s ease;
}

.page-button.active {
        background-color: var(--primary);
        color: white;
        border-color: var(--primary);
}

.page-button:hover:not(.active) {
        background-color: var(--secondary);
}

.topic-tag {
        background-color: var(--secondary);
        color: var(--primary);
        padding: 3px 8px;
        border-radius: 15px;
        font-size: 12px;
        margin-right: 5px;
        display: inline-block;
        margin-bottom: 5px;
}

.reply-form {
        margin-top: 15px;
        padding: 15px;
        background-color: var(--secondary);
        border-radius: 5px;
        animation: fadeIn 0.3s ease;
}

@media (max-width: 768px) {
        header .container {
                flex-direction: column;
                text-align: center;
        }

        .user-info {
                margin-top: 20px;
        }

        .tabs {
                overflow-x: auto;
                white-space: nowrap;
                padding-bottom: 5px;
        }

        .message-header {
                flex-direction: column;
                align-items: flex-start;
        }

        .message-date {
                margin-top: 5px;
                margin-left: 50px;
        }

        .message-actions {
                margin-top: 10px;
                justify-content: flex-end;
                width: 100%;
        }

        .filter-options {
                overflow-x: auto;
                padding-bottom: 5px;
        }
}

@keyframes fadeIn {
        from {
                opacity: 0;
                transform: translateY(10px);
        }

        to {
                opacity: 1;
                transform: translateY(0);
        }
}
</style>
