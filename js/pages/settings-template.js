export default `
    <main class="sub st">
        <div class="sub__inner">
            <h1 class="sub__title">Settings</h1>
            <p class="sub__subtitle">Customize how the site looks. Your choices are saved in this browser only.</p>

            <div class="sub__card">
                <div class="sub__field">
                    <span class="sub__label">Theme presets</span>
                    <div class="st__presets">
                        <button
                            type="button"
                            class="st__preset"
                            v-for="(p, key) in presets"
                            :key="key"
                            :class="{ active: settings.preset === key }"
                            @click="choosePreset(key)"
                        >
                            <span class="st__swatch" :style="{ background: p.bg, borderColor: p.accent }">
                                <i :style="{ background: p.accent }"></i>
                            </span>
                            {{ p.label }}
                        </button>
                    </div>
                </div>

                <div class="sub__field st__colors">
                    <label class="st__colorbox">
                        <span class="sub__label">Accent color</span>
                        <input class="st__color" type="color" v-model="settings.accent" @input="settings.preset = 'custom'" />
                    </label>
                    <label class="st__colorbox">
                        <span class="sub__label">Background</span>
                        <input class="st__color" type="color" v-model="settings.bg" @input="settings.preset = 'custom'" />
                    </label>
                    <label class="st__colorbox">
                        <span class="sub__label">Panels</span>
                        <input class="st__color" type="color" v-model="settings.surface" @input="settings.preset = 'custom'" />
                    </label>
                </div>

                <p class="sub__alert sub__alert--error" v-if="bright">
                    This background is very bright. The site's text is white, so it may be hard to read.
                </p>

                <div class="sub__field">
                    <label class="sub__label" for="st-font">Font</label>
                    <select id="st-font" class="sub__input" v-model="settings.font">
                        <option v-for="(f, key) in fonts" :key="key" :value="key">{{ f.label }}</option>
                    </select>
                </div>

                <div class="sub__field">
                    <label class="sub__label" for="st-size">Text size</label>
                    <select id="st-size" class="sub__input" v-model.number="settings.size">
                        <option :value="90">Small</option>
                        <option :value="100">Normal</option>
                        <option :value="112">Large</option>
                        <option :value="125">Extra large</option>
                    </select>
                </div>

                <button type="button" class="st__reset" @click="reset">Reset to defaults</button>
            </div>
        </div>
    </main>
`;
