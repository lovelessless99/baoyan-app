// BuddhistScriptureSystem.vue
<template>
        <FloatingShapesBackground/>
        <div>
                <!-- Header -->
                <header>
                        <div class="container">
                                <div class="logo">
                                        <span>🪷</span>
                                        <span>佛經誦讀紀錄系統</span>
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
                        <!-- Tab Navigation -->
                        <div class="tabs">
                                <button v-for="tab in tabs" :key="tab.id" class="tab-button"
                                        :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
                                        {{ tab.name }}
                                </button>
                        </div>

                        <!-- Dashboard Tab -->
                        <div class="tab-content" :class="{ active: activeTab === 'dashboard' }" id="dashboard">
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">誦經統計</h3>
                                                <span>📊</span>
                                        </div>

                                        <div class="stats-container">
                                                <div v-for="(stat, index) in stats" :key="index" class="stat-item">
                                                        <div class="stat-value">{{ stat.value }}</div>
                                                        <div class="stat-label">{{ stat.label }}</div>
                                                </div>
                                        </div>

                                        <div class="daily-goal">
                                                <div class="streak-info">{{ dailyGoal.text }}</div>
                                                <div class="daily-goal-bar">
                                                        <div class="daily-goal-fill"
                                                                :style="{ width: dailyGoal.percentage + '%' }"></div>
                                                </div>
                                        </div>
                                </div>

                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">最近誦讀</h3>
                                                <span>📚</span>
                                        </div>

                                        <div class="record-list">
                                                <div v-for="(record, index) in recentRecords" :key="index"
                                                        class="record-item">
                                                        <div>{{ record.text }}</div>
                                                        <div class="record-date">{{ record.date }}</div>
                                                </div>
                                        </div>
                                </div>

                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">進度摘要</h3>
                                                <span>📈</span>
                                        </div>

                                        <div class="scripture-section">
                                                <h4 class="summary-title">經典進度</h4>
                                                <div v-for="(progress, index) in scriptureProgress" :key="index"
                                                        class="mantra-item">
                                                        <div class="mantra-info">
                                                                <div class="mantra-name">{{ progress.name }}</div>
                                                                <div class="mantra-progress">
                                                                        <div class="progress-bar-container">
                                                                                <div class="progress-fill"
                                                                                        :style="{ width: progress.percentage + '%' }">
                                                                                </div>
                                                                        </div>
                                                                        <span class="mantra-count">{{ progress.completed
                                                                                }}/{{ progress.total }}{{ progress.unit
                                                                                }}</span>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>

                                        <div class="total-progress">
                                                <div class="total-text">整體完成度: {{ totalProgress.percentage }}%</div>
                                                <div class="total-bar">
                                                        <div class="total-fill"
                                                                :style="{ width: totalProgress.percentage + '%' }">
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        <!-- Sutras Tab -->
                        <div class="tab-content" :class="{ active: activeTab === 'sutras' }" id="sutras">
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">經典誦讀紀錄</h3>
                                                <span>📚</span>
                                        </div>

                                        <div v-for="(scripture, scriptureIndex) in scripturesList" :key="scriptureIndex"
                                                class="scripture-section">
                                                <h4 class="scripture-title">
                                                        {{ scripture.name }}
                                                        <span>進度：{{ scripture.progressPercentage }}% ({{
                                                                scripture.completed }}/{{ scripture.total }}{{
                                                                scripture.unit }})</span>
                                                </h4>
                                                <div class="volumes-grid">
                                                        <div v-for="(volume, volumeIndex) in scripture.volumes"
                                                                :key="volumeIndex" class="volume-item"
                                                                :class="{ completed: volume.completed }">
                                                                {{ volume.name }}
                                                                <div class="progress-bar"
                                                                        :style="{ width: volume.progress + '%' }"></div>
                                                        </div>
                                                        <div v-if="scripture.showMore" class="volume-item">...</div>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        <!-- Mantras Tab -->
                        <div class="tab-content" :class="{ active: activeTab === 'mantras' }" id="mantras">
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">咒語誦持記錄</h3>
                                                <span>🔄</span>
                                        </div>

                                        <div class="mantra-section">
                                                <h4 class="mantra-title">
                                                        常誦咒語
                                                        <button @click="addNewMantra" class="add-button">+</button>
                                                </h4>

                                                <div v-for="(mantra, index) in mantras" :key="index"
                                                        class="mantra-item">
                                                        <div class="mantra-info">
                                                                <div class="mantra-name">{{ mantra.name }}</div>
                                                                <div class="mantra-progress">
                                                                        <div class="progress-bar-container">
                                                                                <div class="progress-fill"
                                                                                        :style="{ width: mantra.percentage + '%' }">
                                                                                </div>
                                                                        </div>
                                                                        <span class="mantra-count">{{ mantra.count
                                                                                }}</span>
                                                                </div>
                                                        </div>
                                                        <button @click="incrementMantra(index)"
                                                                class="add-button">+</button>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        <!-- History Tab -->
                        <div class="tab-content" :class="{ active: activeTab === 'history' }" id="history">
                                <div class="card">
                                        <div class="card-header">
                                                <h3 class="card-title">歷史紀錄</h3>
                                                <span>📜</span>
                                        </div>

                                        <div class="record-list">
                                                <div v-for="(record, index) in historyRecords" :key="index"
                                                        class="record-item">
                                                        <div>{{ record.text }}</div>
                                                        <div class="record-date">{{ record.date }}</div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
