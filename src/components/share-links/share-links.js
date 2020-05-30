import Component from '../../helpers/component';

export default class shareLinks extends Component {
    init() {
        this.title = this.el.dataset.shareLinksTitle || '';
        this.text = this.el.dataset.shareLinksText || '';
        this.url = this.el.dataset.shareLinksUrl;

        if (!this.url) { return; }

        this.el.removeAttribute('hidden');
        this.boundOnClick = (event) => { this.onClick(event); };
        this.el.addEventListener('click', this.boundOnClick);
    }

    onClick(event) {
        event.preventDefault();

        if (navigator.share) {
            navigator.share({
                title: this.title,
                text: this.text,
                url: this.url,
            });
        }
    }

    destroy() {
        this.el.addAttribute('hidden', 'hidden');
        this.el.removeEventListener('click', this.boundOnClick);
    }
}
