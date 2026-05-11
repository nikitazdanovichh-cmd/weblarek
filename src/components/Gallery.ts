import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected _catalog: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._catalog = ensureElement<HTMLElement>('.gallery', container);
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }
}