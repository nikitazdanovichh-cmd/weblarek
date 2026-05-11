import { Card, ICardActions } from "./Card";
import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";

interface ICardBasket extends IProduct {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}