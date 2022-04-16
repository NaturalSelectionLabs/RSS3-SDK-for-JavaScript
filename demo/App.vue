<template>
    <Suspense>
        <div>
            <h1>RSS3 SDK Demos</h1>
            Ethereum Address:
            <div class="input">
                <el-input
                    v-model="address"
                    placeholder="Please input ethereum address"
                    clearable
                    maxlength="42"
                    show-word-limit
                />
            </div>
            <Profiles :address="address"></Profiles>
        </div>
        <template #fallback> Loading... </template>
    </Suspense>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Profiles from './components/Profiles.vue';

const address = ref(localStorage.getItem('address') || '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944');
watch(address, (address) => {
    localStorage.setItem('address', address);
});
</script>

<style>
.input {
    width: 450px;
    display: inline-block;
    margin-left: 20px;
}
</style>
