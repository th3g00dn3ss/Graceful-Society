import template from './profile-template.js';
import { store } from '../main.js';
import { fetchLeaderboard } from '../content.js';
import { discordEnabled, login, logout } from '../auth.js';

const PLAYERS_FILE = 'data/_players.json';

// Discord adı bir oyuncuyla aynıysa otomatik eşleştir. İstemezsen false yap,
// o zaman sadece data/_players.json'daki eşleşmeler geçerli olur.
const AUTO_MATCH = true;

const DISCORD_URL = 'https://discord.gg/BxWZA2MPBf';

export default {
    template,
    data: () => ({
        store,
        discordEnabled,
        discordUrl: DISCORD_URL,
        leaderboard: [],
        players: {},
        loading: true,
        copied: false,
    }),
    computed: {
        playerName() {
            const user = this.store.user;
            if (!user) return '';

            // 1) Senin tuttuğun eşleşme (Discord kimliği -> oyuncu adı)
            const mapped = this.players[user.id];
            if (mapped) return String(mapped);

            // 2) Discord adı bir oyuncuyla aynıysa
            if (AUTO_MATCH) {
                const names = [user.name, user.username].map((n) => String(n || '').toLowerCase());
                const found = this.leaderboard.find((e) => names.includes(e.user.toLowerCase()));
                if (found) return found.user;
            }
            return '';
        },
        index() {
            if (!this.playerName) return -1;
            const name = this.playerName.toLowerCase();
            return this.leaderboard.findIndex((e) => e.user.toLowerCase() === name);
        },
        entry() {
            return this.index >= 0 ? this.leaderboard[this.index] : null;
        },
    },
    async mounted() {
        try {
            const [leaderboard] = await fetchLeaderboard();
            this.leaderboard = leaderboard;
        } catch (e) {
            console.error('Failed to load leaderboard.', e);
        }
        try {
            const res = await fetch(PLAYERS_FILE, { cache: 'no-cache' });
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data === 'object') this.players = data;
            }
        } catch (e) {
            console.error('Failed to load players file.', e);
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
        copyId() {
            const id = this.store.user && this.store.user.id;
            if (!id || !navigator.clipboard) return;
            navigator.clipboard.writeText(id).then(() => {
                this.copied = true;
                setTimeout(() => {
                    this.copied = false;
                }, 2000);
            });
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
