<template>
        <q-page class="video-player-page q-pa-md">
                <!-- 浮動形狀背景 -->
                <FloatingShapesBackground :backgroundColor="'#FFFFFF'" />

                <!-- 返回按鈕 -->
                <div class="back-button">
                        <q-btn flat icon="arrow_back" label="返回影片列表" color="#4a7862" @click="goBack" />
                </div>

                <!-- 頁面標題 -->
                <div class="page-title">
                        <h1 class="text-h4">{{ videoTitle || '影片學習筆記' }}</h1>
                        <p class="subtitle">在觀看影片時標記重要時刻，加深學習體驗</p>
                </div>

                <!-- 主要內容區 -->
                <div class="content-container">
                        <!-- 左側：影片播放區域 -->
                        <div class="video-section">
                                <div class="video-container">
                                        <div v-if="!currentVideoId" class="video-placeholder">
                                                <q-spinner-dots color="#4a7862" size="3rem" />
                                                <p>載入影片中...</p>
                                        </div>
                                        <iframe v-else
                                                :src="`https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1`"
                                                frameborder="0" allowfullscreen ref="youtubeIframe"
                                                class="youtube-iframe"></iframe>
                                </div>

                                <!-- 影片操作按鈕 -->
                                <div class="video-controls" v-if="currentVideoId">
                                        <q-btn class="action-btn" @click="addTimeMarker">
                                                <q-icon name="bookmark_add" size="sm" class="q-mr-sm" />
                                                標記當前時間點
                                        </q-btn>
                                </div>
                        </div>

                        <!-- 右側：筆記和標記區域 -->
                        <div class="notes-section">
                                <h2 class="section-title">我的標記</h2>

                                <!-- 標記卡片 -->
                                <div class="bookmark-cards">
                                        <div v-if="timeMarkers.length === 0" class="empty-state">
                                                <q-icon name="bookmarks" size="3rem" color="#4a7862" />
                                                <p>尚無標記。觀看影片時點擊「標記當前時間點」按鈕。</p>
                                        </div>

                                        <div v-else>
                                                <!-- 單個標記卡片 -->
                                                <div v-for="(marker, index) in timeMarkers" :key="index"
                                                        class="bookmark-card">
                                                        <!-- 綠線動畫容器 -->
                                                        <div class="card-green-line-container">
                                                                <div class="card-green-line"></div>
                                                        </div>

                                                        <!-- 時間標記區域 -->
                                                        <div class="bookmark-time" @click="seekToTime(marker.seconds)">
                                                                <q-icon name="schedule" size="sm" class="q-mr-sm" />
                                                                {{ formatTime(marker.seconds) }}
                                                        </div>

                                                        <!-- 筆記內容區域 -->
                                                        <div class="bookmark-content">
                                                                <q-input v-model="marker.note" outlined type="textarea"
                                                                        placeholder="在此添加筆記..." rows="2"
                                                                        class="note-input" />
                                                        </div>

                                                        <!-- 操作按鈕 -->
                                                        <div class="bookmark-actions">
                                                                <q-btn flat round color="primary" icon="play_circle"
                                                                        @click="seekToTime(marker.seconds)" />
                                                                <q-btn flat round color="negative" icon="delete"
                                                                        @click="removeMarker(index)" />
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                                <!-- 儲存和匯出按鈕 -->
                                <div class="notes-actions" v-if="timeMarkers.length > 0">
                                        <q-btn class="action-btn" @click="saveMarkers">
                                                <q-icon name="save" size="sm" class="q-mr-sm" />
                                                儲存筆記
                                        </q-btn>
                                        <q-btn class="action-btn ml-2" @click="exportMarkers">
                                                <q-icon name="file_download" size="sm" class="q-mr-sm" />
                                                匯出筆記
                                        </q-btn>
                                </div>
                        </div>
                </div>
        </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';

// 為 YouTube API 定義類型
// 定義 YouTube 事件類型
interface YouTubePlayerEvent {
        target: YouTubePlayerInstance;
        data: unknown;
}

// 定義 YouTube Player 實例類型
interface YouTubePlayerInstance {
        // 常用方法
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        seekTo(seconds: number, allowSeekAhead: boolean): void;
        getCurrentTime(): number;
        getDuration(): number;
}

