import Vue, { createApp } from 'vue';
import App from './App.vue';
import RSS3 from '../src/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const rss3 = new RSS3({
    endpoint: 'http://test-pregod.rss3.dev/v0.4.0/',
    appName: 'demo',
});

const app = createApp(App);

app.config.globalProperties.rss3 = rss3;

app.use(ElementPlus);
app.mount('#app');
