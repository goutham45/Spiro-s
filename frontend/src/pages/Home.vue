<template>
    <div class="home-page">

        <!-- ═══ HERO ═══════════════════════════════════════════ -->
        <section class="hero">
            <div class="hero-overlay"></div>
            <div class="hero-inner">
                <div class="hero-text">
                    <p class="hero-eyebrow">Sheepshead Bay · Brooklyn · Est. 1985</p>
                    <h1 class="hero-heading">Brooklyn's Favourite<br>Greek &amp; American Diner</h1>
                    <p class="hero-sub">Family recipes, fresh ingredients, and four decades of love on Avenue U.
                        From fluffy omelettes to crispy gyros — made the way grandma intended.</p>
                    <div class="hero-ctas">
                        <router-link to="/menu" @click="top" class="btn-hero-primary">Order Now</router-link>
                        <router-link to="/table" @click="top" class="btn-hero-outline">Book a Table</router-link>
                    </div>
                    <div class="hero-trust">
                        <span class="trust-pill">⭐ 4.9 on Uber Eats</span>
                        <span class="trust-pill">🏅 700+ Reviews</span>
                        <span class="trust-pill">📍 Open Daily 7am–10pm</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══ PREMIUM TRUST BAR ═════════════════════════════ -->
        <section class="trust-bar">
            <div class="trust-bar-grid">
                <div class="trust-stat" v-for="(s, i) in trustStats" :key="i">
                    <div class="trust-stat-icon">{{ s.icon }}</div>
                    <div class="trust-stat-body">
                        <span class="trust-stat-num">{{ s.num }}</span>
                        <span class="trust-stat-label">{{ s.label }}</span>
                        <span class="trust-stat-sub">{{ s.sub }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══ EXPLORE MENU ═══════════════════════════════════ -->
        <section class="menu-section">
            <div class="menu-section-header">
                <p class="section-eyebrow">375 Items · Made Fresh Daily</p>
                <h2 class="section-title">Explore Our Menu</h2>
                <p class="menu-section-desc">From hearty American breakfasts to authentic Greek specialties — nine categories, every craving covered.</p>
            </div>
            <div class="cat-grid">
                <router-link
                    :to="{ path: '/menu', query: { category: cat.slug } }"
                    v-for="cat in menuCategories" :key="cat.slug"
                    class="cat-card"
                    @click="() => window.scrollTo(0,0)">
                    <span class="cat-card-emoji">{{ cat.emoji }}</span>
                    <h3 class="cat-card-name">{{ cat.name }}</h3>
                    <p class="cat-card-count">{{ cat.count }} dishes</p>
                    <span class="cat-card-arrow">→</span>
                </router-link>
            </div>
        </section>

        <!-- ═══ FEATURE SPLIT — BREAKFAST + GREEK ═════════════ -->
        <section class="feature-split">
            <div class="feature-panel">
                <img src="../assets/images/breakfast-hero.jpg" alt="Brooklyn's Best Breakfast" class="feature-bg-img" />
                <div class="feature-overlay"></div>
                <div class="feature-panel-content">
                    <span class="feature-tag">Every Morning</span>
                    <h2>Brooklyn's Best<br>Breakfast</h2>
                    <p>Eggs any style, fluffy pancakes, golden waffles &amp; omelettes — crafted fresh every single morning since 1985.</p>
                    <router-link to="/menu" @click="top" class="btn-feature">See Breakfast Menu →</router-link>
                </div>
            </div>
            <div class="feature-panel">
                <img src="../assets/images/greek-food.jpg" alt="Authentic Greek Specialties" class="feature-bg-img" />
                <div class="feature-overlay"></div>
                <div class="feature-panel-content">
                    <span class="feature-tag">Authentic Greek</span>
                    <h2>From Athens<br>to Avenue U</h2>
                    <p>Gyros, souvlaki, spanakopita &amp; moussaka — traditional recipes passed down through three generations.</p>
                    <router-link to="/menu" @click="top" class="btn-feature">See Greek Menu →</router-link>
                </div>
            </div>
        </section>

        <!-- ═══ BRIDGE STRIP ══════════════════════════════════ -->
        <section class="bridge-strip">
            <div class="bridge-inner">
                <div class="bridge-ornament">
                    <span class="bridge-line"></span>
                    <span class="bridge-icon">🍽</span>
                    <span class="bridge-line"></span>
                </div>
                <h2 class="bridge-heading">Forty Years of Flavor,<br>One Family's Love</h2>
                <p class="bridge-sub">Every plate at Spiro's is made the way it's always been — fresh, from scratch,<br>with ingredients you can taste and a warmth you can feel.</p>
            </div>
        </section>

        <!-- ═══ WHY SPIROS ════════════════════════════════════ -->
        <section class="why-section">
            <div class="why-image-col">
                <div class="why-image-frame">
                    <img src="../assets/images/about-img.jpg" alt="Spiros kitchen" />
                    <div class="why-image-badge">
                        <span class="why-badge-num">1985</span>
                        <span class="why-badge-txt">Est. Brooklyn</span>
                    </div>
                </div>
            </div>
            <div class="why-content">
                <p class="section-eyebrow">Why Choose Spiros?</p>
                <h2 class="why-title">A Diner That<br>Feels Like Home</h2>
                <p class="why-text">Chef Spiros and his family bring generations of Greek culinary tradition to every dish. From crispy gyros to classic American breakfasts — every plate is made fresh, every morning, with ingredients sourced locally from Brooklyn markets.</p>
                <router-link to="/about" @click="top" class="btn-why">Our Story →</router-link>
                <div class="why-pillars">
                    <div class="pillar" v-for="p in pillars" :key="p.label">
                        <span class="pillar-icon">{{ p.icon }}</span>
                        <div class="pillar-text">
                            <span class="pillar-label">{{ p.label }}</span>
                            <span class="pillar-sub">{{ p.sub }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══ REVIEWS CAROUSEL ══════════════════════════════ -->
        <section class="reviews-section">
            <div class="reviews-header">
                <p class="section-eyebrow">Verified Uber Eats Reviews</p>
                <h2 class="section-title reviews-title">What Our Customers Say</h2>
                <div class="reviews-meta-row">
                    <span class="reviews-stars">★★★★★</span>
                    <span class="reviews-score">4.9 / 5</span>
                    <span class="reviews-count">· 700+ verified ratings</span>
                </div>
            </div>

            <div class="carousel-wrap">
                <button class="carousel-btn carousel-prev" @click="prevReview">‹</button>

                <div class="carousel-stage">
                    <transition name="rfade" mode="out-in">
                        <div class="review-card" :key="reviews[reviewIdx].id">
                            <div class="review-avatar">{{ reviews[reviewIdx].initials }}</div>
                            <div class="review-card-stars">★★★★★</div>
                            <blockquote class="review-quote">"{{ reviews[reviewIdx].text }}"</blockquote>
                            <div class="review-footer">
                                <span class="review-name">{{ reviews[reviewIdx].name }}</span>
                                <span class="review-sep">·</span>
                                <span class="review-date">{{ reviews[reviewIdx].date }}</span>
                                <span class="review-via">via Uber Eats</span>
                            </div>
                        </div>
                    </transition>
                </div>

                <button class="carousel-btn carousel-next" @click="nextReview">›</button>
            </div>

            <div class="carousel-dots">
                <button
                    v-for="(r, i) in reviews" :key="r.id"
                    class="carousel-dot" :class="{ active: i === reviewIdx }"
                    @click="goToReview(i)">
                </button>
            </div>

            <div class="reviews-cta">
                <router-link to="/menu" @click="top" class="btn-ue">
                    Order Now →
                </router-link>
            </div>
        </section>

    </div>
</template>

<script>
export default {
    name: "Home",

    data() {
        return {
            reviewIdx: 0,
            reviewTimer: null,

            trustStats: [
                { icon: "🏛️", num: "40+",  label: "Years in Brooklyn",  sub: "Est. 1985 on Avenue U"      },
                { icon: "⭐",  num: "4.9",  label: "Uber Eats Rating",    sub: "700+ verified reviews"      },
                { icon: "🍽️", num: "375",  label: "Menu Items",          sub: "Fresh made every morning"   },
                { icon: "👨‍👩‍👧‍👦", num: "3rd",  label: "Generation Family",  sub: "Greek culinary tradition"   },
            ],

            menuCategories: [
                { slug: "breakfast",  name: "Breakfast",          emoji: "🍳", count: 88  },
                { slug: "chicken",    name: "Chicken",            emoji: "🍗", count: 48  },
                { slug: "beef",       name: "Beef & Burgers",     emoji: "🥩", count: 62  },
                { slug: "sandwiches", name: "Sandwiches & Wraps", emoji: "🥪", count: 40  },
                { slug: "salads",     name: "Salads & Healthy",   emoji: "🥗", count: 30  },
                { slug: "seafood",    name: "Seafood",            emoji: "🐟", count: 14  },
                { slug: "appetizers", name: "Appetizers & Sides", emoji: "🍟", count: 38  },
                { slug: "desserts",   name: "Desserts",           emoji: "🍰", count: 31  },
                { slug: "drinks",     name: "Drinks",             emoji: "☕", count: 24  },
            ],

            pillars: [
                { icon: "🚀", label: "Fast Delivery",    sub: "Hot food at your door"    },
                { icon: "🌿", label: "Fresh Daily",      sub: "No frozen ingredients"    },
                { icon: "👨‍🍳", label: "Family Recipes",  sub: "Three generations of love" },
                { icon: "🏠", label: "Dine-in & Takeout", sub: "Your choice, always"     },
            ],

            reviews: [
                { id: 1, name: "Diana S.",       initials: "D", date: "Nov 2025", text: "Food is sooo goood and affordable, thank you!" },
                { id: 2, name: "Fong P.",        initials: "F", date: "Apr 2024", text: "I love this restaurant. They have the best food, especially the beef gyro!" },
                { id: 3, name: "Denbigh B.",     initials: "D", date: "Mar 2024", text: "Delicious breakfast! Best in Brooklyn!" },
                { id: 4, name: "Darren D.",      initials: "D", date: "Jan 2024", text: "Delicious" },
                { id: 5, name: "Randi B.",       initials: "R", date: "Nov 2023", text: "Great service" },
                { id: 6, name: "Linda P.",       initials: "L", date: "Jul 2023", text: "Delicious and fresh food" },
                { id: 7, name: "Konstantin F.",  initials: "K", date: "Feb 2023", text: "Great food, lots of options, fast and tasty!" },
                { id: 8, name: "Maggie M.",      initials: "M", date: "Nov 2022", text: "grilled cheese rocked" },
            ],
        };
    },

    mounted() {
        this.startTimer();
    },

    beforeUnmount() {
        clearInterval(this.reviewTimer);
    },

    methods: {
        top() { window.scrollTo(0, 0); },

        startTimer() {
            this.reviewTimer = setInterval(() => {
                this.reviewIdx = (this.reviewIdx + 1) % this.reviews.length;
            }, 4500);
        },

        prevReview() {
            clearInterval(this.reviewTimer);
            this.reviewIdx = (this.reviewIdx - 1 + this.reviews.length) % this.reviews.length;
            this.startTimer();
        },

        nextReview() {
            clearInterval(this.reviewTimer);
            this.reviewIdx = (this.reviewIdx + 1) % this.reviews.length;
            this.startTimer();
        },

        goToReview(i) {
            clearInterval(this.reviewTimer);
            this.reviewIdx = i;
            this.startTimer();
        },
    },
};
</script>

<style scoped>

/* ─── BASE ─────────────────────────────────────────── */
.home-page { background: #fff; font-family: 'Inter', sans-serif; }
.section-eyebrow {
    font-size: 1.3rem;
    color: #CC0000;
    text-transform: uppercase;
    letter-spacing: .18em;
    font-weight: 700;
    margin-bottom: .6rem;
    display: block;
}
.section-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.6rem;
    color: #1a1a1a;
    line-height: 1.2;
    font-weight: 700;
}

/* ─── HERO ─────────────────────────────────────────── */
.hero {
    position: relative;
    min-height: 90vh;
    background: url("../assets/images/hero-bg.jpg") center / cover no-repeat;
    display: flex;
    align-items: center;
    overflow: hidden;
}
.hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(125deg, rgba(10,2,2,.92) 0%, rgba(10,2,2,.7) 50%, rgba(10,2,2,.25) 100%);
}
.hero-inner {
    position: relative;
    z-index: 2;
    padding: 7rem 9%;
    width: 100%;
}
.hero-text { max-width: 72rem; }
.hero-eyebrow {
    font-size: 1.3rem;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: #c9a84c;
    margin-bottom: 1.6rem;
    display: block;
    font-weight: 600;
}
.hero-heading {
    font-family: 'Playfair Display', serif;
    font-size: 5.8rem;
    color: #fff;
    line-height: 1.12;
    margin-bottom: 2rem;
    font-weight: 700;
}
.hero-sub {
    font-size: 1.75rem;
    color: rgba(255,255,255,.8);
    line-height: 1.8;
    max-width: 54rem;
    margin-bottom: 3rem;
}
.hero-ctas { display: flex; flex-wrap: wrap; gap: 1.2rem; margin-bottom: 2.8rem; }
.btn-hero-primary {
    padding: 1.5rem 3.8rem;
    background: #CC0000;
    color: #fff;
    font-size: 1.6rem;
    font-weight: 700;
    border-radius: .6rem;
    text-decoration: none;
    transition: background .2s, transform .2s;
    letter-spacing: .04em;
}
.btn-hero-primary:hover { background: #a80000; transform: translateY(-2px); }
.btn-hero-outline {
    padding: 1.5rem 3.8rem;
    border: 2px solid rgba(255,255,255,.6);
    color: #fff;
    font-size: 1.6rem;
    font-weight: 600;
    border-radius: .6rem;
    text-decoration: none;
    transition: all .2s;
}
.btn-hero-outline:hover { background: rgba(255,255,255,.1); border-color: #fff; }
.hero-trust { display: flex; flex-wrap: wrap; gap: .8rem; }
.trust-pill {
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.22);
    color: rgba(255,255,255,.9);
    font-size: 1.3rem;
    padding: .55rem 1.4rem;
    border-radius: 3rem;
    backdrop-filter: blur(6px);
}

/* ─── TRUST BAR ────────────────────────────────────── */
.trust-bar {
    background: #faf8f4;
    border-top: 4px solid #CC0000;
    border-bottom: 1px solid #ede9e0;
    padding: 4.5rem 9%;
}
.trust-bar-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
}
.trust-stat {
    display: flex;
    align-items: center;
    gap: 1.8rem;
    padding: 1rem 2.5rem;
    border-right: 1px solid #ded9cf;
    position: relative;
}
.trust-stat:last-child { border-right: none; }
.trust-stat-icon {
    font-size: 3.2rem;
    flex-shrink: 0;
    line-height: 1;
}
.trust-stat-body {
    display: flex;
    flex-direction: column;
    gap: .2rem;
}
.trust-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 3.2rem;
    font-weight: 700;
    color: #CC0000;
    line-height: 1;
    letter-spacing: -.02em;
}
.trust-stat-label {
    font-size: 1.45rem;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.3;
}
.trust-stat-sub {
    font-size: 1.2rem;
    color: #888;
}

