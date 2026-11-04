import template from './submit-level-template.js';

// İkinci Google Form'un gönderim adresi: viewform yerine formResponse
const LEVEL_FORM_ACTION =
    'https://docs.google.com/forms/d/e/1FAIpQLSfgucbyNwOarivbpgXThs-E_WITXAdy068my-s0wHS-wA1epQ/formResponse';

// Her sorunun Google Form'daki kodu
const LEVEL_ENTRY = {
    username: 'entry.1249628165', // Username
    name: 'entry.1684235309', // Level name
    id: 'entry.2088299436', // Level ID
    creators: 'entry.306165023', // Creator(s)
    verifier: 'entry.1605376451', // Verifier
    verification: 'entry.1639808627', // Verification video
    publisher: 'entry.1922457121', // Publisher (isteğe bağlı)
    password: 'entry.217133478', // Password (isteğe bağlı)
    notes: 'entry.157350279', // Notes (isteğe bağlı)
};
const LEVEL_REQUIRED = ['username', 'name', 'id', 'creators', 'verifier', 'verification'];

export default {
    template,
    data: () => ({
        username: '',
        name: '',
        id: '',
        creators: '',
        verifier: '',
        verification: '',
        publisher: '',
        password: '',
        notes: '',
        hp: '',
        sending: false,
        done: false,
        error: '',
        entries: LEVEL_ENTRY,
    }),
    computed: {
        configured() {
            return !!LEVEL_FORM_ACTION && LEVEL_REQUIRED.every((key) => LEVEL_ENTRY[key]);
        },
    },
    methods: {
        async submit() {
            this.error = '';

            // Bot tuzağı: gizli alan doluysa sessizce başarılı gibi davran
            if (this.hp) {
                this.done = true;
                return;
            }

            if (!this.username) {
                this.error = 'Please enter your username.';
                return;
            }
            if (!this.name) {
                this.error = 'Please enter the level name.';
                return;
            }
            if (!/^\d{1,12}$/.test(this.id)) {
                this.error = 'Level ID must be a number.';
                return;
            }
            if (!this.creators) {
                this.error = 'Please enter the creator(s).';
                return;
            }
            if (!this.verifier) {
                this.error = 'Please enter the verifier.';
                return;
            }
            if (!/^https?:\/\/\S+$/i.test(this.verification)) {
                this.error = 'Please enter a valid verification video link (starting with https://).';
                return;
            }

            const body = new URLSearchParams();
            body.append(LEVEL_ENTRY.username, this.username);
            body.append(LEVEL_ENTRY.name, this.name);
            body.append(LEVEL_ENTRY.id, this.id);
            body.append(LEVEL_ENTRY.creators, this.creators);
            body.append(LEVEL_ENTRY.verifier, this.verifier);
            body.append(LEVEL_ENTRY.verification, this.verification);
            if (LEVEL_ENTRY.publisher && this.publisher) body.append(LEVEL_ENTRY.publisher, this.publisher);
            if (LEVEL_ENTRY.password && this.password) body.append(LEVEL_ENTRY.password, this.password);
            if (LEVEL_ENTRY.notes && this.notes) body.append(LEVEL_ENTRY.notes, this.notes);

            this.sending = true;
            try {
                // Google yanıtı okunamaz (no-cors), bu yüzden hata yoksa başarılı sayılır
                await fetch(LEVEL_FORM_ACTION, { method: 'POST', mode: 'no-cors', body });
                this.done = true;
            } catch (e) {
                console.error('Failed to submit level.', e);
                this.error = 'Could not send your level. Please try again in a moment.';
            } finally {
                this.sending = false;
            }
        },
        reset() {
            this.username = '';
            this.name = '';
            this.id = '';
            this.creators = '';
            this.verifier = '';
            this.verification = '';
            this.publisher = '';
            this.password = '';
            this.notes = '';
            this.hp = '';
            this.error = '';
            this.done = false;
        },
    },
};
