<template>
        <q-page class="favorites-page q-pa-md">
                <!-- 浮動形狀背景 -->
                <FloatingShapesBackground :backgroundColor="'#FFFFFF'" />

                <!-- 頁面標題 -->
                <div class="page-title">
                        <h1 class="text-h4">我的最愛</h1>
                        <p class="subtitle">您收藏的佛法影片，隨時觀看</p>
                        <!-- 返回按鈕 -->
                        <q-btn flat round color="#4a7862" icon="arrow_back" class="back-btn" 
                              @click="$router.push('/')">
                                <q-tooltip>返回播放清單</q-tooltip>
                        </q-btn>
                </div>

                <!-- 加載中指示器 -->
                <div v-if="loading" class="loading-container">
                        <q-spinner-dots color="#4a7862" size="3rem" />
                        <div class="loading-text">載入最愛清單中...</div>
                </div>

                <!-- 無最愛提示 -->
                <div v-else-if="favoriteItems.length === 0" class="no-favorites">
                        <q-icon name="favorite_border" size="4rem" color="#4a7862" />
                        <p>您還沒有加入任何最愛</p>
                        <q-btn color="primary" label="瀏覽播放清單" @click="$router.push('/')" />
                </div>

                <!-- 最愛清單卡片 -->
                <div v-else class="favorites-container">
                        <div class="favorites-count">共 {{ favoriteItems.length }} 個收藏影片</div>
                        <div class="favorites-grid">
                                <div v-for="item in favoriteItems" :key="item.playlist_id" class="playlist-card">
                                        <!-- 綠線動畫容器 -->
                                        <div class="card-green-line-container">
                                                <div class="card-green-line"></div>
                                        </div>

                                        <!-- 影片封面 -->
                                        <q-img v-if="item.playlist_cover && item.playlist_cover[0]" 
                                              :src="item.playlist_cover[0].url" 
                                              class="playlist-cover"
                                              :ratio="16 / 9">
                                                <template v-slot:loading>
                                                        <q-spinner-dots color="white" />
                                                </template>
                                                <template v-slot:error>
                                                        <div class="cover-placeholder">
                                                                <q-icon name="movie" size="3rem" color="#4a7862" />
                                                        </div>
                                                </template>
                                        </q-img>
                                        <div v-else class="cover-placeholder">
                                                <q-icon name="movie" size="3rem" color="#4a7862" />
                                        </div>

                                        <!-- 最愛按鈕 -->
                                        <q-btn round flat dense class="favorite-btn" color="red"
                                               @click="removeFromFavorites(item)" icon="favorite">
                                                <q-tooltip>移除最愛</q-tooltip>
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
        </q-page>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - 暫時忽略類型檢查，以便處理路由狀態問題
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';

import { db } from '../boot/firebase';
import { useRouter } from 'vue-router';

// 使用不含 any 的接口定義
interface thumbnail {
        height: string;
        url: string;
        width: string;
}

interface VideoItem {
        id: string;
        name: string;
        thumbnails: thumbnail[];
}

interface Playlist {
        name: string;
        playlist_id: string;
        playlist_cover: { url: string }[];
        video_list: VideoItem[];
}

const favoriteItems = ref<Playlist[]>([]);
const allItems = ref<Playlist[]>([]);
const favoriteIds = ref<string[]>([]);
const q = useQuasar();
const router = useRouter();
const loading = ref(true);

// 移除最愛 - 優化版
function removeFromFavorites(item: Playlist): void {
        const index = favoriteIds.value.indexOf(item.playlist_id);
        
        if (index !== -1) {
                // 從列表中移除
                favoriteIds.value.splice(index, 1);
                
                // 立即更新顯示列表 (不再通過 watch)
                favoriteItems.value = favoriteItems.value.filter(
                        fav => fav.playlist_id !== item.playlist_id
                );
                
                // 更新 localStorage (使用批處理減少操作)
                queueMicrotask(() => {
                        localStorage.setItem('playlistFavorites', JSON.stringify(favoriteIds.value));
                        
                        // 發布事件，通知主頁面更新最愛狀態
                        window.dispatchEvent(new CustomEvent('favorites-updated', {
                                detail: { favorites: favoriteIds.value }
                        }));
                });
                
                // 顯示通知
                q.notify({
                        message: `已將「${item.name}」從我的最愛中移除`,
                        color: 'negative',
                        icon: 'favorite_border',
                        position: 'top-right',
                        timeout: 2000
                });
        }
}

// 改進的播放清單播放功能
async function openPlaylist(item: Playlist) {
        // 檢查是否有影片列表
        if (!item.video_list || item.video_list.length === 0) {
                q.notify({
                        message: '此播放清單沒有影片，將在 YouTube 中開啟',
                        color: 'info',
                        position: 'top-right',
                        timeout: 2000
                });
                
                window.open(`https://www.youtube.com/playlist?list=${item.playlist_id}`, '_blank');
                return;
        }
        
        try {
                // 使用路由狀態傳遞數據 (繞過類型檢查)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - 忽略類型檢查，因為路由狀態需要特殊處理
                await router.push({
                        name: 'video-list',
                        params: { id: item.playlist_id },
                        query: { title: item.name },
                        // 將類型轉換為純 JS 物件
                        state: { 
                                playlist: JSON.parse(JSON.stringify(item)), 
                                videoList: JSON.parse(JSON.stringify(item.video_list)) 
                        }
                });
        } catch (error) {
                console.error('導航錯誤:', error);
                q.notify({
                        message: '無法開啟播放清單，請稍後再試',
                        color: 'negative',
                        position: 'top-right',
                        timeout: 2000
                });
        }
}

