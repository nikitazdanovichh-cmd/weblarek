import { CardCatalog } from "./CardCatalog";
import { ICardActions } from "./Card";
import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";

interface ICardPreview extends IProduct {
    buttonText: string;
}

export class CardPreview extends CardCatalog {
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container); 
        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    render(data?: Partial<ICardPreview>): HTMLElement {
        return super.render(data);
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set disabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}