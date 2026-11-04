import Home from './pages/Home.js';
import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Submit from './pages/Submit.js';

export default [
    { path: '/', component: Home },
    { path: '/list', component: List },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/submit', component: Submit },
    // Eski/yanlış adresler (ör. #/roulette) ana sayfaya yönlensin
    { path: '/:pathMatch(.*)*', redirect: '/' },
];
