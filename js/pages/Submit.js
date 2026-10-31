export default {
    template: `
        <main class="page-submit" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
            <h1>Submit a Record</h1>
            <p style="margin-bottom: 1rem;">Fill out the form below. No Discord account needed.</p>
            <iframe
                :src="formUrl"
                style="width: 100%; height: 1500px; border: 0;"
                frameborder="0"
            >Loading…</iframe>
        </main>
    `,
    data: () => ({
        // Buraya kendi Google Form embed linkini yapıştır
        formUrl: 'BURAYA_FORM_LINKI',
    }),
};
