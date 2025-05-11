// BuddhistQuiz.vue
<template>
        <div class="buddhist-quiz-system">
                <header>
                        <div class="container">
                                <div class="logo">
                                        <span>🪷</span>
                                        <span>佛經挖空填充題</span>
                                </div>
                                <div class="user-info">
                                        <div class="user-avatar">{{ userInfo.avatar }}</div>
                                        <div class="user-details">
                                                <h3>{{ userInfo.name }}</h3>
                                                <span class="user-level">{{ userInfo.level }}</span>
                                        </div>
                                </div>
                        </div>
                </header>

                <div class="container">
                        <div class="stats-bar">
                                <div class="stat-item" v-for="(stat, index) in stats" :key="index">
                                        <div class="stat-value">{{ stat.value }}</div>
                                        <div class="stat-label">{{ stat.label }}</div>
                                </div>
                        </div>

                        <div class="tabs">
                                <button v-for="(tab, index) in tabs" :key="index" class="tab-button"
                                        :class="{ active: activeTab === index }" @click="activeTab = index">
                                        {{ tab }}
                                </button>
                        </div>

                        <div class="filter-options">
                                <div class="filter-group">
                                        <span class="filter-label">經典:</span>
                                        <button v-for="(scripture, index) in scriptures" :key="index"
                                                class="filter-button" :class="{ active: activeScripture === index }"
                                                @click="activeScripture = index">
                                                {{ scripture }}
                                        </button>
                                </div>
                                <div class="filter-group">
                                        <span class="filter-label">難度:</span>
                                        <button v-for="(level, index) in difficultyLevels" :key="index"
                                                class="filter-button" :class="{ active: activeDifficulty === index }"
                                                @click="activeDifficulty = index">
                                                {{ level }}
                                        </button>
                                </div>
                        </div>

                        <div class="card quiz-card" v-if="currentQuiz">
                                <div class="card-header">
                                        <h3 class="card-title">{{ currentQuiz.title }}</h3>
                                        <div class="difficulty-tag"
                                                :class="'difficulty-' + currentQuiz.difficulty.toLowerCase()">
                                                {{ getDifficultyText(currentQuiz.difficulty) }}
                                        </div>
                                </div>

                                <div class="progress-bar">
                                        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                                        <span class="progress-text">{{ currentQuizIndex + 1 }} / {{ totalQuizzes
                                                }}</span>
                                </div>

                                <div class="quiz-content">
                                        <p v-html="formattedQuizContent"></p>

                                        <div class="answer-input-group" v-if="!isAnswered">
                                                <label for="answer-input">填入空格答案:</label>
                                                <input type="text" id="answer-input" class="answer-input"
                                                        placeholder="請輸入答案..." v-model="userAnswer"
                                                        @keyup.enter="submitAnswer">
                                                <button class="submit-button" @click="submitAnswer">提交答案</button>
                                        </div>

                                        <!-- 答案結果區域（提交後顯示） -->
                                        <div class="answer-result" v-if="isAnswered">
                                                <div class="result-correct" v-if="isCorrect">
                                                        <span>✓</span> 回答正確！
                                                </div>
                                                <div class="result-wrong" v-else>
                                                        <span>✗</span> 回答錯誤！
                                                </div>
                                        </div>

                                        <!-- 解析區域（提交後顯示） -->
                                        <div class="explanation-box" v-if="isAnswered && currentQuiz">
                                                <h4>解析</h4>
                                                <p>{{ currentQuiz.explanation }}</p>
                                                <div class="scripture-source">— {{ currentQuiz.source }}</div>
                                        </div>
                                </div>

                                <div class="quiz-actions">
                                        <button class="action-button" :disabled="currentQuizIndex === 0"
                                                @click="previousQuiz">
                                                <span>←</span> 上一題
                                        </button>
                                        <button class="action-button bookmark" @click="toggleBookmark"
                                                :class="{ 'bookmarked': currentQuiz?.bookmarked }">
                                                <span>⭐</span> {{ currentQuiz.bookmarked ? '已收藏' : '收藏題目' }}
                                        </button>
                                        <button class="action-button next"
                                                :disabled="currentQuizIndex === totalQuizzes - 1" @click="nextQuiz">
                                                下一題 <span>→</span>
                                        </button>
                                </div>
                        </div>

                        <div class="pagination">
                                <div v-for="page in totalPages" :key="page" class="page-button"
                                        :class="{ active: currentPage === page }" @click="goToPage(page)">
                                        {{ page }}
                                </div>
                        </div>

                        <div class="floating-button" @click="resetQuiz">
                                <span>🔄</span>
                                <span>重置</span>
                        </div>
                </div>
        </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

