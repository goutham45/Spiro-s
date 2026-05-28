<template>
    <!-- ── HERO ───────────────────────────────────────────────── -->
    <section class="res-hero">
        <div class="res-hero-inner">
            <p class="res-hero-eyebrow">Reserve Your Table</p>
            <h1 class="res-hero-title">Join Us for a Meal to Remember</h1>
            <p class="res-hero-sub">Dine-in reservations · Breakfast through dinner · Brooklyn, NY</p>
            <div class="res-hero-pills">
                <span>🕐 Mon–Thu: 7am – 6pm</span>
                <span>🕐 Fri–Sun: 7am – 7pm</span>
                <span>📍 2103 Avenue U, Brooklyn</span>
                <span>📞 (718) 891-9843</span>
            </div>
        </div>
    </section>

    <!-- ── MAIN CONTENT ───────────────────────────────────────── -->
    <section class="res-section">

        <!-- STEP INDICATOR -->
        <div class="res-steps">
            <div :class="['res-step', step >= 1 ? 'active' : '', step > 1 ? 'done' : '']">
                <div class="step-circle">{{ step > 1 ? '✓' : '1' }}</div>
                <span>Your Details</span>
            </div>
            <div class="step-connector" :class="{ active: step >= 2 }"></div>
            <div :class="['res-step', step >= 2 ? 'active' : '', step > 2 ? 'done' : '']">
                <div class="step-circle">{{ step > 2 ? '✓' : '2' }}</div>
                <span>Date &amp; Time</span>
            </div>
            <div class="step-connector" :class="{ active: step >= 3 }"></div>
            <div :class="['res-step', step >= 3 ? 'active' : '']">
                <div class="step-circle">3</div>
                <span>Confirmed!</span>
            </div>
        </div>

        <!-- ── STEP 1 ────────────────────────────────────────── -->
        <transition name="slide" mode="out-in">
        <div class="res-card" v-if="step === 1" key="step1">
            <h2 class="card-title">Tell Us About Yourself</h2>
            <p class="card-sub">We'll send your confirmation to the email provided.</p>

            <div class="field-grid">
                <div class="field-wrap">
                    <label>Full Name <span class="req">*</span></label>
                    <input type="text" v-model="form.name" placeholder="e.g. Maria Papadopoulos"
                        :class="{ 'err-input': errors.name }" @input="errors.name = ''" />
                    <p class="field-err" v-if="errors.name">{{ errors.name }}</p>
                </div>
                <div class="field-wrap">
                    <label>Email Address <span class="req">*</span></label>
                    <input type="email" v-model="form.email" placeholder="you@example.com"
                        :class="{ 'err-input': errors.email }" @input="errors.email = ''" />
                    <p class="field-err" v-if="errors.email">{{ errors.email }}</p>
                </div>
                <div class="field-wrap">
                    <label>Phone Number <span class="req">*</span></label>
                    <input type="tel" v-model="form.phone" placeholder="(718) 000-0000"
                        :class="{ 'err-input': errors.phone }" @input="errors.phone = ''" />
                    <p class="field-err" v-if="errors.phone">{{ errors.phone }}</p>
                </div>
                <div class="field-wrap">
                    <label>Party Size <span class="req">*</span></label>
                    <div class="party-picker">
                        <button type="button" @click="adjustParty(-1)" :disabled="form.people <= 1">−</button>
                        <span class="party-num">{{ form.people }}</span>
                        <button type="button" @click="adjustParty(1)" :disabled="form.people >= 20">+</button>
                    </div>
                    <p class="field-hint">{{ form.people }} {{ form.people === 1 ? 'guest' : 'guests' }} · {{ tablesNeeded }} {{ tablesNeeded === 1 ? 'table' : 'tables' }} estimated</p>
                </div>
            </div>

            <div class="field-wrap full-width">
                <label>Special Requests <span class="optional">(optional)</span></label>
                <textarea v-model="form.note" rows="3"
                    placeholder="Allergies, celebrations, seating preferences, high chairs…"></textarea>
            </div>

            <div class="card-footer">
                <button class="btn-next" @click="goStep2">Next: Choose Date &amp; Time →</button>
            </div>
        </div>
        </transition>

        <!-- ── STEP 2 ────────────────────────────────────────── -->
        <transition name="slide" mode="out-in">
        <div class="res-card" v-if="step === 2" key="step2">
            <h2 class="card-title">Choose Your Date &amp; Time</h2>
            <p class="card-sub">Select any available slot up to 60 days in advance.</p>

            <!-- Date picker row -->
            <div class="date-row">
                <div class="field-wrap">
                    <label>Date <span class="req">*</span></label>
                    <input type="date" v-model="form.date" :min="minDate" :max="maxDate"
                        :class="{ 'err-input': errors.date }" @change="errors.date = ''; form.time = ''" />
                    <p class="field-err" v-if="errors.date">{{ errors.date }}</p>
                </div>
                <div class="field-wrap" v-if="form.date">
                    <label>Day Info</label>
                    <div class="day-badge">
                        <span class="day-name">{{ selectedDayName }}</span>
                        <span class="day-hours">Open {{ selectedDayHours }}</span>
                    </div>
                </div>
            </div>

            <!-- Time slots -->
            <div v-if="form.date" class="time-section">
                <label class="time-label">Available Time Slots <span class="req">*</span></label>
                <p class="field-err" v-if="errors.time">{{ errors.time }}</p>
                <div class="time-grid">
                    <button type="button"
                        v-for="slot in timeSlots"
                        :key="slot"
                        :class="['time-btn', form.time === slot ? 'selected' : '']"
                        @click="form.time = slot; errors.time = ''">
                        {{ slot }}
                    </button>
                </div>
            </div>

            <!-- Booking summary -->
            <div class="summary-box" v-if="form.date && form.time">
                <div class="summary-row"><span>👤</span><strong>{{ form.name }}</strong></div>
                <div class="summary-row"><span>📅</span><strong>{{ selectedDayName }}, {{ formattedDate }} at {{ form.time }}</strong></div>
                <div class="summary-row"><span>👥</span><strong>{{ form.people }} {{ form.people === 1 ? 'guest' : 'guests' }}</strong></div>
                <div class="summary-row" v-if="form.note"><span>📝</span><em>{{ form.note }}</em></div>
            </div>

            <div class="card-footer">
                <button class="btn-back" @click="step = 1">← Back</button>
                <button class="btn-next" @click="submitBooking" :disabled="submitting">
                    <span v-if="!submitting">Confirm Reservation ✓</span>
                    <span v-else class="spinner-inline">Booking…</span>
                </button>
            </div>

            <p class="field-err center-err" v-if="errors.submit">{{ errors.submit }}</p>
        </div>
        </transition>

        <!-- ── STEP 3 CONFIRMATION ─────────────────────────── -->
        <transition name="slide" mode="out-in">
        <div class="res-card confirm-card" v-if="step === 3" key="step3">
            <div class="confirm-icon">🎉</div>
            <h2 class="confirm-title">You're All Set!</h2>
            <p class="confirm-sub">Your table is reserved. A confirmation email has been sent to<br>
                <strong>{{ form.email }}</strong></p>

            <div class="confirm-details">
                <div class="cd-row"><span class="cd-icon">📅</span><div><p class="cd-label">Date &amp; Time</p><p class="cd-val">{{ selectedDayName }}, {{ formattedDate }} at {{ form.time }}</p></div></div>
                <div class="cd-row"><span class="cd-icon">👥</span><div><p class="cd-label">Party Size</p><p class="cd-val">{{ form.people }} {{ form.people === 1 ? 'guest' : 'guests' }}</p></div></div>
                <div class="cd-row"><span class="cd-icon">📍</span><div><p class="cd-label">Location</p><p class="cd-val">2103 Avenue U, Brooklyn, NY 11229</p></div></div>
                <div class="cd-row"><span class="cd-icon">📞</span><div><p class="cd-label">Need to change?</p><p class="cd-val">(718) 891-9843</p></div></div>
            </div>

            <button class="btn-new" @click="resetForm">Make Another Reservation</button>
        </div>
        </transition>

    </section>

    <!-- ── MAP ───────────────────────────────────────────────── -->
    <section class="map-section">
        <div class="map-info">
            <h3 class="map-heading">Find Us in Brooklyn</h3>
            <p class="map-addr">2103 Avenue U · Sheepshead Bay · Brooklyn, NY 11229</p>
            <ul class="map-details">
                <li><i class="fas fa-clock"></i> Mon–Thu: 7am – 6pm</li>
                <li><i class="fas fa-clock"></i> Fri–Sun: 7am – 7pm</li>
                <li><i class="fas fa-phone"></i> (718) 891-9843</li>
                <li><i class="fab fa-uber"></i> Also on Uber Eats · ⭐ 4.9</li>
            </ul>
        </div>
        <div class="map-embed">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3028.3!2d-73.9478!3d40.5982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c244b3e6f3e4a9%3A0x8a1eae0bbeb7dfab!2s2103%20Avenue%20U%2C%20Brooklyn%2C%20NY%2011229!5e0!3m2!1sen!2sus!4v1700000000000"
                loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
    </section>
