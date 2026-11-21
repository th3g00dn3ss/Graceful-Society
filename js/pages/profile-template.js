export default `
    <main class="sub">
        <div class="sub__inner pf">
            <h1 class="sub__title">Profile</h1>
            <p class="sub__subtitle">Your completions and points on the list.</p>

            <div class="sub__card sub__done" v-if="!discordEnabled">
                <h2>Discord login is not set up yet</h2>
                <p>Profiles will be available once the list staff finish setting up Discord login.</p>
            </div>

            <div class="sub__card sub__done" v-else-if="!store.user">
                <h2>Log in to see your profile</h2>
                <p>Use your Discord account to open your personal profile with your points, completions and verifications.</p>
                <button type="button" class="sub__submit" @click="login">Login with Discord</button>
            </div>

            <template v-else>
                <div class="pf__account">
                    <img class="pf__avatar" :src="store.avatar" alt="" />
                    <div>
                        <strong>{{ store.user.name }}</strong>
                        <small>@{{ store.user.username }}</small>
                    </div>
                    <button type="button" class="st__reset pf__btn" @click="doLogout">Log out</button>
                </div>

                <div class="sub__card sub__done" v-if="loading">
                    <p>Loading...</p>
                </div>

                <div class="sub__card" v-else-if="!playerName">
                    <h2 class="pf__h">No player is linked to your account yet</h2>
                    <p class="pf__hint">Send the ID below to a list staff member on Discord and ask them to link it to your player name.</p>
                    <div class="pf__id">
                        <code>{{ store.user.id }}</code>
                        <button type="button" class="st__reset pf__btn" @click="copyId">{{ copied ? 'Copied!' : 'Copy ID' }}</button>
                    </div>
                    <a class="pf__link" :href="discordUrl" target="_blank">Open the Discord server</a>
                </div>

                <div class="sub__card sub__done" v-else-if="!entry">
                    <h2>No points yet for {{ playerName }}</h2>
                    <p>You will show up here once a record or verification is added to the list.</p>
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
                </template>
            </template>
        </div>
    </main>
`;
