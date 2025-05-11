<template>
        <div class="q-gutter-md row items-stretch justify-start">
                <CourseCard v-for="course in courses" :key="course.name" :course="course"
                        @toggle-favorite="$emit('toggle-favorite', course)"
                        @join-course="$emit('join-course', course)" />
        </div>
</template>

<script setup lang="ts">
import CourseCard from '../components/CourseCard.vue'
import type { Course } from '../types/course'

defineProps<{ courses: Course[] }>()
defineEmits(['toggle-favorite', 'join-course'])
</script>