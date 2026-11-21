import routes from './routes.js';
import { loadSettings, applySettings } from './theme.js';
import { getUser, avatarUrl } from './auth.js';

// Ziyaretçinin kayıtlı görünüm ayarlarını uygula
applySettings(loadSettings());

const user = getUser();

// Site her zaman koyu temada çalışır
export const store = Vue.reactive({
    dark: true,
    user,
    avatar: avatarUrl(user),
});

const app = Vue.createApp({
    data: () => ({ store }),
});
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);

app.mount('#app');
