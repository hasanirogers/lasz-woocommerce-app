import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './styles.css?inline';
import sharedStyles from '../../shared/styles.css?inline';


@customElement('lasz-product-view')
export default class LaszProductView extends LitElement {
  static styles = [unsafeCSS(sharedStyles),unsafeCSS(styles)];

  @property({ type: String })
  data: string = '';

  @property({ type: Object })
  product: any = null;

  firstUpdated() {
    if (!this.product && this.data) {
      this.product = JSON.parse(this.data);
      console.log('Product data:', this.product);
      console.log('Variations:', this.product.variations);
    }
  }

  render() {
    if (this.product) {
      return html`
        <div>
          ${this.product.images?.length > 0 ? html`<img src=${this.product.images[0].src} alt=${this.product.name} />` : null}
        </div>
        <div>
          <h2>${this.product.name}</h2>
          <aside>
            <small>SKU: ${this.product.sku}</small>
          </aside>
          <div>${unsafeHTML(this.product.short_description)}</div>
          ${this.makeVariations()}
        </div>
      `;
    }
    return html`<div>Loading...</div>`;
  }

  makeVariations() {
    if (this.product.variations && this.product.variations.length > 0) {
      const allAttributeNames = [...new Set(this.product.variations.flatMap((variation: any) => variation.attributes?.map((attr: any) => attr.name) || []))] as string[];
      const variationSets: Map<string, any> = new Map();

      allAttributeNames.forEach((name) => {
        const variations = this.product.variations.filter((variation: any) => variation.attributes?.some((attr: any) => attr.name === name));
        variationSets.set(name, variations);
      });

      return Array.from(variationSets.entries().map(([name, variations]) => {
        const variationValues = variations.map((variation: any) => variation.attributes.map((attr: any) => attr.value)[0]);
        return html`
          <div>
            <kemet-field label="${name}">
              <kemet-select slot="input" name="${name.toLowerCase().replace(' ', '-')}" required>
                ${variationValues.map((value: any) => html`
                  <kemet-option label="${value}" value="${value.toLowerCase().replace(' ', '-')}"></kemet-option>
                `)}
              </kemet-select>
            </kemet-field>
            <br />
          </div>
        `;
      }))
    }
    return null;
  }
}
