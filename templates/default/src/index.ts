import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("{{name}}")
export class {{capital name}} extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `
    ];

    @property() name = "{{capital name space=true}}";

    render() {
        return html`<h1>Hello, ${this.name}</h1>`;
    }
}
