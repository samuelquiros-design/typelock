<script setup>
import { ref, onMounted } from 'vue';

const preview_mode = ref('unlocked');
const selected_glyph = ref(null);
const glyph_ranges = ref({
    'Glyphs': [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.'
    ]
});

onMounted(() => {
    for (const range_name of Object.keys(glyph_ranges.value)) {
        if (glyph_ranges.value[range_name].length > 0) {
            selected_glyph.value = glyph_ranges.value[range_name][0];
            preview_mode.value = 'unlocked';
            break;
        }
    }
});
</script>

<template>
    <div class="content">
        <div class="glyph_preview" :class="'preview_' + preview_mode">
            <span v-if="selected_glyph" class="preview_char">{{ selected_glyph }}</span>
        </div>

        <div class="glyph_ranges">
            <section v-for="(glyphs, range_name) in glyph_ranges" :key="'unlocked-' + range_name"
                class="glyph_range_section section_unlocked">
                <h1 class="section_title">Typelock Unlocked</h1>
                <div class="glyph_map">
                    <div v-for="(glyph, index) in glyphs" :key="glyph + index" class="glyph_cell"
                        :class="{ selected: selected_glyph === glyph && preview_mode === 'unlocked' }"
                        @click="selected_glyph = glyph; preview_mode = 'unlocked'">
                        {{ glyph }}
                    </div>
                </div>
            </section>

            <section v-for="(glyphs, range_name) in glyph_ranges" :key="'locked-' + range_name"
                class="glyph_range_section section_locked">
                <h1 class="section_title">Typelock Locked</h1>
                <div class="glyph_map">
                    <div v-for="(glyph, index) in glyphs" :key="glyph + index" class="glyph_cell"
                        :class="{ selected: selected_glyph === glyph && preview_mode === 'locked' }"
                        @click="selected_glyph = glyph; preview_mode = 'locked'">
                        {{ glyph }}
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    align-items: start;
    width: 100%;
    overflow-y: hidden;

    .glyph_preview {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4rem;
        width: 30%;
        height: 100%;
        font-size: 20rem;
        color: $color_dark;
        text-align: center;
        background: $color_light;

        &.preview_unlocked {
            font-family: 'TypeLock Unlocked';
        }

        &.preview_locked {
            font-family: 'TypeLock Locked';
        }

        .preview_char {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16rem;
            height: 16rem;
            line-height: 16rem;
            text-align: center;
            user-select: none;
        }
    }

    .glyph_ranges {
        display: flex;
        flex-direction: column;
        gap: 4rem;
        padding: 4rem;
        width: 70%;
        height: 100%;
        border-left: 3px solid $color_dark;
        overflow-y: auto;

        .glyph_range_section {
            display: flex;
            flex-direction: column;
            gap: 2rem;

            &.section_unlocked {
                .glyph_map {
                    font-family: 'TypeLock Unlocked';
                }
            }

            &.section_locked {
                .glyph_map {
                    font-family: 'TypeLock Locked';
                }
            }

            .glyph_map {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(clamp(3.5rem, 10dvw, 5rem), 1fr));
                justify-content: center;
                color: $color_dark;

                .glyph_cell {
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: auto;
                    aspect-ratio: 1 / 1;
                    font-size: 3.5rem;
                    text-align: center;
                    user-select: none;
                    cursor: pointer;

                    @media (hover: hover) {

                        &:hover {
                            border: 3px solid $color_dark;
                        }
                    }

                    &:active {
                        border: 3px solid $color_dark;
                    }

                    &.selected {
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
        .glyph_preview {
            width: 40%;
        }

        .glyph_ranges {
            width: 60%;
        }
    }
}

@media (max-width: 768px) {
    .content {
        flex-direction: column;

        .glyph_preview {
            width: 100%;
            height: 30%;
            font-size: 10rem;
            border-bottom: 3px solid $color_dark;

            .preview_char {
                width: 8rem;
                height: 8rem;
                line-height: 8rem;
                text-align: center;
            }
        }

        .glyph_ranges {
            width: 100%;
            gap: 4rem;
            padding: 4rem;
            margin: 0;
            border: none;

            .glyph_range_section {
                .glyph_map {
                    .glyph_cell {
                        font-size: 2.5rem;
                    }
                }
            }
        }
    }
}
</style>