import ComponentClass from '../../helpers/component';
import Component from './overlay';

document.body.innerHTML = require('../../components/overlay/overlay.html');
jest.mock('../../helpers/component');

window.EventBus = {
    publish: jest.fn(),
    subscribe: jest.fn()
}
const StateMachine = jest.fn().mockImplementation(() => {
    return {currentState: 'closed'};
});

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    ComponentClass.mockClear();
});

it('Component is called', () => {
    new Component();
    expect(Component).toHaveBeenCalledTimes(1);
});

it('Component is initialized', () => {
    const component = new Component();
    component.el = document.querySelector('[data-component="overlay"]');
    component.el.addEventListener = jest.fn();
    component.boundOnMenuOpen = jest.fn();
    component.boundOnMenuViewportLg = jest.fn();
    component.boundOnClick = jest.fn();
    component.unassignElement = jest.fn();

    component.init();

    expect(EventBus.subscribe).toHaveBeenCalledWith('onMenuOpen', component.boundOnMenuOpen);
    expect(EventBus.subscribe).toHaveBeenCalledWith('onMenuViewportLg', component.boundOnMenuViewportLg);
    expect(component.el.addEventListener).toHaveBeenCalledWith('click', component.boundOnClick)

    component.assignedMenu = {};
    component.boundOnMenuViewportLg();
    expect(component.unassignElement).toHaveBeenCalledTimes(1);
    expect(EventBus.publish).toHaveBeenCalledWith('onOverlayClose', component.el);

});

it('disables scrolling on open', () => {
    const component = new Component();
    component.publishOpenEvents();
    expect(EventBus.publish).toHaveBeenCalledWith('onDisableScroll');
});

it('enables scrolling on close', () => {
    const component = new Component();
    component.publishCloseEvents();
    expect(EventBus.publish).toHaveBeenCalledWith('onEnableScroll');
});