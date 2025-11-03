<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

const toast_message = ref("");
const toast_visible = ref(false);
const font_size = ref(32);
const font_type = ref('locked');
const desktop_default_font_size = 32;
const mobile_default_font_size = 24;
const mobile_breakpoint = 768;
const notes = ref([]);
const editing_note = ref(null);
const fullscreen_content_ref = ref(null);
const has_initialized = ref(false);
const slider_ref = ref(null);
const slider_min_value = 16;
const slider_max_value = 128;
const default_note_theme = 'light-dark';
const theme_options = ['light-dark', 'dark-light', 'light-medium', 'medium-light', 'medium-dark', 'dark-medium'];
const opposite_themes = { 'light-dark': 'dark-light', 'dark-light': 'light-dark', 'light-medium': 'medium-light', 'medium-light': 'light-medium', 'medium-dark': 'dark-medium', 'dark-medium': 'medium-dark' };
const toast_theme_class = ref(opposite_themes[default_note_theme]);

function show_toast(message, duration = 3000) {
    toast_message.value = message;
    toast_visible.value = true;
    setTimeout(() => (toast_visible.value = false), duration);
}

function update_slider_style() {
    const val = font_size.value;
    const percent = ((val - slider_min_value) / (slider_max_value - slider_min_value)) * 100;
    if (slider_ref.value) {
        slider_ref.value.style.setProperty('--val', `${percent}%`);
    }
}

function font_family(type) {
    switch (type) {
        case 'unlocked': return 'TypeLock Unlocked';
        case 'locked': return 'TypeLock Locked';
        default: return 'Archivo';
    }
}

function save_local_notes_data() {
    const data = {
        notes: notes.value.map(note => ({
            id: note.id,
            text: note.text,
            note_theme: note.note_theme || default_note_theme
        })),
    };
    localStorage.setItem('local_notes_data', JSON.stringify(data));
}

function load_local_notes_data(initial_font_size) {
    const data = localStorage.getItem('local_notes_data');
    if (!data) return false;

    try {
        const parsed = JSON.parse(data);
        notes.value = parsed.notes || [];

        notes.value.forEach(note => {
            note.font_size = initial_font_size;
            note.font_type = font_type.value;
            note.note_theme = note.note_theme || default_note_theme;
            note.editing = false;
        });

        delete_empty_notes();
        return true;
    } catch (e) {
        return false;
    }
}

function add_tutorial_notes(initial_font_size) {
    font_type.value = 'default';

    return [
        {
            id: 'tutorial_01',
            text: "Esto es un pensamiento. Puedes acceder a él para editarlo o eliminarlo.",
            font_size: initial_font_size,
            font_type: font_type.value,
            note_theme: default_note_theme,
            editing: false
        },
        {
            id: 'tutorial_02',
            text: "También puedes crear uno nuevo con el botón del principio de la lista.",
            font_size: initial_font_size,
            font_type: font_type.value,
            note_theme: default_note_theme,
            editing: false
        },
        {
            id: 'tutorial_03',
            text: "Utiliza los controles superiores para abrir, cerrar y bloquear tus pensamientos.",
            font_size: initial_font_size,
            font_type: font_type.value,
            note_theme: default_note_theme,
            editing: false
        }
    ];
}

async function add_note() {
    const note_id = Date.now();
    const new_item = {
        id: note_id,
        text: "",
        font_size: font_size.value,
        font_type: font_type.value,
        note_theme: default_note_theme,
        editing: true
    };
    notes.value.unshift(new_item);
    editing_note.value = new_item;
    has_initialized.value = false;
    await nextTick();
    focus_cursor_end();
    save_local_notes_data();
}

function open_note(note) {
    editing_note.value = note;
    has_initialized.value = false;
    nextTick(focus_cursor_end);
}

function close_note() {
    if (!editing_note.value) return;
    const text = editing_note.value.text.trim();
    if (text === "") {
        show_toast("No se puede guardar un pensamiento vacío.");
        return;
    }
    editing_note.value.text = text;
    editing_note.value = null;
    save_local_notes_data();
    delete_empty_notes();
}

function delete_note(id) {
    notes.value = notes.value.filter(n => n.id !== id);
    if (editing_note.value && editing_note.value.id === id) editing_note.value = null;
    save_local_notes_data();
}

function delete_empty_notes() {
    const before = notes.value.length;
    notes.value = notes.value.filter(note => note.text && note.text.trim() !== "");
    if (notes.value.length !== before) {
        save_local_notes_data();
    }
}

