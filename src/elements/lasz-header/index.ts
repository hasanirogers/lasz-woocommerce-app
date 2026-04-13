import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeCSS } from 'lit';
import styles from './styles.css?inline';

@customElement('lasz-header')
export default class LaszHeader extends LitElement {
  static styles = [unsafeCSS(styles)];

  @property({ type: String })
  home?: String;

  @property()
  logo?: String;

  @property()
  name?: String;

  @property()
  logout?: String;

  @property()
  total?: String;

  @property()
  count?: String;

  @property({ type: Boolean, reflect: true, attribute: 'logged-in' })
  logged?: Boolean;

	render() {
		return html`
      <header>
        <div>
          <a class="logo" href="${this.home}">
            ${this.logo ? html`<img src="${this.logo}" alt="${this.name} Logo" />` : null}
            ${this.name ? html`<h2>${this.name}</h2>` : null}
          </a>
          <div>
            <strong>${this.total}</strong>&nbsp;in your cart.
          </div>
        </div>
        <div>
          <slot></slot>
          <a href="${this.home}/cart">
            <kemet-avatar circle>
              <kemet-icon-bootstrap size="24" icon="cart3"></kemet-icon-bootstrap>
              <span>${this.count}</span>
            </kemet-avatar>
          </a>
        </div>
      </header>
    `;
	}
}