</template>

<script lang="ts">
// Define TypeScript interfaces for our data structures

import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';
 

interface User {
        name: string;
        avatar: string;
        level: string;
}

interface Tab {
        id: string;
        name: string;
}

interface Stat {
        value: number;
        label: string;
}

interface DailyGoal {
        percentage: number;
        text: string;
}

interface Record {
        text: string;
        date: string;
}

interface Scripture {
        name: string;
        percentage: number;
        completed: number;
        total: number;
        unit: string;
}

interface Volume {
        name: string;
        completed: boolean;
        progress: number;
}

interface ScriptureDetail {
        name: string;
        progressPercentage: number;
        completed: number;
        total: number;
        unit: string;
        volumes: Volume[];
        showMore: boolean;
}

interface Mantra {
        name: string;
        count: string;
        percentage: number;
}

interface TotalProgress {
        percentage: number;
}

export default {
        name: 'BuddhistScriptureSystem',
        components: {
                FloatingShapesBackground // 在這裡註冊組件
        },
        data() {
                return {
                        user: {
                                name: '王小明',
                                avatar: '王',
                                level: '修行者・初階'
                        } as User,
                        activeTab: 'dashboard',
                        tabs: [
                                { id: 'dashboard', name: '儀表板' },
                                { id: 'sutras', name: '經典' },
                                { id: 'mantras', name: '咒語' },
                                { id: 'history', name: '歷史紀錄' }
                        ] as Tab[],
                        stats: [
                                { value: 48, label: '總誦經次數' },
                                { value: 21, label: '總誦咒次數' },
                                { value: 37, label: '小時累計' },
                                { value: 8, label: '連續天數' }
                        ] as Stat[],
                        dailyGoal: {
                                percentage: 65,
                                text: '今日目標完成度: 65%'
                        } as DailyGoal,
                        recentRecords: [
                                { text: '《楞嚴經》卷三 (完成)', date: '2025/05/08 09:15' },
                                { text: '《大悲咒》x5', date: '2025/05/08 08:30' },
                                { text: '《心經》x3', date: '2025/05/07 20:45' },
                                { text: '《楞嚴經》卷二 (完成)', date: '2025/05/07 16:20' },
                                { text: '《楞嚴經》卷一 (完成)', date: '2025/05/06 15:10' }
                        ] as Record[],
                        scriptureProgress: [
                                { name: '《楞嚴經》', percentage: 30, completed: 3, total: 10, unit: '卷' },
                                { name: '《華嚴經》', percentage: 6.25, completed: 5, total: 80, unit: '卷' },
                                { name: '《地藏經》', percentage: 76.9, completed: 10, total: 13, unit: '品' }
                        ] as Scripture[],
                        totalProgress: {
                                percentage: 38
                        } as TotalProgress,
                        scripturesList: [
                                {
                                        name: '《楞嚴經》',
                                        progressPercentage: 30,
                                        completed: 3,
                                        total: 10,
                                        unit: '卷',
                                        volumes: [
                                                { name: '卷一', completed: true, progress: 100 },
                                                { name: '卷二', completed: true, progress: 100 },
                                                { name: '卷三', completed: true, progress: 100 },
                                                { name: '卷四', completed: false, progress: 0 },
                                                { name: '卷五', completed: false, progress: 0 },
                                                { name: '卷六', completed: false, progress: 0 },
                                                { name: '卷七', completed: false, progress: 0 },
                                                { name: '卷八', completed: false, progress: 0 },
                                                { name: '卷九', completed: false, progress: 0 },
                                                { name: '卷十', completed: false, progress: 0 }
                                        ],
                                        showMore: false
                                },
                                {
                                        name: '《華嚴經》',
                                        progressPercentage: 6.25,
                                        completed: 5,
                                        total: 80,
                                        unit: '卷',
                                        volumes: [
                                                { name: '卷一', completed: true, progress: 100 },
                                                { name: '卷二', completed: true, progress: 100 },
                                                { name: '卷三', completed: true, progress: 100 },
                                                { name: '卷四', completed: true, progress: 100 },
                                                { name: '卷五', completed: true, progress: 100 },
                                                { name: '卷六', completed: false, progress: 0 },
                                                { name: '卷七', completed: false, progress: 0 },
                                                { name: '卷八', completed: false, progress: 0 },
                                                { name: '卷九', completed: false, progress: 0 },
                                                { name: '卷十', completed: false, progress: 0 }
                                        ],
                                        showMore: true
                                },
                                {
                                        name: '《心經》',
                                        progressPercentage: 100,
                                        completed: 1,
                                        total: 1,
                                        unit: '部',
                                        volumes: [
                                                { name: '全文', completed: true, progress: 100 }
                                        ],
                                        showMore: false
                                },
                                {
                                        name: '《大乘起信論》',
                                        progressPercentage: 60,
                                        completed: 3,
                                        total: 5,
                                        unit: '部分',
                                        volumes: [
                                                { name: '第一部分', completed: true, progress: 100 },
                                                { name: '第二部分', completed: true, progress: 100 },
                                                { name: '第三部分', completed: true, progress: 100 },
                                                { name: '第四部分', completed: false, progress: 0 },
                                                { name: '第五部分', completed: false, progress: 0 }
                                        ],
                                        showMore: false
                                },
                                {
                                        name: '《圓覺經》',
                                        progressPercentage: 0,
                                        completed: 0,
                                        total: 1,
                                        unit: '部',
                                        volumes: [
                                                { name: '全文', completed: false, progress: 0 }
                                        ],
                                        showMore: false
                                },
                                {
                                        name: '《地藏經》',
                                        progressPercentage: 76.9,
                                        completed: 10,
                                        total: 13,
                                        unit: '品',
                                        volumes: [
                                                { name: '第一品', completed: true, progress: 100 },
                                                { name: '第二品', completed: true, progress: 100 },
                                                { name: '第三品', completed: true, progress: 100 },
                                                { name: '第四品', completed: true, progress: 100 },
                                                { name: '第五品', completed: true, progress: 100 },
                                                { name: '第六品', completed: true, progress: 100 },
                                                { name: '第七品', completed: true, progress: 100 },
                                                { name: '第八品', completed: true, progress: 100 },
                                                { name: '第九品', completed: true, progress: 100 },
                                                { name: '第十品', completed: true, progress: 100 },
                                                { name: '第十一品', completed: false, progress: 0 },
                                                { name: '第十二品', completed: false, progress: 0 },
                                                { name: '第十三品', completed: false, progress: 0 }
                                        ],
                                        showMore: false
                                },
                                {
                                        name: '《六祖壇經》',
                                        progressPercentage: 40,
                                        completed: 4,
                                        total: 10,
                                        unit: '章',
                                        volumes: [
                                                { name: '行由品', completed: true, progress: 100 },
                                                { name: '般若品', completed: true, progress: 100 },
                                                { name: '疑問品', completed: true, progress: 100 },
                                                { name: '定慧品', completed: true, progress: 100 },
                                                { name: '坐禪品', completed: false, progress: 0 },
                                                { name: '懺悔品', completed: false, progress: 0 },
                                                { name: '機緣品', completed: false, progress: 0 },
                                                { name: '頓漸品', completed: false, progress: 0 },
                                                { name: '護法品', completed: false, progress: 0 },
                                                { name: '付囑品', completed: false, progress: 0 }
                                        ],
                                        showMore: false
                                },
                                {
                                        name: '《菩薩戒本》',
                                        progressPercentage: 0,
                                        completed: 0,
                                        total: 1,
                                        unit: '部',
                                        volumes: [
                                                { name: '全文', completed: false, progress: 0 }
                                        ],
                                        showMore: false
                                }
                        ] as ScriptureDetail[],
                        mantras: [
                                { name: '《大悲咒》', count: '108次', percentage: 85 },
                                { name: '《心經》', count: '25次', percentage: 50 },
                                { name: '《六字大明咒》', count: '1080次', percentage: 70 },
                                { name: '《楞嚴咒》', count: '10次', percentage: 20 },
                                { name: '《藥師咒》', count: '32次', percentage: 40 }
                        ] as Mantra[],
                        historyRecords: [
                                { text: '《楞嚴經》卷三 (完成)', date: '2025/05/08 09:15' },
                                { text: '《大悲咒》x5', date: '2025/05/08 08:30' },
                                { text: '《心經》x3', date: '2025/05/07 20:45' },
                                { text: '《楞嚴經》卷二 (完成)', date: '2025/05/07 16:20' },
                                { text: '《楞嚴經》卷一 (完成)', date: '2025/05/06 15:10' },
                                { text: '《六字大明咒》x108', date: '2025/05/05 19:20' },
                                { text: '《地藏經》第十品 (完成)', date: '2025/05/05 16:30' },
                                { text: '《地藏經》第九品 (完成)', date: '2025/05/04 14:25' },
                                { text: '《華嚴經》卷五 (完成)', date: '2025/05/03 10:40' },
                                { text: '《大悲咒》x7', date: '2025/05/03 08:15' },
                                { text: '《楞嚴咒》x2', date: '2025/05/02 21:10' },
                                { text: '《地藏經》第八品 (完成)', date: '2025/05/02 17:35' },
                                { text: '《心經》x8', date: '2025/05/01 07:45' },
                                { text: '《六祖壇經》定慧品 (完成)', date: '2025/04/30 16:20' },
                                { text: '《大乘起信論》第三部分 (完成)', date: '2025/04/29 11:30' }
                        ] as Record[]
                };
        },
        methods: {
                addNewMantra(): void {
                        // Logic to add a new mantra
                        alert('新增咒語功能');
                },
                incrementMantra(index: number): void {
                        // Logic to increment mantra count
                        const mantra = this.mantras[index];
                        if (mantra) {
                                alert(`增加 ${mantra.name} 誦持次數`);
                        }
                }
        }
};
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
        --border: #eaeaea;
        --text-light: #777777;
}

