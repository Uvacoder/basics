import Component from '../../helpers/component';

export default class MainMenu extends Component {
    prepare() {
        this.anchorLinks = this.el.querySelectorAll('a[href^="#"]');

        this.StateMachine = new StateMachine(this, {
            toggle: {
                value: 'closed',
                closed: {
                    event: 'onMenuClose',
                    on: 'closeMenu',
                },
                open: {
                    event: 'onMenuOpen',
                    on: 'openMenu',
                },
                fullscreen: {
                    event: 'onMenuViewportLg',
                    on: 'disable',
                    off: 'closeMenu',
                },
            },
        });
    }

    init() {
        this.boundOnMenuClose = () => { EventBus.publish('onMenuClose', this.el); };
        EventBus.subscribe('onOverlayClose', this.boundOnMenuClose);

        this.boundOnMenuOpen = () => { EventBus.publish('onMenuOpen', this.el); };
        EventBus.subscribe('onMenuToggle', this.boundOnMenuOpen);

        this.boundHandleViewportChanges = (viewport) => { this.handleViewportChanges(viewport); };
        EventBus.subscribe('onViewportChange', this.boundHandleViewportChanges);

        this.closeOnAnchorLink();

        // checkbox exists only to support limited functionality without js
        this.checkbox.remove();
    }

    handleViewportChanges(viewport) {
        if (viewport === 'lg') {
            EventBus.publish('onMenuClose', this.el);
            EventBus.publish('onMenuViewportLg', this.el);
        } else {
            const isOpen = this.StateMachine.states.toggle.currentState === 'open';
            this.el.setAttribute('aria-expanded', isOpen);
            EventBus.publish(isOpen ? 'onMenuOpen' : 'onMenuClose', this.el);
        }
    }

    closeOnAnchorLink() {
        this.boundOnMenuClose = () => {
            EventBus.publish('onMenuClose', this.el);
            EventBus.publish('onAnchorLinkClose', this.el);
        };

        Array.from(this.anchorLinks).forEach((anchorLink) => {
            anchorLink.addEventListener('click', this.boundOnMenuClose);
        });
    }

    openMenu() {
        if (this.StateMachine.states.toggle.currentState !== 'fullscreen') {
            this.el.setAttribute('aria-expanded', true);
        }
    }

    closeMenu() {
        if (!this.StateMachine || this.StateMachine.states.toggle.currentState !== 'fullscreen') {
            this.el.setAttribute('aria-expanded', false);
        }
    }

    disable() {
        this.el.removeAttribute('aria-expanded');
    }
}