// 定義 YouTube Player 建構函數類型
interface YouTubePlayerConstructor {
        (elementId: string, options: {
                videoId?: string;
                width?: number | string;
                height?: number | string;
                playerVars?: Record<string, unknown>;
                events?: Record<string, (event: YouTubePlayerEvent) => void>;
        }): YouTubePlayerInstance;
}

// 擴展 Window 介面
interface YouTubeWindow extends Window {
        YT?: {
                Player: YouTubePlayerConstructor;
        };
        onYouTubeIframeAPIReady?: () => void;
}

// 將 window 轉換為擴展後的介面
const youtubeWindow = window as YouTubeWindow;

// YouTube API 必要變數
const youtubeApiLoaded = ref(false);

// Quasar 通知系統
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

// 頁面數據
const videoTitle = ref('');
const currentVideoId = ref('');
const youtubeIframe = ref<HTMLIFrameElement | null>(null);
const timeMarkers = ref<{ seconds: number; time: string; note: string }[]>([]);

// 返回到影片列表頁面
async function goBack() {
        try {
                router.go(-1); // 返回上一頁
        } catch (error) {
                console.error('導航錯誤:', error);
                try {
                        await router.push({ name: 'video-list', params: { id: route.params.playlistId || '' } });
                } catch (innerError) {
                        console.error('備用導航也失敗:', innerError);
                }
        }
}

// 從 URL 中提取 YouTube ID
// function extractYoutubeId(url: string): string {
//         const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//         const match = url.match(regExp);

//         // 修正 TypeScript 錯誤：檢查 match 和 match[2] 是否存在
//         if (match && match[2] && match[2].length === 11) {
//                 return match[2];
//         }
//         return '';
// }

// 載入影片
function loadVideo(videoId: string, title?: string) {
        if (videoId) {
                currentVideoId.value = videoId;
                if (title) {
                        videoTitle.value = title;
                }
                loadSavedMarkers(videoId);
                $q.notify({
                        color: 'positive',
                        message: '影片已載入',
                        icon: 'check_circle'
                });
        } else {
                $q.notify({
                        color: 'negative',
                        message: '無效的 YouTube 影片 ID',
                        icon: 'error'
                });
        }
}

// 初始化 YouTube API
function initYouTubeAPI() {
        if (youtubeApiLoaded.value) return;

        // 如果已經載入 API，不再重複載入
        if (youtubeWindow.YT && typeof youtubeWindow.YT.Player === 'function') {
                youtubeApiLoaded.value = true;
                return;
        }

        // 創建 script 元素載入 YouTube API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];

        // 修正 TypeScript 錯誤：確保 firstScriptTag 和其父節點存在
        if (firstScriptTag && firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
                // 如果沒有找到現有的 script 標籤，則添加到 head
                document.head.appendChild(tag);
        }

        // API 準備好時的回調
        youtubeWindow.onYouTubeIframeAPIReady = () => {
                youtubeApiLoaded.value = true;
        };
}

// 添加時間標記
function addTimeMarker() {
        if (!currentVideoId.value) return;

        try {
                const iframe = youtubeIframe.value;
                if (iframe) {
                        // 取得 iframe 的內容
                        const contentWindow = iframe.contentWindow;
                        if (contentWindow) {
                                // 嘗試使用 postMessage 來獲取當前時間
                                contentWindow.postMessage('{"event":"command","func":"getCurrentTime","args":""}', '*');

                                // 假設我們能夠獲取到時間，這裡使用預設值
                                const currentTime = getCurrentTimeManually() || 0;

                                // 獲取視頻總時長（在實際應用中應該通過 API 獲取）
                                const videoDuration = getVideoDuration() || 600; // 預設 10 分鐘

                                // 檢查標記時間是否超過影片時長
                                if (currentTime > videoDuration) {
                                        $q.notify({
                                                color: 'negative',
                                                message: `標記時間 (${formatTime(currentTime)}) 超過影片時長 (${formatTime(videoDuration)})`,
                                                icon: 'error'
                                        });
                                        return;
                                }

                                const formattedTime = formatTime(currentTime);

                                // 添加新標記
                                timeMarkers.value.push({
                                        seconds: currentTime,
                                        time: formattedTime,
                                        note: ''
                                });

                                $q.notify({
                                        color: 'positive',
                                        message: `已標記時間點 ${formattedTime}`,
                                        icon: 'bookmark'
                                });
                        }
                }
        } catch (error) {
                console.error('無法獲取影片時間', error);
                $q.notify({
                        color: 'negative',
                        message: '無法獲取影片時間',
                        icon: 'error'
                });
        }
}

