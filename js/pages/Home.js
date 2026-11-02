import { fetchEditors } from '../content.js';

const DISCORD_URL = 'https://discord.gg/BxWZA2MPBf';
// YouTube kanalın olunca linki buraya yaz, boşken kart görünmez
const YOUTUBE_URL = 'https://www.youtube.com/@GRACEEE-f9y';
const TEMPLATE_URL = 'https://github.com/TheShittyList/GDListTemplate';

export default {
    template: `
        <main class="page-home">
            <aside class="home-staff">
                <h2>Staff &amp; Community</h2>
                <p class="home-staff__sub">The Staff Team</p>
                <ul v-if="editors && editors.length">
                    <li v-for="editor in editors" class="home-staff__row">
                        <a v-if="editor.link" :href="editor.link" target="_blank">{{ editor.name }}</a>
                        <span v-else>{{ editor.name }}</span>
                        <span class="role" :class="'role--' + editor.role">{{ editor.role }}</span>
                    </li>
                </ul>
                <p v-else class="home-staff__sub">No staff listed yet.</p>
            </aside>

            <section class="home-hero">
                <h1>Graceful Society</h1>
                <p class="home-hero__tagline">
                    The challenge list of the Graceful Society community.
                </p>

                <div class="home-cards">
                    <a class="home-card" :href="discordUrl" target="_blank">
                        <img src="assets/discord.svg" alt="Discord" />
                        <span><strong>Discord</strong><small>Our server</small></span>
                    </a>
                    <a v-if="youtubeUrl" class="home-card" :href="youtubeUrl" target="_blank">
                        <span><strong>YouTube</strong><small>Subscribe to our YouTube channel</small></span>
                    </a>
                </div>

                <div class="home-actions">
                    <router-link class="home-btn home-btn--primary" to="/list">Explore Levels</router-link>
                    <router-link class="home-btn" to="/leaderboard">View Leaderboard</router-link>
                    <a class="home-btn" :href="templateUrl" target="_blank">Website Template</a>
                </div>
            </section>
        </main>
    `,
    data: () => ({
        editors: [],
        discordUrl: DISCORD_URL,
        youtubeUrl: YOUTUBE_URL,
        templateUrl: TEMPLATE_URL,
    }),
    async mounted() {
        this.editors = (await fetchEditors()) || [];
    },
};
