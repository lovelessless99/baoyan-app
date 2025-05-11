<template>
        <!-- 內部路由 -->
        <q-item v-if="to" clickable v-ripple :to="to" tag="router-link">
                <q-item-section avatar v-if="icon">
                        <q-icon :name="icon" />
                </q-item-section>
                <q-item-section>
                        <q-item-label>{{ title }}</q-item-label>
                        <q-item-label caption v-if="caption">{{ caption }}</q-item-label>
                </q-item-section>
        </q-item>

        <!-- 外部連結 -->
        <q-item v-else clickable v-ripple :href="link" target="_blank" tag="a" rel="noopener">
                <q-item-section avatar v-if="icon">
                        <q-icon :name="icon" />
                </q-item-section>
                <q-item-section>
                        <q-item-label>{{ title }}</q-item-label>
                        <q-item-label caption v-if="caption">{{ caption }}</q-item-label>
                </q-item-section>
        </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
        title: string;
        caption?: string;
        link?: string;
        icon?: string;  // 外部連結
        to?: string;     // 內部 router link
};

withDefaults(defineProps<EssentialLinkProps>(), {
        caption: '',
        icon: '',
});
</script>
