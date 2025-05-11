<template>
        <div class="baoyan-homepage">
                <!-- 浮動形狀背景 -->
                <FloatingShapesBackground :backgroundColor="'#FFFFFF'" />

                <!-- 主要內容 -->
                <div class="content-container">
                        <!-- 標題區域 -->
                        <header class="header">
                                <h1 class="main-title">BAOYAN</h1>
                                <p class="subtitle">佛法智慧·內心寧靜·自我提升</p>
                        </header>

                        <!-- 三大特色卡片 -->
                        <section class="features-section">
                                <div class="feature-card">
                                        <div class="card-green-line-container">
                                                <div class="card-green-line"></div>
                                        </div>

                                        <div class="icon-container">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                                        <path
                                                                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z">
                                                        </path>
                                                </svg>
                                        </div>
                                        <h2>佛法學習</h2>
                                        <p>用深入淺出又生活化的方式，帶您了解佛陀的智慧</p>
                                        <button class="learn-more-btn">了解更多</button>
                                </div>

                                <div class="feature-card">
                                        <div class="card-green-line-container">
                                                <div class="card-green-line"></div>
                                        </div>
                                        <div class="icon-container">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <path d="M12 6v6l4 2"></path>
                                                </svg>
                                        </div>
                                        <h2>客製化規劃</h2>
                                        <p>個人課表、面板，讓您輕鬆跟紀錄學習的歷程</p>
                                        <button class="learn-more-btn">了解更多</button>
                                </div>

                                <div class="feature-card">
                                        <div class="card-green-line-container">
                                                <div class="card-green-line"></div>
                                        </div>
                                        <div class="icon-container">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="9" cy="7" r="4"></circle>
                                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                </svg>
                                        </div>
                                        <h2>憶持佛經</h2>
                                        <p>利用填充題的方式，讓您快速背下三藏十六部經典</p>
                                        <button class="learn-more-btn">了解更多</button>
                                </div>
                        </section>

                        <!-- 簡介和開始體驗按鈕 -->
                        <section class="intro-section">
                                <p class="intro-text">
                                        「寶」，佛寶、法寶、僧寶。「嚴」，以楞嚴經、華嚴經為導，圓成依報嚴、正報嚴與眷屬嚴。
                                        又放光明名寶嚴，此光能覺一切眾，令得寶藏無窮盡，以此供養諸如來。
                                </p>
                                <button class="start-btn">開始體驗</button>
                        </section>
                </div>
        </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';

export default defineComponent({
        name: 'BaoyanHomepage',
        components: {
                FloatingShapesBackground,
        },
});
</script>

<style scoped>
.baoyan-homepage {
        position: relative;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Noto Sans TC', sans-serif;
        color: #333;
}

.content-container {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 1200px;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 1rem;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        margin: 2rem;
}

.header {
        text-align: center;
        margin-bottom: 3rem;
}

.main-title {
        font-size: 4rem;
        font-weight: 700;
        letter-spacing: 0.5rem;
        color: #4a7862;
        margin-bottom: 0.5rem;
}

.subtitle {
        font-size: 1.2rem;
        color: #6d6d6d;
        letter-spacing: 0.2rem;
}

.features-section {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
        width: 100%;
        margin-bottom: 3rem;
}

@media (max-width: 768px) {
        .features-section {
                flex-direction: column;
        }
}

.feature-card {
        flex: 1;
        background-color: white;
        border-radius: 1rem;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        transition:
                transform 0.3s ease,
                box-shadow 0.3s ease;
        position: relative; /* 確保相對定位 */
        overflow: hidden; /* 確保溢出隱藏 */
}

.feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

/* 更改類名避免衝突 */
.card-green-line-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        overflow: hidden;
}

/* 更改類名避免衝突 */
.card-green-line {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        background-color: #4A7862;
        transition: width 0.5s ease;
}

.feature-card:hover .card-green-line {
        width: 100%;
}

.icon-container {
        width: 80px;
        height: 80px;
        background-color: #e9f5ee;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto 1.5rem;
        color: #4a7862;
}

.feature-card h2 {
        font-size: 1.5rem;
        color: #4a7862;
        margin-bottom: 1rem;
}

.feature-card p {
        font-size: 1rem;
        line-height: 1.6;
        color: #666;
        margin-bottom: 1.5rem;
}

.learn-more-btn {
        background-color: transparent;
        color: #4a7862;
        border: 1px solid #4a7862;
        padding: 0.5rem 1.5rem;
        border-radius: 2rem;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
}

.learn-more-btn:hover {
        background-color: #4a7862;
        color: white;
}

.intro-section {
        text-align: center;
        max-width: 800px;
}

.intro-text {
        font-size: 1.1rem;
        line-height: 1.7;
        margin-bottom: 2rem;
        color: #555;
}

.start-btn {
        background-color: #4a7862;
        color: white;
        border: none;
        padding: 1rem 3rem;
        border-radius: 2rem;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(74, 120, 98, 0.3);
}

.start-btn:hover {
        background-color: #3d664f;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(74, 120, 98, 0.4);
}
</style>