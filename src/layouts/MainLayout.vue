<template>
        <q-layout view="lHh Lpr lFf">
                <q-header elevated class="header-elegant">
                        <q-toolbar>
                                <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
                                <router-link to="/" class="no-decoration text-black">
                                        <q-toolbar-title> 寶嚴小幫手 </q-toolbar-title>
                                </router-link>
                                <q-space />
                                <q-btn flat round icon="login" @click="handleLogin" v-if="!isLoggedIn" />
                                <q-btn flat round icon="logout" @click="handleLogout" v-else />
                        </q-toolbar>
                </q-header>

                <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
                        <div class="no-scrollbar scrollable-drawer">
                                <q-list>
                                        <q-item-label header>
                                                工具列
                                        </q-item-label>
                                        <q-expansion-item icon="book" label="學習天地" expand-separator default-opened>
                                                <EssentialLink v-for="item in learningLinks" :key="item.title"
                                                        v-bind="item" />
                                        </q-expansion-item>

                                        <q-expansion-item icon="person" label="關於我" expand-separator default-opened
                                                v-if="isLoggedIn">
                                                <EssentialLink v-for="item in aboutMeLinks" :key="item.title"
                                                        v-bind="item" />
                                        </q-expansion-item>

                                        <q-expansion-item icon="quiz" label="Quiz" expand-separator default-opened>
                                                <EssentialLink v-for="item in quizLinks" :key="item.title"
                                                        v-bind="item" />
                                        </q-expansion-item>
                                </q-list>
                        </div>
                </q-drawer>

                <q-page-container>
                        <router-view />
                </q-page-container>
        </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const isLoggedIn = ref(false)

const learningLinks: EssentialLinkProps[] = [
        {
                title: '查詢課程',
                caption: '查詢想聽的課程',
                icon: 'search',
                to: '',
        },
        {
                title: '線上課程',
                caption: '一覽所有課程',
                icon: 'school',
                to: '/playlist-page',
        },
        {
                title: '法會紀實',
                caption: '歷屆法會紀錄',
                icon: 'movie',
                to: '',
        },
        {
                title: '線上共修',
                caption: '共修力量大，一起共修吧 !',
                icon: 'record_voice_over',
                to: '/group-practice-schedule'
        }
];

const aboutMeLinks: EssentialLinkProps[] = [
        {
                title: '個人面板',
                caption: '看看你的(無記時間)',
                icon: 'school',
                to: '/personal-board',
        },
        {
                title: '我的課程',
                caption: '所選課程紀錄',
                icon: 'favorite',
                to: '/mycourse',
        },
        {
                title: '誦經紀錄',
                caption: '每日充電紀錄',
                icon: 'event_note',
                to: '/scripture-tracker',
        },
        {
                title: '個人課表（通知）',
                caption: '查看選課細節',
                icon: 'schedule',
                to: '/personal-schedule'
        },
        {
                title: '法師留言',
                caption: 'forum.quasar.dev',
                icon: 'message',
                to: '/monk-message',
        }
];

const quizLinks: EssentialLinkProps[] = [
        {
                title: '小考總覽',
                caption: 'forum.quasar.dev',
                icon: 'quiz',
                to: '/buddhist-quiz',
        },
        {
                title: '我的小考',
                caption: 'forum.quasar.dev',
                icon: 'schedule',
                to: 'buddhist-quiz',
        }

];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
}

function handleLogin() {
        isLoggedIn.value = true
        // 這邊可以改成呼叫 Firebase login
}

function handleLogout() {
        isLoggedIn.value = false
}

</script>

<style scoped>
.scrollable-drawer {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
}

.no-scrollbar {
        scrollbar-width: none;
        /* Firefox */
        -ms-overflow-style: none;
        /* IE 10+ */
}

.no-scrollbar::-webkit-scrollbar {
        display: none;
        /* Chrome/Safari */
}

.header-elegant {
        background: linear-gradient(90deg, #ffffff 0%, #f9f9f9 100%);
        /* 白到灰白漸層 */
        color: #444;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        border-bottom: 1px solid #eee;
}

.header-elegant .q-toolbar-title {
        font-weight: 600;
        letter-spacing: 1px;
        color: #333;
        /* 更深一點 */
}

.header-elegant .q-btn:hover {
        background-color: rgba(0, 0, 0, 0.03);
        border-color: #ccc;
}

.no-decoration {
        text-decoration: none;
}
</style>