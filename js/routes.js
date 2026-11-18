import Home from './pages/Home.js';
import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Changelog from './pages/Changelog.js';
import Submit from './pages/Submit.js';
import SubmitLevel from './pages/SubmitLevel.js';
import Settings from './pages/Settings.js';
import Profile from './pages/Profile.js';

export default [
    { path: '/', component: Home },
    { path: '/list', component: List },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/changelog', component: Changelog },
    { path: '/submit', component: Submit },
    { path: '/submit-level', component: SubmitLevel },
    { path: '/settings', component: Settings },
    { path: '/profile', component: Profile },
    // Eski/yanlış adresler ana sayfaya yönlensin
    { path: '/:pathMatch(.*)*', redirect: '/' },
];
