<template>
    <div class="menu-section">

        <!-- ── Red Header ─────────────────────────────── -->
        <div class="menu-header">
            <div class="header-text">
                <p class="eyebrow">Fresh · Authentic · Brooklyn</p>
                <h1>Our Menu</h1>
                <!-- Real Uber Eats store rating -->
                <div class="ue-rating-row">
                    <span class="ue-star-icon">⭐</span>
                    <span class="ue-rating-val">4.9</span>
                    <span class="ue-rating-sep">·</span>
                    <span class="ue-rating-count">700+ ratings on Uber Eats</span>
                </div>
            </div>
            <div class="search-wrap">
                <i class="fas fa-search search-icon"></i>
                <input
                    v-model="foodObj.name"
                    type="text"
                    placeholder="Search dishes…"
                    class="search-input"
                />
            </div>
        </div>

        <!-- ── Category Tabs ──────────────────────────── -->
        <div class="category-tabs">
            <button
                v-for="cat in categories"
                :key="cat.value"
                :class="['cat-btn', { active: activeCategory === cat.value }]"
                @click="setCategory(cat.value)"
            >
                <span class="cat-icon">{{ cat.emoji }}</span>
                <span>{{ cat.label }}</span>
            </button>
        </div>

        <!-- ── Body ───────────────────────────────────── -->
        <div class="menu-body">

            <!-- Sidebar filters -->
            <aside class="sidebar">
                <h4 class="sidebar-title">Filter</h4>

                <div class="filter-group">
                    <p class="filter-label">Status</p>
                    <label
                        v-for="s in statusOptions" :key="s.value"
                        :class="['chip', { active: foodObj.status.includes(s.value) }]"
                    >
                        <input type="checkbox" :value="s.value" v-model="foodObj.status" hidden />
                        {{ s.label }}
                    </label>
                </div>

                <div class="filter-group">
                    <p class="filter-label">Price</p>
                    <label
                        v-for="p in priceOptions" :key="p.value"
                        :class="['chip', { active: foodObj.price === p.value }]"
                    >
                        <input type="radio" name="price" :value="p.value" v-model="foodObj.price" hidden />
                        {{ p.label }}
                    </label>
                    <button v-if="foodObj.price" class="clear-link" @click="foodObj.price = ''">✕ Clear</button>
                </div>

                <div class="filter-group">
                    <p class="filter-label">Category</p>
                    <label
                        v-for="t in typeOptions" :key="t.value"
                        :class="['chip', { active: foodObj.type === t.value }]"
                    >
                        <input type="radio" name="type" :value="t.value" v-model="foodObj.type" hidden />
                        {{ t.label }}
                    </label>
                    <button v-if="foodObj.type" class="clear-link" @click="foodObj.type = ''">✕ Clear</button>
                </div>

                <button v-if="hasFilters" class="reset-btn" @click="resetAll">Reset all filters</button>
            </aside>

            <!-- Main grid area -->
            <div class="grid-area">

                <!-- Loading -->
                <div v-if="loading" class="state-box">
                    <div class="spinner"></div>
                    <p>Loading menu…</p>
                </div>

                <!-- Results bar -->
                <div v-else-if="filtered.length" class="results-bar">
                    <span class="results-count">{{ filtered.length }} dish{{ filtered.length !== 1 ? 'es' : '' }}</span>
                </div>

                <!-- Food grid -->
                <div v-if="!loading && paged.length" class="food-grid">
                    <div v-for="item in paged" :key="item.food_id" class="card">

                        <!-- Food image (real photo or emoji fallback) -->
                        <div class="card-hero" :style="isImageUrl(item.food_src) ? {} : { background: categoryColor(item.food_category) }">
                            <img
                                v-if="isImageUrl(item.food_src)"
                                :src="item.food_src"
                                :alt="item.food_name"
                                class="hero-img"
                                loading="lazy"
                                @error="e => e.target.style.display='none'"
                            />
                            <span v-else class="hero-emoji">{{ categoryEmoji(item.food_category) }}</span>

                            <!-- UE-style endorsement badge on image -->
                            <span v-if="item.food_vote" :class="['ue-badge', endorsementClass(item.food_vote)]">
                                {{ endorsementLabel(item.food_vote) }}
                            </span>
                        </div>

                        <div class="card-info">
                            <h3 class="item-name">{{ item.food_name }}</h3>

                            <p class="item-desc">{{ item.food_desc }}</p>

                            <span :class="['diet-tag', item.food_type]">{{ item.food_type }}</span>

                            <div class="card-bottom">
                                <div class="pricing">
                                    <span class="final-price">${{ finalPrice(item) }}</span>
                                    <span v-if="+item.food_discount > 0" class="orig-price">${{ (+item.food_price).toFixed(2) }}</span>
                                </div>
                                <button class="add-btn" @click="openQuickView(item.food_id)">
                                    <i class="fas fa-cart-plus"></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty state — only show after data has loaded -->
                <div v-if="!loading && dataLoaded && !paged.length" class="state-box">
                    <span style="font-size:5rem;">🔍</span>
                    <h3>No dishes found</h3>
                    <p>Try changing your search or filters</p>
                    <button class="btn" @click="resetAll">Clear filters</button>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="pagination">
                    <button class="pg-btn" :disabled="page === 0" @click="page--">‹</button>
                    <button
                        v-for="n in totalPages" :key="n"
                        :class="['pg-num', { active: page === n - 1 }]"
                        @click="page = n - 1"
                    >{{ n }}</button>
                    <button class="pg-btn" :disabled="page === totalPages - 1" @click="page++">›</button>
                </div>
            </div>
        </div>

        <!-- ── Real Uber Eats Reviews ─────────────────────────── -->
        <div class="reviews-section">
            <div class="reviews-header">
                <div class="reviews-title-row">
                    <h2 class="reviews-title">What customers are saying</h2>
                    <div class="reviews-rating-pill">
                        <span class="reviews-star">⭐</span>
                        <span class="reviews-rating-num">4.9</span>
                        <span class="reviews-rating-sep">·</span>
                        <span class="reviews-count">700+ ratings</span>
                    </div>
                </div>
                <p class="reviews-source">Reviews from <strong>Uber Eats</strong></p>
            </div>
            <div class="reviews-grid">
                <div v-for="review in ueReviews" :key="review.id" class="review-card">
                    <div class="review-top">
                        <div class="reviewer-avatar">{{ review.initials }}</div>
                        <div class="reviewer-info">
                            <span class="reviewer-name">{{ review.name }}</span>
                            <span class="review-date">{{ review.date }}</span>
                        </div>
                        <div class="review-stars">
                            <span class="rstar">★★★★★</span>
                        </div>
                    </div>
                    <p class="review-text">"{{ review.text }}"</p>
                </div>
            </div>
        </div>

        <!-- Quick-view modal -->
        <QuickView v-if="quickViewId !== null" :food="quickViewId">
            <button class="btn" @click="quickViewId = null">✕ Close</button>
        </QuickView>
    </div>