* {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
}

body {
        font-family: "Arial", "微軟正黑體", sans-serif;
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

.tab-content {
        display: none;
        animation: fadeIn 0.4s ease-out;
}

.tab-content.active {
        display: block;
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
        transition: transform 0.3s ease;
}

.stat-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
        color: var(--primary);
}

.stat-label {
        font-size: 14px;
        color: var(--text-light);
}

.daily-goal {
        margin-top: 20px;
        padding: 15px;
        background-color: var(--secondary);
        border-radius: 8px;
        text-align: center;
}

.streak-info {
        font-weight: bold;
        margin-bottom: 10px;
        color: var(--dark);
}

.daily-goal-bar {
        width: 100%;
        height: 8px;
        background-color: var(--light);
        border-radius: 4px;
        overflow: hidden;
        margin-top: 10px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.daily-goal-fill {
        height: 100%;
        background-color: var(--success);
        transition: width 0.5s ease;
}

.record-list {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid var(--secondary);
        border-radius: 8px;
        padding: 10px;
        background-color: var(--light);
}

.record-item {
        padding: 12px;
        border-bottom: 1px solid var(--secondary);
        display: flex;
        justify-content: space-between;
        align-items: center;
}

.record-item:last-child {
        border-bottom: none;
}

.record-item:hover {
        background-color: #f9fbfd;
}

.record-date {
        color: var(--text-light);
        font-size: 14px;
}

.scripture-section,
.mantra-section {
        margin-bottom: 30px;
}

.scripture-title,
.mantra-title,
.summary-title {
        font-size: 18px;
        margin-bottom: 15px;
        color: var(--primary);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--secondary);
}

