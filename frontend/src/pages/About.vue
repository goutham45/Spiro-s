<template>
    <div class="about-page">

        <!-- ═══ PAGE HEADER ════════════════════════════════════ -->
        <div class="page-header">
            <p class="page-eyebrow">Est. 1985 · Sheepshead Bay</p>
            <h1 class="page-title">Our Story</h1>
            <p class="page-subtitle">A Brooklyn institution, family-owned for over four decades.</p>
        </div>

        <!-- ═══ STORY SECTION ═════════════════════════════════ -->
        <section class="story-section">
            <div class="story-image">
                <img src="../assets/images/about-img.jpg" alt="Spiros Restaurant" class="story-img" />
                <div class="story-img-badge">
                    <span class="badge-year">1985</span>
                    <span class="badge-label">Established</span>
                </div>
            </div>
            <div class="story-text">
                <p class="story-eyebrow">How it all began</p>
                <h2 class="story-heading">Welcome to Spiros Greek Diner</h2>
                <p>Spiros Diner has been a beloved fixture of the Sheepshead Bay neighbourhood since 1985.
                    Founded by the Spiros family, our restaurant brings the warmth of Greek hospitality
                    and home cooking to the heart of Brooklyn.</p>
                <p>From our famous crispy spanakopita and hearty gyro platters to classic American breakfasts
                    with the freshest eggs — every dish is crafted with the same passion that has kept our
                    loyal customers coming back for over three decades.</p>
                <p>We source our ingredients daily from local Brooklyn markets, ensuring every plate that
                    leaves our kitchen is as fresh as it is flavourful. Stop by, pull up a chair, and let
                    us take care of you — just like family.</p>

                <div class="info-cards">
                    <div class="info-card">
                        <span class="info-icon">📍</span>
                        <div>
                            <strong>Location</strong>
                            <span>2103 Avenue U, Brooklyn, NY 11229</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <span class="info-icon">📞</span>
                        <div>
                            <strong>Phone</strong>
                            <span>(718) 891-9843</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <span class="info-icon">🕐</span>
                        <div>
                            <strong>Hours</strong>
                            <span>Mon–Thu 7am–6pm · Fri–Sun 7am–7pm</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══ QUOTE BANNER ══════════════════════════════════ -->
        <div class="quote-banner">
            <div class="quote-banner-inner">
                <span class="quote-mark">"</span>
                <h2>Good food brings people together.<br>We've been proving that since 1985.</h2>
                <p>— The Spiros Family</p>
            </div>
        </div>

        <!-- ═══ MILESTONES / TIMELINE ══════════════════════════ -->
        <section class="milestones-section">
            <div class="milestones-header">
                <p class="ms-eyebrow">Four decades of service</p>
                <h2 class="ms-title">Our Journey</h2>
            </div>
            <div class="timeline">
                <div class="timeline-item" v-for="m in milestones" :key="m.year">
                    <div class="tl-year">{{ m.year }}</div>
                    <div class="tl-dot"></div>
                    <div class="tl-content">
                        <h3>{{ m.title }}</h3>
                        <p>{{ m.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══ VALUES GRID ════════════════════════════════════ -->
        <section class="values-section">
            <div class="values-header">
                <p class="val-eyebrow">What we stand for</p>
                <h2 class="val-title">The Spiros Promise</h2>
            </div>
            <div class="values-grid">
                <div class="value-card" v-for="v in values" :key="v.title">
                    <div class="value-icon-wrap" :style="{ background: v.bg }">
                        <span class="value-icon">{{ v.icon }}</span>
                    </div>
                    <h3 class="value-title">{{ v.title }}</h3>
                    <p class="value-desc">{{ v.desc }}</p>
                </div>
            </div>
        </section>


        <!-- ═══ VISIT US ════════════════════════════════════════ -->
        <section class="visit-section">
            <div class="visit-inner">
                <div class="visit-text">
                    <p class="visit-eyebrow">Come see us</p>
                    <h2 class="visit-title">Find Us in Sheepshead Bay</h2>
                    <p class="visit-desc">We're open seven days a week, serving Brooklyn families the same way
                        we have since 1985. Walk-ins welcome. Tables can be reserved online.</p>
                    <div class="visit-details">
                        <div class="visit-row"><span class="vr-icon">📍</span><span>2103 Avenue U, Brooklyn, NY 11229</span></div>
                        <div class="visit-row"><span class="vr-icon">📞</span><span>(718) 891-9843</span></div>
                        <div class="visit-row"><span class="vr-icon">🕐</span><div>
                            <span>Mon–Fri: 7:00 am – 6:00 pm</span><br>
                            <span>Sat–Sun: 7:00 am – 7:00 pm</span>
                        </div></div>
                    </div>
                    <router-link to="/table" @click="top" class="btn-visit">Book a Table →</router-link>
                </div>
                <div class="visit-map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3028.5!2d-73.96!3d40.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjEwMyBBdmVudWUgVSwgQnJvb2tseW4sIE5ZIDExMjI5!5e0!3m2!1sen!2sus!4v1"
                        width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
                        title="Spiros Restaurant Map">
                    </iframe>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
export default {
    name: "About",
    methods: {
        top() { window.scrollTo(0, 0); }
    },
    data() {
        return {
            milestones: [
                { year: "1985", title: "Spiros Opens its Doors",          desc: "The Spiros family opens a small diner on Avenue U, serving Brooklyn their first taste of authentic Greek home cooking." },
                { year: "1992", title: "A Neighbourhood Staple",          desc: "Word spreads fast. Regulars fill every booth from morning to night. The legendary breakfast menu takes shape." },
                { year: "2005", title: "Greek Specialties Expand",        desc: "A full Greek menu is introduced — souvlaki, spanakopita, and gyros prepared with traditional family recipes." },
                { year: "2018", title: "Brooklyn's Favourite Rating",     desc: "Spiros earns a 4.9-star rating on Uber Eats from hundreds of loyal customers, cementing its legacy." },
                { year: "2024", title: "Still Going Strong",              desc: "Three generations later, the same warmth, the same recipes, the same love for Brooklyn. Come pull up a chair." },
            ],
            values: [
                { icon: "🏠", bg: "#fff5f5", title: "Family Owned",      desc: "Three generations of the Spiros family, serving Brooklyn with pride since 1985." },
                { icon: "🥬", bg: "#f0fff4", title: "Fresh Daily",        desc: "Every ingredient sourced every morning from local Brooklyn markets — nothing frozen, nothing rushed." },
                { icon: "🫶", bg: "#fff5f5", title: "Community First",   desc: "We've fed generations of Sheepshead Bay families. This neighbourhood is our home, and you are family." },
                { icon: "🇬🇷", bg: "#f0f8ff", title: "Authentic Greek",   desc: "Recipes passed down through the family — gyros, souvlaki, spanakopita made the traditional way, every time." },
                { icon: "🍳", bg: "#fff8f0", title: "Best Breakfast",     desc: "From fluffy pancakes to classic egg platters — our morning menu has been the talk of Brooklyn for decades." },
                { icon: "⭐", bg: "#fffbf0", title: "4.9 Star Rated",     desc: "Over 700 Uber Eats reviews and counting. Our customers keep coming back, and that means everything to us." },
            ],
        };
    },
};
</script>

<style scoped>

/* ── PAGE HEADER ──────────────────────────────────── */
.page-header {
    background: #CC0000;
    padding: 5rem 9%;
    text-align: center;
}
.page-eyebrow {
    font-size: 1.3rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(255,255,255,.75);
    margin-bottom: 1rem;
}
.page-title {
    font-family: 'Playfair Display', serif;
    font-size: 5rem;
    color: #fff;
    margin-bottom: 1rem;
    font-weight: 700;
}
.page-subtitle { font-size: 1.8rem; color: rgba(255,255,255,.8); }

/* ── STORY ────────────────────────────────────────── */
.story-section {
    display: flex;
    gap: 6rem;
    align-items: flex-start;
    padding: 7rem 9%;
    flex-wrap: wrap;
}
.story-image {
    flex: 1 1 38rem;
    position: relative;
}
.story-img {
    width: 100%;
    border-radius: 1.4rem;
    box-shadow: 0 20px 50px rgba(0,0,0,.15);
    display: block;
}
.story-img-badge {
    position: absolute;
    bottom: -2rem;
    left: 2rem;
    background: #CC0000;
    color: #fff;
    border-radius: 1rem;
    padding: 1.4rem 2rem;
    text-align: center;
    box-shadow: 0 8px 24px rgba(204,0,0,.35);
}
.badge-year  { display: block; font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 700; line-height: 1; }
.badge-label { display: block; font-size: 1.2rem; letter-spacing: .1em; text-transform: uppercase; opacity: .85; margin-top: .3rem; }

.story-text  { flex: 1 1 38rem; padding-top: 1rem; }
.story-eyebrow {
    font-size: 1.4rem; color: #CC0000; text-transform: uppercase;
    letter-spacing: .12em; font-weight: 700; margin-bottom: 1rem;
}
.story-heading {
    font-family: 'Playfair Display', serif;
    font-size: 3.4rem;
    color: #1a1a1a;
    line-height: 1.25;
    margin-bottom: 2.5rem;
}
.story-text p {
    font-size: 1.55rem;
    color: #555;
    line-height: 1.85;
    margin-bottom: 1.6rem;
}
.info-cards { display: flex; flex-direction: column; gap: 1.2rem; margin-top: 3rem; }
.info-card {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    background: #fafafa;
    border: 1px solid #eee;
    border-radius: 1rem;
    padding: 1.4rem 1.8rem;
}
.info-icon { font-size: 2rem; flex-shrink: 0; }
.info-card strong { display: block; font-size: 1.2rem; text-transform: uppercase; letter-spacing: .06em; color: #CC0000; margin-bottom: .3rem; }
.info-card span   { font-size: 1.45rem; color: #444; }

/* ── QUOTE BANNER ─────────────────────────────────── */
.quote-banner {
    background: linear-gradient(135deg, #CC0000 0%, #8b0000 100%);
    padding: 6rem 9%;
    text-align: center;
}
.quote-banner-inner { max-width: 80rem; margin: 0 auto; }
.quote-mark {
    font-family: 'Playfair Display', serif;
    font-size: 10rem;
    color: rgba(255,255,255,.15);
    line-height: .5;
    display: block;
    margin-bottom: -2rem;
}
.quote-banner h2 {
    font-family: 'Playfair Display', serif;
    font-size: 3.4rem;
    color: #fff;
    line-height: 1.4;
    margin-bottom: 1.5rem;
    font-style: italic;
}
.quote-banner p { font-size: 1.5rem; color: rgba(255,255,255,.75); }

/* ── MILESTONES / TIMELINE ────────────────────────── */
.milestones-section { padding: 7rem 9%; background: #fafafa; }
.milestones-header  { text-align: center; margin-bottom: 5rem; }
.ms-eyebrow { font-size: 1.4rem; color: #CC0000; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin-bottom: .8rem; }
.ms-title   { font-family: 'Playfair Display', serif; font-size: 3.4rem; color: #1a1a1a; }

.timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 80rem;
    margin: 0 auto;
}
.timeline::before {
    content: "";
    position: absolute;
    left: 9.5rem;
    top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #CC0000, rgba(204,0,0,.1));
}
.timeline-item {
    display: flex;
    align-items: flex-start;
    gap: 0;
    padding: 0 0 3.5rem 0;
    position: relative;
}
.tl-year {
    width: 7.5rem;
    text-align: right;
    padding-right: 1.5rem;
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #CC0000;
    padding-top: .3rem;
    flex-shrink: 0;
}
.tl-dot {
    width: 1.4rem; height: 1.4rem;
    background: #CC0000;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 0 0 3px #CC0000;
    flex-shrink: 0;
    margin: .5rem .5rem 0;
    z-index: 1;
}
.tl-content {
    flex: 1;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 1rem;
    padding: 1.8rem 2rem;
    margin-left: 1.5rem;
    box-shadow: 0 2px 12px rgba(0,0,0,.05);
}
.tl-content h3 { font-size: 1.7rem; font-weight: 700; color: #1a1a1a; margin-bottom: .6rem; }
.tl-content p  { font-size: 1.4rem; color: #666; line-height: 1.7; }

/* ── VALUES ───────────────────────────────────────── */
.values-section { padding: 7rem 9%; background: #fff; }
.values-header  { text-align: center; margin-bottom: 4rem; }
.val-eyebrow { font-size: 1.4rem; color: #CC0000; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin-bottom: .8rem; }
.val-title   { font-family: 'Playfair Display', serif; font-size: 3.4rem; color: #1a1a1a; }
.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(26rem, 1fr));
    gap: 2.4rem;
}
.value-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 1.4rem;
    padding: 3rem 2.5rem;
    text-align: center;
    transition: transform .2s, box-shadow .2s;
}
.value-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(204,0,0,.1);
    border-color: #CC0000;
}
.value-icon-wrap {
    width: 7rem; height: 7rem;
    border-radius: 1.2rem;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.8rem;
}
.value-icon  { font-size: 3.2rem; }
.value-title { font-size: 2rem; font-weight: 700; color: #CC0000; margin-bottom: 1rem; }
.value-desc  { font-size: 1.45rem; color: #666; line-height: 1.75; }


/* ── VISIT US ─────────────────────────────────────── */
.visit-section { background: #1a1a1a; padding: 0; }
.visit-inner {
    display: flex;
    flex-wrap: wrap;
    min-height: 50rem;
}
.visit-text {
    flex: 1 1 40rem;
    padding: 6rem 5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.visit-eyebrow { font-size: 1.4rem; color: #CC0000; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin-bottom: 1rem; }
.visit-title   { font-family: 'Playfair Display', serif; font-size: 3.4rem; color: #fff; line-height: 1.25; margin-bottom: 1.5rem; }
.visit-desc    { font-size: 1.5rem; color: rgba(255,255,255,.7); line-height: 1.8; margin-bottom: 3rem; }
.visit-details { display: flex; flex-direction: column; gap: 1.4rem; margin-bottom: 3rem; }
.visit-row     { display: flex; align-items: flex-start; gap: 1.2rem; }
.vr-icon       { font-size: 1.8rem; flex-shrink: 0; margin-top: .1rem; }
.visit-row span { font-size: 1.5rem; color: rgba(255,255,255,.8); line-height: 1.6; }
.btn-visit {
    display: inline-block;
    padding: 1.3rem 3rem;
    background: #CC0000;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    border-radius: .6rem;
    text-decoration: none;
    width: fit-content;
    transition: background .2s;
}
.btn-visit:hover { background: #a30000; }
.visit-map {
    flex: 1 1 40rem;
    min-height: 45rem;
}
.visit-map iframe { display: block; filter: grayscale(20%); }

/* ── RESPONSIVE ───────────────────────────────────── */
@media (max-width: 900px) {
    .story-section  { flex-direction: column-reverse; gap: 4rem; }
    .story-img-badge { position: static; display: inline-flex; margin-top: 1.5rem; }
    .timeline::before { left: 7.5rem; }
    .visit-inner    { flex-direction: column-reverse; }
    .visit-map      { min-height: 35rem; }
}
@media (max-width: 600px) {
    .page-title     { font-size: 3.6rem; }
    .story-heading  { font-size: 2.8rem; }
    .quote-banner h2 { font-size: 2.4rem; }
    .timeline::before { display: none; }
    .tl-year        { width: 5rem; font-size: 1.6rem; }
    .values-grid    { grid-template-columns: 1fr; }
}
</style>
