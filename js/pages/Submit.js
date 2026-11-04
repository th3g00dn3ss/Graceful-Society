import { fetchList } from '../content.js';

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