</template>

<script>
import QuickView from "@/components/QuickView.vue";
import { mapState, mapActions } from "vuex";

const CATEGORY_EMOJI = {
    "pancakes":                   "🥞",
    "french-toast-waffles":       "🧇",
    "eggs-omelettes":             "🍳",
    "omelettes":                  "🍳",
    "spiros-special":             "⭐",
    "low-cal-omelettes":          "🥗",
    "super-3-egg-wrap":           "🌯",
    "cereal":                     "🥣",
    "body-builders":              "💪",
    "bagels":                     "🥯",
    "breakfast-extras":           "🥓",
    "appetizers":                 "🍟",
    "cold-salad-platters":        "🥗",
    "salads":                     "🥗",
    "tasty-sandwiches":           "🥪",
    "grilled-pita":               "🫓",
    "grilled-chicken-sandwiches": "🍗",
    "special-sandwiches":         "🥙",
    "hot-open-sandwiches":        "🫔",
    "classic-burgers":            "🍔",
    "classic-burger-deluxe":      "🍔",
    "specialty-burgers":          "🍔",
    "slim-line":                  "🥬",
    "triple-decker-clubs":        "🥪",
    "carving-board":              "🍖",
    "gourmet-wraps":              "🌯",
    "steaks-chops":               "🥩",
    "sautes":                     "🍲",
    "broiled-seafood":            "🐟",
    "fried-seafood":              "🍤",
    "entrees-roasts":             "🍗",
    "spaghetti":                  "🍝",
    "italian-specialties":        "🇮🇹",
    "greek-specialties":          "🥙",
    "chef-specials":              "👨‍🍳",
    "fruits-puddings":            "🍮",
    "danish-muffins":             "🥐",
    "pies-cakes":                 "🥧",
    "desserts":                   "🍨",
    "ice-cream-sodas":            "🍦",
    "juices-fruits":              "🍊",
    "beverages":                  "☕",
};

