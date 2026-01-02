import Alpine from 'alpinejs';

document.addEventListener('alpine:init', () => {
    Alpine.data('alert', () => ({
        show: false,
        init() {
            setTimeout(() => this.show = true, 250);
            setTimeout(() => this.show = false, 3000);
        }
    }));
});