</template>

<script>
import axios from "axios";

export default {
    name: "Table",

    data() {
        return {
            step: 1,
            submitting: false,

            form: {
                name:  "",
                email: "",
                phone: "",
                people: 2,
                note:  "",
                date:  "",
                time:  "",
            },
            errors: {
                name: "", email: "", phone: "",
                date: "", time: "", submit: "",
            },
        };
    },

    computed: {
        // ── Date range ───────────────────────────────────────
        minDate() {
            const d = new Date();
            d.setDate(d.getDate() + 1); // no same-day booking
            return d.toISOString().split("T")[0];
        },
        maxDate() {
            const d = new Date();
            d.setDate(d.getDate() + 60);
            return d.toISOString().split("T")[0];
        },

        // ── Selected date details ────────────────────────────
        selectedDayName() {
            if (!this.form.date) return "";
            const d = new Date(this.form.date + "T12:00:00");
            return d.toLocaleDateString("en-US", { weekday: "long" });
        },
        formattedDate() {
            if (!this.form.date) return "";
            const d = new Date(this.form.date + "T12:00:00");
            return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        },
        isWeekend() {
            if (!this.form.date) return false;
            const d = new Date(this.form.date + "T12:00:00");
            const dow = d.getDay();
            return dow === 0 || dow === 5 || dow === 6; // Sun, Fri, Sat
        },
        selectedDayHours() {
            return this.isWeekend ? "7am – 7pm" : "7am – 6pm";
        },
        closeHour() {
            return this.isWeekend ? 18 : 17; // last slot starts at 6pm/5pm (close-1h)
        },

        // ── Time slots (30-min intervals) ───────────────────
        timeSlots() {
            const slots = [];
            // Last seating 1 hour before close
            const endHour = this.isWeekend ? 18 : 17; // Fri-Sun close 7pm → last slot 6pm; Mon-Thu close 6pm → last 5pm
            for (let h = 7; h <= endHour; h++) {
                slots.push(`${this.fmtHour(h)}:00 ${h < 12 ? "AM" : "PM"}`);
                if (h < endHour) {
                    slots.push(`${this.fmtHour(h)}:30 ${h < 12 ? "AM" : (h === 12 ? "PM" : "PM")}`);
                }
            }
            return slots;
        },

        tablesNeeded() {
            return Math.ceil(this.form.people / 4);
        },
    },

    methods: {
        fmtHour(h24) {
            const h12 = h24 > 12 ? h24 - 12 : h24;
            return String(h12).padStart(2, "0");
        },

        adjustParty(delta) {
            const n = this.form.people + delta;
            if (n >= 1 && n <= 20) this.form.people = n;
        },

        // ── Step 1 validation ────────────────────────────────
        goStep2() {
            let ok = true;
            this.errors = { name: "", email: "", phone: "", date: "", time: "", submit: "" };

            if (!this.form.name.trim()) { this.errors.name = "Please enter your name."; ok = false; }
            else if (!/^[A-Za-z\s\-']+$/.test(this.form.name.trim())) { this.errors.name = "Name can only contain letters."; ok = false; }

            if (!this.form.email.trim()) { this.errors.email = "Please enter your email."; ok = false; }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) { this.errors.email = "Please enter a valid email."; ok = false; }

            if (!this.form.phone.trim()) { this.errors.phone = "Please enter your phone number."; ok = false; }
            else if (!/^\+?[\d\s\-().]{7,20}$/.test(this.form.phone)) { this.errors.phone = "Please enter a valid phone number."; ok = false; }

            if (ok) this.step = 2;
        },

        // ── Submit ───────────────────────────────────────────
        async submitBooking() {
            this.errors.date = "";
            this.errors.time = "";
            this.errors.submit = "";

            if (!this.form.date) { this.errors.date = "Please select a date."; return; }
            if (!this.form.time) { this.errors.time = "Please select a time slot."; return; }

            // Build datetime string  "YYYY-MM-DD HH:MM:SS"
            const timeParts = this.form.time.match(/^(\d+):(\d+)\s(AM|PM)$/);
            let hour = parseInt(timeParts[1]);
            const min  = timeParts[2];
            const ampm = timeParts[3];
            if (ampm === "PM" && hour !== 12) hour += 12;
            if (ampm === "AM" && hour === 12) hour = 0;
            const hStr = String(hour).padStart(2, "0");
            const bookWhen = `${this.form.date} ${hStr}:${min}:00`;

            this.submitting = true;
            try {
                await axios.post("/booking", {
                    book_name:   this.form.name,
                    book_email:  this.form.email,
                    book_phone:  this.form.phone,
                    book_people: this.form.people,
                    book_when:   bookWhen,
                    book_note:   this.form.note,
                });
                this.step = 3;
            } catch (err) {
                const msg = err.response?.data?.error || "Something went wrong. Please try again or call us.";
                this.errors.submit = msg;
            } finally {
                this.submitting = false;
            }
        },

        resetForm() {
            this.step = 1;
            this.form = { name: "", email: "", phone: "", people: 2, note: "", date: "", time: "" };
            this.errors = { name: "", email: "", phone: "", date: "", time: "", submit: "" };
        },
    },
};
</script>

<style scoped>
/* ── SLIDE TRANSITION ────────────────────────────────────────── */
.slide-enter-active, .slide-leave-active { transition: opacity .3s ease, transform .3s ease; }
.slide-enter-from { opacity: 0; transform: translateX(30px); }
.slide-leave-to  { opacity: 0; transform: translateX(-30px); }

/* ── HERO ────────────────────────────────────────────────────── */
.res-hero {
    background: linear-gradient(135deg, #1a0000 0%, #3a0000 50%, #1a1a1a 100%);
    border-top: 4px solid #CC0000;
    padding: 7rem 9% 6rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}
.res-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23CC0000' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.res-hero-inner { position: relative; z-index: 1; }
.res-hero-eyebrow {
    font-size: 1.3rem; font-weight: 700; letter-spacing: .2em;
    text-transform: uppercase; color: #CC0000; margin-bottom: 1.2rem;
}
.res-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.8rem, 5vw, 4.8rem);
    color: #fff; font-weight: 700;
    line-height: 1.2; margin-bottom: 1.4rem;
}
.res-hero-sub {
    font-size: 1.6rem; color: rgba(255,255,255,.65);
    margin-bottom: 2.4rem;
}
.res-hero-pills {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;
}
.res-hero-pills span {
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.15);
    color: rgba(255,255,255,.8);
    font-size: 1.35rem;
    padding: .6rem 1.4rem;
    border-radius: 2rem;
}

