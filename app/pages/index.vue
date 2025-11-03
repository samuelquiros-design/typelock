<script setup>
import { ref, onMounted } from 'vue';
import { demo_auth } from '~/composables/demo_auth';

const { demo_link } = demo_auth();
const about_content_paragraphs = [
    `Hay palabras que se ofrecen, y otras que se protegen.`.split(' '),
    `"TypeLock" es una tipografía que nace para custodiar esas palabras que valen más de lo que dicen.`.split(' '),
    `Como un cofre que solo revela su interior a aquel que tenga la llave, su forma cambia entre lo abierto, lo cerrado y lo bloqueado.`.split(' '),
    `El usuario se convierte en guardián de cada letra, cada palabra, cada pensamiento.`.split(' ')
];
const about_content_ref = ref(null);

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    if (document.readyState !== 'complete') {
        await new Promise(resolve => {
            window.addEventListener('load', resolve, { once: true });
        });
    }

    await wait(3000);

    const about_content = document.querySelector('.about_content');
    const about_content_words = about_content_ref.value.querySelectorAll('.word');

    async function cycle_font() {

        function lock_content() {
            about_content.classList.add('content_locked');
            for (let i = 0; i < about_content_words.length; i++) {
                about_content_words[i].classList.add('content_locked');
            }
        }

        function unlock_content() {
            about_content.classList.remove('content_locked');
            for (let i = 0; i < about_content_words.length; i++) {
                about_content_words[i].classList.remove('content_locked');
            }
        }

        await wait(10000);

        for (let i = 0; i < about_content_words.length; i++) {
            about_content_words[i].classList.add('unlocked');
            await wait(30);
        }

        await wait(500);
        lock_content();

        await wait(500);
        about_content_words.forEach(word => word.classList.remove('unlocked'));
        about_content_words.forEach(word => word.classList.add('locked'));

        await wait(5000);
        about_content_words.forEach(word => word.classList.remove('locked'));
        about_content_words.forEach(word => word.classList.add('unlocked'));

        await wait(500);
        unlock_content();

        await wait(500);
        for (let i = about_content_words.length - 1; i >= 0; i--) {
            about_content_words[i].classList.remove('unlocked');
            await wait(30);
        }

        cycle_font();
    }

    cycle_font();
});
</script>

<template>
    <div class="content">
        <section class="about">
            <div class="about_content" ref="about_content_ref">
                <p v-for="(paragraph, paragraph_index) in about_content_paragraphs" :key="paragraph_index">
                    <span v-for="(word, word_index) in paragraph" :key="word_index" class="word">
                        {{ word + (word_index < paragraph.length - 1 ? ' ' : '') }} </span>
                </p>
            </div>

            <div class="about_cta">
                <button class="about_cta_demo">
                    <NuxtLink :to="demo_link">
                        <span class="button_tag">Probar TypeLock</span>
                        <span class="material-symbols-sharp">experiment</span>
                    </NuxtLink>
                </button>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    padding: 4rem 4rem 8rem 4rem;
    overflow-y: auto;
    font-size: 2rem;

    .about {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 70%;
        margin-top: auto;
        margin-bottom: auto;

        .about_content {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
            transition: gap .25s ease-out;
            user-select: none;

            &.content_locked {
                gap: 0;
                transition: gap .25s ease-out;
            }

            p {

                .word {
                    display: inline;
                    line-height: 1.2;
                    transition: line-height .25s ease-out;

                    &.unlocked {
                        font-family: 'TypeLock Unlocked';
                        font-size: 2.75rem;
                    }

                    &.locked {
                        font-family: 'TypeLock Locked';
                        font-size: 2.75rem;
                    }

                    &.content_locked {
                        line-height: .93;
                        transition: line-height .25s ease-out;
                    }
                }
            }
        }

        .about_cta {
            position: fixed;
            bottom: .5rem;

            .about_cta_demo {
                display: flex;
                justify-content: end;

                a {
                    display: flex;
                    align-items: center;

                    .button_tag {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 3rem;
                        padding: 0 1rem;
                        background: $color_light;
                        border: 3px solid $color_dark;
                        border-right: none;
                        font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                        font-weight: 450;
                    }

                    .material-symbols-sharp {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 3rem;
                        height: 3rem;
                        background: $color_light;
                        border: 3px solid $color_dark;
                        font-size: 2rem;
                        font-weight: 450;
                    }
                }

                @media (hover: hover) {

                    &:hover {
                        .button_tag {
                            background: $color_dark;
                            color: $color_light;
                        }

                        .material-symbols-sharp {
                            background: $color_dark;
                            color: $color_light;
                        }
                    }
                }

                &:active {
                    .button_tag {
                        background: $color_dark;
                        color: $color_light;
                    }

                    .material-symbols-sharp {
                        background: $color_dark;
                        color: $color_light;
                    }
                }
            }
        }
    }
}

@media (max-width: 1024px) {
    .content {
        .about {
            width: 85%;

            .about_content {
                gap: 1.25rem;
            }
        }
    }
}

@media (max-width: 768px) {
    .content {
        font-size: 1.5rem;

        .about {
            width: 100%;

            .about_content {
                gap: 1rem;

                p {
                    .word {
                        &.unlocked {
                            font-size: 2rem;
                        }

                        &.locked {
                            font-size: 2rem;
                        }
                    }
                }
            }
        }
    }
}
</style>