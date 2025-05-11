<template>
        <FloatingShapesBackground/>
        <CourseCarousel :courses="courses" />

        <q-separator class="q-my-md" />

        <q-page class="q-pa-md">
                <q-tabs v-model="tab" dense align="justify" class="text-primary">
                        <q-tab name="live" label="📡 現正直播中" />
                        <q-tab name="upcoming" label="🕒 即將開始" />
                        <q-tab name="ended" label="📁 已結束" />
                        <q-tab name="all" label="📚 所有課程" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                        <q-tab-panel name="live">
                                <CourseGrid :courses="liveCourses" />
                        </q-tab-panel>
                        <q-tab-panel name="upcoming">
                                <CourseGrid :courses="upcomingCourses" />
                        </q-tab-panel>
                        <q-tab-panel name="ended">
                                <CourseGrid :courses="endedCourses" />
                        </q-tab-panel>
                        <q-tab-panel name="all">
                                <CourseGrid :courses="courses" />
                        </q-tab-panel>
                </q-tab-panels>
        </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CourseGrid from '../components/CourseGrid.vue'
import CourseCarousel from '../components/CourseCarousel.vue'
import type { Course } from '../types/course'
import { getCourseStatus, CourseStatus } from '../composables/courseStatus'
import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';


const tab = ref('live')
const courses = ref<Course[]>([
        {
                name: '華嚴經雲端共修 一卷組',
                timeSlots: ['05:00–06:30', '16:30–18:00', '20:00–21:30'],
                timeIndex: [0, 23, 30],
                description: '華嚴經導讀與共修，深入佛法核心',
                cover: 'https://resource.cosmiccare.org/api/Resource/Image/179b864e-d782-4575-9dcf-15f017474828',
                zoom_url: 'zoommtg://zoom.us/join?confno=8865224676&pwd=aFdnZE4zamZ1Y0tNamhQbWlrNGpFZz09',
                favorite: false,
        },
        {
                name: '華嚴經雲端共修 三卷組',
                timeSlots: ['05:00–06:30', '16:30–18:00', '20:00–21:30'],
                timeIndex: [0, 23, 30],
                description: '華嚴經導讀與共修，深入佛法核心，瘋狂中的瘋狂',
                cover: 'https://i.natgeofe.com/k/a2a738a9-e019-4911-98e6-17f31c45ac88/milky-way-2_2x1.jpg',
                zoom_url: 'zoommtg://zoom.us/join?confno=8865224676&pwd=aFdnZE4zamZ1Y0tNamhQbWlrNGpFZz09',
                favorite: false,
        },
        {
                name: '楞嚴咒',
                timeSlots: ['06:30–07:00'],
                timeIndex: [3],
                description: '每日早晨靜心持咒，開啟一天能量',
                cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShKWlc2q33w1V9avPpwb0afullg-AZyOjSlA&s',
                zoom_url: 'zoommtg://zoom.us/join?confno=8865224676&pwd=aFdnZE4zamZ1Y0tNamhQbWlrNGpFZz09',
                favorite: false,
        },
        {
                name: '騰雲六卷組',
                timeSlots: ['06:30-07:00', '07:00-07:30', '07:30-08:00', '08:00-08:30'],
                timeIndex: [3, 4, 5, 6],
                description: '深入探討佛法六卷組，提升修行境界',
                cover: 'https://media-cldnry.s-nbcnews.com/image/upload/newscms/2018_21/2443266/180524-milky-way-mn-1418.jpg',
                zoom_url: 'zoommtg://zoom.us/join?confno=8865224676&pwd=aFdnZE4zamZ1Y0tNamhQbWlrNGpFZz09',
                favorite: false,
        },
        {
                name: '觀心一支香',
                timeSlots: ['07:30-08:00'],
                timeIndex: [5],
                description: '靜心觀照，體驗一支香的寧靜時光',
                cover: 'https://c.files.bbci.co.uk/1570D/production/_123312878_gettyimages-85757595.jpg',
                zoom_url: 'zoommtg://zoom.us/join?confno=8865224676&pwd=aFdnZE4zamZ1Y0tNamhQbWlrNGpFZz09',
                favorite: false,
        },
        {
                name: '秒董佛經系列課程',
                timeSlots: ['08:30-09:30', '12:40-13:40'],
                timeIndex: [7, 14],
                description: '快速掌握佛經核心智慧，提升生活品質',
                cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb7hzP8zDarVerjenkZTPudV1TvorRHBUsNQ&s',
                zoom_url: 'zoommtg://zoom.us/join?confno=8865224676&pwd=aFdnZE4zamZ1Y0tNamhQbWlrNGpFZz09',
                favorite: false,
        },
        {
                name: '秒董佛經系列課程 (重播)',
                timeSlots: ['08:30-09:00', '09:00-09:30', '12:30-13:00', '13:00-13:30', '13:30-14:00'],
                timeIndex: [7, 8, 14, 15, 16, 17],
                description: '重播精彩佛經課程，隨時回顧學習',
                cover: 'https://resource.cosmiccare.org/api/Resource/Image/179b864e-d782-4575-9dcf-15f017474828',
                zoom_url: 'zoommtg://zoom.us/join?confno=8865224676&pwd=aFdnZE4zamZ1Y0tNamhQbWlrNGpFZz09',
                favorite: false,
        },
        {
                name: '秒董佛經系列課程 (Live)',
                timeSlots: ['19:00-19:30', '19:30-20:00'],
                timeIndex: [33, 34],
                description: '實時直播佛經課程，與講師互動交流',
                cover: 'https://c.files.bbci.co.uk/1570D/production/_123312878_gettyimages-85757595.jpg',
                zoom_url: 'zoommtg://zoom.us/join?confno=8865224676&pwd=aFdnZE4zamZ1Y0tNamhQbWlrNGpFZz09',
                favorite: false,
        },

        {
                name: '六祖壇經',
                timeSlots: ['20:00-00:00'],
                timeIndex: [33, 34, 35, 36, 37, 38, 39, 40],
                description: '每日早晨靜心持咒，開啟一天能量',
                cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQPOiOhUqnswOHJiSYh8s5qjCal_pmrqTVQ&s',
                zoom_url: 'zoommtg://zoom.us/join?confno=8865224676&pwd=aFdnZE4zamZ1Y0tNamhQbWlrNGpFZz09',
                favorite: false,
        },

]);

const liveCourses = computed(() => courses.value.filter(c => getCourseStatus(c.timeIndex) === CourseStatus.Ready))
const upcomingCourses = computed(() => courses.value.filter(c => getCourseStatus(c.timeIndex) === CourseStatus.NotStarted))
const endedCourses = computed(() => courses.value.filter(c => getCourseStatus(c.timeIndex) === CourseStatus.Ended))
</script>