interface UserInfo {
        name: string;
        avatar: string;
        level: string;
}

interface Stat {
        value: string | number;
        label: string;
}

interface Quiz {
        id: number;
        title: string;
        content: string;
        answer: string;
        explanation: string;
        source: string;
        difficulty: 'easy' | 'medium' | 'hard';
        bookmarked: boolean;
}

export default defineComponent({
        name: 'BuddhistQuiz',
        setup() {
                // 用戶信息
                const userInfo = ref<UserInfo>({
                        name: '王小明',
                        avatar: '王',
                        level: '修行者・初階'
                });

                // 統計數據
                const stats = ref<Stat[]>([
                        { value: 120, label: '累計積分' },
                        { value: 15, label: '完成題數' },
                        { value: '12%', label: '正確率' }
                ]);

                // 標籤頁
                const tabs = ref<string[]>(['今日練習', '經典選集', '我的收藏', '錯題集']);
                const activeTab = ref<number>(0);

                // 經典過濾
                const scriptures = ref<string[]>(['全部經典', '心經', '金剛經', '法華經', '楞嚴經', '六祖壇經']);
                const activeScripture = ref<number>(0);

                // 難度過濾
                const difficultyLevels = ref<string[]>(['全部難度', '初級', '中級', '高級']);
                const activeDifficulty = ref<number>(0);

                // 測驗數據
                const quizzes = ref<Quiz[]>([
                        {
                                id: 1,
                                title: '金剛般若波羅蜜經',
                                content: '須菩提，於意云何？如來昔在然燈佛所，於法有所得不？不也，世尊！如來在然燈佛所，_______。',
                                answer: '於法實無所得',
                                explanation: '這句經文表達了佛法中的無所得觀念，佛陀在過去生中遇到然燈佛時，並沒有得到什麼特別的法，因為真正的法是不可得的。這反映了空性和無執著的核心教義。',
                                source: '《金剛般若波羅蜜經》',
                                difficulty: 'medium',
                                bookmarked: false
                        },
                        {
                                id: 2,
                                title: '心經',
                                content: '觀自在菩薩，行深般若波羅蜜多時，照見_______，度一切苦厄。',
                                answer: '五蘊皆空',
                                explanation: '這是心經的開始部分，表述了觀世音菩薩在修行深奧的般若波羅蜜多時，透過智慧照見了五蘊（色、受、想、行、識）的本質是空的，從而超越一切苦難。',
                                source: '《般若波羅蜜多心經》',
                                difficulty: 'easy',
                                bookmarked: false
                        },
                        {
                                id: 3,
                                title: '六祖壇經',
                                content: '佛法在世間，不離世間覺，_______，只是覓菩提。',
                                answer: '離世求佛',
                                explanation: '這句經文表達了佛法並非離開世間而存在，而是在日常生活中覺悟。離開現實世界去尋求佛道是錯誤的，真正的菩提（覺悟）就在我們的日常生活之中。',
                                source: '《六祖壇經》',
                                difficulty: 'hard',
                                bookmarked: false
                        },
                        {
                                id: 4,
                                title: '法華經',
                                content: '諸佛世尊，唯以一大事因緣故，出現於世。舍利弗，云何名諸佛世尊唯以一大事因緣故出現於世？諸佛世尊，欲令眾生_______，而示佛知見。',
                                answer: '開示悟入佛之知見',
                                explanation: '這句經文闡明了佛陀出現在世間的唯一大事因緣，就是要讓所有眾生開啟、顯示、領悟並進入佛的知見，也就是佛的智慧和覺悟境界。',
                                source: '《妙法蓮華經》',
                                difficulty: 'medium',
                                bookmarked: false
                        },
                        {
                                id: 5,
                                title: '楞嚴經',
                                content: '一切眾生，從無始來，_______，認賊為子，失於本心，流轉生死。',
                                answer: '生死相續',
                                explanation: '這句經文指出眾生從無始以來，因為生死輪迴不斷，把虛妄的東西（賊）當作真實的自我（子），從而迷失了本來的清淨心性，在生死中不斷輪迴。',
                                source: '《大佛頂首楞嚴經》',
                                difficulty: 'hard',
                                bookmarked: false
                        }
                ]);

                // 當前測驗狀態
                const currentQuizIndex = ref<number>(0);
                const currentPage = ref<number>(1);
                const totalPages = ref<number>(5);
                const userAnswer = ref<string>('');
                const isAnswered = ref<boolean>(false);
                const isCorrect = ref<boolean>(false);
                const totalQuizzes = computed(() => quizzes.value.length);

                // 計算當前進度百分比
                const progressPercentage = computed(() => {
                        return ((currentQuizIndex.value + 1) / totalQuizzes.value) * 100;
                });

                // 獲取當前問題（確保不會返回 undefined）
                const currentQuiz = computed(() => {
                        return quizzes.value[currentQuizIndex.value] || quizzes.value[0];
                });

                // 格式化問題內容，將下劃線部分轉換為適當的HTML
                const formattedQuizContent = computed(() => {
                        const quiz = currentQuiz.value;
                        if (!quiz) return '';

                        if (isAnswered.value) {
                                if (isCorrect.value) {
                                        return quiz.content.replace('_______', `<span class="correct-answer">${quiz.answer}</span>`);
                                } else {
                                        return quiz.content.replace('_______', `<span class="wrong-answer">${userAnswer.value}</span> <span class="correct-answer">${quiz.answer}</span>`);
                                }
                        } else {
                                return quiz.content.replace('_______', '<span class="blank-space">______</span>');
                        }
                });

                // 獲取難度文字
                const getDifficultyText = (difficulty: 'easy' | 'medium' | 'hard'): string => {
                        switch (difficulty) {
                                case 'easy': return '初級';
                                case 'medium': return '中級';
                                case 'hard': return '高級';
                        }
                };

                // 提交答案
                const submitAnswer = () => {
                        const quiz = currentQuiz.value;
                        if (!quiz) return;

                        isAnswered.value = true;
                        isCorrect.value = userAnswer.value === quiz.answer;
                };

                // 下一題
                const nextQuiz = () => {
                        if (currentQuizIndex.value < totalQuizzes.value - 1) {
                                currentQuizIndex.value++;
                                resetQuestionState();
                        }
                };

                // 上一題
                const previousQuiz = () => {
                        if (currentQuizIndex.value > 0) {
                                currentQuizIndex.value--;
                                resetQuestionState();
                        }
                };

                // 重置當前問題狀態
                const resetQuestionState = () => {
                        isAnswered.value = false;
                        isCorrect.value = false;
                        userAnswer.value = '';
                };

                // 重置整個測驗
                const resetQuiz = () => {
                        currentQuizIndex.value = 0;
                        resetQuestionState();
                };

                // 收藏/取消收藏題目
                const toggleBookmark = () => {
                        // 直接使用當前可靠的 currentQuiz 值，而不是通過索引訪問
                        const quiz = currentQuiz.value;
                        if (quiz) {
                                quiz.bookmarked = !quiz.bookmarked;
                        }
                };

                // 前往特定頁面
                const goToPage = (page: number) => {
                        currentPage.value = page;
                        // 根據頁碼加載相應的題目，實際應用中可能需要從API獲取
                };

                return {
                        userInfo,
                        stats,
                        tabs,
                        activeTab,
                        scriptures,
                        activeScripture,
                        difficultyLevels,
                        activeDifficulty,
                        currentQuizIndex,
                        totalQuizzes,
                        currentQuiz,
                        progressPercentage,
                        formattedQuizContent,
                        userAnswer,
                        isAnswered,
                        isCorrect,
                        currentPage,
                        totalPages,
                        getDifficultyText,
                        submitAnswer,
                        nextQuiz,
                        previousQuiz,
                        resetQuiz,
                        toggleBookmark,
                        goToPage
                };
        }
});
</script>

