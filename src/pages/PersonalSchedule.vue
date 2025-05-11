
<script setup lang="ts">
// @ts-expect-error: Qalendar has no proper type declarations
import { Qalendar } from 'qalendar'
import 'qalendar/dist/style.css'
import { ref } from 'vue'
import FloatingShapesBackground from '../pages/FloatingPolygonsBackground.vue';

// 固定週與月的選擇日
const selectedWeekDate = ref(new Date('2025-04-14'))
const selectedMonthDate = ref(new Date('2025-04-01'))

const events = [
        {
                title: '早課共修',
                time: { start: '2025-04-15 08:00', end: '2025-04-15 09:30' },
                color: 'red'
        },
        {
                title: '佛法導讀',
                time: { start: '2025-04-16 10:00', end: '2025-04-16 11:30' },
                color: 'blue'
        },
        {
                title: '禪修問答',
                time: { start: '2025-04-17 14:00', end: '2025-04-17 15:30' },
                color: 'blue'
        },
        {
                title: '法會活動',
                time: { start: '2025-04-20 09:00', end: '2025-04-20 12:00' },
                color: 'green'
        }
]

// 固定週顯示：不能操作切換
const weekConfig = {
        week: {
                startsOn: 'monday',
                hideWeekends: false
        },
        locale: 'zh-TW',
        isSilent: true,
        defaultMode: 'week',
}

// 固定月顯示：不可換月份
const monthConfig = {
        locale: 'zh-TW',
        isSilent: true,
        defaultMode: 'month',
}
</script>

<template>
        <FloatingShapesBackground/>
        <q-page class="q-pa-md">
                <div class="row q-col-gutter-md">

                        <!-- 左邊：一週 -->
                        <div class="col-12 col-md-7">
                                <q-banner class="bg-indigo text-white q-mb-sm" rounded dense>
                                        <template #avatar>
                                                <q-icon name="self_improvement" />
                                        </template>
                                        我的修行週誌
                                </q-banner>
                                <div class="qalendar-box calendar-month-container">
                                        <Qalendar view="week" :selected-date="selectedWeekDate" :events="events"
                                                :config="weekConfig" />
                                </div>
                        </div>

                        <!-- 右邊：整月 -->
                        <div class="col-12 col-md-5">

                                <q-banner class="bg-indigo-10 text-white q-mb-sm" rounded dense>
                                        <template #avatar>
                                                <q-icon name="temple_hindu" />
                                        </template>
                                        禪院今日道場
                                </q-banner>

                                <div class="qalendar-box calendar-month-container">
                                        <Qalendar view="month" :selected-date="selectedMonthDate" :events="events"
                                                :config="monthConfig" />
                                </div>
                        </div>

                </div>
        </q-page>
</template>

<style scoped>
.qalendar-box {
        max-height: 550px;
        overflow-y: auto;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}


.calendar-month-container {
  height: 700px;
  overflow-y: auto;
  scrollbar-width: none;         /* Firefox */
  -ms-overflow-style: none;      /* IE 10+ */
  scroll-behavior: smooth;
}

.calendar-month-container::-webkit-scrollbar {
  display: none;                 /* Chrome / Safari */
}
</style>
