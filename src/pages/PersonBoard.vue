// App.vue - 主應用組件
<template>
        <FloatingShapesBackground/>
        <div class="app">
                <header>
                        <div class="container">
                                <div class="logo">
                                        <span>🪷</span>
                                        <span>佛法學習個人面板</span>
                                </div>
                                <div class="user-info">
                                        <div class="user-avatar">{{ user.avatar }}</div>
                                        <div class="user-details">
                                                <h3>{{ user.name }}</h3>
                                                <span class="user-level">{{ user.level }}</span>
                                        </div>
                                </div>
                        </div>
                </header>

                <div class="container">
                        <div class="dashboard">
                                <!-- 每日簽到 -->
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">每日簽到</h3>
                                                <span class="card-icon">📅</span>
                                        </div>
                                        <div class="daily-check">
                                                <p>連續簽到: <strong>{{ user.checkInStreak }}</strong> 天</p>
                                                <div class="calendar">
                                                        <div class="calendar-header">
                                                                <span>{{ calendarData.month }}</span>
                                                        </div>
                                                        <div class="calendar-day">一</div>
                                                        <div class="calendar-day">二</div>
                                                        <div class="calendar-day">三</div>
                                                        <div class="calendar-day">四</div>
                                                        <div class="calendar-day">五</div>
                                                        <div class="calendar-day weekend">六</div>
                                                        <div class="calendar-day weekend">日</div>

                                                        <template v-for="(day, index) in calendarData.days"
                                                                :key="index">
                                                                <div class="calendar-day" :class="{
                                                                        'weekend': day.isWeekend,
                                                                        'today': day.isToday,
                                                                        'checked': day.checked
                                                                }">
                                                                        {{ day.day }}
                                                                </div>
                                                        </template>
                                                </div>
                                                <button type="button" class="check-in-btn" @click="checkIn"
                                                        :disabled="isCheckedToday ? true : false">
                                                        {{ isCheckedToday ? '已簽到' : '今日簽到' }}
                                                </button>
                                        </div>
                                </div>

                                <!-- 共修課程紀錄 -->
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">共修課程紀錄</h3>
                                                <span class="card-icon">📚</span>
                                        </div>
                                        <div class="practice-record">
                                                <div v-for="(practice, index) in practices" :key="index"
                                                        class="practice-item">
                                                        <div class="practice-icon">{{ practice.icon }}</div>
                                                        <div class="practice-info">
                                                                <div class="practice-title">{{ practice.title }}</div>
                                                                <div class="practice-time">{{ practice.time }}</div>
                                                        </div>
                                                        <span class="practice-duration">{{ practice.duration }}</span>
                                                </div>
                                        </div>
                                </div>

                                <!-- 上次課程 -->
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">上次課程</h3>
                                                <span class="card-icon">▶️</span>
                                        </div>
                                        <div class="last-course">
                                                <div class="course-thumbnail">{{ lastCourse.thumbnail }}</div>
                                                <div class="course-info">
                                                        <div class="course-title">{{ lastCourse.title }}</div>
                                                        <div class="course-meta">講師：{{ lastCourse.instructor }} | {{
                                                                lastCourse.duration }}</div>
                                                        <div class="course-progress">
                                                                <div class="course-progress-bar">
                                                                        <div class="course-progress-fill"
                                                                                :style="{ width: lastCourse.progress + '%' }">
                                                                        </div>
                                                                </div>
                                                                <span>{{ lastCourse.progress }}%</span>
                                                        </div>
                                                        <button type="button" class="continue-btn">繼續學習</button>
                                                </div>
                                        </div>
                                </div>

                                <!-- 禪修計時器 -->
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">禪修計時器</h3>
                                                <span class="card-icon">⏱️</span>
                                        </div>
                                        <div class="meditation-timer">
                                                <div class="timer-display">{{ formatTime(timeLeft) }}</div>
                                                <div class="timer-buttons">
                                                        <button type="button" class="timer-btn start"
                                                                @click="startTimer"
                                                                :disabled="timerRunning ? true : false">開始</button>
                                                        <button type="button" class="timer-btn pause"
                                                                @click="pauseTimer"
                                                                :disabled="!timerRunning ? true : false">暫停</button>
                                                        <button type="button" class="timer-btn"
                                                                @click="resetTimer">重置</button>
                                                </div>
                                        </div>
                                </div>

                                <!-- 學習進度 -->
                                <div class="card wide-card">
                                        <div class="card-header">
                                                <h3 class="card-title">學習進度</h3>
                                                <span class="card-icon">📊</span>
                                        </div>
                                        <div class="progress-container">
                                                <div v-for="(item, index) in learningProgress" :key="index"
                                                        class="progress-item">
                                                        <div class="progress-header">
                                                                <span>{{ item.title }}</span>
                                                                <span>{{ item.percentage }}%</span>
                                                        </div>
                                                        <div class="progress-bar">
                                                                <div class="progress-fill"
                                                                        :style="{ width: item.percentage + '%' }"></div>
                                                        </div>
                                                </div>
                                        </div>
                                        <div class="stats-container">
                                                <div v-for="(stat, index) in learningStats" :key="index"
                                                        class="stat-item">
                                                        <div class="stat-value">{{ stat.value }}</div>
                                                        <div class="stat-label">{{ stat.label }}</div>
                                                </div>
                                        </div>
                                </div>

                                <!-- 學習目標 -->
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">學習目標</h3>
                                                <span class="card-icon">🎯</span>
                                        </div>
                                        <div class="progress-container">
                                                <div v-for="(goal, index) in learningGoals" :key="index"
                                                        class="progress-item">
                                                        <div class="progress-header">
                                                                <span>{{ goal.title }}</span>
                                                                <span>{{ goal.current }}/{{ goal.total }}</span>
                                                        </div>
                                                        <div class="progress-bar">
                                                                <div class="progress-fill"
                                                                        :style="{ width: goal.percentage + '%' }"></div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                                <!-- 每日法語 -->
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">每日法語</h3>
                                                <span class="card-icon">💬</span>
                                        </div>
                                        <div class="quote-card">
                                                <p class="quote-text">{{ dailyQuote.text }}</p>
                                                <p class="quote-author">- {{ dailyQuote.author }}</p>
                                        </div>
                                </div>

                                <!-- 學習筆記 -->
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">學習筆記</h3>
                                                <span class="card-icon">📝</span>
                                        </div>
                                        <div class="practice-record">
                                                <div v-for="(note, index) in learningNotes" :key="index"
                                                        class="practice-item">
                                                        <div class="practice-icon">{{ note.icon }}</div>
                                                        <div class="practice-info">
                                                                <div class="practice-title">{{ note.title }}</div>
                                                                <div class="practice-time">{{ note.time }}</div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';