const CATEGORY_COLOR = {
    "pancakes":                   "#fff8f0",
    "french-toast-waffles":       "#fff8f0",
    "eggs-omelettes":             "#fff8f0",
    "omelettes":                  "#fff8f0",
    "spiros-special":             "#fff0e6",
    "low-cal-omelettes":          "#f0fff4",
    "super-3-egg-wrap":           "#fff8f0",
    "cereal":                     "#fff8f0",
    "body-builders":              "#f0fff4",
    "bagels":                     "#fff8f0",
    "breakfast-extras":           "#fff8f0",
    "appetizers":                 "#fff5f0",
    "cold-salad-platters":        "#f0fff4",
    "salads":                     "#f0fff4",
    "tasty-sandwiches":           "#fffaf0",
    "grilled-pita":               "#fffaf0",
    "grilled-chicken-sandwiches": "#fff5f0",
    "special-sandwiches":         "#fffaf0",
    "hot-open-sandwiches":        "#fff5f0",
    "classic-burgers":            "#fff5f0",
    "classic-burger-deluxe":      "#fff5f0",
    "specialty-burgers":          "#fff5f0",
    "slim-line":                  "#f0fff4",
    "triple-decker-clubs":        "#fffaf0",
    "carving-board":              "#fff5f0",
    "gourmet-wraps":              "#fffaf0",
    "steaks-chops":               "#fff0f0",
    "sautes":                     "#fff0f0",
    "broiled-seafood":            "#f0f8ff",
    "fried-seafood":              "#f0f8ff",
    "entrees-roasts":             "#fff0f0",
    "spaghetti":                  "#fff5f0",
    "italian-specialties":        "#fff5f0",
    "greek-specialties":          "#fff0f0",
    "chef-specials":              "#fff0f0",
    "fruits-puddings":            "#fff0f8",
    "danish-muffins":             "#fff8f0",
    "pies-cakes":                 "#fff0f8",
    "desserts":                   "#fff0f8",
    "ice-cream-sodas":            "#fff0f8",
    "juices-fruits":              "#f0fff8",
    "beverages":                  "#f0f8ff",
    // legacy keys for old data
    breakfast:   "#fff8f0",
    greek:       "#fff0f0",
    burgers:     "#fff5f0",
    sandwiches:  "#fffaf0",
    mains:       "#fff0f0",
    drinks:      "#f0f8ff",
};

