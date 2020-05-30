import Component from '../../helpers/component';
import HeavyCalculationWorker from './heavyCalculation.worker';
import './heavyCalculation.scss';

export default class HeavyCalculation extends Component {
    init() {
        const parsedCurrent = parseInt(this.calculatedNumber.innerText, 10);
        this.current = typeof (parsedCurrent) !== 'number' ? parsedCurrent : 0;
        this.finish = 999999999;
        this.counter = new HeavyCalculationWorker();

        this.StateMachine = new StateMachine(this, {
            calculation: {
                progress: {
                    event: 'heavyCaluclationProgress',
                },
                finished: {
                    event: 'heavyCaluclationFinished',
                    on: 'updateNumber',
                },
            },
        });

        EventBus.publish('heavyCaluclationProgress', this.el);
        this.counter.postMessage({
            count: {
                from: this.current,
                to: this.finish,
            },
        });

        this.counter.addEventListener('message', (event) => {
            if (event.data.finished) {
                EventBus.publish('heavyCaluclationFinished', this.el);
            }
        });
    }

    updateNumber() {
        this.calculatedNumber.innerText = this.finish;
    }
}