/* ─── MENU SECTION ─────────────────────────────────── */
.menu-section {
    background: #fff;
    padding: 6rem 9%;
    border-top: 4px solid #CC0000;
}
.menu-section-header {
    text-align: center;
    margin-bottom: 4.5rem;
}
.menu-section-header .section-eyebrow { color: #CC0000; }
.menu-section-header .section-title   { color: #1a1a1a; }
.menu-section-desc {
    font-size: 1.55rem;
    color: #777;
    margin-top: 1rem;
    line-height: 1.7;
}

.cat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.4rem;
}
.cat-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 2.8rem 2.4rem 2.2rem;
    border-radius: 1.4rem;
    text-decoration: none;
    overflow: hidden;
    border: 1px solid #e8e8e8;
    min-height: 16rem;
    box-shadow: 0 2px 14px rgba(0,0,0,.07);
    /* Wide gradient — white → blush → red; slide it on hover */
    background: linear-gradient(135deg, #ffffff 0%, #fff0f0 35%, #ffcccc 60%, #CC0000 100%);
    background-size: 220% 220%;
    background-position: 0% 0%;
    transition: background-position .5s ease, transform .28s ease, box-shadow .28s ease, border-color .28s;
}
.cat-card:hover {
    background-position: 80% 80%;
    transform: translateY(-4px);
    box-shadow: 0 14px 40px rgba(204,0,0,.22);
    border-color: #CC0000;
}
.cat-card::before { display: none; }
.cat-card::after  { display: none; }

.cat-card-emoji {
    font-size: 3.4rem;
    line-height: 1;
    margin-bottom: 1.2rem;
    position: relative; z-index: 1;
}
.cat-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.85rem;
    color: #1a1a1a;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: .4rem;
    position: relative; z-index: 1;
    transition: color .5s ease;
}
.cat-card-count {
    font-size: 1.2rem;
    color: #888;
    position: relative; z-index: 1;
    transition: color .5s ease;
}
.cat-card:hover .cat-card-name  { color: #fff; }
.cat-card:hover .cat-card-count { color: rgba(255,255,255,.75); }

.cat-card-arrow {
    position: absolute;
    bottom: 2rem; right: 2rem;
    font-size: 2rem;
    color: #ddd;
    transition: color .5s ease, right .2s ease;
    z-index: 1;
}
.cat-card:hover .cat-card-arrow {
    color: #fff;
    right: 1.5rem;
}

/* ─── FEATURE SPLIT ────────────────────────────────── */
.feature-split { display: flex; min-height: 58rem; border-top: 4px solid #CC0000; }
.feature-panel {
    flex: 1;
    position: relative;
    display: flex;
    align-items: flex-end;
    padding: 5rem;
    overflow: hidden;
}
.feature-bg-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform .6s ease;
}
.feature-panel:hover .feature-bg-img { transform: scale(1.05); }
.feature-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.82) 0%, rgba(0,0,0,.35) 55%, rgba(0,0,0,.05) 100%);
}
.feature-panel-content {
    position: relative;
    z-index: 2;
    max-width: 46rem;
}
.feature-tag {
    display: inline-block;
    background: #CC0000;
    color: #fff;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: .45rem 1.2rem;
    border-radius: 3rem;
    margin-bottom: 1.4rem;
}
.feature-panel-content h2 {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 1.2rem;
    font-weight: 700;
}
.feature-panel-content p {
    font-size: 1.55rem;
    color: rgba(255,255,255,.78);
    line-height: 1.75;
    margin-bottom: 2.4rem;
}
.btn-feature {
    display: inline-block;
    padding: 1.1rem 2.6rem;
    border: 2px solid rgba(255,255,255,.65);
    color: #fff;
    font-size: 1.45rem;
    font-weight: 600;
    border-radius: .5rem;
    text-decoration: none;
    transition: all .2s;
    letter-spacing: .02em;
}
.btn-feature:hover { background: #CC0000; border-color: #CC0000; }

/* ─── BRIDGE STRIP ────────────────────────────────── */
.bridge-strip {
    background: #fff;
    border-top: 4px solid #CC0000;
    padding: 6rem 9%;
    text-align: center;
}
.bridge-inner { max-width: 82rem; margin: 0 auto; }
.bridge-ornament {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.6rem;
    margin-bottom: 2.8rem;
}
.bridge-line {
    flex: 1;
    max-width: 12rem;
    height: 1px;
    background: linear-gradient(to right, transparent, #CC0000);
}
.bridge-ornament .bridge-line:last-child {
    background: linear-gradient(to left, transparent, #CC0000);
}
.bridge-icon { font-size: 2.6rem; line-height: 1; }
.bridge-heading {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.2;
    margin-bottom: 1.6rem;
}
.bridge-sub {
    font-size: 1.6rem;
    color: #666;
    line-height: 1.8;
    margin-bottom: 0;
}

/* ─── WHY SPIROS ───────────────────────────────────── */
.why-section {
    display: flex;
    flex-wrap: wrap;
    background: #1a1a1a;
    min-height: 58rem;
    overflow: hidden;
    border-top: 4px solid #CC0000;
}
.why-image-col {
    flex: 1 1 44rem;
    min-height: 52rem;
    position: relative;
    overflow: hidden;
}
.why-image-frame { width: 100%; height: 100%; position: relative; }
.why-image-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
.why-image-badge {
    position: absolute;
    bottom: 3rem; left: 3rem;
    background: #CC0000;
    color: #fff;
    padding: 1.6rem 2rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
}
.why-badge-num {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 1;
}
.why-badge-txt {
    display: block;
    font-size: 1.15rem;
    opacity: .88;
    margin-top: .4rem;
    text-transform: uppercase;
    letter-spacing: .1em;
}
.why-content {
    flex: 1 1 44rem;
    padding: 5.5rem 5.5rem 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.why-content .section-eyebrow { color: #c9a84c; margin-bottom: .8rem; }
.why-title {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 2rem;
    font-weight: 700;
}
.why-text {
    font-size: 1.55rem;
    color: rgba(255,255,255,.68);
    line-height: 1.9;
    margin-bottom: 2.8rem;
}
.btn-why {
    display: inline-block;
    padding: 1.2rem 3rem;
    background: #CC0000;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    border-radius: .6rem;
    text-decoration: none;
    width: fit-content;
    margin-bottom: 4rem;
    transition: background .2s, transform .2s;
}
.btn-why:hover { background: #a80000; transform: translateY(-2px); }
.why-pillars {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.4rem;
}
.pillar {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 1rem;
    padding: 1.6rem 1.8rem;
    transition: background .2s;
}
.pillar:hover { background: rgba(204,0,0,.1); border-color: rgba(204,0,0,.25); }
.pillar-icon { font-size: 2.6rem; flex-shrink: 0; }
.pillar-text { display: flex; flex-direction: column; gap: .2rem; }
.pillar-label { font-size: 1.4rem; color: #fff; font-weight: 700; line-height: 1.2; }
.pillar-sub   { font-size: 1.15rem; color: rgba(255,255,255,.5); }

/* ─── REVIEWS CAROUSEL ─────────────────────────────── */
.reviews-section {
    background: #fff;
    padding: 7rem 9% 5rem;
    text-align: center;
    border-top: 4px solid #CC0000;
}
.reviews-header { margin-bottom: 4rem; }
.reviews-title { margin-bottom: 1.5rem; }
.reviews-meta-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .8rem;
}
.reviews-stars { font-size: 2.2rem; color: #f5a623; letter-spacing: .1em; }
.reviews-score { font-size: 1.8rem; font-weight: 700; color: #1a1a1a; }
.reviews-count { font-size: 1.5rem; color: #888; }

.carousel-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    max-width: 86rem;
    margin: 0 auto 2.5rem;
}
.carousel-btn {
    background: none;
    border: 2px solid #ddd;
    color: #666;
    font-size: 3rem;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    cursor: pointer;
    line-height: 1;
    flex-shrink: 0;
    transition: all .2s;
    display: flex;
    align-items: center;
    justify-content: center;
}
.carousel-btn:hover { border-color: #CC0000; color: #CC0000; background: #fff5f5; }
.carousel-stage {
    flex: 1;
    min-height: 22rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.review-card {
    background: #faf8f4;
    border: 1px solid #ede9e0;
    border-radius: 2rem;
    padding: 4rem 4.5rem;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,.06);
}
.review-avatar {
    width: 6rem; height: 6rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #CC0000, #8b0000);
    color: #fff;
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.6rem;
    box-shadow: 0 4px 16px rgba(204,0,0,.25);
}
.review-card-stars { font-size: 2rem; color: #f5a623; letter-spacing: .1em; margin-bottom: 1.8rem; }
.review-quote {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    color: #1a1a1a;
    line-height: 1.5;
    font-style: italic;
    margin-bottom: 2rem;
    font-weight: 400;
}
.review-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .7rem;
    flex-wrap: wrap;
}
.review-name { font-weight: 700; color: #1a1a1a; font-size: 1.5rem; }
.review-sep  { color: #ccc; }
.review-date { color: #888; font-size: 1.4rem; }
.review-via  {
    background: #ebf7ee;
    color: #1a7a3c;
    font-size: 1.15rem;
    font-weight: 700;
    padding: .2rem .9rem;
    border-radius: 3rem;
    margin-left: .4rem;
}

.carousel-dots {
    display: flex;
    justify-content: center;
    gap: .8rem;
    margin-bottom: 3.5rem;
}
.carousel-dot {
    width: 1rem; height: 1rem;
    border-radius: 50%;
    background: #ddd;
    border: none;
    cursor: pointer;
    transition: all .2s;
    padding: 0;
}
.carousel-dot.active {
    background: #CC0000;
    width: 2.8rem;
    border-radius: .5rem;
}

.reviews-cta { text-align: center; }
.btn-ue {
    display: inline-block;
    padding: 1.3rem 3.5rem;
    background: #06C167;
    color: #fff;
    font-size: 1.6rem;
    font-weight: 700;
    border-radius: .6rem;
    text-decoration: none;
    transition: background .2s, transform .2s;
    letter-spacing: .02em;
}
.btn-ue:hover { background: #05a356; transform: translateY(-2px); }

/* ─── REVIEW TRANSITION ────────────────────────────── */
.rfade-enter-active,
.rfade-leave-active { transition: opacity .35s ease, transform .35s ease; }
.rfade-enter-from   { opacity: 0; transform: translateX(20px); }
.rfade-leave-to     { opacity: 0; transform: translateX(-20px); }

/* ─── RESPONSIVE ───────────────────────────────────── */
@media (max-width: 1100px) {
    .trust-bar-grid { grid-template-columns: repeat(2, 1fr); }
    .trust-stat:nth-child(2) { border-right: none; }
    .trust-stat { padding: 1.5rem 2rem; border-bottom: 1px solid #ded9cf; }
    .trust-stat:nth-child(3), .trust-stat:nth-child(4) { border-bottom: none; }
    .cat-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
    .hero-heading      { font-size: 4.2rem; }
    .feature-split     { flex-direction: column; }
    .feature-panel     { min-height: 40rem; padding: 4rem; }
    .bridge-heading    { font-size: 3rem; }
    .bridge-sub        { font-size: 1.45rem; }
    .why-section       { flex-direction: column; }
    .why-image-col     { min-height: 32rem; }
    .why-content       { padding: 4.5rem 5%; }
    .cat-grid          { grid-template-columns: repeat(2, 1fr); }
    .carousel-wrap     { gap: 1.2rem; }
    .review-card       { padding: 3rem 2.5rem; }
    .review-quote      { font-size: 2rem; }
}
@media (max-width: 600px) {
    .hero-heading      { font-size: 3.2rem; }
    .hero-sub          { font-size: 1.55rem; }
    .bridge-heading    { font-size: 2.6rem; }
    .trust-bar-grid    { grid-template-columns: 1fr 1fr; }
    .trust-stat-num    { font-size: 2.6rem; }
    .cat-grid          { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .cat-card          { padding: 2rem 1.6rem; min-height: 12rem; }
    .cat-card-emoji    { font-size: 2.8rem; }
    .cat-card-name     { font-size: 1.55rem; }
    .feature-panel-content h2 { font-size: 3rem; }
    .why-pillars       { grid-template-columns: 1fr; }
    .why-title         { font-size: 3.2rem; }
    .reviews-section   { padding: 5rem 5%; }
    .carousel-btn      { width: 4rem; height: 4rem; font-size: 2.4rem; }
    .review-quote      { font-size: 1.8rem; }
}
</style>
