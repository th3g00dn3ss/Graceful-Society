export default `
    <main class="sub">
        <div class="sub__inner pf">
            <h1 class="sub__title">Profile</h1>
            <p class="sub__subtitle">Your completions and points on the list.</p>

            <div class="pf__account" v-if="discordEnabled">
                <template v-if="store.user">
                    <img class="pf__avatar" :src="store.avatar" alt="" />
                    <div>
                        <strong>{{ store.user.name }}</strong>
                        <small>@{{ store.user.username }}</small>
                    </div>
                    <button type="button" class="st__reset pf__btn" @click="doLogout">Log out</button>
                </template>
                <template v-else>
                    <span>Log in with Discord to show your name and avatar.</span>
                    <button type="button" class="sub__submit pf__btn" @click="login">Login with Discord</button>
                </template>
            </div>

            <div class="sub__card sub__done" v-if="loading">
                <p>Loading...</p>
            </div>

            <div class="sub__card" v-else-if="!player">
                <h2 class="pf__h">Find your player profile</h2>
                <p class="pf__hint">Search for your in-game name to link it to this browser. The link is only stored on your device.</p>

                <div class="pf__suggest" v-if="suggestion">
                    <span>Is this you?</span>
                    <button type="button" class="st__reset pf__btn" @click="link(suggestion.user)">{{ suggestion.user }}</button>
                </div>

                <input class="sub__input" type="text" v-model="search" placeholder="Search player..." />

                <ul class="pf__results" v-if="results.length">
                    <li v-for="item in results" :key="item.i">
                        <button type="button" class="pf__result" @click="link(item.entry.user)">
                            <span class="lb__prank" :class="rankClass(item.i)">#{{ item.i + 1 }}</span>
                            <span class="lb__pname">{{ item.entry.user }}</span>
                            <span class="lb__ppts">{{ fmt(item.entry.total) }}</span>
                        </button>
                    </li>
                </ul>
                <p class="pf__hint" v-else-if="search.trim()">No players found.</p>
            </div>

            <div class="sub__card sub__done" v-else-if="!entry">
                <h2>No points yet for {{ player }}</h2>
                <p>You will show up here once a record or verification is added to the list.</p>
                <button type="button" class="st__reset" @click="unlink">Change player</button>
            </div>

            <template v-else>
                <div class="lb__head">
                    <h1>
                        <span class="lb__bigrank" :class="rankClass(index)">#{{ index + 1 }}</span>
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

                <button type="button" class="st__reset pf__change" @click="unlink">Change player</button>
            </template>
        </div>
    </main>
`;