.mantra-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--secondary);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        transition: all 0.2s ease;
}

.mantra-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mantra-info {
        flex-grow: 1;
}

.mantra-name {
        font-weight: bold;
        margin-bottom: 5px;
        color: var(--dark);
}

.mantra-progress {
        display: flex;
        align-items: center;
        gap: 10px;
}

.progress-bar-container {
        flex-grow: 1;
        height: 8px;
        background-color: var(--light);
        border-radius: 4px;
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-fill {
        height: 100%;
        background-color: var(--success);
        transition: width 0.5s ease;
}

.mantra-count {
        font-weight: bold;
        color: var(--primary);
        min-width: 60px;
        text-align: right;
}

.add-button {
        background-color: var(--primary);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 16px;
        margin-left: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-button:hover {
        background-color: var(--accent);
        transform: rotate(90deg);
}

.volumes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
        margin-bottom: 20px;
}

.volume-item {
        background-color: var(--secondary);
        border-radius: 5px;
        padding: 15px 10px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.volume-item .progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        background-color: var(--success);
        transition: width 0.3s ease;
}

.volume-item.completed {
        background-color: var(--success);
        color: white;
}

.volume-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.total-progress {
        background-color: var(--secondary);
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
        text-align: center;
}

.total-text {
        font-weight: bold;
        margin-bottom: 10px;
        color: var(--dark);
}

.total-bar {
        width: 100%;
        height: 10px;
        background-color: var(--light);
        border-radius: 5px;
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.total-fill {
        height: 100%;
        background-color: var(--success);
        transition: width 0.5s ease;
}

@media (max-width: 768px) {
        .stats-container {
                grid-template-columns: 1fr 1fr;
        }

        .volumes-grid {
                grid-template-columns: repeat(4, 1fr);
        }

        header .container {
                flex-direction: column;
                text-align: center;
        }

        .user-info {
                margin-top: 20px;
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