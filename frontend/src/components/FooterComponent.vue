<template>
    <footer class="site-footer">

        <!-- Top band -->
        <div class="footer-top">
            <div class="footer-brand">
                <span class="footer-logo-icon">🍽</span>
                <span class="footer-logo-name">Spiros</span>
                <p class="footer-tagline">Brooklyn's Favourite Greek &amp; American Diner since 1985.</p>
                <div class="footer-social">
                    <a href="https://www.facebook.com/" target="_blank" aria-label="Facebook" class="social-btn fab fa-facebook-f"></a>
                    <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram" class="social-btn fab fa-instagram"></a>
                    <a href="https://twitter.com/" target="_blank" aria-label="Twitter" class="social-btn fab fa-twitter"></a>
                </div>
            </div>

            <div class="footer-col">
                <h4 class="footer-col-title">Our Menu</h4>
                <router-link @click="scrollToTop()" to="/menu">Breakfast</router-link>
                <router-link @click="scrollToTop()" to="/menu">Greek Specialties</router-link>
                <router-link @click="scrollToTop()" to="/menu">Burgers &amp; Beef</router-link>
                <router-link @click="scrollToTop()" to="/menu">Salads</router-link>
                <router-link @click="scrollToTop()" to="/menu">Seafood</router-link>
                <router-link @click="scrollToTop()" to="/menu">Desserts</router-link>
            </div>

            <div class="footer-col">
                <h4 class="footer-col-title">Quick Links</h4>
                <router-link @click="scrollToTop()" to="/">Home</router-link>
                <router-link @click="scrollToTop()" to="/about">About Us</router-link>
                <router-link @click="scrollToTop()" to="/promotions">Promotions</router-link>
                <router-link @click="scrollToTop()" to="/menu">Menu</router-link>
                <router-link @click="scrollToTop()" to="/table">Reservations</router-link>
                <router-link @click="scrollToTop()" to="/login" v-if="!user">Login</router-link>
                <router-link @click="scrollToTop()" to="/myorder" v-if="user">My Orders</router-link>
            </div>

            <div class="footer-col">
                <h4 class="footer-col-title">Visit Us</h4>
                <p class="footer-contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    2103 Avenue U<br>Brooklyn, NY 11229
                </p>
                <p class="footer-contact-item">
                    <i class="fas fa-phone"></i>
                    (718) 891-9843
                </p>
                <p class="footer-contact-item">
                    <i class="fas fa-clock"></i>
                    Mon–Thu: 7am – 6pm<br>
                    Fri–Sun: 7am – 7pm
                </p>
                <p class="footer-contact-item">
                    <i class="fab fa-uber"></i>
                    Also on Uber Eats · ⭐ 4.9
                </p>
            </div>
        </div>

        <!-- Newsletter strip -->
        <div class="footer-newsletter">
            <span class="newsletter-label">Get weekly specials &amp; deals →</span>
            <form class="newsletter-form" onsubmit="event.preventDefault()">
                <input type="email" placeholder="Your email address" />
                <button type="submit">Subscribe</button>
            </form>
        </div>

        <!-- Bottom bar -->
        <div class="footer-bottom">
            <p class="footer-copy">© {{ year }} Spiros Greek &amp; American Diner · Sheepshead Bay, Brooklyn, NY</p>
            <p class="footer-attr">Made with ❤️ for Brooklyn</p>
        </div>

    </footer>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'FooterComponent',
    computed: {
        ...mapState(['user']),
        year() { return new Date().getFullYear(); },
    },
    methods: {
        scrollToTop() { window.scrollTo(0, 0); }
    }
};
</script>

<style scoped>
.site-footer {
    background: #1a1a1a;
    color: #bbb;
    font-size: 1.4rem;
    border-top: 4px solid #CC0000;
}

/* ── TOP BAND ───────────────────────────────── */
.footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.4fr;
    gap: 4rem;
    padding: 5.5rem 9% 4.5rem;
    border-bottom: 1px solid rgba(255,255,255,.08);
}

/* Brand col */
.footer-brand { display: flex; flex-direction: column; gap: 1rem; }
.footer-logo-icon { font-size: 2.4rem; }
.footer-logo-name {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-weight: 700;
    color: #CC0000;
    line-height: 1;
}
.footer-tagline {
    font-size: 1.35rem;
    color: rgba(255,255,255,.5);
    line-height: 1.6;
    max-width: 28rem;
    margin-top: .4rem;
}
.footer-social { display: flex; gap: .8rem; margin-top: .8rem; }
.social-btn {
    width: 3.8rem; height: 3.8rem;
    border-radius: .6rem;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.7);
    font-size: 1.5rem;
    display: flex; align-items: center; justify-content: center;
    transition: all .2s;
    text-decoration: none;
    line-height: 3.8rem;
    text-align: center;
}
.social-btn:hover { background: #CC0000; border-color: #CC0000; color: #fff; }

/* Nav columns */
.footer-col { display: flex; flex-direction: column; gap: .1rem; }
.footer-col-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1.4rem;
    padding-bottom: .8rem;
    border-bottom: 2px solid #CC0000;
    display: inline-block;
}
.footer-col a {
    color: rgba(255,255,255,.55);
    text-decoration: none;
    padding: .45rem 0;
    transition: color .2s, padding-left .2s;
    display: block;
}
.footer-col a:hover { color: #CC0000; padding-left: .5rem; }

/* Contact col */
.footer-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    color: rgba(255,255,255,.55);
    padding: .6rem 0;
    line-height: 1.55;
}
.footer-contact-item i {
    color: #CC0000;
    margin-top: .2rem;
    flex-shrink: 0;
    width: 1.6rem;
}

/* ── NEWSLETTER STRIP ───────────────────────── */
.footer-newsletter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 2.5rem 9%;
    background: rgba(204,0,0,.08);
    border-bottom: 1px solid rgba(255,255,255,.06);
    flex-wrap: wrap;
}
.newsletter-label {
    font-size: 1.45rem;
    color: rgba(255,255,255,.75);
    font-weight: 500;
}
.newsletter-form {
    display: flex;
    border-radius: .5rem;
    overflow: hidden;
    flex: 0 1 42rem;
}
.newsletter-form input {
    flex: 1;
    padding: 1rem 1.4rem;
    font-size: 1.4rem;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    border-right: none;
    color: #fff;
    outline: none;
}
.newsletter-form input::placeholder { color: rgba(255,255,255,.35); }
.newsletter-form button {
    padding: 1rem 2.2rem;
    background: #CC0000;
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: background .2s;
    white-space: nowrap;
}
.newsletter-form button:hover { background: #a80000; }

/* ── BOTTOM BAR ─────────────────────────────── */
.footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 9%;
    gap: 1rem;
    flex-wrap: wrap;
}
.footer-copy  { font-size: 1.3rem; color: rgba(255,255,255,.35); }
.footer-attr  { font-size: 1.3rem; color: rgba(255,255,255,.3); }

/* ── RESPONSIVE ─────────────────────────────── */
@media (max-width: 1000px) {
    .footer-top { grid-template-columns: 1fr 1fr; gap: 3rem; }
}
@media (max-width: 600px) {
    .footer-top { grid-template-columns: 1fr; gap: 2.5rem; padding: 4rem 5% 3rem; }
    .footer-newsletter { flex-direction: column; align-items: flex-start; padding: 2rem 5%; }
    .newsletter-form { flex: 1; width: 100%; }
    .footer-bottom { flex-direction: column; text-align: center; padding: 1.8rem 5%; }
}
</style>
