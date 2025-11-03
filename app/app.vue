<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { favicon } from '~/composables/favicon';
import { demo_auth } from '~/composables/demo_auth';

const { demo_link } = demo_auth();
const route = useRoute();
const is_menu_open = ref(false);
const splash_visible = ref(true);
const reset_scroll_visible = ref(false);
const reset_scroll_visible_threshold = 0;

let scrollable_elements = [];
let mutation_observer = null;


function toggle_menu() {
  is_menu_open.value = !is_menu_open.value;
}

function open_menu() {
  is_menu_open.value = true;
}

function close_menu() {
  is_menu_open.value = false;
}

function get_scrollable_elements() {
  const all = Array.from(document.querySelectorAll('*'));
  return all.filter(el => {
    const cs = window.getComputedStyle(el);
    const overflow_y = cs.overflowY;
    const can_overflow =
      overflow_y === 'auto' ||
      overflow_y === 'scroll' ||
      overflow_y === 'overlay';
    return can_overflow && el.scrollHeight > el.clientHeight;
  });
}

function on_any_scroll() {
  if ((window.scrollY || window.pageYOffset) > reset_scroll_visible_threshold) {
    reset_scroll_visible.value = true;
    return;
  }

  for (const el of scrollable_elements) {
    if (el.scrollTop > reset_scroll_visible_threshold) {
      reset_scroll_visible.value = true;
      return;
    }
  }

  reset_scroll_visible.value = false;
}

function bind_scroll_listeners() {
  unbind_scroll_listeners();
  scrollable_elements = get_scrollable_elements();
  window.addEventListener('scroll', on_any_scroll, { passive: true });
  for (const el of scrollable_elements) {
    el.addEventListener('scroll', on_any_scroll, { passive: true });
  }
  on_any_scroll();
}

function unbind_scroll_listeners() {
  try {
    window.removeEventListener('scroll', on_any_scroll);
  } catch (e) { }
  if (scrollable_elements?.length) {
    for (const el of scrollable_elements) {
      try {
        el.removeEventListener('scroll', on_any_scroll);
      } catch (e) { }
    }
  }
  scrollable_elements = [];
}

function reset_scroll() {
  is_menu_open.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const targets = scrollable_elements.length
    ? scrollable_elements
    : get_scrollable_elements();
  targets.forEach(el => {
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      el.scrollTop = 0;
    }
  });
}