<style>
:root {
        /* CSS變量定義 */
        --primary: #5c7c9d;
        --secondary: #e8f0fb;
        --accent: #8a6d3b;
        --light: #ffffff;
        --dark: #333333;
        --success: #4ca873;
        --error: #d9534f;
        --warning: #f0ad4e;
        --border: #eaeaea;
        --text-light: #777777;
}

* {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
}

.buddhist-quiz-system {
        font-family: "Arial", "微軟正黑體", sans-serif;
        color: var(--dark);
        line-height: 1.6;
        background-color: #f5f7fa;
        min-height: 100vh;
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
        margin-bottom: 20px;
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

.stats-bar {
        display: flex;
        justify-content: space-around;
        background-color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
        margin-bottom: 20px;
}

.stat-item {
        text-align: center;
}

.stat-value {
        font-size: 24px;
        font-weight: bold;
        color: var(--primary);
}

.stat-label {
        font-size: 14px;
        color: var(--text-light);
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

.filter-options {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 20px;
        background-color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
}

.filter-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
}

.filter-label {
        font-weight: bold;
        color: var(--primary);
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

.card {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease;
        margin-bottom: 20px;
}

.quiz-card {
        min-height: 400px;
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

.difficulty-tag {
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 12px;
        color: white;
}

.difficulty-easy {
        background-color: var(--success);
}

.difficulty-medium {
        background-color: var(--warning);
}

.difficulty-hard {
        background-color: var(--error);
}

.progress-bar {
        height: 8px;
        background-color: var(--secondary);
        border-radius: 4px;
        margin-bottom: 20px;
        position: relative;
}

.progress-fill {
        height: 100%;
        background-color: var(--primary);
        border-radius: 4px;
        width: 20%;
        /* 初始值，代表進度 */
}

.progress-text {
        position: absolute;
        top: -18px;
        right: 0;
        font-size: 12px;
        color: var(--text-light);
}

.quiz-content {
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        margin-bottom: 20px;
        line-height: 1.8;
}

.quiz-content p {
        margin-bottom: 20px;
        font-size: 18px;
}

.blank-space {
        display: inline-block;
        min-width: 100px;
        border-bottom: 2px dashed var(--primary);
        text-align: center;
        color: var(--primary);
        font-weight: bold;
}

.correct-answer {
        background-color: rgba(76, 168, 115, 0.2);
        padding: 2px 5px;
        border-radius: 4px;
        color: var(--success);
        font-weight: bold;
}

.wrong-answer {
        background-color: rgba(217, 83, 79, 0.2);
        padding: 2px 5px;
        border-radius: 4px;
        color: var(--error);
        font-weight: bold;
        text-decoration: line-through;
}

.answer-input-group {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        margin-bottom: 20px;
}

.answer-input-group label {
        font-weight: bold;
        color: var(--primary);
}

.answer-input {
        flex: 1;
        min-width: 200px;
        padding: 10px;
        border: 1px solid var(--border);
        border-radius: 5px;
        font-size: 16px;
}

.submit-button {
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        transition: all 0.3s ease;
}

.submit-button:hover {
        background-color: var(--accent);
}

.answer-result {
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 5px;
}

.result-correct {
        background-color: rgba(76, 168, 115, 0.1);
        color: var(--success);
        padding: 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
}

.result-correct span {
        font-size: 20px;
        margin-right: 10px;
}

.result-wrong {
        background-color: rgba(217, 83, 79, 0.1);
        color: var(--error);
        padding: 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
}

.result-wrong span {
        font-size: 20px;
        margin-right: 10px;
}

.explanation-box {
        background-color: rgba(140, 124, 59, 0.1);
        padding: 15px;
        border-radius: 5px;
        border-left: 3px solid var(--accent);
}

.explanation-box h4 {
        color: var(--accent);
        margin-bottom: 10px;
}

.scripture-source {
        font-style: italic;
        color: var(--text-light);
        text-align: right;
        margin-top: 10px;
}

.quiz-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
}

.action-button {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 8px 15px;
        background-color: var(--secondary);
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
}

.action-button:hover {
        background-color: var(--primary);
        color: white;
}

.action-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
}

.action-button.bookmark {
        background-color: rgba(240, 173, 78, 0.2);
        color: var(--warning);
}

.action-button.bookmark:hover {
        background-color: var(--warning);
        color: white;
}

.action-button.bookmarked {
        background-color: var(--warning);
        color: white;
}

.action-button.next {
        background-color: var(--primary);
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

.floating-button {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: var(--primary);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 100;
}

.floating-button span:first-child {
        font-size: 20px;
}

.floating-button span:last-child {
        font-size: 12px;
}

.floating-button:hover {
        transform: scale(1.1);
        background-color: var(--accent);
}
</style>