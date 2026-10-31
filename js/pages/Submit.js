export default {
    template: `
        <main class="page-submit" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
            <h1>Submit a Record</h1>
            <p style="margin-bottom: 1rem;">Fill out the form below.</p>
            <iframe
                :src="formUrl"
                style="width: 100%; height: 1500px; border: 0;"
                frameborder="0"
            >Loading…</iframe>
        </main>
    `,
    data: () => ({
        // Buraya kendi Google Form embed linkini yapıştır
        formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeED0xRlqy-E7N2rRC4a8fwfs1AS-YVIL6syl2zq8Hrt87yzQ/viewform?embedded=true',
    }),
};