export default {
    name: "Menu",
    components: { QuickView },

    data() {
        return {
            loading: false,
            dataLoaded: false,
            quickViewId: null,
            page: 0,
            perPage: 9,
            foodObj: { name: "", category: "", status: [], price: "", type: "" },

            categories: [
                { value: "",                          label: "All",                          emoji: "🍽️" },
                { value: "pancakes",                  label: "Pancakes",                     emoji: "🥞" },
                { value: "french-toast-waffles",      label: "French Toast and Waffles",     emoji: "🧇" },
                { value: "eggs-omelettes",            label: "Eggs and 3 Egg Omelettes",     emoji: "🍳" },
                { value: "omelettes",                 label: "Omelettes",                    emoji: "🍳" },
                { value: "spiros-special",            label: "Spiro's Special",              emoji: "⭐" },
                { value: "low-cal-omelettes",         label: "Low Cal Omelettes",            emoji: "🥗" },
                { value: "super-3-egg-wrap",          label: "Super 3 Egg Omelette Wrap",    emoji: "🌯" },
                { value: "cereal",                    label: "Cereal",                       emoji: "🥣" },
                { value: "body-builders",             label: "Body Builder's Breakfast",     emoji: "💪" },
                { value: "bagels",                    label: "Bagels",                       emoji: "🥯" },
                { value: "breakfast-extras",          label: "Breakfast Extras",             emoji: "🥓" },
                { value: "appetizers",                label: "Appetizers and Side Orders",   emoji: "🍟" },
                { value: "cold-salad-platters",       label: "Cold Salad Platters",          emoji: "🥗" },
                { value: "salads",                    label: "Salads",                       emoji: "🥗" },
                { value: "tasty-sandwiches",          label: "Tasty Sandwiches",             emoji: "🥪" },
                { value: "grilled-pita",              label: "Grilled Pita Sandwiches",      emoji: "🫓" },
                { value: "grilled-chicken-sandwiches",label: "Grilled Chicken Sandwiches",   emoji: "🍗" },
                { value: "special-sandwiches",        label: "Special Sandwiches",           emoji: "🥙" },
                { value: "hot-open-sandwiches",       label: "Hot Open Sandwiches",          emoji: "🫔" },
                { value: "classic-burgers",           label: "Classic Burgers",              emoji: "🍔" },
                { value: "classic-burger-deluxe",     label: "Classic Burger Deluxe",        emoji: "🍔" },
                { value: "specialty-burgers",         label: "Specialty Burgers",            emoji: "🍔" },
                { value: "slim-line",                 label: "Slim Line",                    emoji: "🥬" },
                { value: "triple-decker-clubs",       label: "Triple Decker Clubs",          emoji: "🥪" },
                { value: "carving-board",             label: "Carving Board Sandwiches",     emoji: "🍖" },
                { value: "gourmet-wraps",             label: "Our New Gourmet Wraps",        emoji: "🌯" },
                { value: "steaks-chops",              label: "Steaks and Chops",             emoji: "🥩" },
                { value: "sautes",                    label: "Sautes",                       emoji: "🍲" },
                { value: "broiled-seafood",           label: "Broiled Seafood",              emoji: "🐟" },
                { value: "fried-seafood",             label: "Fried Seafood",                emoji: "🍤" },
                { value: "entrees-roasts",            label: "Entrees and Roasts",           emoji: "🍗" },
                { value: "spaghetti",                 label: "Spaghetti",                    emoji: "🍝" },
                { value: "italian-specialties",       label: "Italian Specialties",          emoji: "🍕" },
                { value: "greek-specialties",         label: "Greek Specialties",            emoji: "🥙" },
                { value: "chef-specials",             label: "Chef Specials",                emoji: "👨‍🍳" },
                { value: "fruits-puddings",           label: "Fruits and Puddings",          emoji: "🍮" },
                { value: "danish-muffins",            label: "Danish and Muffins",           emoji: "🥐" },
                { value: "pies-cakes",                label: "Pies and Cakes",               emoji: "🥧" },
                { value: "desserts",                  label: "Desserts",                     emoji: "🍨" },
                { value: "ice-cream-sodas",           label: "Ice Cream Sodas",              emoji: "🍦" },
                { value: "juices-fruits",             label: "Juices and Fruits",            emoji: "🍊" },
                { value: "beverages",                 label: "Beverages",                    emoji: "☕" },
            ],

            statusOptions: [
                { value: "Best Seller", label: "🔥 Popular / Best Seller" },
            ],

            priceOptions: [
                { value: "under5",  label: "Under $5" },
                { value: "5to10",   label: "$5 – $10" },
                { value: "10to20",  label: "$10 – $20" },
                { value: "over20",  label: "Over $20" },
            ],

            typeOptions: [
                { value: "breakfast",  label: "🍳 Breakfast"         },
                { value: "chicken",    label: "🍗 Chicken"            },
                { value: "beef",       label: "🥩 Beef & Burgers"     },
                { value: "sandwiches", label: "🥪 Sandwiches & Wraps" },
                { value: "seafood",    label: "🐟 Seafood"            },
                { value: "salads",     label: "🥗 Salads & Healthy"   },
                { value: "appetizers", label: "🍟 Appetizers & Sides" },
                { value: "desserts",   label: "🍰 Desserts"           },
                { value: "drinks",     label: "☕ Drinks"             },
            ],

            // Real Uber Eats reviews
            ueReviews: [
                { id: 1, name: "Diana S.",       initials: "D", date: "Nov 2025",  text: "Food is sooo goood and affordable, thank you!" },
                { id: 2, name: "Fong P.",        initials: "F", date: "Apr 2024",  text: "I love this restaurant. They have the best food, especially the beef gyro!" },
                { id: 3, name: "Denbigh B.",     initials: "D", date: "Mar 2024",  text: "Delicious breakfast! Best in Brooklyn!" },
                { id: 4, name: "Darren D.",      initials: "D", date: "Jan 2024",  text: "Delicious" },
                { id: 5, name: "Randi B.",       initials: "R", date: "Nov 2023",  text: "Great service" },
                { id: 6, name: "Linda P.",       initials: "L", date: "Jul 2023",  text: "Delicious and fresh food" },
                { id: 7, name: "Konstantin F.",  initials: "K", date: "Feb 2023",  text: "Great food, lots of options, fast and tasty!" },
                { id: 8, name: "Maggie M.",      initials: "M", date: "Nov 2022",  text: "grilled cheese rocked" },
            ],
        };
    },

    computed: {
        ...mapState(["allFoods"]),

        activeCategory() { return this.foodObj.category; },

        filtered() {
            return this.allFoods.filter(f => {
                const q = this.foodObj.name.toLowerCase();
                if (q && !f.food_name.toLowerCase().includes(q)) return false;
                if (this.foodObj.category && f.food_category !== this.foodObj.category) return false;
                if (this.foodObj.type && f.food_type !== this.foodObj.type) return false;
                if (!this.matchPrice(f)) return false;
                if (!this.matchStatus(f)) return false;
                return true;
            });
        },

        paged() {
            return this.filtered.slice(this.page * this.perPage, (this.page + 1) * this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filtered.length / this.perPage);
        },

        hasFilters() {
            return this.foodObj.name || this.foodObj.category ||
                   this.foodObj.type || this.foodObj.price || this.foodObj.status.length;
        },
    },

    watch: {
        foodObj: { deep: true, handler() { this.page = 0; } },
    },

    async mounted() {
        // Always fetch fresh data when menu page loads
        this.loading = true;
        this.dataLoaded = false;
        await this.getFoodsData();
        this.loading = false;
        this.dataLoaded = true;

        // Apply filter from Home page card click (?category=chicken / breakfast / beef …)
        const cat = this.$route.query.category;
        if (cat) {
            // Home cards use food_type values — check typeOptions first
            const isType = this.typeOptions.some(t => t.value === cat);
            if (isType) {
                this.foodObj.type = cat;          // filters by food_type
            } else {
                this.setCategory(cat);            // fallback: filters by food_category
            }
            // Scroll to the food grid smoothly
            this.$nextTick(() => {
                const grid = document.querySelector(".food-grid");
                if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    },

    methods: {
        ...mapActions(["getFoodsData"]),

        isImageUrl(src) { return src && src.startsWith("http"); },
        categoryEmoji(cat) { return CATEGORY_EMOJI[cat] || "🍽️"; },
        categoryColor(cat) { return CATEGORY_COLOR[cat] || "#f9f9f9"; },

        starCount(star) { return Math.floor(parseFloat(star) || 0); },

        // Convert UE endorsement text → display label
        endorsementLabel(vote) {
            if (!vote) return "";
            const v = vote.toLowerCase();
            if (v.includes("#1")) return "🥇 #1 Most Liked";
            if (v.includes("#2")) return "#2 Most Liked";
            if (v.includes("#3")) return "#3 Most Liked";
            if (v.includes("popular")) return "🔥 Popular";
            return vote;
        },

        // CSS modifier for endorsement badge
        endorsementClass(vote) {
            if (!vote) return "";
            const v = vote.toLowerCase();
            if (v.includes("#1")) return "gold";
            if (v.includes("#2") || v.includes("#3")) return "silver";
            return "green";
        },

        finalPrice(item) {
            return (parseFloat(item.food_price) - parseFloat(item.food_discount)).toFixed(2);
        },

        matchPrice(f) {
            if (!this.foodObj.price) return true;
            const p = parseFloat(f.food_price) - parseFloat(f.food_discount);
            if (this.foodObj.price === "under5")  return p < 5;
            if (this.foodObj.price === "5to10")   return p >= 5 && p <= 10;
            if (this.foodObj.price === "10to20")  return p > 10 && p <= 20;
            if (this.foodObj.price === "over20")  return p > 20;
            return true;
        },

        matchStatus(f) {
            if (!this.foodObj.status.length) return true;
            return this.foodObj.status.some(s => {
                if (s === "Best Seller")     return f.food_status === "best seller";
                if (s === "New Dishes")      return f.food_status === "new dishes";
                if (s === "Seasonal Dishes") return f.food_status.includes("seasonal");
                return false;
            });
        },

        setCategory(val) { this.foodObj.category = val; },

        resetAll() {
            this.foodObj = { name: "", category: "", status: [], price: "", type: "" };
            this.page = 0;
        },

        openQuickView(id) { this.quickViewId = id; },
    },
};
</script>

<style scoped>
/* ─── Layout ─────────────────────────────────── */
.menu-section { background: #fff; min-height: 100vh; }

/* ─── Red header bar ─────────────────────────── */
.menu-header {
    background: #CC0000;
    padding: 3rem 9%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
}
.eyebrow {
    font-size: 1.3rem;
    color: rgba(255,255,255,.75);
    letter-spacing: .1em;
    text-transform: uppercase;
    margin-bottom: .3rem;
}
.menu-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    color: #fff;
    margin: 0;
}
.search-wrap { position: relative; display: flex; align-items: center; }
.search-icon  { position: absolute; left: 1.4rem; color: #CC0000; font-size: 1.5rem; }
.search-input {
    background: #fff;
    border: none;
    border-radius: 3rem;
    padding: 1.1rem 1.5rem 1.1rem 4rem;
    font-size: 1.5rem;
    color: #1a1a1a;
    width: 28rem;
    text-transform: none;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
}
.search-input:focus { outline: 2px solid #fff; }

/* ─── Category tabs ──────────────────────────── */
.category-tabs {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: #CC0000 #f0f0f0;
    gap: .6rem;
    padding: 1.4rem 9%;
    background: #fff;
    border-bottom: 2px solid #f0f0f0;
    position: sticky;
    top: 70px;
    z-index: 100;
}
.category-tabs::-webkit-scrollbar { height: 4px; }
.category-tabs::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 2px; }
.category-tabs::-webkit-scrollbar-thumb { background: #CC0000; border-radius: 2px; }
.cat-btn {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: .4rem;
    padding: .7rem 1.4rem;
    background: #f7f7f7;
    border: 2px solid transparent;
    border-radius: 3rem;
    font-size: 1.3rem;
    font-weight: 600;
    color: #555;
    cursor: pointer;
    transition: all .2s;
    white-space: nowrap;
}
.cat-btn:hover        { border-color: #CC0000; color: #CC0000; background: #fff5f5; }
.cat-btn.active       { background: #CC0000; border-color: #CC0000; color: #fff; }
.cat-icon             { font-size: 1.4rem; }

/* ─── Body ───────────────────────────────────── */
.menu-body {
    display: flex;
    gap: 3rem;
    padding: 2.5rem 9%;
    align-items: flex-start;
}

/* ─── Sidebar ────────────────────────────────── */
.sidebar {
    width: 22rem;
    flex-shrink: 0;
    border: 1px solid #eee;
    border-radius: 1rem;
    padding: 2rem;
    position: sticky;
    top: 150px;
    background: #fff;
}
.sidebar-title {
    font-size: 1.8rem;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
    padding-bottom: .8rem;
    border-bottom: 2px solid #CC0000;
}
.filter-group   { margin-bottom: 2rem; }
.filter-label   { font-size: 1.2rem; font-weight: 700; color: #CC0000; text-transform: uppercase; letter-spacing: .06em; margin-bottom: .6rem; }
.chip {
    display: block;
    padding: .65rem 1rem;
    border-radius: .5rem;
    font-size: 1.35rem;
    color: #555;
    cursor: pointer;
    transition: all .15s;
    margin-bottom: .3rem;
    border: 1px solid transparent;
    user-select: none;
}
.chip:hover  { background: #fff5f5; border-color: #CC0000; color: #CC0000; }
.chip.active { background: #CC0000; color: #fff; border-color: #CC0000; }
.clear-link  { font-size: 1.2rem; color: #CC0000; background: none; border: none; cursor: pointer; margin-top: .4rem; text-decoration: underline; }
.reset-btn   { width: 100%; padding: .9rem; background: #fff5f5; color: #CC0000; border: 1px solid #CC0000; border-radius: .5rem; cursor: pointer; font-size: 1.4rem; font-weight: 600; margin-top: .5rem; }
.reset-btn:hover { background: #CC0000; color: #fff; }

/* ─── Grid area ──────────────────────────────── */
.grid-area { flex: 1; min-width: 0; }

.results-bar { margin-bottom: 1.5rem; }
.results-count { font-size: 1.4rem; color: #888; }

.food-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
    gap: 2rem;
}

/* ─── Card ───────────────────────────────────── */
.card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 1.2rem;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: transform .2s, box-shadow .2s, border-color .2s;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(204,0,0,.1); border-color: #CC0000; }

.badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 1.1rem;
    font-weight: 700;
    padding: .3rem .9rem;
    border-radius: 2rem;
    z-index: 2;
}
.badge.red   { background: #CC0000; color: #fff; }
.badge.dark  { background: #1a1a1a; color: #fff; }
.badge.green { background: #15803d; color: #fff; }

.card-hero {
    height: 18rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .3s ease;
}
.card:hover .hero-img { transform: scale(1.05); }
.hero-emoji { font-size: 6rem; line-height: 1; }

.card-info { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: .5rem; }

.item-name  { font-size: 1.7rem; font-weight: 700; color: #1a1a1a; line-height: 1.3; }

.stars      { display: flex; align-items: center; gap: .15rem; }
.star       { color: #f59e0b; font-size: 1.4rem; }
.votes      { font-size: 1.2rem; color: #999; margin-left: .3rem; }

.item-desc  { font-size: 1.3rem; color: #666; line-height: 1.5; flex: 1; }

.diet-tag {
    display: inline-block;
    font-size: 1.1rem;
    padding: .2rem .8rem;
    border-radius: 2rem;
    font-weight: 600;
    text-transform: capitalize;
    width: fit-content;
}
.diet-tag.meat       { background: #fef2f2; color: #b91c1c; }
.diet-tag.vegetarian { background: #f0fdf4; color: #15803d; }
.diet-tag.vegan      { background: #ecfdf5; color: #065f46; }
.diet-tag.seafood    { background: #eff6ff; color: #1d4ed8; }

.card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: .8rem;
    padding-top: 1rem;
    border-top: 1px solid #f0f0f0;
    flex-wrap: wrap;
    gap: .5rem;
}
.pricing         { display: flex; align-items: baseline; gap: .5rem; flex-wrap: wrap; }
.final-price     { font-size: 2.2rem; font-weight: 800; color: #CC0000; }
.orig-price      { font-size: 1.4rem; color: #aaa; text-decoration: line-through; }
.add-btn         { background: #CC0000; color: #fff; border: none; border-radius: .6rem; padding: .85rem 1.6rem; font-size: 1.4rem; font-weight: 700; cursor: pointer; white-space: nowrap; }
.add-btn:hover   { background: #990000; }

/* ─── States ─────────────────────────────────── */
.state-box { text-align: center; padding: 6rem 2rem; }
.state-box h3 { font-size: 2.4rem; color: #1a1a1a; margin: 1.5rem 0 .8rem; }
.state-box p  { font-size: 1.5rem; color: #888; margin-bottom: 2rem; }

/* Spinner */
.spinner {
    width: 4rem; height: 4rem;
    border: 4px solid #f0f0f0;
    border-top-color: #CC0000;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    margin: 0 auto 1.5rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Pagination ─────────────────────────────── */
.pagination { display: flex; align-items: center; justify-content: center; gap: .5rem; margin-top: 3rem; flex-wrap: wrap; }
.pg-btn     { width: 3.8rem; height: 3.8rem; border: 1px solid #ddd; background: #fff; border-radius: .5rem; font-size: 2rem; color: #CC0000; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.pg-btn:disabled     { opacity: .35; cursor: default; }
.pg-btn:hover:not(:disabled) { background: #fff5f5; border-color: #CC0000; }
.pg-num     { width: 3.8rem; height: 3.8rem; border: 1px solid #ddd; background: #fff; border-radius: .5rem; font-size: 1.5rem; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.pg-num.active       { background: #CC0000; border-color: #CC0000; color: #fff; font-weight: 700; }
.pg-num:hover:not(.active) { border-color: #CC0000; color: #CC0000; }

/* ─── Responsive ─────────────────────────────── */
@media (max-width: 900px) {
    .menu-body  { flex-direction: column; }
    .sidebar    { width: 100%; position: static; }
}
@media (max-width: 600px) {
    .menu-header { padding: 2rem 5%; }
    .category-tabs { padding: 1.2rem 5%; }
    .menu-body   { padding: 1.5rem 5%; }
    .search-input { width: 20rem; }
    .food-grid   { grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    .menu-header h1 { font-size: 2.8rem; }
}
@media (max-width: 420px) {
    .food-grid { grid-template-columns: 1fr; }
}

/* ─── Store rating in header ─────────────────── */
.ue-rating-row {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-top: .8rem;
}
.ue-star-icon   { font-size: 1.5rem; }
.ue-rating-val  { font-size: 1.6rem; font-weight: 700; color: #fff; }
.ue-rating-sep  { color: rgba(255,255,255,.6); font-size: 1.4rem; }
.ue-rating-count { font-size: 1.4rem; color: rgba(255,255,255,.85); }

/* ─── UE endorsement badge on card image ─────── */
.card-hero { position: relative; }
.ue-badge {
    position: absolute;
    bottom: .8rem;
    left: .8rem;
    font-size: 1.05rem;
    font-weight: 700;
    padding: .25rem .75rem;
    border-radius: 2rem;
    z-index: 2;
    letter-spacing: .01em;
    box-shadow: 0 2px 6px rgba(0,0,0,.25);
}
.ue-badge.green  { background: #0E8345; color: #fff; }
.ue-badge.gold   { background: #f59e0b; color: #1a1a1a; }
.ue-badge.silver { background: #6b7280; color: #fff; }

/* ─── Stars row update ───────────────────────── */
.star-val { font-size: 1.3rem; font-weight: 700; color: #f59e0b; }

/* ─── Reviews section ────────────────────────── */
.reviews-section {
    background: #fafafa;
    border-top: 2px solid #f0f0f0;
    padding: 4rem 9%;
}
.reviews-header { margin-bottom: 2.5rem; }
.reviews-title-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: .5rem;
}
.reviews-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    color: #1a1a1a;
    margin: 0;
}
.reviews-rating-pill {
    display: flex;
    align-items: center;
    gap: .4rem;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 3rem;
    padding: .4rem 1.2rem;
    box-shadow: 0 1px 4px rgba(0,0,0,.07);
}
.reviews-star       { font-size: 1.4rem; }
.reviews-rating-num { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; }
.reviews-rating-sep { color: #aaa; }
.reviews-count      { font-size: 1.3rem; color: #555; }
.reviews-source     { font-size: 1.3rem; color: #888; margin: 0; }
.reviews-source strong { color: #000; }

.reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
    gap: 1.8rem;
}

.review-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 1.2rem;
    padding: 2rem;
    transition: box-shadow .2s;
}
.review-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); }

.review-top {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.2rem;
}
.reviewer-avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: #CC0000;
    color: #fff;
    font-size: 1.6rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.reviewer-info {
    display: flex;
    flex-direction: column;
    gap: .15rem;
    flex: 1;
}
.reviewer-name { font-size: 1.4rem; font-weight: 700; color: #1a1a1a; }
.review-date   { font-size: 1.2rem; color: #999; }
.review-stars .rstar { color: #f59e0b; font-size: 1.3rem; letter-spacing: .05em; }

.review-text {
    font-size: 1.4rem;
    color: #444;
    line-height: 1.65;
    margin: 0;
    font-style: italic;
}

@media (max-width: 600px) {
    .reviews-section  { padding: 3rem 5%; }
    .reviews-title    { font-size: 2.2rem; }
    .reviews-grid     { grid-template-columns: 1fr; }
    .ue-rating-count  { display: none; }
}
</style>
