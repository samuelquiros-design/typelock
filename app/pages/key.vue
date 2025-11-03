<script setup>
import { demo_auth } from '~/composables/demo_auth';

const { demo_user, demo_pass } = demo_auth();
</script>

<template>
    <div class="content">
        <div class="key_overlay">
            <div class="key">
                <p class="key_info">
                    Aquí tienes las credenciales para abrir tu cofre de pensamientos.
                </p>
                <div class="key_credentials">
                    <div class="key_user">
                        <h2 class="user_title">Usuario</h2>
                        <div class="user_data">
                            <span class="username"> {{ demo_user }} </span>
                            <span class="material-symbols-sharp">visibility</span>
                        </div>

                    </div>
                    <div class="key_pass">
                        <h2 class="pass_title">Contraseña</h2>
                        <div class="pass_data">
                            <span class="password">{{ demo_pass }}</span>
                            <span class="material-symbols-sharp">visibility</span>
                        </div>
                    </div>
                </div>
                <p class="key_warning">
                    No compartas esta información ni tu llave física con personas ajenas a tu mente.
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem;
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .key_overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4rem;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: $color_light;
        z-index: 4;

        .key {
            display: flex;
            flex-direction: column;
            width: clamp(128px, 100%, 512px);
            border: 3px solid $color_dark;
            user-select: none;

            .key_info {
                display: flex;
                padding: 4rem;
                font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
            }

            .key_credentials {
                display: flex;
                flex-direction: column;
                padding: 0 4rem;
                gap: 2rem;

                .key_user,
                .key_pass {
                    display: flex;
                    flex-direction: column;
                    gap: .5rem;
                    width: 100%;

                    .user_data,
                    .pass_data {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        height: 3rem;
                        border: 3px solid $color_dark;
                        font-family: 'TypeLock Locked';
                        font-size: clamp(1.5rem, 2.5dvw, 2rem);

                        .username,
                        .password {
                            padding: .5rem;
                        }

                        .material-symbols-sharp {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 3rem;
                            height: 3rem;
                            border-left: 3px solid $color_dark;
                            font-size: 2rem;
                        }

                        @media (hover: hover) {
                            &:hover {

                                .username,
                                .password {
                                    font-family: 'Archivo';
                                    font-size: clamp(1rem, 2.5dvw, 1.25rem);
                                }

                                .material-symbols-sharp {
                                    background: $color_dark;
                                    color: $color_light;
                                }
                            }
                        }

                        &:active {

                            .username,
                            .password {
                                font-family: 'Archivo';
                                font-size: clamp(1rem, 2.5dvw, 1.25rem);
                            }

                            .material-symbols-sharp {
                                background: $color_dark;
                                color: $color_light;
                            }
                        }
                    }
                }
            }

            .key_warning {
                display: flex;
                padding: 4rem;
                font-size: clamp(1rem, 2.5dvw, 1.25rem);
            }
        }
    }
}

@media (max-width: 768px) {
    .content {
        .key_overlay {
            .key {
                .key_info {
                    padding: 2rem;
                }

                .key_credentials {
                    padding: 0 2rem;
                }

                .key_warning {
                    padding: 2rem;
                }
            }
        }
    }
}
</style>