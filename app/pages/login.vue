<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { demo_auth } from '~/composables/demo_auth';

const { login } = demo_auth();
const router = useRouter();

const username = ref('');
const password = ref('');
const login_error = ref(false);

async function handle_login() {
    const login_success = login(username.value, password.value);

    if (login_success) {
        login_error.value = false;

        await router.push('/demo');

    } else {
        login_error.value = true;
    }
}
</script>

<template>
    <div class="content">
        <form @submit.prevent="handle_login" class="login_form">
            <h1 class="login_form_title">Accede a tus pensamientos</h1>
            <div class="login_form_input">
                <div class="login_form_user">
                    <label for="username">Usuario</label>
                    <input id="username" type="text" v-model="username" required>
                </div>
                <div class="login_form_pass">
                    <label for="password">Contraseña</label>
                    <input id="password" type="text" v-model="password" required>
                </div>
            </div>
            <p v-if="login_error" class="error_message">Usuario o contraseña incorrectos</p>
            <button type="submit" class="login_button">
                <span class="login_button_tag">Abrir el cofre</span>
                <span class=" login_button_icon material-symbols-sharp">lock_open</span>
            </button>
        </form>
    </div>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4rem 4rem 4rem;
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .login_form {
        display: flex;
        flex-direction: column;
        width: clamp(128px, 100%, 512px);
        border: 3px solid $color_dark;

        .login_form_title {
            display: flex;
            padding: 4rem;
        }

        .login_form_input {
            display: flex;
            flex-direction: column;
            padding: 0 4rem;
            gap: 2rem;

            .login_form_user,
            .login_form_pass {
                display: flex;
                flex-direction: column;
                gap: .5rem;
                background: $color_light;
                width: 100%;
            }

            label {
                font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                font-weight: 450;
            }

            input {
                height: 3rem;
                padding: .5rem;
                border: 3px solid $color_dark;
                background: $color_light;
                font-size: clamp(1.25rem, 2.5dvw, 1.5rem);

                &#password {
                    font-size: clamp(1.5rem, 2.5dvw, 2rem);
                    font-family: 'TypeLock Locked';
                }
            }
        }

        .login_button {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 4rem;
            width: 100%;
            cursor: pointer;
            user-select: none;

            .login_button_tag {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 3rem;
                background: $color_light;
                border-top: 3px solid $color_dark;
                font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                font-weight: 450;
            }

            .login_button_icon {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 3rem;
                height: 3rem;
                background: $color_light;
                border-top: 3px solid $color_dark;
                border-left: 3px solid $color_dark;
                font-size: 2rem;
                font-weight: 450;
            }

            @media (hover:hover) {
                &:hover {

                    .login_button_tag,
                    .login_button_icon {
                        background: $color_dark;
                        color: $color_light;
                    }
                }
            }

            &:active {

                .login_button_tag,
                .login_button_icon {
                    background: $color_dark;
                    color: $color_light;
                }
            }
        }

        .error_message {
            padding: 2rem 4rem 0 4rem;
            color: $color_medium;
            font-size: clamp(1rem, 2.5dvw, 1.25rem);
            font-weight: 450;
        }
    }
}

@media (max-width: 768px) {
    .content {

        .login_form {
            .login_form_title {
                padding: 2rem;
            }

            .login_form_input {
                padding: 0 2rem;
            }

            .login_button {
                padding-top: 2rem;
            }

            .error_message {
                padding: 1rem 2rem 0 2rem;
            }
        }
    }
}
</style>