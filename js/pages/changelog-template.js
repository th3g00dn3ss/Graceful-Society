export default `
    <main class="sub">
        <div class="sub__inner">
            <h1 class="sub__title">Changelog</h1>
            <p class="sub__subtitle">Recently added, moved and removed levels.</p>

            <div class="cl__filters">
                <button
                    type="button"
                    class="cl__chip"
                    v-for="f in filters"
                    :key="f.key"
                    :class="{ active: filter === f.key }"
                    @click="filter = f.key"
                >{{ f.label }}</button>
            </div>

            <p class="sub__alert sub__alert--error" v-if="failed">Failed to load the changelog.</p>
            <p class="cl__empty" v-else-if="!loading && !groups.length">No changes yet.</p>

            <section class="cl__day" v-for="group in groups" :key="group.date">
                <h2 class="cl__date">{{ formatDate(group.date) }}</h2>
                <ul class="cl__items">
                    <li class="cl__item" v-for="(c, i) in group.changes" :key="i">
                        <span class="cl__badge" :class="'cl__badge--' + c.type">{{ label(c.type) }}</span>
                        <div class="cl__body">
                            <span class="cl__level" v-if="c.level">{{ c.level }}</span>
                            <span class="cl__pos" v-if="position(c)" :class="direction(c)">{{ position(c) }}</span>
                            <p class="cl__note" v-if="c.note">{{ c.note }}</p>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    </main>
`;
