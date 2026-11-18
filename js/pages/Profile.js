import template from './profile-template.js';
import { store } from '../main.js';
import { fetchLeaderboard } from '../content.js';
import {
    discordEnabled,
    login,
    logout,
    getPlayer,
    setPlayer,
    clearPlayer,
} from '../auth.js';

export default {
    template,
    data: () => ({
        store,
        discordEnabled,
        leaderboard: [],
        loading: true,
        player: getPlayer(),
        search: '',
    }),
    computed: {
        index() {
            if (!this.player) return -1;
            const name = this.player.toLowerCase();
            return this.leaderboard.findIndex((e) => e.user.toLowerCase() === name);
        },
        entry() {
            return this.index >= 0 ? this.leaderboard[this.index] : null;
        },
        results() {
            const q = this.search.trim().toLowerCase();
            if (!q) return [];
            return this.leaderboard
                .map((entry, i) => ({ entry, i }))
                .filter(({ entry }) => entry.user.toLowerCase().includes(q))
                .slice(0, 8);
        },
        // Discord adı bir oyuncuyla eşleşiyorsa öner
        suggestion() {
            const user = this.store.user;
            if (!user) return null;
            const names = [user.name, user.username].map((n) => String(n || '').toLowerCase());
            return this.leaderboard.find((e) => names.includes(e.user.toLowerCase())) || null;
        },
    },
    async mounted() {
        try {
            const [leaderboard] = await fetchLeaderboard();
            this.leaderboard = leaderboard;
        } catch (e) {
            console.error('Failed to load leaderboard.', e);
        }
        this.loading = false;
    },
    methods: {
        login,
        doLogout() {
            logout();
            this.store.user = null;
            this.store.avatar = '';
        },
        link(name) {
            setPlayer(name);
            this.player = name;
            this.search = '';
        },
        unlink() {
            clearPlayer();
            this.player = '';
        },
        fmt(n) {
            return Math.round(Number(n));
        },
        rankClass(i) {
            if (i === 0) return 'is-gold';
            if (i === 1) return 'is-silver';
            if (i === 2) return 'is-bronze';
            return '';
        },
    },
};