interface CalendarDay {
        day: number | null;
        checked: boolean;
        isToday: boolean;
        isWeekend: boolean;
}

interface User {
        name: string;
        level: string;
        avatar: string;
        checkInStreak: number;
}

interface CalendarData {
        month: string;
        days: CalendarDay[];
}

interface Practice {
        icon: string;
        title: string;
        time: string;
        duration: string;
}

interface Course {
        title: string;
        thumbnail: string;
        instructor: string;
        duration: string;
        progress: number;
}

interface LearningProgress {
        title: string;
        percentage: number;
}

interface Stat {
        value: number;
        label: string;
}

interface Goal {
        title: string;
        current: number;
        total: number;
        percentage: number;
}

interface Quote {
        text: string;
        author: string;
}

interface Note {
        icon: string;
        title: string;
        time: string;
}

export default defineComponent({
        name: 'App',
        components: {
                FloatingShapesBackground // 在這裡註冊組件
        },
        data() {
                return {
                        user: {
                                name: '王小明',
                                level: '修行者・初階',
                                avatar: '王',
                                checkInStreak: 7
                        } as User,
                        calendarData: {
                                month: '2025年5月',
                                days: [
                                        { day: null, checked: false, isToday: false, isWeekend: false },
                                        { day: 1, checked: true, isToday: false, isWeekend: false },
                                        { day: 2, checked: true, isToday: false, isWeekend: false },
                                        { day: 3, checked: true, isToday: false, isWeekend: false },
                                        { day: 4, checked: true, isToday: false, isWeekend: false },
                                        { day: 5, checked: true, isToday: false, isWeekend: true },
                                        { day: 6, checked: true, isToday: false, isWeekend: true },
                                        { day: 7, checked: true, isToday: false, isWeekend: false },
                                        { day: 8, checked: false, isToday: true, isWeekend: false },
                                        { day: 9, checked: false, isToday: false, isWeekend: false },
                                        { day: 10, checked: false, isToday: false, isWeekend: false },
                                        { day: 11, checked: false, isToday: false, isWeekend: false },
                                        { day: 12, checked: false, isToday: false, isWeekend: true },
                                        { day: 13, checked: false, isToday: false, isWeekend: true }
                                ]
                        } as CalendarData,
                        practices: [
                                {
                                        icon: '📖',
                                        title: '《心經》共修',
                                        time: '2025/05/06 19:30',
                                        duration: '90分鐘'
                                },
                                {
                                        icon: '🧘',
                                        title: '禪修班',
                                        time: '2025/05/04 10:00',
                                        duration: '120分鐘'
                                },
                                {
                                        icon: '🔄',
                                        title: '《金剛經》讀書會',
                                        time: '2025/05/01 20:00',
                                        duration: '60分鐘'
                                }
                        ] as Practice[],
                        lastCourse: {
                                title: '《大乘起信論》第三講',
                                thumbnail: '🎞️',
                                instructor: '見輝師父',
                                duration: '2小時15分鐘',
                                progress: 65
                        } as Course,
                        learningProgress: [
                                { title: '《心經》學習', percentage: 80 },
                                { title: '《金剛經》學習', percentage: 45 },
                                { title: '《佛法概論》課程', percentage: 65 }
                        ] as LearningProgress[],
                        learningStats: [
                                { value: 32, label: '總學習時數' },
                                { value: 12, label: '課程完成數' },
                                { value: 8, label: '禪修次數' },
                                { value: 3, label: '讀書會參與' }
                        ] as Stat[],
                        learningGoals: [
                                { title: '每週禪修3次', current: 2, total: 3, percentage: 66 },
                                { title: '完成《心經》課程', current: 80, total: 100, percentage: 80 },
                                { title: '佛學詞彙學習', current: 42, total: 100, percentage: 42 }
                        ] as Goal[],
                        dailyQuote: {
                                text: '「狂性頓歇，歇即菩提。」',
                                author: '《楞嚴經》'
                        } as Quote,
                        learningNotes: [
                                {
                                        icon: '📝',
                                        title: '「四聖諦」理解與應用',
                                        time: '2025/05/07'
                                },
                                {
                                        icon: '📝',
                                        title: '《金剛經》第三品心得',
                                        time: '2025/05/02'
                                },
                                {
                                        icon: '📝',
                                        title: '禪修體驗記錄',
                                        time: '2025/04/28'
                                }
                        ] as Note[],
                        // 禪修計時器數據
                        timeLeft: 20 * 60, // 20分鐘，以秒為單位
                        timerRunning: false,
                        timerInterval: null as number | null
                }
        },
        computed: {
                isCheckedToday(): boolean {
                        const today = this.calendarData.days.find(day => day.isToday);
                        return !!(today && today.checked);
                }
        },
        methods: {
                // 簽到功能
                checkIn(): void {
                        const todayIndex = this.calendarData.days.findIndex(day => day.isToday);
                        if (todayIndex !== -1) {
                                const day = this.calendarData.days[todayIndex];
                                if (day) {
                                        day.checked = true;
                                        this.user.checkInStreak += 1;
                                }
                        }
                },

                // 禪修計時器功能
                startTimer(): void {
                        if (!this.timerRunning) {
                                this.timerRunning = true;
                                this.timerInterval = window.setInterval(() => {
                                        if (this.timeLeft > 0) {
                                                this.timeLeft--;
                                        } else {
                                                this.pauseTimer();
                                                alert('禪修時間結束！');
                                        }
                                }, 1000);
                        }
                },
                pauseTimer(): void {
                        if (this.timerInterval !== null) {
                                window.clearInterval(this.timerInterval);
                                this.timerInterval = null;
                        }
                        this.timerRunning = false;
                },
                resetTimer(): void {
                        this.pauseTimer();
                        this.timeLeft = 20 * 60;
                },
                formatTime(seconds: number): string {
                        const minutes = Math.floor(seconds / 60);
                        const remainingSeconds = seconds % 60;
                        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
                }
        }
})
</script>

