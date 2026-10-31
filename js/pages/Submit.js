export default {
    template: `
        <main class="page-submit" style="display: block; width: 100%; padding: 2rem 1rem; box-sizing: border-box;">
            <div style="max-width: 800px; margin: 0 auto;">
                <h1>Submit a Record</h1>
                <p style="margin: 1rem 0;">Fill out the form below. No Discord account needed.</p>
                <iframe
                    :src="formUrl"
                    style="display: block; width: 100%; height: 1600px; border: 0;"
                    frameborder="0"
                >Loading…</iframe>
            </div>
        </main>
    `,
    data: () => ({
        formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeED0xRlqy-E7N2rRC4a8fwfs1AS-YVIL6syl2zq8Hrt87yzQ/viewform?embedded=true',
    }),
};
