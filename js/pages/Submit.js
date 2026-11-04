import { fetchList } from '../content.js';
import template from './submit-template.js?v=2';

// ------------------------------------------------------------------
// AYARLAR
// ------------------------------------------------------------------

// Google Form'un gönderim adresi (viewform yerine formResponse)
const FORM_ACTION =
    'https://docs.google.com/forms/d/e/1FAIpQLSeED0xRlqy-E7N2rRC4a8fwfs1AS-YVIL6syl2zq8Hrt87yzQ/formResponse';

// Her sorunun Google Form'daki kodu
const ENTRY = {
    // Zorunlu alanlar (formdaki mevcut sorular)
    username: 'entry.372268231', // Username
    level: 'entry.1245040941', // Level (With ID)
    percentage: 'entry.792016257', // percentage
    video: 'entry.608347415', // Video Link
    device: 'entry.568374877', // Device (Mobile / PC)
    hz: 'entry.991470393', // FPS/Hz
    // İsteğe bağlı alanlar: forma ekleyip kodunu yazarsan sayfada görünür
    raw: '', // Raw footage link
    copyId: '', // Custom copy ID
    notes: '', // Notes
};
const REQUIRED = ['username', 'level', 'percentage', 'video', 'device', 'hz'];

// "View Standards" bölümünde görünen kurallar, istediğin gibi düzenle
const RULES = [
    'Achieved the record without using hacks (however, FPS bypass is allowed, up to 360fps)',
    'Achieved the record on the level that is listed on the site - please check the level ID before you submit a record',
    'Have either source audio or clicks/taps in the video. Edited audio only does not count',
    'The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt. Everyplay records are exempt from this',
    'The recording must also show the player hit the endwall, or the completion will be invalidated',
    'Do not use secret routes or bug routes',
    'Do not use easy modes, only a record of the unmodified level qualifies',
    'Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level',
];

export default {
    template: `
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
    `,
    data: () => ({
        levels: [],
        username: '',
        levelIndex: '',
        percentage: '',
        video: '',
        hz: '',
        mobile: false,
        raw: '',
        copyId: '',
        notes: '',
        hp: '',
        sending: false,
        done: false,
        error: '',
        showRules: false,
        rules: RULES,
        entries: ENTRY,
    }),
    computed: {
        configured() {
            return REQUIRED.every((key) => ENTRY[key]);
        },
        // Sadece kayıt kabul eden seviyeler (ilk 150)
        levelOptions() {
            return this.levels
                .map(([level], index) => ({ level, index }))
                .filter(({ level, index }) => level && index < 150)
                .map(({ level, index }) => ({
                    index,
                    label: '#' + (index + 1) + ' ' + level.name,
                }));
        },
        selectedLevel() {
            if (this.levelIndex === '') return null;
            const row = this.levels[this.levelIndex];
            return row ? row[0] : null;
        },
        requiredPercent() {
            const level = this.selectedLevel;
            if (!level) return 100;
            if (this.levelIndex < 75) {
                return Number(level.percentToQualify) || 100;
            }
            return 100;
        },
    },
    async mounted() {
        const list = await fetchList();
        this.levels = list || [];
    },
    methods: {
        async submit() {
            this.error = '';

            // Bot tuzağı: gizli alan doluysa sessizce başarılı gibi davran
            if (this.hp) {
                this.done = true;
                return;
            }

            const level = this.selectedLevel;
            const pct = Number(this.percentage);
            const hz = Number(this.hz);

            if (!this.username) {
                this.error = 'Please enter your username.';
                return;
            }
            if (!level) {
                this.error = 'Please choose a level.';
                return;
            }
            if (!Number.isInteger(pct) || pct < this.requiredPercent || pct > 100) {
                this.error = 'Minimum ' + this.requiredPercent + '% is required for this level.';
                return;
            }
            if (!/^https?:\/\/\S+$/i.test(this.video)) {
                this.error = 'Please enter a valid video link (starting with https://).';
                return;
            }
            if (!Number.isFinite(hz) || hz < 1) {
                this.error = 'Please enter your FPS / Hz.';
                return;
            }

            const body = new URLSearchParams();
            body.append(ENTRY.username, this.username);
            body.append(ENTRY.level, level.name + ' (' + level.id + ')');
            body.append(ENTRY.percentage, String(pct));
            body.append(ENTRY.video, this.video);
            body.append(ENTRY.device, this.mobile ? 'Mobile' : 'PC');
            body.append(ENTRY.hz, String(hz));
            if (ENTRY.raw && this.raw) body.append(ENTRY.raw, this.raw);
            if (ENTRY.copyId && this.copyId) body.append(ENTRY.copyId, this.copyId);
            if (ENTRY.notes && this.notes) body.append(ENTRY.notes, this.notes);

            this.sending = true;
            try {
                // Google yanıtı okunamaz (no-cors), bu yüzden hata yoksa başarılı sayılır
                await fetch(FORM_ACTION, { method: 'POST', mode: 'no-cors', body });
                this.done = true;
            } catch (e) {
                console.error('Failed to submit record.', e);
                this.error = 'Could not send your record. Please try again in a moment.';
            } finally {
                this.sending = false;
            }
        },
        reset() {
            this.username = '';
            this.levelIndex = '';
            this.percentage = '';
            this.video = '';
            this.hz = '';
            this.mobile = false;
            this.raw = '';
            this.copyId = '';
            this.notes = '';
            this.hp = '';
            this.error = '';
            this.done = false;
        },
    },
};
