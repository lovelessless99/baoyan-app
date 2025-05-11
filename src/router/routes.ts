import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
        {
                path: '/',
                component: () => import('layouts/MainLayout.vue'),
                children: [
                        { path: '', component: () => import('pages/HomePage.vue') },
                        {
                                path: 'personal-schedule',
                                component: () => import('pages/PersonalSchedule.vue')
                        },

                        {
                                path: 'group-practice-schedule',
                                component: () => import('pages/GroupPracticeSchedule.vue')
                        },

                        {
                                path: 'playlist-page',
                                name: 'playlists',
                                component: () => import('pages/PlaylistPage.vue')
                        },
                        {
                                path: 'video/:videoId',
                                name: 'video-player',
                                component: () => import('pages/VideoPlayerPage.vue')
                        },
                        { 
                                path: 'playlist/:id', 
                                name: 'video-list',
                                component: () => import('pages/VideoListPage.vue') 
                        },
                        { 
                                path: 'mycourse', 
                                name: 'mycourse-list',
                                component: () => import('pages/MyCourse.vue') 
                        },
                        { 
                                path: 'personal-board', 
                                name: 'personal-board',
                                component: () => import('pages/PersonBoard.vue') 
                        },
                        { 
                                path: 'scripture-tracker', 
                                name: 'scripturetracker',
                                component: () => import('pages/ScriptureTracker.vue') 
                        },
                        { 
                                path: 'monk-message', 
                                name: 'monkmessage',
                                component: () => import('pages/MonkMessage.vue') 
                        },
                        { 
                                path: 'buddhist-quiz', 
                                name: 'buddhistquiz',
                                component: () => import('pages/BuddhistQuiz.vue') 
                        }

                ],

        },



        // Always leave this as last one,
        // but you can also remove it
        {
                path: '/:catchAll(.*)*',
                component: () => import('pages/ErrorNotFound.vue'),
        },
];

export default routes;
