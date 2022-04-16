<template>
    <div>
        <h2>Profiles</h2>
        <h3>Model</h3>
        <Tree :obj="profiles" />
        <h3>View</h3>
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import Tree from './Tree.vue';

const props = defineProps({
    address: {
        type: String,
        required: true,
    },
});

const rss3 = getCurrentInstance()?.appContext.config.globalProperties.rss3;

const profiles = await rss3.profiles.get({
    prefix: 'account',
    identity: props.address,
    platform: 'ethereum',
});
console.log(profiles);
</script>

<style></style>
