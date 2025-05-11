<template>
        <q-page class="playlist-page q-pa-md">
                <!-- 浮動形狀背景 -->
                <FloatingShapesBackground :backgroundColor="'#FFFFFF'" />

                <!-- 頁面標題 -->
                <div class="page-title">
                        <h1 class="text-h4">寶嚴影音</h1>
                        <p class="subtitle">精選佛法學習影片，豐富您的修行之路</p>
                        <!-- 刷新按鈕 -->
                        <q-btn flat round color="#4a7862" icon="refresh" class="refresh-btn" 
                              @click="refreshData" :loading="refreshing">
                                <q-tooltip>刷新播放清單</q-tooltip>
                        </q-btn>
                </div>

                <!-- 搜尋欄 -->
                <div class="search-container">
                        <div class="search-box">
                                <q-input v-model="searchQuery" placeholder="搜尋影片..." outlined class="search-input"
                                        bg-color="white">
                                        <template v-slot:prepend>
                                                <q-icon name="search" color="#4a7862" />
                                        </template>
                                        <template v-slot:append v-if="searchQuery">
                                                <q-icon name="close" color="#4a7862" class="cursor-pointer"
                                                        @click="searchQuery = ''" />
                                        </template>
                                </q-input>
                        </div>
                </div>

                <!-- 加載中指示器 -->
                <div v-if="loading" class="loading-container">
                        <q-spinner-dots color="#4a7862" size="3rem" />
                        <div class="loading-text">載入播放清單中...</div>
                </div>

                <!-- 播放清單卡片 - 固定每行三張卡片 -->
                <div v-else class="playlist-container">
                        <!-- 顯示搜尋結果數量 -->
                        <div v-if="searchQuery" class="search-results-count">
                                找到 {{ filteredItems.length }} 個結果
                        </div>

                        <!-- 無結果提示 -->
                        <div v-if="searchQuery && filteredItems.length === 0" class="no-results">
                                <q-icon name="search_off" size="3rem" color="#4a7862" />
                                <p>沒有找到符合「{{ searchQuery }}」的影片</p>
                                <q-btn flat color="primary" label="清除搜尋" @click="searchQuery = ''" />
                        </div>

                        <div v-else class="playlist-grid">
                                <div v-for="item in filteredItems" :key="item.name" class="playlist-card">
                                        <!-- 綠線動畫容器 -->
                                        <div class="card-green-line-container">
                                                <div class="card-green-line"></div>
                                        </div>

                                        <!-- 影片封面 -->
                                        <q-img :src="item.playlist_cover[0]?.url" class="playlist-cover"
                                                :ratio="16 / 9" />

                                        <!-- 最愛按鈕 -->
                                        <q-btn round flat dense class="favorite-btn" :color="isFavorite(item.playlist_id) ? 'red' : 'grey'"
                                               @click="toggleFavorite(item)" :icon="isFavorite(item.playlist_id) ? 'favorite' : 'favorite_border'">
                                                <q-tooltip>{{ isFavorite(item.playlist_id) ? '移除最愛' : '加到最愛' }}</q-tooltip>
                                        </q-btn>

                                        <!-- 內容區域 -->
                                        <div class="playlist-content">
                                                <div class="playlist-title">{{ item.name }}</div>
                                                <div class="playlist-subtitle">{{ item.playlist_id }}</div>
                                        </div>

                                        <!-- 按鈕區域 -->
                                        <div class="playlist-actions">
                                                <q-btn class="watch-btn" @click="openPlaylist(item)">
                                                        <q-icon name="play_arrow" size="sm" class="q-mr-sm" />
                                                        觀看影片
                                                </q-btn>
                                        </div>
                                </div>
                        </div>
                </div>

                <!-- 通知元件 -->
                <q-notify-config :position="'top-right'" />
        </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';

import { db } from '../boot/firebase';
import { useRouter } from 'vue-router';

interface thumbnail {
        height: string;
        url: string;
        width: string;
}

interface Playlist {
        name: string;
        playlist_id: string;
        playlist_cover: { url: string }[];
        video_list: {id: string, name: string, thumbnails: thumbnail[]}[];
}

// 緩存鍵常量
const CACHE_KEY = 'playlist_data_cache';
const CACHE_EXPIRY_KEY = 'playlist_data_cache_expiry';
const CACHE_DURATION = 30 * 60 * 1000; // 30分鐘快取有效期

const items = ref<Playlist[]>([]);
const searchQuery = ref('');
const favorites = ref<string[]>([]);
const q = useQuasar();
const router = useRouter();
const loading = ref(true);
const refreshing = ref(false);

