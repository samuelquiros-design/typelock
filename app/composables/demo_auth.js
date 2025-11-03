import { ref, computed } from 'vue';

const demo_user = 'd3m0u53r';
const demo_pass = 'd3m0p455';
const auth_key = 'is_logged_in';
const is_logged_in = ref(get_login_state());

function get_login_state() {
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(auth_key) === 'true') {
        return true;
    }
    return false;
}

export function demo_auth() {

    const demo_link = computed(() => { return is_logged_in.value ? '/demo' : '/login'; });

    function set_logged_in(status) {
        is_logged_in.value = status;

        if (typeof window !== 'undefined') {
            if (status) {
                window.sessionStorage.setItem(auth_key, 'true');
            } else {
                window.sessionStorage.removeItem(auth_key);
            }
        }
    }

    function login(username, password) {
        if (username === demo_user && password === demo_pass) {
            set_logged_in(true);
            return true;
        }
        return false;
    }

    return {
        is_logged_in,
        demo_link,
        login,
        demo_user,
        demo_pass
    };
}