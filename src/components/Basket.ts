import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
    valid: boolean; 
}

export class Basket extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:open');
        });

        // Изначально блокируем кнопку оформления заказа
        this.buttonElement.disabled = true;

        // При пустом массиве сработает логика из сеттера
        this.items = [];
    }

    // Cеттер valid
    set valid(value: boolean) {
        this.buttonElement.disabled = !value;
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.listElement.replaceChildren(...items);
        } else {
            // Если массив пустой, отрисовываем сообщение
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            this.listElement.replaceChildren(emptyMessage);
        }
    }

    set total(total: number) {
        this.totalElement.textContent = `${total} синапсов`; 
    }
}