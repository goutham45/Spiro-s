import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
    state() {
        // Restore user from localStorage on page reload (fixes the JWT re-login bug)
        const savedUser  = localStorage.getItem("spiros_user");
        const savedToken = localStorage.getItem("spiros_token");
        return {
            allFoods: [],
            user:  savedUser  ? JSON.parse(savedUser)  : undefined,
            token: savedToken ? savedToken             : undefined,
            admin: undefined,
        };
    },

    mutations: {
        setFoodsData(state, payload) {
            state.allFoods = payload;
        },

        // Called after successful login — stores user + token
        setUser(state, payload) {
            if (payload && payload.token) {
                state.token = payload.token;
                state.user  = payload.user;
                localStorage.setItem("spiros_token", payload.token);
                localStorage.setItem("spiros_user",  JSON.stringify(payload.user));
            } else if (!payload) {
                // Logout
                state.token = undefined;
                state.user  = undefined;
                localStorage.removeItem("spiros_token");
                localStorage.removeItem("spiros_user");
            } else {
                // Legacy / admin path
                state.user = payload;
            }
        },

        setAdmin(state, payload) {
            state.admin = payload;
        },
    },

    actions: {
        async getFoodsData(context) {
            try {
                const response = await axios.get("/foods");
                if (response.data && response.data.length > 0) {
                    context.commit("setFoodsData", response.data);
                }
            } catch (error) {
                console.error("❌ Failed to load menu:", error.message);
            }
        },
    },
});

export default store;
