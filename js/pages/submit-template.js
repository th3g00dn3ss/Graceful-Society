export default `
    <main class="sub">
        <div class="sub__inner">
            <h1 class="sub__title">Submit Record</h1>
            <p class="sub__subtitle">Submit your level completion or progress for review by list moderators.</p>

            <div class="sub__banner">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                <span>Please review the <strong>Record Standards</strong> before submitting your record.</span>
                <button type="button" class="sub__link" @click="showRules = !showRules">
                    {{ showRules ? 'Hide Standards' : 'View Standards' }}
                </button>
            </div>

            <ol class="sub__rules" v-if="showRules">
                <li v-for="rule in rules">{{ rule }}</li>
            </ol>

            <p class="sub__alert sub__alert--error" v-if="!configured">
                The submission form is not configured yet.
            </p>

            <div class="sub__card sub__done" v-if="done">
                <h2>Record submitted!</h2>
                <p>Thank you. A list moderator will review your record soon.</p>
                <button type="button" class="sub__submit" @click="reset">Submit another record</button>
            </div>

            <div class="sub__card" v-else>
                <form @submit.prevent="submit" novalidate>
                    <div class="sub__field">
                        <label class="sub__label" for="sub-user">Username</label>
                        <input id="sub-user" class="sub__input" type="text" v-model.trim="username" placeholder="Your Geometry Dash username" maxlength="40" />
                    </div>

                    <div class="sub__field">
                        <label class="sub__label" for="sub-level">Level</label>
                        <select id="sub-level" class="sub__input" v-model="levelIndex">
                            <option value="" disabled>Choose a level...</option>
                            <option v-for="o in levelOptions" :key="o.index" :value="o.index">{{ o.label }}</option>
                        </select>
                    </div>

                    <div class="sub__field">
                        <div class="sub__labelrow">
                            <label class="sub__label" for="sub-pct">Percentage</label>
                            <span class="sub__hint" v-if="selectedLevel">{{ requiredPercent }}% Required</span>
                        </div>
                        <input id="sub-pct" class="sub__input" type="number" min="1" max="100" v-model.number="percentage" placeholder="100" />
                    </div>

                    <div class="sub__field">
                        <label class="sub__label" for="sub-video">Video link</label>
                        <input id="sub-video" class="sub__input" type="url" v-model.trim="video" placeholder="https://www.youtube.com/watch?v=..." />
                    </div>

                    <div class="sub__field">
                        <label class="sub__label" for="sub-hz">FPS / Hz</label>
                        <input id="sub-hz" class="sub__input" type="number" min="1" max="1000" v-model.number="hz" placeholder="e.g. 60, 144, 240" />
                    </div>

                    <label class="sub__check">
                        <input type="checkbox" v-model="mobile" />
                        <span>Record achieved on Mobile device</span>
                    </label>

                    <div class="sub__field" v-if="entries.raw">
                        <label class="sub__label" for="sub-raw">Raw footage link (optional)</label>
                        <input id="sub-raw" class="sub__input" type="url" v-model.trim="raw" placeholder="Google Drive, Dropbox, Mega, etc." />
                    </div>

                    <div class="sub__field" v-if="entries.copyId">
                        <label class="sub__label" for="sub-copy">Custom copy ID (optional)</label>
                        <input id="sub-copy" class="sub__input" type="text" v-model.trim="copyId" placeholder="e.g. 12345678 (If custom copy used)" />
                    </div>

                    <div class="sub__field" v-if="entries.notes">
                        <div class="sub__labelrow">
                            <label class="sub__label" for="sub-notes">Notes (optional)</label>
                            <span class="sub__count">{{ notes.length }}/500</span>
                        </div>
                        <textarea id="sub-notes" class="sub__input" rows="3" maxlength="500" v-model="notes" placeholder="Additional information, audio details, etc."></textarea>
                    </div>

                    <input class="sub__hp" type="text" v-model="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />

                    <p class="sub__alert sub__alert--error" v-if="error">{{ error }}</p>

                    <button class="sub__submit" type="submit" :disabled="sending || !configured">
                        {{ sending ? 'Submitting...' : 'Submit Record' }}
                    </button>
                </form>
            </div>
        </div>
    </main>
`;