// 根據搜尋查詢過濾項目
const filteredItems = computed(() => {
        if (!searchQuery.value) {
                return items.value;
        }

        const query = searchQuery.value.toLowerCase().trim();
        return items.value.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.playlist_id.toLowerCase().includes(query)
        );
});

// 檢查是否為最愛
function isFavorite(playlistId: string): boolean {
        return favorites.value.includes(playlistId);
}

// 切換最愛狀態
function toggleFavorite(item: Playlist): void {
        const index = favorites.value.indexOf(item.playlist_id);
        let message = '';
        
        if (index === -1) {
                // 添加到最愛
                favorites.value.push(item.playlist_id);
                message = `已將「${item.name}」加入我的最愛`;
        } else {
                // 從最愛中移除
                favorites.value.splice(index, 1);
                message = `已將「${item.name}」從我的最愛中移除`;
        }
        
        // 更新本地存儲
        localStorage.setItem('playlistFavorites', JSON.stringify(favorites.value));
        
        // 顯示通知
        q.notify({
                message,
                color: index === -1 ? 'positive' : 'negative',
                icon: index === -1 ? 'favorite' : 'favorite_border',
                position: 'top-right',
                timeout: 2000
        });
}

// 保存數據到緩存
function saveToCache(data: Playlist[]) {
        try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_DURATION));
                console.log('播放清單數據已緩存');
        } catch (error) {
                console.error('緩存數據失敗:', error);
        }
}

// 從緩存加載數據
function loadFromCache(): Playlist[] | null {
        try {
                const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
                if (expiryTime && Number(expiryTime) > Date.now()) {
                        const cachedData = localStorage.getItem(CACHE_KEY);
                        if (cachedData) {
                                console.log('從緩存載入播放清單數據');
                                return JSON.parse(cachedData);
                        }
                } else if (expiryTime) {
                        // 緩存已過期，清除緩存
                        localStorage.removeItem(CACHE_KEY);
                        localStorage.removeItem(CACHE_EXPIRY_KEY);
                        console.log('緩存已過期，已清除');
                }
        } catch (error) {
                console.error('讀取緩存失敗:', error);
        }
        return null;
}

// 獲取數據
async function fetchData() {
        loading.value = true;
        
        try {
                // 嘗試從緩存加載
                const cachedData = loadFromCache();
                if (cachedData && cachedData.length > 0) {
                        items.value = cachedData;
                        loading.value = false;
                        return;
                }
                
                // 如果沒有緩存或緩存無效，從 Firestore 獲取數據
                items.value = [];
                const querySnapshot = await getDocs(collection(db, 'local'));
                querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        items.value.push({
                                name: doc.id,
                                playlist_id: data.playlist_id,
                                playlist_cover: data.playlist_cover,
                                video_list: data.video_list
                        });
                });
                
                // 保存到緩存
                if (items.value.length > 0) {
                        saveToCache(items.value);
                }
        } catch (error) {
                console.error('獲取數據失敗:', error);
                q.notify({
                        message: '獲取播放清單失敗，請檢查網絡連接',
                        color: 'negative',
                        position: 'top-right',
                        timeout: 3000
                });
        } finally {
                loading.value = false;
        }
}

// 手動刷新數據的方法
async function refreshData() {
        // 設置刷新狀態
        refreshing.value = true;
        
        try {
                // 清除緩存
                localStorage.removeItem(CACHE_KEY);
                localStorage.removeItem(CACHE_EXPIRY_KEY);
                
                // 重新加載數據
                items.value = [];
                const querySnapshot = await getDocs(collection(db, 'local'));
                querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        items.value.push({
                                name: doc.id,
                                playlist_id: data.playlist_id,
                                playlist_cover: data.playlist_cover,
                                video_list: data.video_list
                        });
                });
                
                // 保存到緩存
                if (items.value.length > 0) {
                        saveToCache(items.value);
                }
                
                // 顯示通知
                q.notify({
                        message: '播放清單已更新',
                        color: 'positive',
                        position: 'top-right',
                        timeout: 2000
                });
        } catch (error) {
                console.error('刷新數據失敗:', error);
                q.notify({
                        message: '更新播放清單失敗，請檢查網絡連接',
                        color: 'negative',
                        position: 'top-right',
                        timeout: 3000
                });
        } finally {
                refreshing.value = false;
        }
}