// 獲取影片總時長（模擬，實際應使用 YouTube API）
function getVideoDuration(): number {
        // 在實際項目中，這應該通過 YouTube API 獲取
        // 此處返回一個模擬時長
        return 600; // 模擬 10 分鐘
}

// 手動獲取時間（模擬，實際項目中應使用 YouTube API）
function getCurrentTimeManually() {
        // 在實際項目中，這應該通過 YouTube API 獲取
        // 此處模擬隨機時間用於演示
        return Math.floor(Math.random() * 600); // 模擬 0-10 分鐘
}

// 格式化時間（秒 -> MM:SS）
function formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 跳轉到指定時間
function seekToTime(seconds: number) {
        try {
                const iframe = youtubeIframe.value;
                if (iframe) {
                        const contentWindow = iframe.contentWindow;
                        if (contentWindow) {
                                // 使用 postMessage 來控制播放
                                contentWindow.postMessage(`{"event":"command","func":"seekTo","args":[${seconds}, true]}`, '*');
                                contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                        }
                }
        } catch (error) {
                console.error('無法跳轉影片時間', error);
        }
}

// 移除標記
function removeMarker(index: number) {
        timeMarkers.value.splice(index, 1);
}

// 儲存標記到本地存儲
function saveMarkers() {
        if (!currentVideoId.value) return;

        const data = {
                videoId: currentVideoId.value,
                videoTitle: videoTitle.value,
                markers: timeMarkers.value
        };

        localStorage.setItem(`video-markers-${currentVideoId.value}`, JSON.stringify(data));

        $q.notify({
                color: 'positive',
                message: '筆記已儲存',
                icon: 'save'
        });
}

// 從本地存儲載入標記
function loadSavedMarkers(videoId: string) {
        try {
                const savedData = localStorage.getItem(`video-markers-${videoId}`);
                if (savedData) {
                        const data = JSON.parse(savedData);
                        timeMarkers.value = data.markers || [];
                        // 如果存儲的數據中有標題，也一併載入
                        if (data.videoTitle && !videoTitle.value) {
                                videoTitle.value = data.videoTitle;
                        }

                        if (timeMarkers.value.length > 0) {
                                $q.notify({
                                        color: 'info',
                                        message: `已載入 ${timeMarkers.value.length} 個已儲存的標記`,
                                        icon: 'info'
                                });
                        }
                } else {
                        // 沒有儲存的標記，清空列表
                        timeMarkers.value = [];
                }
        } catch (error) {
                console.error('載入標記失敗', error);
                timeMarkers.value = [];
        }
}