// 優化資料獲取 - 使用快取機制
async function fetchAllItems() {
        try {
                // 檢查快取是否仍然有效
                const expiryTime = localStorage.getItem('playlist_data_cache_expiry');
                if (expiryTime && Number(expiryTime) > Date.now()) {
                        const cachedData = localStorage.getItem('playlist_data_cache');
                        if (cachedData) {
                                allItems.value = JSON.parse(cachedData);
                                console.log('從緩存載入播放清單數據');
                                return true;
                        }
                }
                
                // 從 Firestore 獲取
                console.log('從 Firestore 載入播放清單數據');
                allItems.value = [];
                const querySnapshot = await getDocs(collection(db, 'local'));
                
                if (querySnapshot.empty) {
                        console.warn('Firestore 查詢未返回任何數據');
                        return false;
                }
                
                querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        allItems.value.push({
                                name: doc.id,
                                playlist_id: data.playlist_id,
                                playlist_cover: data.playlist_cover,
                                video_list: data.video_list
                        });
                });
                
                // 更新緩存
                if (allItems.value.length > 0) {
                        localStorage.setItem('playlist_data_cache', JSON.stringify(allItems.value));
                        // 設置 30 分鐘的緩存過期時間
                        localStorage.setItem('playlist_data_cache_expiry', String(Date.now() + 30 * 60 * 1000));
                }
                
                return true;
        } catch (error) {
                console.error('獲取所有項目失敗:', error);
                return false;
        }
}

// 加載最愛項目 - 優化版
function loadFavoriteItems() {
        // 從 localStorage 獲取最愛 ID 列表
        const storedFavorites = localStorage.getItem('playlistFavorites');
        if (storedFavorites) {
                try {
                        favoriteIds.value = JSON.parse(storedFavorites);
                } catch (e) {
                        console.error('解析最愛數據失敗:', e);
                        favoriteIds.value = [];
                }
        } else {
                favoriteIds.value = [];
        }
        
        // 過濾出最愛項目 (改進了錯誤處理)
        if (allItems.value.length > 0 && favoriteIds.value.length > 0) {
                favoriteItems.value = allItems.value.filter(item => 
                        item && item.playlist_id && favoriteIds.value.includes(item.playlist_id)
                );
        } else {
                favoriteItems.value = [];
        }
}

// 處理最愛更新事件 - 優化版
function handleFavoritesUpdated(event: CustomEvent) {
        if (event.detail && Array.isArray(event.detail.favorites)) {
                favoriteIds.value = event.detail.favorites;
                
                // 直接更新最愛清單
                if (allItems.value.length > 0) {
                        favoriteItems.value = allItems.value.filter(item => 
                                item && item.playlist_id && favoriteIds.value.includes(item.playlist_id)
                        );
                } else {
                        favoriteItems.value = [];
                }
        }
}

// 初始化資料 - 改進流程
async function initializeData() {
        loading.value = true;
        
        try {
                // 首先嘗試獲取所有項目
                const fetchSuccess = await fetchAllItems();
                
                if (fetchSuccess) {
                        // 然後加載最愛
                        loadFavoriteItems();
                } else {
                        // 如果獲取失敗，顯示錯誤
                        q.notify({
                                message: '獲取播放清單失敗，請檢查網絡連接',
                                color: 'negative',
                                position: 'top-right',
                                timeout: 3000
                        });
                        favoriteItems.value = [];
                }
        } catch (error) {
                console.error('初始化數據失敗:', error);
                favoriteItems.value = [];
        } finally {
                loading.value = false;
        }
}

onMounted(() => {
        // 初始化資料 (添加 void 操作符解決 floating promise 問題)
        void initializeData();
        
        // 監聽最愛更新事件
        window.addEventListener('favorites-updated', handleFavoritesUpdated as EventListener);
});

onBeforeUnmount(() => {
        // 移除事件監聽
        window.removeEventListener('favorites-updated', handleFavoritesUpdated as EventListener);
});
</script>

<style scoped>
.favorites-page {
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

.back-btn {
        position: absolute;
        top: 0;
        left: 0;
        transition: transform 0.3s ease;
}

.back-btn:hover {
        transform: translateX(-5px);
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

.no-favorites {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        color: #6d6d6d;
        text-align: center;
}

.no-favorites p {
        margin: 1rem 0;
        font-size: 1.2rem;
}

.favorites-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
}

.favorites-count {
        text-align: right;
        margin-bottom: 1rem;
        color: #6d6d6d;
        font-size: 0.9rem;
}

.favorites-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
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

.cover-placeholder {
        height: 0;
        padding-bottom: 56.25%; /* 16:9 寬高比 */
        background-color: #f5f5f5;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
}

.cover-placeholder q-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
        .favorites-grid {
                grid-template-columns: repeat(3, 1fr);
        }
}

@media (max-width: 768px) {
        .page-title h1 {
                font-size: 2rem;
        }

        .subtitle {
                font-size: 1rem;
        }

        .playlist-content {
                padding: 1rem;
        }

        .playlist-actions {
                padding: 0 1rem 1rem 1rem;
        }

        .favorites-grid {
                grid-template-columns: repeat(2, 1fr);
        }
}

@media (max-width: 599px) {
        .favorites-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
        }
}
</style>