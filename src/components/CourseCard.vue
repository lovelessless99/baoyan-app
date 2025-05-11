<template>
        <q-card :class="{
                'live-card': getCourseStatus(props.course.timeIndex) === CourseStatus.Ready,
                'ended-card': getCourseStatus(props.course.timeIndex) === CourseStatus.Ended
        }" class="my-card col-12 col-md-4">
                <div class="image-wrapper">
                        <q-img :src="props.course.cover" class="q-mb-sm zoom-img" style="height: 180px" />
                        <div v-if="isLive" class="live-indicator"></div>
                </div>
                <q-card-section class="card-content">
                        <q-btn flat round :color="props.course.favorite ? 'red' : 'grey-5'" icon="favorite"
                                class="absolute favorite-btn"
                                style="top: -10px; right: 12px; transform: translateY(-50%)"
                                @click="emits('toggle-favorite', props.course)">
                                <q-tooltip>{{ props.course.favorite ? '移除我的最愛' : '加入我的最愛' }}</q-tooltip>
                        </q-btn>
                        <div class="text-h6">{{ props.course.name }}</div>
                        <q-separator class="q-my-xs" />
                        <div class="text-subtitle2 text-grey-7">{{ props.course.description }}</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                        <div class="q-gutter-xs">
                                <q-badge v-for="(slot, idx) in props.course.timeSlots" :key="idx" color="blue-1"
                                        text-color="blue-8" class="q-mr-xs q-mb-xs custom-badge">
                                        <q-icon name="schedule" size="16px" class="q-mr-xs" />
                                        {{ slot }}
                                </q-badge>
                        </div>
                </q-card-section>
                <q-card-actions align="right">
                        <q-btn color="primary" :disable="getCourseStatus(props.course.timeIndex) !== CourseStatus.Ready"
                                icon="arrow_forward" @click="emits('join-course', props.course)">
                                <q-tooltip>{{ getTooltipText(props.course.timeIndex) }}</q-tooltip>
                        </q-btn>
                </q-card-actions>
        </q-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { computed } from 'vue';
import type { Course } from '../types/course'
import { getCourseStatus, CourseStatus } from '../composables/courseStatus'


const props = defineProps<{ course: Course }>();
const emits = defineEmits<{
        (e: 'toggle-favorite', course: Course): void;
        (e: 'join-course', course: Course): void;
}>();

const isLive = computed(() => getCourseStatus(props.course.timeIndex) === CourseStatus.Ready);
// const isEnded = computed(() => getCourseStatus(props.course.timeIndex) === CourseStatus.Ended);


function getTooltipText(courseTimeIndices: number[]): string {
        const status = getCourseStatus(courseTimeIndices);
        if (status === CourseStatus.NotStarted) return '課程未開始';
        if (status === CourseStatus.Ended) return '課程已結束';
        return '進入課程';
}
</script>

<style scoped>
.my-card {
        max-width: 350px;
        overflow: hidden;
        transition:
                transform 0.3s,
                box-shadow 0.3s;
        display: flex;
        flex-direction: column;
        height: 100%;
}

.card-content {
        flex-grow: 1;
}

.my-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        animation: bounce 1s infinite ease-in-out;
}

@keyframes bounce {

        0%,
        100% {
                transform: translateY(-5px);
                /* 預設浮起 */
        }

        50% {
                transform: translateY(-10px);
                /* 往上晃動一點 */
        }
}

.zoom-img {
        transition:
                transform 0.3s ease,
                opacity 0.3s;
        opacity: 0.85;
        object-fit: cover;
}

.my-card:hover .zoom-img {
        transform: scale(1.1);
        opacity: 1;
}

.image-wrapper {
        height: 180px;
        overflow: hidden;
        position: relative;
        border-radius: 4px;
}

.favorite-btn {
        position: absolute;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition:
                transform 0.3s,
                box-shadow 0.3s,
                background-color 0.3s;
}

.favorite-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        background-color: rgba(244, 67, 54, 0.2);
}

.custom-badge {
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        transition: background-color 0.3s;
}

.custom-badge:hover {
        background-color: #e0f2ff;
}

/* 🔴 Live Indicator */
.live-indicator {
        position: absolute;
        top: 15px;
        left: 20px;
        width: 12px;
        height: 12px;
        background-color: red;
        border-radius: 50%;
        animation: pulse 1.2s infinite;
}

@keyframes pulse {
        0% {
                transform: scale(1);
                opacity: 1;
        }

        50% {
                transform: scale(1.5);
                opacity: 0.5;
        }

        100% {
                transform: scale(1);
                opacity: 1;
        }
}


/* 📁 Ended Courses 灰色濾鏡 */
.ended-card {
        filter: grayscale(50%) brightness(0.9);
        opacity: 0.8;
}

.ended-card:hover {
        filter: grayscale(0.6) brightness(0.95);
        opacity: 1;
}


/* 📡 Live Courses 紅色邊框 */
.live-card {
        box-shadow: 0 0 8px rgba(244, 67, 54, 0.5);
        /* 加模糊陰影 */
        border-radius: 8px;
}

.live-card:hover {
        box-shadow: 0 0 12px rgba(244, 67, 54, 0.8);
}
</style>
