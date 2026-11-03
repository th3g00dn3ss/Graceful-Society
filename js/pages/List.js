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
        <main v-else class="page-list" :class="{ 'records-hidden': !showRecords }">
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

                <div class="rp__panel" v-if="showRecords && level">
                    ...
                </div>
            </div>
        </div>

        <button class="rp__toggle" @click="showRecords = !showRecords">
            ...
        </button>

        <p class="rp__credit">
            Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a>
        </p>
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
