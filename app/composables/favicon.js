export function favicon() {
    function set_favicon(href) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = href;
    }

    function check_visibility_change() {
        if (document.hidden) {
            set_favicon('./favicon_locked.svg');
        } else {
            set_favicon('./favicon_unlocked.svg');
        }
    }

    if (process.client) {
        document.addEventListener('visibilitychange', check_visibility_change);
    }
}