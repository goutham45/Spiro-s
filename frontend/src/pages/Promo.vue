<template>
    <div class="promo-page">

        <!-- ═══ PAGE HEADER ════════════════════════════════════ -->
        <div class="page-header">
            <p class="page-eyebrow">Save more every visit</p>
            <h1 class="page-title">Deals &amp; Specials</h1>
            <p class="page-subtitle">Exclusive offers for our Brooklyn family — fresh deals every day.</p>
        </div>

        <!-- ═══ ACTIVE DEALS GRID ═════════════════════════════ -->
        <section class="section deals-section">
            <div class="section-header">
                <p class="section-eyebrow">Limited time offers</p>
                <h2 class="section-title">Current Promotions</h2>
            </div>
            <div class="deals-grid">
                <div class="deal-card" v-for="deal in activeDeals" :key="deal.id">
                    <div class="deal-img-wrap">
                        <img :src="deal.img" :alt="deal.title" class="deal-img" />
                        <div class="deal-img-overlay"></div>
                        <div class="deal-discount-badge">{{ deal.discount }}</div>
                    </div>
                    <div class="deal-body">
                        <span class="deal-tag">{{ deal.tag }}</span>
                        <h3 class="deal-title">{{ deal.title }}</h3>
                        <ul class="deal-list">
                            <li v-for="pt in deal.points" :key="pt">{{ pt }}</li>
                        </ul>
                        <div class="deal-footer">
                            <div class="deal-validity">
                                <span class="validity-icon">🕐</span>
                                <span>{{ deal.validity }}</span>
                            </div>
                            <router-link to="/menu" @click="top" class="btn-deal">Order Now</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══ WEEKLY SCHEDULE ════════════════════════════════ -->
        <section class="schedule-section">
            <div class="schedule-header">
                <p class="sch-eyebrow">Every week, all year round</p>
                <h2 class="sch-title">Weekly Deals Schedule</h2>
                <p class="sch-subtitle">Plan your visit around our recurring specials. More savings, every day.</p>
            </div>

            <div class="schedule-grid">
                <div class="sch-col" v-for="day in schedule" :key="day.day">
                    <div class="sch-day-header" :class="{ weekend: day.isWeekend }">
                        {{ day.day }}
                    </div>
                    <div class="sch-slots">
                        <div
                            v-for="slot in day.slots"
                            :key="slot.time"
                            class="sch-slot"
                            :class="slot.type">
                            <span class="slot-time">{{ slot.time }}</span>
                            <span class="slot-name">{{ slot.name }}</span>
                            <span class="slot-offer">{{ slot.offer }}</span>
                        </div>
                        <div v-if="day.slots.length === 0" class="sch-empty">Regular Hours</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══ COMBO DEALS ════════════════════════════════════ -->
        <section class="section combos-section">
            <div class="section-header">
                <p class="section-eyebrow">Great value bundles</p>
                <h2 class="section-title">Combo Meals</h2>
            </div>
            <div class="combos-grid">
                <div class="combo-card" v-for="c in combos" :key="c.name">
                    <div class="combo-emoji">{{ c.emoji }}</div>
                    <div class="combo-info">
                        <h3>{{ c.name }}</h3>
                        <p>{{ c.desc }}</p>
                    </div>
                    <div class="combo-price">
                        <span class="combo-was">{{ c.was }}</span>
                        <span class="combo-now">{{ c.now }}</span>
                    </div>
                    <router-link to="/menu" @click="top" class="combo-btn">Order</router-link>
                </div>
            </div>
        </section>

        <!-- ═══ LOYALTY CTA ════════════════════════════════════ -->
        <section class="loyalty-section">
            <div class="loyalty-inner">
                <div class="loyalty-left">
                    <img src="../assets/images/chef.png" alt="Chef at Spiros" class="loyalty-chef" />
                </div>
                <div class="loyalty-right">
                    <p class="loyalty-eyebrow">Order online today</p>
                    <h2 class="loyalty-title">Get More When You Order Online</h2>
                    <p class="loyalty-desc">Skip the line, track your order, and unlock exclusive online-only
                        deals. Order direct or through Uber Eats — always fresh, always fast.</p>
                    <div class="loyalty-actions">
                        <router-link to="/menu" @click="top" class="btn-loyalty-primary">Order Now →</router-link>
                        <a href="https://www.ubereats.com/store/spiros-restaurant/peYDfzFtU2WrcBxQQu2e9w"
                           target="_blank" rel="noopener" class="btn-loyalty-outline">⭐ Find us on Uber Eats</a>
                    </div>
                    <div class="loyalty-perks">
                        <span class="perk">✓ No minimum order</span>
                        <span class="perk">✓ Real-time tracking</span>
                        <span class="perk">✓ Easy reorder</span>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
