const KEY = 'gs-theme';

export const DEFAULTS = {
    preset: 'midnight',
    accent: '#4f8dff',
    bg: '#0b0d12',
    surface: '#0a0b0f',
    font: 'lexend',
    size: 100,
};

export const PRESETS = {
    midnight: { label: 'Midnight', accent: '#4f8dff', bg: '#0b0d12', surface: '#0a0b0f' },
    amoled: { label: 'AMOLED Black', accent: '#4f8dff', bg: '#000000', surface: '#050505' },
    slate: { label: 'Slate', accent: '#38bdf8', bg: '#111827', surface: '#0f172a' },
    violet: { label: 'Violet', accent: '#a78bfa', bg: '#0f0b1a', surface: '#0c0816' },
    forest: { label: 'Forest', accent: '#34d399', bg: '#0a1210', surface: '#08100d' },
    crimson: { label: 'Crimson', accent: '#f87171', bg: '#130a0b', surface: '#100808' },
};

export const FONTS = {
    lexend: { label: 'Lexend Deca (default)', stack: "'Lexend Deca', sans-serif" },
    inter: { label: 'Inter', stack: "'Inter', sans-serif", google: 'Inter:wght@400;500;700' },
    poppins: { label: 'Poppins', stack: "'Poppins', sans-serif", google: 'Poppins:wght@400;500;700' },
    roboto: { label: 'Roboto', stack: "'Roboto', sans-serif", google: 'Roboto:wght@400;500;700' },
    jetbrains: { label: 'JetBrains Mono', stack: "'JetBrains Mono', monospace", google: 'JetBrains+Mono:wght@400;500;700' },
    system: { label: 'System default', stack: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
    serif: { label: 'Serif', stack: "Georgia, 'Times New Roman', serif" },
};

const isHex = (c) => /^#[0-9a-fA-F]{6}$/.test(c);

export function luminance(hex) {
    if (!isHex(hex)) return 0;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function loadSettings() {
    try {
        const raw = localStorage.getItem(KEY);
        return { ...DEFAULTS, ...(raw ? JSON.parse(raw) : {}) };
    } catch (e) {
        return { ...DEFAULTS };
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(KEY, JSON.stringify(settings));
    } catch (e) {
        // Tarayıcı kaydetmeye izin vermiyorsa ayarlar sadece bu oturumda geçerli olur
    }
}

function loadFont(key, family) {
    const id = 'gs-font-' + key;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + family + '&display=swap';
    document.head.appendChild(link);
}

export function applySettings(settings) {
    const root = document.documentElement;
    const font = FONTS[settings.font] || FONTS.lexend;
    if (font.google) loadFont(settings.font, font.google);

    const accent = isHex(settings.accent) ? settings.accent : DEFAULTS.accent;
    const bg = isHex(settings.bg) ? settings.bg : DEFAULTS.bg;
    const surface = isHex(settings.surface) ? settings.surface : DEFAULTS.surface;
    const size = Math.min(140, Math.max(80, Number(settings.size) || 100));

    root.style.setProperty('--accent', accent);
    root.style.setProperty('--on-accent', luminance(accent) > 0.6 ? '#000000' : '#ffffff');
    root.style.setProperty('--bg', bg);
    root.style.setProperty('--surface', surface);
    root.style.setProperty('--font', font.stack);
    root.style.fontSize = size + '%';
}

export function resetSettings() {
    try {
        localStorage.removeItem(KEY);
    } catch (e) {
        // önemli değil
    }
    const defaults = { ...DEFAULTS };
    applySettings(defaults);
    return defaults;
}
