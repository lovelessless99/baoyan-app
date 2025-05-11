<template>
        <q-page class="video-list-page q-pa-md">
                <!-- 浮動形狀背景 -->
                <FloatingShapesBackground :backgroundColor="'#FFFFFF'" />

                <!-- 回到播放清單按鈕 -->
                <div class="back-button">
                        <q-btn flat icon="arrow_back" label="返回播放清單" color="#4a7862" @click="goBack" />
                </div>

                <!-- 頁面標題 -->
                <div class="page-title">
                        <h1 class="text-h4">{{ playlistTitle }}</h1>
                        <p class="subtitle">共 {{ videoList.length }} 部影片</p>
                </div>

                <!-- 視頻列表 -->
                <div class="video-container">
                        <div v-if="videoList.length === 0" class="no-videos">
                                <q-icon name="videocam_off" size="3rem" color="#4a7862" />
                                <p>此播放清單沒有影片</p>
                                <q-btn flat color="primary" label="返回播放清單" @click="goBack" />
                        </div>

                        <div v-else class="video-grid">
                                <div v-for="(video, index) in videoList" :key="video.id" class="video-card">
                                        <!-- 序號 -->
                                        <div class="video-number">{{ index + 1 }}</div>

                                        <!-- 影片縮圖 -->
                                        <div class="thumbnail-container" @click="playVideo(video)">
                                                <q-img :src="getVideoThumbnailUrl(video)"
                                                        class="video-thumbnail" :ratio="16 / 9">
                                                        <div class="play-overlay">
                                                                <q-icon name="play_circle" size="3rem" color="white" />
                                                        </div>
                                                </q-img>
                                        </div>

                                        <!-- 影片標題 -->
                                        <div class="video-info" @click="playVideo(video)">
                                                <div class="video-title">{{ video.name }}</div>
                                                <div class="video-id">ID: {{ video.id }}</div>
                                        </div>
                                </div>
                        </div>
                </div>
        </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';

interface thumbnail {
        height: string;
        url: string;
        width: string;
}

interface Video {
        id: string;
        name: string;
        thumbnails: thumbnail[];
}

interface Playlist {
        name: string;
        playlist_id: string;
        playlist_cover: { url: string }[];
        video_list: Video[];
}

const route = useRoute();
const router = useRouter();
const playlistTitle = ref('');
const videoList = ref<Video[]>([]);
const playlist = ref<Playlist | null>(null);

// 獲取視頻縮圖URL的安全函數
function getVideoThumbnailUrl(video: Video): string {
        if (video.thumbnails && video.thumbnails.length > 0 && video.thumbnails[0]?.url) {
                return video.thumbnails[0].url;
        }
        return '';
}

// 回到播放清單頁面
async function goBack() {
        try {
                // 使用路由的 go 方法回到上一頁
                // go(-1) 表示返回上一頁，這與瀏覽器的後退按鈕功能相同
                router.go(-1);
        } catch (error) {
                console.error('導航錯誤:', error);
                // 如果 go 方法失敗，嘗試使用明確的路由路徑
                try {
                        // 確保使用正確的路由名稱，這應該與您的路由配置匹配
                        await router.push({ name: 'playlists' });
                } catch (innerError) {
                        console.error('備用導航也失敗:', innerError);
                }
        }
}

// 播放影片
async function playVideo(video: Video) {
        try {
                // 導航到播放器頁面
                await router.push({
                        name: 'video-player',
                        params: {
                                videoId: video.id,
                                playlistId: route.params.id
                        },
                        query: {
                                title: video.name
                        },
                        // 使用狀態傳遞數據
                        state: {
                                videoId: video.id,
                                videoTitle: video.name,
                                thumbnail: video.thumbnails && video.thumbnails.length > 0 ? video.thumbnails[0]?.url : ''
                        }
                });
        } catch (error) {
                console.error('導航到播放頁面失敗:', error);
                // 如果導航失敗，使用傳統方法打開 YouTube
                window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
        }
}

onMounted(() => {
        // 從路由狀態獲取數據
        const routeState = history.state;

        // 獲取播放清單標題
        if (route.query.title) {
                playlistTitle.value = route.query.title as string;
        }

        // 從狀態中獲取播放清單和影片列表
        if (routeState && routeState.playlist) {
                playlist.value = routeState.playlist;
        }

        if (routeState && routeState.videoList) {
                videoList.value = routeState.videoList;
        } else {
                // 沒有影片列表數據的備用處理
                if (playlist.value && playlist.value.video_list) {
                        videoList.value = playlist.value.video_list;
                }
        }

        console.log('播放清單標題:', playlistTitle.value);
        console.log('影片列表:', videoList.value);
});
</script>

<style scoped>
.video-list-page {
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

.video-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
}

.no-videos {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 1rem;
        color: #6d6d6d;
        text-align: center;
}

.no-videos p {
        margin: 1rem 0;
        font-size: 1.1rem;
}

.video-grid {
        display: grid;
        gap: 1.5rem;
        margin-bottom: 2rem;
}

.video-card {
        position: relative;
        display: flex;
        background-color: white;
        border-radius: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
}

.video-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.video-number {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: rgba(74, 120, 98, 0.8);
        color: white;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: bold;
        z-index: 2;
}

.thumbnail-container {
        width: 220px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
}

.video-thumbnail {
        transition: transform 0.3s ease;
}

.thumbnail-container:hover .video-thumbnail {
        transform: scale(1.05);
}

.play-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: opacity 0.3s ease;
}

.thumbnail-container:hover .play-overlay {
        opacity: 1;
}

.video-info {
        padding: 1rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        cursor: pointer;
}

.video-title {
        font-size: 1.1rem;
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

.video-id {
        font-size: 0.9rem;
        color: #777;
}

/* 響應式調整 */
@media (min-width: 960px) {
        .video-grid {
                grid-template-columns: 1fr;
        }
}

@media (max-width: 768px) {
        .video-card {
                flex-direction: column;
        }

        .thumbnail-container {
                width: 100%;
        }

        .video-info {
                padding: 1rem;
        }

        .page-title h1 {
                font-size: 2rem;
        }

        .subtitle {
                font-size: 1rem;
        }
}
</style>