import Component from '../../helpers/component';

export default class ColorSchemeToggle extends Component {
    init() {
        this.StateMachine = new StateMachine(this, {
            colorScheme: {
                value: window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light',
                dark: {
                    event: 'onColorSchemeDark',
                },
                light: {
                    event: 'onColorSchemeLight',
                },
            },
        });

        this.boundOnToggle = () => { this.onToggle(); };
        this.colorSchemeToggle.addEventListener('change', this.boundOnToggle);
        this.applyInitialState();
    }

    onToggle() {
        const colorScheme = this.colorSchemeToggle.checked ? 'Dark' : 'Light';
        window.localStorage.colorScheme = colorScheme.toLowerCase();
        EventBus.publish(`onColorScheme${colorScheme}`);
    }

    applyInitialState() {
        if (window.localStorage.colorScheme === 'dark' || window.localStorage.colorScheme === 'light') {
            this.colorSchemeToggle.checked = window.localStorage.colorScheme === 'dark';
            this.onToggle();
        } else {
            this.colorSchemeToggle.checked = window.matchMedia('(prefers-color-scheme:dark)').matches;
        }
    }

    destroy() {
        this.colorSchemeToggle.removeEventListener('change', this.boundOnToggle);
    }
}
