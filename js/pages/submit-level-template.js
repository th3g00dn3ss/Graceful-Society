export default `
    <main class="sub">
        <div class="sub__inner">
            <h1 class="sub__title">Submit Level</h1>
            <p class="sub__subtitle">Suggest a level you have verified for review by list moderators.</p>

            <div class="sub__tabs">
                <router-link class="sub__tab" to="/submit">Submit Record</router-link>
                <router-link class="sub__tab" to="/submit-level">Submit Level</router-link>
            </div>

            <div class="sub__card sub__done" v-if="!configured">
                <h2>Level submissions are not open yet</h2>
                <p>Please check back soon, or contact the list staff on Discord.</p>
            </div>

            <div class="sub__card sub__done" v-else-if="done">
                <h2>Level submitted!</h2>
                <p>Thank you. A list moderator will review your level soon.</p>
                <button type="button" class="sub__submit" @click="reset">Submit another level</button>
            </div>

            <div class="sub__card" v-else>
                <form @submit.prevent="submit" novalidate>
                    <div class="sub__field">
                        <label class="sub__label" for="lv-user">Your username</label>
                        <input id="lv-user" class="sub__input" type="text" v-model.trim="username" placeholder="Your Geometry Dash username" maxlength="40" />
                    </div>

                    <div class="sub__field">
                        <label class="sub__label" for="lv-name">Level name</label>
                        <input id="lv-name" class="sub__input" type="text" v-model.trim="name" placeholder="e.g. Bloodbath" maxlength="80" />
                    </div>

                    <div class="sub__field">
                        <label class="sub__label" for="lv-id">Level ID</label>
                        <input id="lv-id" class="sub__input" type="text" inputmode="numeric" v-model.trim="id" placeholder="e.g. 10565740" maxlength="12" />
                    </div>

                    <div class="sub__field">
                        <label class="sub__label" for="lv-creators">Creator(s)</label>
                        <input id="lv-creators" class="sub__input" type="text" v-model.trim="creators" placeholder="Separate multiple creators with commas" maxlength="200" />
                    </div>

                    <div class="sub__field">
                        <label class="sub__label" for="lv-verifier">Verifier</label>
                        <input id="lv-verifier" class="sub__input" type="text" v-model.trim="verifier" placeholder="Who verified the level" maxlength="60" />
                    </div>

                    <div class="sub__field">
                        <label class="sub__label" for="lv-video">Verification video</label>
                        <input id="lv-video" class="sub__input" type="url" v-model.trim="verification" placeholder="https://www.youtube.com/watch?v=..." />
                    </div>

                    <div class="sub__field" v-if="entries.publisher">
                        <label class="sub__label" for="lv-publisher">Publisher (optional)</label>
                        <input id="lv-publisher" class="sub__input" type="text" v-model.trim="publisher" placeholder="If different from the creator" maxlength="60" />
                    </div>

                    <div class="sub__field" v-if="entries.password">
                        <label class="sub__label" for="lv-password">Password (optional)</label>
                        <input id="lv-password" class="sub__input" type="text" v-model.trim="password" placeholder="Leave empty if free to copy" maxlength="40" />
                    </div>

                    <div class="sub__field" v-if="entries.notes">
                        <div class="sub__labelrow">
                            <label class="sub__label" for="lv-notes">Notes (optional)</label>
                            <span class="sub__count">{{ notes.length }}/500</span>
                        </div>
                        <textarea id="lv-notes" class="sub__input" rows="3" maxlength="500" v-model="notes" placeholder="Anything else the moderators should know."></textarea>
                    </div>

                    <input class="sub__hp" type="text" v-model="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />

                    <p class="sub__alert sub__alert--error" v-if="error">{{ error }}</p>

                    <button class="sub__submit" type="submit" :disabled="sending">
                        {{ sending ? 'Submitting...' : 'Submit Level' }}
                    </button>
                </form>
            </div>
        </div>
    </main>
`;
