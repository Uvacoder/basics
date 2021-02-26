import Component from "../../helpers/component";
import HeavyCalculationWorker from "./heavyCalculation.worker";
import "./heavyCalculation.scss";

export default class HeavyCalculation extends Component {
	prepare() {
		const parsedCurrent = parseInt(this.calculatedNumber.innerText, 10);
		this.current = typeof parsedCurrent !== "number" ? parsedCurrent : 0;
		this.finish = 999999999;
		this.counter = new HeavyCalculationWorker();

		this.StateMachine = new StateMachine(this, {
			calculation: {
				progress: {
					event: "heavyCaluclationProgress",
				},
				finished: {
					event: "heavyCaluclationFinished",
					on: "updateNumber",
				},
			},
		});
	}

	init() {
		EventBus.publish("heavyCaluclationProgress", this.el);

		const Elem = (e) => {
			return {
				toJSON: () => ({
					tagName: e.tagName,
					textContent: e.textContent,
					attributes: Array.from(e.attributes).map((a) => ({
						name: a.name,
						value: a.value,
					})),
					children: Array.from(e.children, Elem),
				}),
			};
		};

		// html2json :: Node -> JSONString
		const html2json = (e) => JSON.stringify(Elem(e), null, "  ");

		this.counter.postMessage({
			count: {
				from: this.current,
				to: this.finish,
			},
			html: html2json(document.body),
		});

		this.counter.addEventListener("message", (event) => {
			if (event.data.finished) {
				EventBus.publish("heavyCaluclationFinished", this.el);
			}
		});
	}

	updateNumber() {
		this.calculatedNumber.innerText = this.finish;
	}
}
