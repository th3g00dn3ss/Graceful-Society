import template from './changelog-template.js';

const FILE = 'data/_changelog.json';
const LABELS = { added: 'Added', moved: 'Moved', removed: 'Removed', note: 'Note' };

export default {
    template,
    data: () => ({
        entries: [],
        loading: true,
        failed: false,
        filter: 'all',
        filters: [
            { key: 'all', label: 'All' },
            { key: 'added', label: 'Added' },
            { key: 'moved', label: 'Moved' },
            { key: 'removed', label: 'Removed' },
        ],
    }),
    computed: {
        groups() {
            return this.entries
                .map((entry) => ({
                    date: entry.date,
                    changes: (entry.changes || []).filter(
                        (c) => this.filter === 'all' || c.type === this.filter
                    ),
                }))
                .filter((group) => group.changes.length)
                .sort((a, b) => String(b.date).localeCompare(String(a.date)));
        },
    },
    async mounted() {
        try {
            const res = await fetch(FILE, { cache: 'no-cache' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            this.entries = Array.isArray(data) ? data : [];
        } catch (e) {
            console.error('Failed to load changelog.', e);
            this.failed = true;
        }
        this.loading = false;
    },
    methods: {
        label(type) {
            return LABELS[type] || 'Note';
        },
        position(c) {
            if (c.type === 'added' && c.to) return '#' + c.to;
            if (c.type === 'moved' && c.from && c.to) {
                const arrow = c.to < c.from ? '▲' : '▼';
                return arrow + ' #' + c.from + ' → #' + c.to;
            }
            if (c.type === 'removed' && c.from) return 'was #' + c.from;
            return '';
        },
        direction(c) {
            if (c.type !== 'moved' || !c.from || !c.to) return '';
            return c.to < c.from ? 'is-up' : 'is-down';
        },
        formatDate(date) {
            const d = new Date(date + 'T00:00:00');
            if (isNaN(d)) return date;
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
    },
};