function setup_mutation_observer() {
  if (typeof MutationObserver === 'undefined') return;
  mutation_observer = new MutationObserver(() => {
    bind_scroll_listeners();
  });
  mutation_observer.observe(document.documentElement || document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
}

function animate_splash() {
  setTimeout(() => {
    document.querySelectorAll('.splash_text_lock').forEach(span => span.classList.add('locked'));
  }, 2125);

  setTimeout(() => {
    if (document.readyState === 'complete') {
      splash_visible.value = false;
    } else {
      window.addEventListener('load', () => splash_visible.value = false, { once: true });
    }
  }, 2625);
}

onMounted(async () => {
  favicon();
  animate_splash();
  bind_scroll_listeners();
  window.addEventListener('resize', bind_scroll_listeners);
  window.addEventListener('orientationchange', bind_scroll_listeners);
  setup_mutation_observer();
  await nextTick();
});

onUnmounted(() => {
  unbind_scroll_listeners();
  window.removeEventListener('resize', bind_scroll_listeners);
  window.removeEventListener('orientationchange', bind_scroll_listeners);
  mutation_observer?.disconnect();
  mutation_observer = null;
});
</script>

<template>
  <div class="content_wrapper">
    <div class="splash" v-if="splash_visible">
      <span class="splash_text_type splash_t">T</span>
      <span class="splash_text_type splash_y">y</span>
      <span class="splash_text_type splash_p">p</span>
      <span class="splash_text_type splash_e">e</span>
      <span class="splash_text_lock splash_l">L</span>
      <span class="splash_text_lock splash_o">o</span>
      <span class="splash_text_lock splash_c">c</span>
      <span class="splash_text_lock splash_k">k</span>
    </div>

    <div :class="['overlay', { menu_open: is_menu_open }]" @click="close_menu"></div>

    <button class="scroll_reset" :class="{ visible: reset_scroll_visible }" @click="reset_scroll"
      :aria-hidden="!reset_scroll_visible" aria-label="Volver arriba">
      <span class="material-symbols-sharp">arrow_upward</span>
    </button>

    <button class="menu_toggle" @click="toggle_menu" @mouseenter="open_menu"
      :aria-label="is_menu_open ? 'Cerrar menú' : 'Abrir menú'">
      <span class="material-symbols-sharp">
        {{ is_menu_open ? 'close' : 'menu' }}
      </span>
    </button>

    <nav class="nav" :class="{ open: is_menu_open }" @mouseleave="close_menu">
      <ul class="nav_list" :class="{ visible: is_menu_open }">
        <li class="nav_list_elem" :class="{ current: route.path === '/' }">
          <NuxtLink to="/" @click="close_menu">
            <span class="nav_list_elem_tag">TypeLock</span>
            <span class="material-symbols-sharp">square</span>
          </NuxtLink>
        </li>
        <li class="nav_list_elem" :class="{ current: route.path === '/demo' || route.path === '/login' }">
          <NuxtLink :to="demo_link" @click="close_menu">
            <span class="nav_list_elem_tag">Demo</span>
            <span class="material-symbols-sharp">experiment</span>
          </NuxtLink>
        </li>
        <li class="nav_list_elem" :class="{ current: route.path.startsWith('/tester') }">
          <NuxtLink to="/tester" @click="close_menu">
            <span class="nav_list_elem_tag">Type tester</span>
            <span class="material-symbols-sharp">custom_typography</span>
          </NuxtLink>
        </li>
        <li class="nav_list_elem" :class="{ current: route.path.startsWith('/glyphs') }">
          <NuxtLink to="/glyphs" @click="close_menu">
            <span class="nav_list_elem_tag">Glifos</span>
            <span class="material-symbols-sharp">glyphs</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <header class="header">
      <NuxtLink to="/">
        <span class="header_type header_letter header_t">T</span>
        <span class="header_type header_letter header_y">y</span>
        <span class="header_type header_letter header_p">p</span>
        <span class="header_type header_letter header_e">e</span>
        <span class="header_lock header_letter header_l">L</span>
        <span class="header_lock header_letter header_o">o</span>
        <span class="header_lock header_letter header_c">c</span>
        <span class="header_lock header_letter header_k">k</span>
      </NuxtLink>
    </header>

    <main class="main">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped lang="scss">
.content_wrapper {
  color: $color_dark;
  background: $color_light;

  .splash {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100dvw;
    height: 100dvh;
    background: $color_light;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    user-select: none;

    span {
      font-size: clamp(4rem, 12.5dvw, 8rem);

      &.splash_t {
        animation: splash_text 1s ease-in-out .125s forwards;
      }

      &.splash_y {
        animation: splash_text 1s ease-in-out .375s forwards;
      }

      &.splash_p {
        animation: splash_text 1s ease-in-out .625s forwards;
      }

      &.splash_e {
        animation: splash_text 1s ease-in-out .750s forwards;
      }

      &.splash_l {
        animation: splash_text 1s ease-in-out .250s forwards;
      }

      &.splash_o {
        animation: splash_text 1s ease-in-out .825s forwards;
      }

      &.splash_c {
        animation: splash_text 1s ease-in-out 1s forwards;
      }

      &.splash_k {
        animation: splash_text 1s ease-in-out .5s forwards;
      }

      &.locked {
        animation: none;
        font-family: 'TypeLock Locked';
      }
    }
  }

  @keyframes splash_text {
    100% {
      font-family: 'TypeLock Unlocked';
    }
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: $color_dark;
    opacity: 0;
    pointer-events: none;
    transition: opacity .3s ease-in-out;
    z-index: 2;

    &.menu_open {
      opacity: .2;
      pointer-events: auto;
    }
  }

  .menu_toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
    background: $color_light;
    border: 3px solid $color_dark;
    cursor: pointer;
    user-select: none;
    z-index: 4;

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

    &:active {
      background: $color_dark;
      color: $color_light;
    }
  }

  .nav {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: .5rem .5rem 4rem .5rem;
    gap: .5rem;
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 3;
    user-select: none;
    transform: translateX(150%);
    pointer-events: none;
    visibility: hidden;
    transition: transform .3s ease-in-out;

    &.open {
      transform: translateX(0);
      pointer-events: auto;
      visibility: visible;
      transition: transform .3s ease-in-out;
    }

    .nav_list {
      display: flex;
      flex-direction: column;
      align-items: end;
      gap: .5rem;
      pointer-events: none;
      transform: translateX(150%);
      transition: all .3s ease-in-out;

      &.visible {
        pointer-events: auto;
        transform: translateX(0);
      }

      .nav_list_elem {
        display: flex;
        justify-content: end;
        width: fit-content;

        a {
          display: flex;
          align-items: center;

          .nav_list_elem_tag {
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

            .nav_list_elem_tag,
            .material-symbols-sharp {
              background: $color_dark;
              color: $color_light;
            }
          }
        }

        &.current {

          .nav_list_elem_tag,
          .material-symbols-sharp {
            background: $color_dark;
            color: $color_light;
          }
        }
      }
    }
  }

  .scroll_reset {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    position: fixed;
    bottom: .5rem;
    left: .5rem;
    z-index: 4;
    background: $color_light;
    border: 3px solid $color_dark;
    cursor: pointer;
    user-select: none;
    pointer-events: none;
    transform: translateY(150%);
    transition: transform .3s ease-in-out;

    &.visible {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

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

    &:active {
      background: $color_dark;
      color: $color_light;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100dvw;
    height: 6rem;
    position: fixed;
    top: 0;
    background: $color_light;
    border-bottom: 3px solid $color_dark;
    font-size: clamp(2.5rem, 2.5dvw, 3rem);

    .header_letter {

      &.header_type {
        font-family: 'TypeLock Unlocked';

        @media (hover: hover) {
          &:hover {
            font-family: 'TypeLock Locked';
            cursor: none;
          }
        }
      }

      &.header_lock {
        font-family: 'TypeLock Locked';

        @media (hover: hover) {
          &:hover {
            font-family: 'TypeLock Unlocked';
            cursor: none;
          }
        }
      }
    }
  }

  .main {
    display: flex;
    padding-top: 6rem;
    width: 100dvw;
    height: 100dvh;
  }
}
</style>