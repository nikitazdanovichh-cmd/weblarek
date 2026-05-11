import { Component } from "./base/Component";
import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProduct {
    index?: number;
    buttonText?: string;
}

export class Card<T = ICard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.priceElement = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value ? `${value} синапсов` : "Бесценно";
    }
}