export default {
    name: "Promo",
    methods: {
        top() { window.scrollTo(0, 0); }
    },
    data() {
        return {
            activeDeals: [
                {
                    id: 1,
                    img: require("../assets/images/dis-1.jpg"),
                    discount: "10% OFF",
                    tag: "🍳 Daily Breakfast",
                    title: "Early Bird Breakfast Special",
                    points: [
                        "10% off entire breakfast order",
                        "Every day, 7:00 am – 9:00 am",
                        "Dine-in and delivery",
                    ],
                    validity: "Daily · 7am – 9am",
                },
                {
                    id: 2,
                    img: require("../assets/images/blog-1.jpg"),
                    discount: "FREE DRINK",
                    tag: "☀️ Mon, Wed, Fri",
                    title: "Happy Lunch Deal",
                    points: [
                        "Free fountain drink with any entrée",
                        "Monday, Wednesday & Friday only",
                        "10:00 am – 2:00 pm",
                    ],
                    validity: "Mon / Wed / Fri · 10am – 2pm",
                },
                {
                    id: 3,
                    img: require("../assets/images/dis-3.jpg"),
                    discount: "15% OFF",
                    tag: "🌙 Weekend Evenings",
                    title: "Happy Dinner Special",
                    points: [
                        "15% off all dinner entrées",
                        "Friday, Saturday & Sunday",
                        "6:00 pm – closing",
                    ],
                    validity: "Fri–Sun · 6pm – Close",
                },
            ],
            schedule: [
                {
                    day: "Mon",
                    isWeekend: false,
                    slots: [
                        { time: "7–9am",    name: "Early Bird",   offer: "10% Off Breakfast", type: "slot-brown" },
                        { time: "10am–2pm", name: "Happy Lunch",  offer: "Free Drink",        type: "slot-beige" },
                    ],
                },
                {
                    day: "Tue",
                    isWeekend: false,
                    slots: [
                        { time: "7–9am",    name: "Early Bird",   offer: "10% Off Breakfast", type: "slot-brown" },
                        { time: "3–5pm",    name: "Afternoon",    offer: "20% Off Desserts",  type: "slot-earth" },
                    ],
                },
                {
                    day: "Wed",
                    isWeekend: false,
                    slots: [
                        { time: "7–9am",    name: "Early Bird",   offer: "10% Off Breakfast", type: "slot-brown" },
                        { time: "10am–2pm", name: "Happy Lunch",  offer: "Free Drink",        type: "slot-beige" },
                    ],
                },
                {
                    day: "Thu",
                    isWeekend: false,
                    slots: [
                        { time: "7–9am",    name: "Early Bird",   offer: "10% Off Breakfast", type: "slot-brown" },
                        { time: "3–5pm",    name: "Afternoon",    offer: "20% Off Desserts",  type: "slot-earth" },
                    ],
                },
                {
                    day: "Fri",
                    isWeekend: false,
                    slots: [
                        { time: "7–9am",    name: "Early Bird",   offer: "10% Off Breakfast", type: "slot-brown" },
                        { time: "10am–2pm", name: "Happy Lunch",  offer: "Free Drink",        type: "slot-beige" },
                        { time: "6pm–Close",name: "Happy Dinner", offer: "15% Off Dinner",   type: "slot-green" },
                    ],
                },
                {
                    day: "Sat",
                    isWeekend: true,
                    slots: [
                        { time: "6pm–Close",name: "Happy Dinner", offer: "15% Off Dinner",   type: "slot-green" },
                    ],
                },
                {
                    day: "Sun",
                    isWeekend: true,
                    slots: [
                        { time: "6pm–Close",name: "Happy Dinner", offer: "15% Off Dinner",   type: "slot-green" },
                    ],
                },
            ],
            combos: [
                { emoji: "🍳", name: "Breakfast Combo",    desc: "2 eggs + toast + home fries + coffee",             was: "$14.50", now: "$11.95" },
                { emoji: "🥙", name: "Greek Plate",        desc: "Gyro platter + Greek salad + pita",               was: "$22.00", now: "$17.95" },
                { emoji: "🍔", name: "Burger & Fries",     desc: "Any classic burger + french fries + soda",        was: "$18.00", now: "$14.95" },
                { emoji: "🥗", name: "Lunch Special",      desc: "Any sandwich + side salad or home fries",         was: "$16.00", now: "$12.95" },
            ],
        };
    },
};
</script>