function focus_cursor_end() {
    const el = fullscreen_content_ref.value;
    if (!el || !editing_note.value) return;

    if (!has_initialized.value) {
        el.innerText = editing_note.value.text;
        has_initialized.value = true;
    }

    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function cycle_note_theme() {
    if (!editing_note.value) return;

    const current_theme = editing_note.value.note_theme;
    const current_index = theme_options.indexOf(current_theme);
    const next_index = (current_index + 1) % theme_options.length;

    editing_note.value.note_theme = theme_options[next_index];

    save_local_notes_data();
}

watch(editing_note, (new_note) => {
    if (new_note && new_note.note_theme) {
        toast_theme_class.value = opposite_themes[new_note.note_theme] || opposite_themes[default_note_theme];
    } else {
        toast_theme_class.value = opposite_themes[default_note_theme];
    }
}, { deep: true, immediate: true });

watch(font_size, (val) => {
    update_slider_style();
    notes.value.forEach(note => note.font_size = val);
    save_local_notes_data();
});

watch(font_type, (val) => {
    notes.value.forEach(note => note.font_type = val);
    save_local_notes_data();
});

watch(notes, save_local_notes_data, { deep: true });

onMounted(() => {
    const initial_font_size = window.innerWidth < mobile_breakpoint ? mobile_default_font_size : desktop_default_font_size;
    const loaded = load_local_notes_data(initial_font_size);

    if (!loaded || notes.value.length === 0) {
        notes.value = add_tutorial_notes(initial_font_size);
        save_local_notes_data();
    }

    update_slider_style();
    delete_empty_notes();
});
</script>

<template>
    <div class="content">
        <div class="toast_overlay" :class="[toast_theme_class, { visible: toast_visible }]">
            {{ toast_message }}
        </div>

        <div class="notes_controls">
            <div class="state_buttons">
                <button :class="{ active: font_type === 'default' }" @click="font_type = 'default'">
                    <span class="material-symbols-sharp">font_download</span>
                </button>
                <button :class="{ active: font_type === 'unlocked' }" @click="font_type = 'unlocked'">
                    <span class="material-symbols-sharp">lock_open</span>
                </button>
                <button :class="{ active: font_type === 'locked' }" @click="font_type = 'locked'">
                    <span class="material-symbols-sharp">lock</span>
                </button>
            </div>

            <div class="control_slider">
                <span class="material-symbols-sharp">format_size</span>
                <input ref="slider_ref" class="size_slider" type="range" :min="slider_min_value" :max="slider_max_value"
                    step="4" v-model="font_size" @click.stop />
            </div>
        </div>

        <ul class="notes_list">
            <li class="note_item add_button" @click="add_note">
                <span class="add_icon material-symbols-sharp">add</span>
            </li>

            <li v-for="note in notes" :key="note.id" class="note_item" :class="note.note_theme"
                @click="open_note(note)">
                <div class="note_content" :class="note.font_type"
                    :style="{ fontSize: note.font_size + 'px', fontFamily: font_family(note.font_type) }">
                    {{ note.text }}
                </div>
            </li>
        </ul>

        <div v-if="editing_note" class="fullscreen_overlay" @click.self="close_note">
            <div class="fullscreen_note">
                <div class="fullscreen_header">
                    <button class="edit_button edit_delete" @click="delete_note(editing_note.id)">
                        <span class="edit_button_icon material-symbols-sharp">delete</span>
                        <span class="edit_button_tag">Eliminar</span>
                    </button>

                    <div class="theme_buttons theme_buttons_desktop">
                        <button v-for="theme in theme_options" :key="theme"
                            :class="['theme_button', theme, { active: editing_note.note_theme === theme }]"
                            @click="editing_note.note_theme = theme; save_local_notes_data()">
                            <span>A</span>
                        </button>
                    </div>

                    <button class="theme_button theme_button_mobile" :class="[editing_note.note_theme]"
                        @click="cycle_note_theme">
                        <span>A</span>
                    </button>

                    <button class="edit_button edit_save" @click="close_note">
                        <span class="edit_button_tag">Guardar</span>
                        <span class="edit_button_icon material-symbols-sharp">check</span>
                    </button>
                </div>
                <textarea class="fullscreen_content" :class="[editing_note.note_theme]" ref="fullscreen_content_ref"
                    placeholder="Escribe aquí tu pensamiento..." v-model="editing_note.text" autofocus></textarea>
            </div>
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
    margin-top: 3rem;
    gap: 2rem;
    overflow-y: auto;

    .toast_overlay {
        position: fixed;
        bottom: 3rem;
        left: 50%;
        transform: translateX(-50%) translateY(100%);
        padding: 1.5rem 2rem;
        font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
        font-weight: 450;
        user-select: none;
        pointer-events: none;
        opacity: 0;
        z-index: 6;
        transition: transform .3s ease-out;

        &.visible {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
            transition: transform .3s ease-out;
        }

        &.light-dark {
            background: $color_light;
            color: $color_dark;
        }

        &.dark-light {
            background: $color_dark;
            color: $color_light;
        }

        &.light-medium {
            background: $color_light;
            color: $color_medium;
        }

        &.medium-light {
            background: $color_medium;
            color: $color_light;
        }

        &.medium-dark {
            background: $color_medium;
            color: $color_dark;
        }

        &.dark-medium {
            background: $color_dark;
            color: $color_medium;
        }
    }

    .notes_controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 3rem;
        position: fixed;
        top: 6rem;
        left: 0;
        background: $color_light;
        border-bottom: 3px solid $color_dark;
        user-select: none;

        .state_buttons {
            display: flex;

            button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3rem;
                height: 3rem;
                cursor: pointer;
                user-select: none;
                border-right: 3px solid $color_dark;

                .material-symbols-sharp {
                    font-size: 2rem;
                    font-weight: 450;
                }

                @media (hover: hover) {

                    &:hover {
                        background: $color_dark;
                        color: $color_light;
                    }
                }

                &:active,
                &.active {
                    background: $color_dark;
                    color: $color_light;
                }
            }
        }

        .control_slider {
            display: flex;
            align-items: center;
            justify-content: end;
            gap: 1rem;
            padding: 0 1rem;

            .material-symbols-sharp {
                font-size: 2rem;
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

    .notes_list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(384px, 1fr));
        gap: 2rem;
        width: 100%;
        user-select: none;

        .note_item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            min-width: 128px;
            min-height: 128px;
            cursor: pointer;

            .note_content {
                max-width: 100%;
                text-align: center;
                overflow-wrap: break-word;
                line-height: 1.2;
                transition: line-height .25s ease-out;

                &.unlocked,
                &.locked {
                    line-height: .93;
                    transition: line-height .25s ease-out;
                }
            }

            &.light-dark {
                background: $color_light;
                border: 3px solid $color_dark;

                .note_content {
                    color: $color_dark;
                }

                @media (hover: hover) {

                    &:hover {
                        background: $color_dark;

                        .note_content {
                            color: $color_light;
                        }
                    }
                }

                &:active {
                    background: $color_dark;

                    .note_content {
                        color: $color_light;
                    }
                }
            }

            &.dark-light {
                background: $color_dark;
                border: 3px solid transparent;

                .note_content {
                    color: $color_light;
                }

                @media (hover: hover) {

                    &:hover {
                        background: $color_light;
                        border-color: $color_dark;

                        .note_content {
                            color: $color_dark;
                        }
                    }
                }

                &:active {
                    background: $color_light;
                    border-color: $color_dark;

                    .note_content {
                        color: $color_dark;
                    }
                }
            }

            &.light-medium {
                background: $color_light;
                border: 3px solid $color_medium;

                .note_content {
                    color: $color_medium;
                }

                @media (hover: hover) {

                    &:hover {
                        background: $color_medium;

                        .note_content {
                            color: $color_light;
                        }
                    }
                }

                &:active {
                    background: $color_medium;

                    .note_content {
                        color: $color_light;
                    }
                }
            }

            &.medium-light {
                background: $color_medium;
                border: 3px solid transparent;

                .note_content {
                    color: $color_light;
                }

                @media (hover: hover) {

                    &:hover {
                        background: $color_light;
                        border-color: $color_medium;

                        .note_content {
                            color: $color_medium;
                        }
                    }
                }

                &:active {
                    background: $color_light;
                    border-color: $color_medium;

                    .note_content {
                        color: $color_medium;
                    }
                }
            }

            &.medium-dark {
                background: $color_medium;
                border: 3px solid transparent;

                .note_content {
                    color: $color_dark;
                }

                @media (hover: hover) {

                    &:hover {
                        background: $color_dark;

                        .note_content {
                            color: $color_medium;
                        }
                    }
                }

                &:active {
                    background: $color_dark;

                    .note_content {
                        color: $color_medium;
                    }
                }
            }

            &.dark-medium {
                background: $color_dark;
                border: 3px solid transparent;

                .note_content {
                    color: $color_medium;
                }

                @media (hover: hover) {

                    &:hover {
                        background: $color_medium;

                        .note_content {
                            color: $color_dark;
                        }
                    }
                }

                &:active {
                    background: $color_medium;

                    .note_content {
                        color: $color_dark;
                    }
                }
            }
        }

        .add_button {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px dashed $color_dark;
            background: $color_light;
            cursor: pointer;
            user-select: none;

            .add_icon {
                font-size: clamp(1.5rem, 2.5dvw, 2rem);
                font-weight: 450;
            }

            @media (hover: hover) {

                &:hover {
                    border-color: $color_medium;
                    color: $color_medium;
                }
            }

            &:active {
                border-color: $color_medium;
                color: $color_medium;
            }
        }
    }

    .fullscreen_overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 4;

        .fullscreen_note {
            display: flex;
            flex-direction: column;
            background: $color_light;
            padding: 3rem;
            gap: 3rem;
            width: 100%;
            height: 100%;

            .fullscreen_header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                width: 100%;

                .theme_button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 3rem;
                    height: 3rem;
                    cursor: pointer;
                    user-select: none;
                    border: 3px solid transparent;

                    span {
                        font-size: clamp(1.5rem, 2.5dvw, 2rem);
                        font-weight: 450;
                    }

                    @media (hover: hover) {
                        &:hover {
                            text-decoration: underline .2rem solid;
                            text-underline-offset: .2rem;
                        }
                    }

                    &:active,
                    &.active {
                        text-decoration: underline .2rem solid;
                        text-underline-offset: .2rem;
                    }

                    &.light-dark {
                        background: $color_light;
                        color: $color_dark;
                        border-color: $color_dark;
                    }

                    &.dark-light {
                        background: $color_dark;
                        color: $color_light;
                    }

                    &.light-medium {
                        background: $color_light;
                        color: $color_medium;
                        border-color: $color_medium;
                    }

                    &.medium-light {
                        background: $color_medium;
                        color: $color_light;
                    }

                    &.medium-dark {
                        background: $color_medium;
                        color: $color_dark;
                        border-color: $color_dark;
                    }

                    &.dark-medium {
                        background: $color_dark;
                        color: $color_medium;
                    }
                }

                .theme_buttons_desktop {
                    display: flex;
                    gap: 1rem;
                }

                .theme_button_mobile {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: 3rem;
                    height: 3rem;
                    cursor: pointer;
                    border: 3px solid transparent;
                }
            }

            .edit_button {
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;

                .edit_button_tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 3rem;
                    padding: 0 1rem;
                    background: $color_light;
                    border: 3px solid $color_dark;
                    font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                    font-weight: 450;
                }

                .edit_button_icon {
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

                &.edit_delete {
                    .edit_button_tag {
                        border-left: none;
                    }
                }

                &.edit_save {
                    .edit_button_tag {
                        border-right: none;
                    }
                }

                @media (hover: hover) {

                    &:hover {

                        .edit_button_tag,
                        .edit_button_icon {
                            background: $color_dark;
                            color: $color_light;
                        }
                    }
                }

                &:active {

                    .delete_button_tag,
                    .material-symbols-sharp {
                        background: $color_dark;
                        color: $color_light;
                    }
                }
            }
        }

        .fullscreen_content {
            padding: 1rem 1.5rem;
            height: 100%;
            overflow-y: auto;
            resize: none;
            font-size: clamp(1.25rem, 2.5dvw, 1.75rem);

            &.light-dark {
                background: $color_light;
                border: 3px solid $color_dark;
                color: $color_dark;
            }

            &.dark-light {
                background: $color_dark;
                border: 3px solid transparent;
                color: $color_light;
            }

            &.light-medium {
                background: $color_light;
                border: 3px solid $color_medium;
                color: $color_medium;
            }

            &.medium-light {
                background: $color_medium;
                border: 3px solid transparent;
                color: $color_light;
            }

            &.medium-dark {
                background: $color_medium;
                border: 3px solid transparent;
                color: $color_dark;
            }

            &.dark-medium {
                background: $color_dark;
                border: 3px solid transparent;
                color: $color_medium;
            }
        }
    }
}

@media (max-width: 1024px) {
    .content {
        .notes_controls {
            .control_slider {
                .size_slider {
                    width: 128px;
                }
            }
        }

        .notes_list {
            grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
        }

        .fullscreen_overlay {
            .fullscreen_note {
                .fullscreen_header {
                    gap: .5rem;

                    .theme_buttons {
                        gap: .5rem;
                    }
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .content {
        .notes_controls {
            .control_slider {
                .size_slider {
                    width: 96px;
                }
            }
        }

        .notes_list {
            grid-template-columns: 1fr;
        }

        .fullscreen_overlay {
            .fullscreen_note {
                .fullscreen_header {
                    .edit_button {
                        .edit_button_tag {
                            display: none;
                        }
                    }

                    .theme_buttons_desktop {
                        display: none;
                    }

                    .theme_button_mobile {
                        display: flex;
                    }
                }
            }
        }
    }
}
</style>