<style>
:root {
        --primary: #4a6fa0;
        --secondary: #e8f0fb;
        --accent: #6d8cb0;
        --light: #ffffff;
        --dark: #333333;
        --success: #4ca873;
        --warning: #f0ae54;
}

* {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Arial", "微軟正黑體", sans-serif;
}

body {
        background-color: var(--light);
        color: var(--dark);
        line-height: 1.6;
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
        border: 1px solid #eaeaea;
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

.dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
}

.card {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease;
}

.card:hover {
        transform: translateY(-5px);
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
        font-size: 18px;
        color: var(--primary);
        font-weight: bold;
}

.wide-card {
        grid-column: span 2;
}

/* 每日簽到 */
.daily-check {
        display: flex;
        flex-direction: column;
        align-items: center;
}

.calendar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
        width: 100%;
        margin-top: 15px;
}

.calendar-header {
        grid-column: span 7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
}

.calendar-day {
        text-align: center;
        padding: 10px 0;
        background-color: var(--secondary);
        border-radius: 5px;
        transition: all 0.2s ease;
}

.calendar-day.weekend {
        color: var(--accent);
}

.calendar-day.today {
        background-color: var(--primary);
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(74, 111, 160, 0.3);
}

.calendar-day.checked {
        background-color: var(--success);
        color: white;
}

