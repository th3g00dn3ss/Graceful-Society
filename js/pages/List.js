import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
    <div class="lv" v-if="level">
        <div class="lv__header">
            <h1 class="lv__title">
                <span class="lv__rank" v-if="selected + 1 <= 150">#{{ selected + 1 }}</span>
                <span class="lv__rank" v-else>Legacy</span>
                {{ level.name }}
            </h1>
            <div class="lv__meta">
                <span><b>Creator:</b> {{ (level.creators || []).join(', ') }}</span>
                <span><b>Verifier:</b> {{ level.verifier }}</span>
                <span><b>Publisher:</b> {{ level.author }}</span>
            </div>
        </div>

        <div class="lv__video">
            <iframe class="video" id="videoframe" :src="video" frameborder="0" allowfullscreen></iframe>
        </div>

        <div class="lv__stats">
            <div class="lv__stat">
                <span class="lv__label">Points</span>
                <span class="lv__value lv__value--accent">{{ score(selected + 1, 100, level.percentToQualify) }}</span>
            </div>
            <div class="lv__stat">
                <span class="lv__label">Level ID</span>
                <span class="lv__value">{{ level.id }}</span>
            </div>
            <div class="lv__stat lv__stat--wide">
                <span class="lv__label">Password</span>
                <span class="lv__value">{{ level.password || 'Free to Copy' }}</span>
            </div>
        </div>
    </div>
    <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
        <p>(ノಠ益ಠ)ノ彡┻━┻</p>
    </div>
</div>

<div class="meta-container">
    <div class="rp">
        <div class="errors" v-show="errors.length > 0">
            <p class="error" v-for="error of errors">{{ error }}</p>
        </div>

        <button class="rp__toggle" @click="showRecords = !showRecords">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            {{ showRecords ? 'Hide Records' : 'Show Records' }}
        </button>

        <div class="rp__panel" v-if="showRecords && level">
            <div class="rp__head">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                <span class="rp__title">Records</span>
                <span class="rp__count">({{ level.records.length }})</span>
            </div>

            <p class="rp__req" v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
            <p class="rp__req" v-else-if="selected + 1 <= 150"><strong>100%</strong> or better to qualify</p>
            <p class="rp__req" v-else>This level does not accept new records.</p>

            <ul class="rp__list" v-if="level.records.length">
                <li class="rp__item" v-for="record in level.records">
                    <div class="rp__who">
                        <a :href="record.link" target="_blank">{{ record.user }}</a>
                        <small>{{ record.hz ? record.hz + 'Hz' : '' }}{{ record.mobile ? ' · Mobile' : '' }}</small>
                    </div>
                    <span class="rp__percent">{{ record.percent }}%</span>
                </li>
            </ul>
            <p class="rp__empty" v-else>No records yet</p>
        </div>

        <p class="rp__credit">
            Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a>
        </p>
    </div>
</div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        showRecords: true,
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected][0];
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