<style scoped>

/* ── Base ─────────────────────────────────────────── */
.promo-page { background: #fff; }
.section    { padding: 6rem 9%; }

.section-header  { text-align: center; margin-bottom: 4rem; }
.section-eyebrow { font-size: 1.4rem; color: #CC0000; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin-bottom: .6rem; }
.section-title   { font-family: 'Playfair Display', serif; font-size: 3.4rem; color: #1a1a1a; }

/* ── PAGE HEADER ──────────────────────────────────── */
.page-header {
    background: #CC0000;
    padding: 5rem 9%;
    text-align: center;
}
.page-eyebrow  { font-size: 1.3rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.75); margin-bottom: 1rem; }
.page-title    { font-family: 'Playfair Display', serif; font-size: 5rem; color: #fff; margin-bottom: 1rem; font-weight: 700; }
.page-subtitle { font-size: 1.8rem; color: rgba(255,255,255,.8); }

/* ── DEALS GRID ───────────────────────────────────── */
.deals-section { background: #fafafa; }
.deals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(32rem, 1fr));
    gap: 2.8rem;
}
.deal-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 1.6rem;
    overflow: hidden;
    transition: transform .25s, box-shadow .25s;
    display: flex;
    flex-direction: column;
}
.deal-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(204,0,0,.14);
    border-color: #CC0000;
}
.deal-img-wrap {
    position: relative;
    height: 22rem;
    overflow: hidden;
}
.deal-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
.deal-card:hover .deal-img { transform: scale(1.06); }
.deal-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.4) 0%, transparent 60%);
}
.deal-discount-badge {
    position: absolute;
    top: 1.5rem; right: 1.5rem;
    background: #CC0000;
    color: #fff;
    font-size: 1.6rem;
    font-weight: 900;
    padding: .6rem 1.4rem;
    border-radius: .8rem;
    letter-spacing: .05em;
    box-shadow: 0 4px 12px rgba(0,0,0,.25);
}
.deal-body {
    padding: 2.4rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .8rem;
}
.deal-tag {
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #CC0000;
}
.deal-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    color: #1a1a1a;
    line-height: 1.3;
    margin-bottom: .4rem;
}
.deal-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: .6rem;
    flex: 1;
}
.deal-list li {
    font-size: 1.45rem;
    color: #555;
    padding-left: 2rem;
    position: relative;
    line-height: 1.5;
}
.deal-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #15803d;
    font-weight: 700;
}
.deal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #f0f0f0;
    flex-wrap: wrap;
    gap: 1rem;
}
.deal-validity {
    display: flex;
    align-items: center;
    gap: .5rem;
    font-size: 1.3rem;
    color: #999;
}
.validity-icon { font-size: 1.4rem; }
.btn-deal {
    padding: .9rem 2.2rem;
    background: #CC0000;
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
    border-radius: .6rem;
    text-decoration: none;
    transition: background .2s;
}
.btn-deal:hover { background: #a30000; }

/* ── WEEKLY SCHEDULE ──────────────────────────────── */
.schedule-section {
    background: #1a1a1a;
    padding: 6rem 9%;
}
.schedule-header { text-align: center; margin-bottom: 4rem; }
.sch-eyebrow { font-size: 1.4rem; color: #CC0000; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin-bottom: .8rem; }
.sch-title   { font-family: 'Playfair Display', serif; font-size: 3.4rem; color: #fff; margin-bottom: 1rem; }
.sch-subtitle { font-size: 1.5rem; color: rgba(255,255,255,.6); }

.schedule-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1.2rem;
}
.sch-col { display: flex; flex-direction: column; gap: .8rem; }
.sch-day-header {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: rgba(255,255,255,.9);
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: .8rem;
    padding: .9rem .5rem;
    text-transform: uppercase;
    letter-spacing: .06em;
}
.sch-day-header.weekend { background: rgba(204,0,0,.2); border-color: rgba(204,0,0,.3); color: #ff6b6b; }
.sch-slots { display: flex; flex-direction: column; gap: .6rem; }
.sch-slot {
    border-radius: .8rem;
    padding: 1rem .8rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: .3rem;
}
.sch-empty {
    text-align: center;
    font-size: 1.2rem;
    color: rgba(255,255,255,.3);
    padding: 1rem;
    border: 1px dashed rgba(255,255,255,.1);
    border-radius: .8rem;
    font-style: italic;
}
.slot-time  { font-size: 1.05rem; font-weight: 700; opacity: .85; }
.slot-name  { font-size: 1.2rem; font-weight: 700; }
.slot-offer { font-size: 1.1rem; opacity: .85; }
/* Slot colours */
.slot-brown { background: rgba(135,100,69,.35); border: 1px solid rgba(135,100,69,.6); color: #f5dbc0; }
.slot-beige { background: rgba(202,149,92,.35); border: 1px solid rgba(202,149,92,.6); color: #fde8c4; }
.slot-earth { background: rgba(180,150,80,.35); border: 1px solid rgba(180,150,80,.6); color: #fde8c4; }
.slot-green { background: rgba(118,186,153,.3); border: 1px solid rgba(118,186,153,.5); color: #a7f3c8; }

/* ── COMBO MEALS ──────────────────────────────────── */
.combos-section { background: #fff; }
.combos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(26rem, 1fr));
    gap: 2rem;
}
.combo-card {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 1.2rem;
    padding: 2rem;
    transition: all .2s;
}
.combo-card:hover {
    border-color: #CC0000;
    box-shadow: 0 8px 24px rgba(204,0,0,.1);
    transform: translateY(-2px);
}
.combo-emoji { font-size: 3rem; flex-shrink: 0; }
.combo-info  { flex: 1; }
.combo-info h3 { font-size: 1.6rem; font-weight: 700; color: #1a1a1a; margin-bottom: .3rem; }
.combo-info p  { font-size: 1.3rem; color: #777; line-height: 1.5; }
.combo-price   { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; }
.combo-was     { font-size: 1.2rem; color: #aaa; text-decoration: line-through; }
.combo-now     { font-size: 2rem; font-weight: 800; color: #CC0000; }
.combo-btn {
    padding: .7rem 1.6rem;
    background: #CC0000;
    color: #fff;
    font-size: 1.3rem;
    font-weight: 700;
    border-radius: .5rem;
    text-decoration: none;
    flex-shrink: 0;
    transition: background .2s;
}
.combo-btn:hover { background: #a30000; }

/* ── LOYALTY CTA ──────────────────────────────────── */
.loyalty-section {
    background: linear-gradient(135deg, #fff5f5 0%, #ffecec 100%);
    border-top: 2px solid #ffe0e0;
    padding: 6rem 9%;
}
.loyalty-inner {
    display: flex;
    align-items: center;
    gap: 5rem;
    flex-wrap: wrap;
    max-width: 120rem;
    margin: 0 auto;
}
.loyalty-left { flex: 0 0 20rem; display: flex; justify-content: center; }
.loyalty-chef { width: 18rem; filter: drop-shadow(0 8px 20px rgba(0,0,0,.15)); }
.loyalty-right { flex: 1 1 40rem; }
.loyalty-eyebrow { font-size: 1.4rem; color: #CC0000; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin-bottom: 1rem; }
.loyalty-title   { font-family: 'Playfair Display', serif; font-size: 3.2rem; color: #1a1a1a; line-height: 1.25; margin-bottom: 1.5rem; }
.loyalty-desc    { font-size: 1.5rem; color: #555; line-height: 1.8; margin-bottom: 2.5rem; }
.loyalty-actions { display: flex; flex-wrap: wrap; gap: 1.2rem; margin-bottom: 2rem; }
.btn-loyalty-primary {
    padding: 1.3rem 3rem;
    background: #CC0000;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    border-radius: .6rem;
    text-decoration: none;
    transition: background .2s;
}
.btn-loyalty-primary:hover { background: #a30000; }
.btn-loyalty-outline {
    padding: 1.3rem 3rem;
    border: 2px solid #CC0000;
    color: #CC0000;
    font-size: 1.5rem;
    font-weight: 700;
    border-radius: .6rem;
    text-decoration: none;
    background: transparent;
    transition: all .2s;
}
.btn-loyalty-outline:hover { background: #CC0000; color: #fff; }
.loyalty-perks { display: flex; flex-wrap: wrap; gap: 1.5rem; }
.perk { font-size: 1.4rem; color: #15803d; font-weight: 600; }

/* ── RESPONSIVE ───────────────────────────────────── */
@media (max-width: 1000px) {
    .schedule-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 700px) {
    .schedule-grid { grid-template-columns: repeat(2, 1fr); }
    .loyalty-left  { display: none; }
    .page-title    { font-size: 3.6rem; }
}
@media (max-width: 500px) {
    .schedule-grid { grid-template-columns: 1fr; }
    .combo-card    { flex-wrap: wrap; }
    .section       { padding: 4rem 5%; }
}
</style>
