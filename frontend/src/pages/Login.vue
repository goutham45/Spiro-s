<template>
    <div class="login-container">
        <div class="login-form-container">
            <form id="loginForm" @submit.prevent="handleSubmit" novalidate autocomplete="off">
                <div class="logo-area">🍽️ Spiros</div>
                <h3>Welcome back</h3>

                <div v-if="errors.length" class="error-box">
                    <ul>
                        <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                </div>

                <div class="form-group">
                    <input type="email" id="uEmail" class="form-control" placeholder="Email address"
                        v-model="loginObj.email" />
                </div>

                <div class="form-group">
                    <input type="password" id="uPass" class="form-control" placeholder="Password"
                        v-model="loginObj.pass" />
                </div>

                <div class="form-group">
                    <input type="submit" :value="loading ? 'Signing in…' : 'sign in'" class="btn" :disabled="loading">
                    <p>Don't have an account? <router-link @click="scrollToTop()" to="/register">create one</router-link></p>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";

export default {
    name: 'Login',

    data() {
        return {
            loginObj: { email: "", pass: "" },
            errors: [],
            loading: false,
        };
    },

    methods: {
        ...mapMutations(["setUser"]),

        scrollToTop() { window.scrollTo(0, 0); },

        async handleSubmit() {
            this.errors = [];

            if (!this.loginObj.email) this.errors.push("Email is required");
            else if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(this.loginObj.email))
                this.errors.push("Please enter a valid email");

            if (!this.loginObj.pass) this.errors.push("Password is required");

            if (this.errors.length) return;

            this.loading = true;
            try {
                const { data } = await axios.post("/auth/login", {
                    email:    this.loginObj.email,
                    password: this.loginObj.pass,
                });

                // Store token + user in Vuex + localStorage
                this.setUser({ token: data.token, user: data.user });
                this.$router.push("/");

            } catch (err) {
                const msg = err.response?.data?.message || "Incorrect email or password.";
                this.errors.push(msg);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.login-container {
    padding: 2rem 9%;
}

.login-container .login-form-container {
    background-color: #fff;
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container .login-form-container form {
    max-width: 42rem;
    width: 100%;
    box-shadow: 0 4px 24px rgba(0,63,138,0.1);
    border: 1px solid rgba(0,63,138,0.1);
    padding: 3rem;
    border-radius: 1rem;
}

.logo-area {
    font-family: 'Playfair Display', serif;
    font-size: 2.8rem;
    font-weight: 700;
    color: #CC0000;
    text-align: center;
    margin-bottom: 0.5rem;
}

.login-container form h3 {
    padding-bottom: 1.5rem;
    font-size: 1.8rem;
    color: #666;
    margin: 0;
    text-align: center;
    text-transform: none;
}

.login-container form .form-control {
    margin: .7rem 0;
    border-radius: .5rem;
    background: #f7f7f7;
    padding: 1.4rem 1.2rem;
    font-size: 1.6rem;
    color: #1a1a2e;
    text-transform: none;
    width: 100%;
    border: 1px solid transparent;
    transition: border-color 0.2s;
}

.login-container form .form-control:focus {
    border-color: #CC0000;
    background: #fff;
}

.login-container form .btn {
    margin-bottom: 1rem;
    margin-top: 1rem;
    width: 100%;
}

.login-container form p {
    padding-top: 1rem;
    font-size: 1.5rem;
    color: #666;
    margin: 0;
    text-align: center;
    text-transform: none;
}

.login-container form p a {
    color: #CC0000;
    font-weight: 600;
}

.login-container form p a:hover {
    color: #D4A017;
    text-decoration: underline;
}

.error-box {
    background-color: #fff5f5;
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 6px;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    padding: 1rem 1.5rem;
}

.error-box ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.error-box ul li {
    color: #dc2626;
    padding: 2px 0;
}
</style>
