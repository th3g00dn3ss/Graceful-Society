import { fetchLeaderboard } from '../content.js';
import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="lb">
            <aside class="lb__side">
                <div class="lb__search">
                    <label class="lb__field">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input type="text" v-model="search" placeholder="Search player..." />
                    </label>
                </div>
                <ul class="lb__players">
                    <li v-for="item in filtered" :key="item.i">
                        <button class="lb__player" :class="{ active: selected == item.i }" @click="selected = item.i">
                            <span class="lb__prank" :class="rankClass(item.i)">#{{ item.i + 1 }}</span>
                            <span class="lb__pname">{{ item.entry.user }}</span>
                            <span class="lb__ppts">{{ fmt(item.entry.total) }}</span>
                        </button>
                    </li>
                    <li class="lb__none" v-if="!filtered.length">No players found</li>
                </ul>
            </aside>

            <section class="lb__main" v-if="entry">
                <p class="lb__error" v-if="errs.length">Failed to load levels: {{ errs.join(', ') }}</p>

                <div class="lb__head">
                    <h1>
                        <span class="lb__bigrank" :class="rankClass(selected)">#{{ selected + 1 }}</span>
                        {{ entry.user }}
                    </h1>
                    <div class="lb__totals">
                        <div>
                            <span class="lb__label">Total points</span>
                            <span class="lb__num lb__num--accent">{{ fmt(entry.total) }}</span>
                        </div>
                        <div>
                            <span class="lb__label">Completions</span>
                            <span class="lb__num">{{ entry.completed.length }}</span>
                        </div>
                        <div>
                            <span class="lb__label">Verifications</span>
                            <span class="lb__num">{{ entry.verified.length }}</span>
                        </div>
                    </div>
                </div>

                <div class="lb__cols">
                    <div class="lb__col">
                        <div class="lb__colhead">
                            <span>Completions <small>({{ entry.completed.length }})</small></span>
                            <small>Points</small>
                        </div>
                        <ul class="lb__rows" v-if="entry.completed.length">
                            <li class="lb__row" v-for="row in entry.completed">
                                <span class="lb__lrank">#{{ row.rank }}</span>
                                <span class="lb__lname">{{ row.level }}</span>
                                <a class="lb__watch" :href="row.link" target="_blank">Watch
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                                </a>
                                <span class="lb__lpts">{{ fmt(row.score) }}</span>
                            </li>
                        </ul>
                        <p class="lb__empty" v-else>None yet</p>
                    </div>

                    <div class="lb__col">
                        <div class="lb__colhead">
                            <span>Verifications <small>({{ entry.verified.length }})</small></span>
                            <small>Points</small>
                        </div>
                        <ul class="lb__rows" v-if="entry.verified.length">
                            <li class="lb__row" v-for="row in entry.verified">
                                <span class="lb__lrank">#{{ row.rank }}</span>
                                <span class="lb__lname">{{ row.level }}</span>
                                <a class="lb__watch" :href="row.link" target="_blank">Watch
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                                </a>
                                <span class="lb__lpts">{{ fmt(row.score) }}</span>
                            </li>
                        </ul>
                        <p class="lb__empty" v-else>None yet</p>
                    </div>
                </div>

                <div class="lb__col lb__progress" v-if="entry.progressed.length">
                    <div class="lb__colhead">
                        <span>Progress <small>({{ entry.progressed.length }})</small></span>
                        <small>Points</small>
                    </div>
                    <ul class="lb__rows">
                        <li class="lb__row" v-for="row in entry.progressed">
                            <span class="lb__lrank">#{{ row.rank }}</span>
                            <span class="lb__lname">{{ row.level }} · {{ row.percent }}%</span>
                            <a class="lb__watch" :href="row.link" target="_blank">Watch
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                            </a>
                            <span class="lb__lpts">{{ fmt(row.score) }}</span>
                        </li>
                    </ul>
                </div>
            </section>
            <section class="lb__main lb__main--empty" v-else>
                <p class="lb__empty">No players yet.</p>
            </section>
        </main>
    `,
    data: () => ({
        leaderboard: [],
        errs: [],
        loading: true,
        selected: 0,
        search: '',
    }),
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
        filtered() {
            const q = this.search.trim().toLowerCase();
            return this.leaderboard
                .map((entry, i) => ({ entry, i }))
                .filter(({ entry }) => !q || entry.user.toLowerCase().includes(q));
        },
    },
    async mounted() {
        try {
            const [leaderboard, errs] = await fetchLeaderboard();
            this.leaderboard = leaderboard;
            this.errs = errs;
        } catch (e) {
            console.error('Failed to load leaderboard.', e);
        }
        this.loading = false;
    },
    methods: {
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