async function openPlaylist(item: Playlist) {
        console.log("選擇的播放清單：", item.name);
        console.log("影片列表：", item.video_list);
        
        // 檢查是否有影片列表
        if (!item.video_list || item.video_list.length === 0) {
                // 如果沒有影片，顯示通知
                q.notify({
                        message: '此播放清單沒有影片，將在 YouTube 中開啟',
                        color: 'info',
                        position: 'top-right',
                        timeout: 2000
                });
                
                // 使用 YouTube 連結作為備用
                window.open(`https://www.youtube.com/playlist?list=${item.playlist_id}`, '_blank');
                return;
        }
        
        // 將對象轉換為普通的序列化對象
        const serializedPlaylist = JSON.parse(JSON.stringify(item));
        const serializedVideoList = JSON.parse(JSON.stringify(item.video_list));
        
        // 使用 router 跳轉到影片列表頁面，並傳遞數據
        try {
                await router.push({
                        name: 'video-list',
                        params: { id: item.playlist_id },
                        query: { 
                                title: item.name 
                        },
                        // 使用狀態傳遞數據
                        state: { 
                                playlist: serializedPlaylist,
                                videoList: serializedVideoList
                        }
                });
        } catch (error) {
                console.error('導航錯誤:', error);
        }
}

// 從本地存儲加載最愛
function loadFavorites() {
        const storedFavorites = localStorage.getItem('playlistFavorites');
        if (storedFavorites) {
                favorites.value = JSON.parse(storedFavorites);
        }
}

onMounted(async () => {
        await fetchData();
        loadFavorites();
});
</script>

<style scoped>
.playlist-page {
        font-family: 'Noto Sans TC', sans-serif;
        background-color: #ffffff;
        min-height: 100vh;
}

.loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
}

.loading-text {
        margin-top: 1rem;
        color: #4a7862;
        font-size: 1.2rem;
}

.page-title {
        text-align: center;
        margin-bottom: 2rem;
        position: relative;
}

.refresh-btn {
        position: absolute;
        top: 0;
        right: 0;
        transition: transform 0.3s ease;
}

.refresh-btn:hover {
        transform: rotate(180deg);
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

/* 搜尋欄樣式 */
.search-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto 2rem auto;
        padding: 0 1rem;
}

.search-box {
        width: 100%;
}

.search-input {
        width: 100%;
}

.search-input :deep(.q-field__control) {
        border-radius: 2rem;
        border: 1px solid rgba(74, 120, 98, 0.5);
}

.search-input :deep(.q-field__control:hover) {
        border: 1px solid rgba(74, 120, 98, 0.8);
}

.search-results-count {
        text-align: center;
        margin-bottom: 1rem;
        color: #6d6d6d;
        font-size: 0.9rem;
}

.no-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 1rem;
        color: #6d6d6d;
        text-align: center;
}

.no-results p {
        margin: 1rem 0;
        font-size: 1.1rem;
}

.playlist-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
}

.playlist-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        /* 固定三列 */
        gap: 1.5rem;
        margin-bottom: 2rem;
}

.playlist-card {
        position: relative;
        overflow: hidden;
        background-color: white;
        border-radius: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        height: 100%;
}

.playlist-card:hover {
        transform: translateY(-5px);
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

.playlist-card:hover .card-green-line {
        width: 100%;
}

.playlist-cover {
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
}

/* 最愛按鈕樣式 */
.favorite-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(255, 255, 255, 0.8);
        z-index: 3;
        transition: transform 0.2s ease;
}

.favorite-btn:hover {
        transform: scale(1.1);
}

.playlist-content {
        padding: 1.2rem;
        flex-grow: 1;
}

.playlist-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #4a7862;
        margin-bottom: 0.5rem;
        /* 添加多行截斷 */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.4;
}

.playlist-subtitle {
        font-size: 0.9rem;
        color: #777;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
}

.playlist-actions {
        padding: 0 1.2rem 1.2rem 1.2rem;
        display: flex;
        justify-content: flex-end;
}

.watch-btn {
        background-color: transparent;
        color: #4a7862;
        border: 1px solid #4a7862;
        padding: 0.5rem 1.2rem;
        border-radius: 2rem;
        font-size: 0.9rem;
        transition: all 0.3s ease;
}

.watch-btn:hover {
        background-color: #4a7862;
        color: white;
}

/* 響應式調整 */
@media (max-width: 992px) {
        .playlist-grid {
                grid-template-columns: repeat(3, 1fr);
                /* 平板也保持三列 */
        }
}

@media (max-width: 768px) {
        .page-title h1 {
                font-size: 2rem;
        }

        .subtitle {
                font-size: 1rem;
        }

        .search-container {
                max-width: 100%;
        }

        .playlist-content {
                padding: 1rem;
        }

        .playlist-actions {
                padding: 0 1rem 1rem 1rem;
        }

        .playlist-grid {
                grid-template-columns: repeat(2, 1fr);
                /* 小平板改為兩列 */
        }
}

@media (max-width: 599px) {
        .playlist-grid {
                grid-template-columns: 1fr;
                /* 手機改為單列 */
                gap: 1rem;
        }
}
</style>