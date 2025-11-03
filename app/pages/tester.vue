<script setup>
import { ref, watch, onMounted } from 'vue';

const user_input = ref('');
const is_focused = ref(false);
const input_ref = ref(null);
const font_size = ref(48);
const slider_ref = ref(null);
const slider_min_value = 8;
const slider_max_value = 256;

const update_slider_style = () => {
    const val = font_size.value;
    const percent = ((val - slider_min_value) / (slider_max_value - slider_min_value)) * 100;
    if (slider_ref.value) {
        slider_ref.value.style.setProperty('--val', `${percent}%`);
    }
};

watch(font_size, update_slider_style);

onMounted(() => {
    update_slider_style();
});

function focus_input() {
    input_ref.value?.focus();
}
</script>

<template>
    <div class="content">
        <div class="tester_input">
            <div class="tester_form" :class="{ focused: is_focused }" @click="focus_input">
                <span class="material-symbols-sharp">stylus</span>
                <input id="user_input" ref="input_ref" v-model="user_input" placeholder="Escribe aquí..."
                    @focus="is_focused = true" @blur="is_focused = false" />
            </div>

            <div class="tester_slider">
                <span class="size_current">{{ font_size + 'px' }}</span>
                <input ref="slider_ref" class="size_slider" type="range" min="8" max="256" step="4" v-model="font_size"
                    @click.stop />
            </div>
        </div>

        <div class="tester_preview">
            <p class="tester_output_regular" :style="{ fontSize: font_size + 'px' }">
                {{ user_input || 'TypeLock Unlocked' }}
            </p>
        </div>

        <div class="tester_preview">
            <p class="tester_output_black" :style="{ fontSize: font_size + 'px' }">
                {{ user_input || 'TypeLock Locked' }}
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
    padding: 4rem;
    gap: 4rem;
    overflow-y: auto;

    .tester_input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 2rem;

        .tester_form {
            display: flex;
            align-items: center;
            justify-content: start;
            width: 50%;
            height: 3rem;
            gap: 1rem;
            padding: 0 1rem;
            border-bottom: 2px solid $color_dark;
            cursor: text;

            span {
                font-size: clamp(1.5rem, 2.5dvw, 2rem);
                color: $color_dark;
            }

            input {
                font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                color: $color_dark;
                width: 100%;
            }

            @media (hover: hover) {

                &:hover {
                    border-bottom: 2px solid $color_medium;

                    span,
                    input {
                        color: $color_medium;
                    }
                }
            }

            &:active {
                border-bottom: 3px solid $color_medium;

                span,
                input {
                    color: $color_medium;
                }
            }

            &.focused {
                border-bottom: 3px solid $color_medium;

                span,
                input {
                    color: $color_medium;
                }
            }
        }

        .tester_slider {
            display: flex;
            align-items: center;
            justify-content: end;
            gap: 1rem;
            height: 3rem;
            user-select: none;

            .size_current {
                font-size: clamp(1rem, 2.5dvw, 1.25rem);
                font-weight: 450;
            }

            .size_slider {
                cursor: pointer;
                width: 160px;
                height: 2px;
                border-radius: 0;
                background: transparent;

                &::-webkit-slider-runnable-track {
                    background: $color_dark;
                    height: 3px;
                    border-radius: 0;
                }

                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 0;
                    background: $color_light;
                    border: 3px solid $color_dark;
                    margin-top: -6px;
                    z-index: 1;
                    position: relative;
                }

                &::-moz-range-track {
                    background: $color_dark;
                    height: 2px;
                    border-radius: 0;
                }

                &::-moz-range-progress {
                    background: $color_dark;
                    height: 3px;
                    border-radius: 0;
                }

                &::-moz-range-thumb {
                    height: 16px;
                    width: 16px;
                    border-radius: 0;
                    background: $color_light;
                    border: 3px solid $color_dark;
                }

                &:hover,
                &:active {
                    &::-webkit-slider-thumb {
                        background: $color_dark;
                    }

                    &::-moz-range-thumb {
                        background: $color_dark;
                    }
                }
            }
        }
    }

    .tester_preview {
        display: flex;
        width: 100%;
        padding: 2rem 3rem;
        border: 3px solid $color_dark;
        user-select: none;

        .tester_output_regular {
            font-family: 'TypeLock Unlocked', 'Archivo';
            word-break: break-word;
        }

        .tester_output_black {
            font-family: 'TypeLock Locked', 'Archivo';
            word-break: break-word;
        }
    }
}

@media (max-width: 768px) {
    .content {
        gap: 2rem;

        .tester_input {
            flex-direction: column;
            align-items: end;
            gap: 1rem;

            .tester_form {
                width: 100%;
            }
        }

        .tester_preview {
            padding: 1rem 1.5rem;
        }
    }
}
</style>