// 匯出標記為文本文件
function exportMarkers() {
        if (timeMarkers.value.length === 0) return;

        let content = `# 影片筆記: ${videoTitle.value || currentVideoId.value}\n\n`;

        timeMarkers.value.forEach((marker, index) => {
                content += `## 標記 ${index + 1} - ${marker.time}\n`;
                content += `${marker.note || '(無筆記)'}\n\n`;
        });

        // 創建並下載文件
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `影片筆記-${videoTitle.value || currentVideoId.value}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        $q.notify({
                color: 'positive',
                message: '筆記已匯出',
                icon: 'file_download'
        });
}

// 生命週期鉤子
onMounted(() => {
        // 初始化 YouTube API
        initYouTubeAPI();

        // 首先從路由參數取得影片信息
        const videoId = route.params.videoId as string;
        const title = route.query.title as string || '';
        
        // 如果路由參數中有影片 ID
        if (videoId) {
                loadVideo(videoId, title);
        } 
        // 如果路由中沒有，但有 state 傳遞的數據
        else if (history.state && history.state.videoId) {
                loadVideo(history.state.videoId, history.state.videoTitle || '');
        } 
        // 最後從 URL 參數嘗試讀取
        else {
                const urlParams = new URLSearchParams(window.location.search);
                const videoParam = urlParams.get('v');
                if (videoParam) {
                        loadVideo(videoParam);
                }
        }

        // 設置接收 YouTube 事件的監聽器
        window.addEventListener('message', (event) => {
                try {
                        const data = JSON.parse(event.data);
                        if (data.event === 'infoDelivery' && data.info && data.info.currentTime) {
                                // 如果收到影片時間訊息，可以進行處理
                                console.log('Current time:', data.info.currentTime);
                        }
                } catch {
                        // 忽略非 JSON 消息
                }
        });
});

onBeforeUnmount(() => {
        // 移除事件監聽器
        window.removeEventListener('message', () => { });
});
</script>

<style scoped>
.video-player-page {
        font-family: 'Noto Sans TC', sans-serif;
        background-color: #ffffff;
        min-height: 100vh;
}

.back-button {
        margin-bottom: 1rem;
}

.page-title {
        text-align: center;
        margin-bottom: 2rem;
}

.page-title h1 {
        font-weight: 700;
        letter-spacing: 0.3rem;
        color: #4a7862;
        margin-bottom: 0.5rem;
}

.subtitle {
        font-size: 1.1rem;
        color: #6d6d6d;
        letter-spacing: 0.1rem;
}

.content-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
}

/* 影片區域樣式 */
.video-section {
        flex: 1;
        min-width: 300px;
}

.video-container {
        position: relative;
        padding-bottom: 56.25%;
        /* 16:9 比例 */
        height: 0;
        overflow: hidden;
        border-radius: 1rem;
        background-color: #f5f5f5;
        margin-bottom: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.youtube-iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 1rem;
}

.video-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #f9f9f9;
        color: #6d6d6d;
        border-radius: 1rem;
}

.video-placeholder p {
        margin-top: 1rem;
        font-size: 1.1rem;
}

.video-controls {
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
}

.action-btn {
        background-color: transparent;
        color: #4a7862;
        border: 1px solid #4a7862;
        padding: 0.5rem 1.2rem;
        border-radius: 2rem;
        font-size: 0.9rem;
        transition: all 0.3s ease;
}

.action-btn:hover {
        background-color: #4a7862;
        color: white;
}

/* 筆記區域樣式 */
.notes-section {
        flex: 1;
        min-width: 300px;
}

.section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #4a7862;
        margin-bottom: 1rem;
        letter-spacing: 0.1rem;
}

.bookmark-cards {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
        max-height: 600px;
        overflow-y: auto;
        padding-right: 0.5rem;
}

.empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 1rem;
        color: #6d6d6d;
        text-align: center;
        background-color: #f9f9f9;
        border-radius: 1rem;
}

.empty-state p {
        margin-top: 1rem;
        font-size: 1.1rem;
}

.bookmark-card {
        position: relative;
        overflow: hidden;
        background-color: white;
        border-radius: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        padding: 1.2rem;
        margin-bottom: 1rem;
        /* 確保卡片間有足夠空間 */
        border: 1px solid rgba(74, 120, 98, 0.1);
        /* 添加輕微邊框 */
}

.bookmark-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 綠線動畫 */
.card-green-line-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        overflow: hidden;
        z-index: 2;
}

.card-green-line {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        background-color: #4A7862;
        transition: width 0.5s ease;
}

.bookmark-card:hover .card-green-line {
        width: 100%;
}

.bookmark-time {
        font-size: 1.1rem;
        font-weight: 600;
        color: #4a7862;
        margin-bottom: 0.8rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
}

.bookmark-content {
        margin-bottom: 0.8rem;
}

.note-input :deep(.q-field__control) {
        border-radius: 0.5rem;
        border: 1px solid rgba(74, 120, 98, 0.3);
}

.bookmark-actions {
        display: flex;
        justify-content: flex-end;
}

.notes-actions {
        display: flex;
        justify-content: center;
}

.ml-2 {
        margin-left: 0.5rem;
}

/* 響應式調整 */
@media (max-width: 768px) {
        .content-container {
                flex-direction: column;
        }

        .video-section,
        .notes-section {
                width: 100%;
        }

        .page-title h1 {
                font-size: 2rem;
        }

        .subtitle {
                font-size: 1rem;
        }
}
</style>