/* ── SECTION WRAPPER ─────────────────────────────────────────── */
.res-section {
    background: #f7f4ef;
    border-top: 4px solid #CC0000;
    padding: 5rem 9%;
    min-height: 60vh;
}

/* ── STEP INDICATOR ──────────────────────────────────────────── */
.res-steps {
    display: flex; align-items: center;
    justify-content: center;
    gap: 0; margin-bottom: 4rem;
}
.res-step {
    display: flex; flex-direction: column; align-items: center;
    gap: .6rem;
}
.step-circle {
    width: 4rem; height: 4rem; border-radius: 50%;
    background: #ddd; color: #999;
    font-size: 1.5rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    transition: all .3s;
}
.res-step.active .step-circle { background: #CC0000; color: #fff; }
.res-step.done .step-circle   { background: #28a745; color: #fff; }
.res-step span {
    font-size: 1.2rem; color: #aaa; font-weight: 600;
    text-transform: uppercase; letter-spacing: .08em;
}
.res-step.active span { color: #CC0000; }
.res-step.done span   { color: #28a745; }

.step-connector {
    width: 10rem; height: 2px; background: #ddd; margin: 0 .6rem;
    margin-bottom: 2.4rem; transition: background .3s;
    flex-shrink: 0;
}
.step-connector.active { background: #CC0000; }

/* ── CARD ────────────────────────────────────────────────────── */
.res-card {
    max-width: 80rem;
    margin: 0 auto;
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 4px 32px rgba(0,0,0,.09);
    padding: 4rem 4.5rem;
}
.card-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem; color: #1a1a1a;
    margin: 0 0 .5rem;
}
.card-sub { font-size: 1.45rem; color: #888; margin: 0 0 3rem; }

/* ── FIELDS ──────────────────────────────────────────────────── */
.field-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2rem 3rem;
    margin-bottom: 2rem;
}
.field-wrap { display: flex; flex-direction: column; gap: .5rem; }
.field-wrap.full-width { margin-bottom: 2.5rem; }

.field-wrap label {
    font-size: 1.4rem; font-weight: 600; color: #444;
}
.req { color: #CC0000; }
.optional { font-size: 1.2rem; color: #aaa; font-weight: 400; }

.field-wrap input,
.field-wrap textarea,
.field-wrap select {
    padding: 1.1rem 1.4rem;
    border: 1.5px solid #ddd;
    border-radius: .7rem;
    font-size: 1.5rem;
    color: #1a1a1a;
    transition: border-color .2s, box-shadow .2s;
    background: #fff;
    outline: none;
    font-family: inherit;
}
.field-wrap input:focus,
.field-wrap textarea:focus {
    border-color: #CC0000;
    box-shadow: 0 0 0 3px rgba(204,0,0,.1);
}
.field-wrap textarea { resize: vertical; min-height: 8rem; }
.err-input { border-color: #e53e3e !important; }
.field-err { font-size: 1.3rem; color: #e53e3e; margin: 0; }
.field-hint { font-size: 1.3rem; color: #888; margin: 0; }

/* Party picker */
.party-picker {
    display: flex; align-items: center; gap: 0;
    border: 1.5px solid #ddd; border-radius: .7rem; overflow: hidden;
}
.party-picker button {
    width: 4.4rem; height: 4.4rem;
    background: #f5f5f5; border: none;
    font-size: 2rem; cursor: pointer; color: #333;
    transition: background .15s;
}
.party-picker button:hover:not(:disabled) { background: #CC0000; color: #fff; }
.party-picker button:disabled { color: #ccc; cursor: not-allowed; }
.party-num {
    flex: 1; text-align: center;
    font-size: 2rem; font-weight: 700; color: #1a1a1a;
}

/* ── DATE / TIME ─────────────────────────────────────────────── */
.date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 2.5rem; }
.day-badge {
    display: flex; flex-direction: column;
    background: #faf8f4; border: 1.5px solid #eee;
    border-radius: .7rem; padding: 1rem 1.4rem;
    gap: .4rem; min-height: 4.6rem; justify-content: center;
}
.day-name  { font-size: 1.6rem; font-weight: 700; color: #1a1a1a; }
.day-hours { font-size: 1.3rem; color: #CC0000; font-weight: 600; }

.time-section { margin-bottom: 2.5rem; }
.time-label { font-size: 1.4rem; font-weight: 600; color: #444; display: block; margin-bottom: 1.2rem; }

.time-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: .9rem;
}
.time-btn {
    padding: .9rem .5rem;
    border: 1.5px solid #ddd;
    border-radius: .6rem;
    background: #fff;
    font-size: 1.35rem;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    transition: all .18s;
    text-align: center;
}
.time-btn:hover { border-color: #CC0000; color: #CC0000; }
.time-btn.selected { background: #CC0000; border-color: #CC0000; color: #fff; }

/* Booking summary */
.summary-box {
    background: #faf8f4;
    border: 1px solid #e8e0d0;
    border-left: 4px solid #CC0000;
    border-radius: .8rem;
    padding: 1.8rem 2rem;
    display: flex; flex-direction: column; gap: .7rem;
    margin-bottom: 2.5rem;
}
.summary-row {
    display: flex; align-items: flex-start; gap: 1rem;
    font-size: 1.45rem; color: #333;
}
.summary-row span { font-size: 1.6rem; flex-shrink: 0; }

/* ── CARD FOOTER (buttons) ───────────────────────────────────── */
.card-footer {
    display: flex; gap: 1.4rem;
    margin-top: 1rem;
}
.btn-next, .btn-back, .btn-new {
    padding: 1.3rem 3rem;
    border-radius: .7rem;
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s;
    border: 2px solid transparent;
}
.btn-next {
    background: #CC0000; color: #fff; flex: 1;
}
.btn-next:hover:not(:disabled) { background: #a80000; }
.btn-next:disabled { opacity: .6; cursor: not-allowed; }

.btn-back {
    background: transparent; color: #666; border-color: #ddd;
}
.btn-back:hover { border-color: #999; color: #333; }

.center-err { text-align: center; margin-top: .8rem; font-size: 1.45rem; }

.spinner-inline::after {
    content: '';
    display: inline-block;
    width: 1.4rem; height: 1.4rem;
    border: 2px solid rgba(255,255,255,.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    vertical-align: middle; margin-left: .6rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── CONFIRMATION CARD ───────────────────────────────────────── */
.confirm-card { text-align: center; }
.confirm-icon { font-size: 6rem; margin-bottom: 1rem; }
.confirm-title {
    font-family: 'Playfair Display', serif;
    font-size: 3rem; color: #1a1a1a; margin: 0 0 1rem;
}
.confirm-sub { font-size: 1.5rem; color: #555; margin-bottom: 3rem; line-height: 1.7; }
.confirm-details {
    max-width: 44rem; margin: 0 auto 3rem;
    border: 1px solid #eee; border-radius: .8rem; overflow: hidden;
}
.cd-row {
    display: flex; align-items: center; gap: 1.4rem;
    padding: 1.4rem 2rem; border-bottom: 1px solid #f0f0f0;
    text-align: left;
}
.cd-row:last-child { border-bottom: none; }
.cd-icon { font-size: 2rem; flex-shrink: 0; width: 2.8rem; text-align: center; }
.cd-label { font-size: 1.2rem; color: #999; margin: 0 0 .2rem; text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
.cd-val   { font-size: 1.5rem; color: #1a1a1a; font-weight: 600; margin: 0; }
.btn-new {
    background: transparent; color: #CC0000;
    border-color: #CC0000; padding: 1.1rem 2.8rem;
}
.btn-new:hover { background: #CC0000; color: #fff; }

/* ── MAP ─────────────────────────────────────────────────────── */
.map-section {
    display: grid; grid-template-columns: 38rem 1fr;
    border-top: 4px solid #CC0000;
}
.map-info {
    background: #1a1a1a; color: #ddd;
    padding: 4.5rem 4rem;
    display: flex; flex-direction: column; gap: 1.2rem;
}
.map-heading {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem; color: #fff; margin: 0;
}
.map-addr { font-size: 1.4rem; color: rgba(255,255,255,.55); margin: 0; }
.map-details { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .9rem; }
.map-details li { font-size: 1.4rem; color: rgba(255,255,255,.65); display: flex; align-items: center; gap: .9rem; }
.map-details i { color: #CC0000; width: 1.6rem; text-align: center; }
.map-embed iframe { width: 100%; height: 100%; min-height: 36rem; border: none; display: block; }

/* ── RESPONSIVE ──────────────────────────────────────────────── */
@media (max-width: 900px) {
    .res-section { padding: 4rem 5%; }
    .res-card { padding: 3rem 2.5rem; }
    .field-grid { grid-template-columns: 1fr; }
    .date-row  { grid-template-columns: 1fr; }
    .step-connector { width: 5rem; }
    .map-section { grid-template-columns: 1fr; }
    .map-embed iframe { min-height: 28rem; }
}
@media (max-width: 600px) {
    .res-hero { padding: 5rem 5% 4rem; }
    .res-card { padding: 2.4rem 1.8rem; }
    .res-steps { gap: 0; }
    .step-connector { width: 3rem; }
    .time-grid { grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr)); }
    .card-footer { flex-direction: column-reverse; }
    .btn-next, .btn-back { flex: unset; width: 100%; }
}
</style>