.check-in-btn {
        background-color: var(--primary);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        margin-top: 20px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.check-in-btn:hover:not(:disabled) {
        background-color: var(--accent);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.check-in-btn:disabled {
        background-color: var(--success);
        cursor: default;
}

/* 共修課程紀錄 */
.practice-record {
        margin-top: 20px;
}

.practice-item {
        padding: 10px;
        border-bottom: 1px solid var(--secondary);
        display: flex;
        align-items: center;
}

.practice-icon {
        margin-right: 15px;
        width: 30px;
        height: 30px;
        background-color: var(--secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
}

.practice-info {
        flex-grow: 1;
}

.practice-title {
        font-weight: bold;
}

.practice-time {
        font-size: 12px;
        color: #777;
}

.practice-duration {
        background-color: var(--secondary);
        padding: 3px 8px;
        border-radius: 10px;
        font-size: 12px;
}

/* 上次課程 */
.last-course {
        display: flex;
        margin-top: 20px;
        align-items: center;
}

.course-thumbnail {
        width: 120px;
        height: 80px;
        background-color: var(--secondary);
        border-radius: 5px;
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
}

.course-info {
        flex-grow: 1;
}

.course-title {
        font-weight: bold;
        margin-bottom: 5px;
}

.course-progress {
        display: flex;
        align-items: center;
        margin-top: 5px;
}

.course-progress-bar {
        flex-grow: 1;
        height: 5px;
        background-color: var(--secondary);
        border-radius: 5px;
        overflow: hidden;
        margin-right: 10px;
}

.course-progress-fill {
        height: 100%;
        background-color: var(--primary);
}

.continue-btn {
        background-color: var(--primary);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        margin-top: 10px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s ease;
}

.continue-btn:hover {
        background-color: var(--accent);
}

/* 禪修計時器 */
.meditation-timer {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
}

.timer-display {
        font-size: 48px;
        font-weight: bold;
        margin: 20px 0;
}

.timer-buttons {
        display: flex;
        gap: 10px;
}

.timer-btn {
        background-color: var(--primary);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
}

.timer-btn.start {
        background-color: var(--success);
}

.timer-btn.pause {
        background-color: var(--warning);
}

.timer-btn:hover:not(:disabled) {
        opacity: 0.9;
}

.timer-btn:disabled {
        opacity: 0.6;
        cursor: default;
}

/* 學習進度 */
.progress-container {
        margin-top: 15px;
}

.progress-item {
        margin-bottom: 15px;
}

.progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
}

.progress-bar {
        height: 10px;
        background-color: var(--secondary);
        border-radius: 5px;
        overflow: hidden;
}

.progress-fill {
        height: 100%;
        background-color: var(--primary);
}

.stats-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin-top: 20px;
}

.stat-item {
        background-color: var(--secondary);
        border-radius: 10px;
        padding: 15px;
        text-align: center;
}

.stat-value {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
        color: var(--primary);
}

.stat-label {
        font-size: 14px;
        color: #777;
}

/* 每日法語 */
.quote-card {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 200px;
}

.quote-text {
        font-style: italic;
        margin-bottom: 15px;
        font-size: 18px;
}

.quote-author {
        font-weight: bold;
        color: var(--primary);
}

@media (max-width: 768px) {
        .dashboard {
                grid-template-columns: 1fr;
        }

        .wide-card {
                grid-column: span 1;
        }

        header .container {
                flex-direction: column;
                text-align: center;
        }

        .user-info {
                margin-top: 20px;
        }
}
</style>