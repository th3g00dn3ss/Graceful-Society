import template from './settings-template.js';
import {
    PRESETS,
    FONTS,
    loadSettings,
    saveSettings,
    applySettings,
    resetSettings,
    luminance,
} from '../theme.js';

export default {
    template,
    data: () => ({
        settings: loadSettings(),
        presets: PRESETS,
        fonts: FONTS,
    }),
    computed: {
        bright() {
            return luminance(this.settings.bg) > 0.5 || luminance(this.settings.surface) > 0.5;
        },
    },
    watch: {
        settings: {
            deep: true,
            handler(value) {
                applySettings(value);
                saveSettings(value);
            },
        },
    },
    methods: {
        choosePreset(key) {
            const preset = PRESETS[key];
            this.settings.preset = key;
            this.settings.accent = preset.accent;
            this.settings.bg = preset.bg;
            this.settings.surface = preset.surface;
        },
        reset() {
            this.settings = resetSettings();
        },
    },
};
