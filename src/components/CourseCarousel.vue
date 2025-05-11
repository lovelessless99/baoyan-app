<template>
        <div class="tape-wrapper">
                <div class="tape-track">
                        <div v-for="(course, index) in duplicatedCourses" :key="index" class="tape-item">
                                <img :src="course.cover" :alt="course.name" />
                        </div>
                </div>
        </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type { Course } from '../types/course';

const props = defineProps<{ courses: Course[] }>();

// Duplicate courses for seamless loop
const duplicatedCourses = computed(() => [...props.courses, ...props.courses]);
</script>

<style scoped>
.tape-wrapper {
        width: 100%;
        overflow: hidden;
        height: 30vh;
        padding-top: 40px;
        /* 大一點，高度約佔 30% */
}

.tape-track {
        display: flex;
        gap: 24px;
        animation: scroll-tape 40s linear infinite;
        min-width: max-content;
        /* 內容寬度自動調整 */
}

@keyframes scroll-tape {
        0% {
                transform: translateX(0);
        }

        100% {
                transform: translateX(calc(-50%));
        }
}


.tape-item {
        flex: 0 0 auto;
        width: 240px;
        /* 統一寬度 */
        aspect-ratio: 16 / 9;
        /* 固定16:9比例 */
        display: flex;
        align-items: center;
        justify-content: center;
}

.tape-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        /* 填滿裁切，保持一致 */
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
}


.tape-item img:hover {
        transform: scale(1.05);
}

@keyframes scroll-tape {
        0% {
                transform: translateX(0);
        }

        100% {
                transform: translateX(-50%);
        }
}
</style>