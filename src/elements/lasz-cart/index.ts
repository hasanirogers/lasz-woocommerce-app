import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, queryAll } from 'lit/decorators.js';
import { ZustandController } from '../../controllers/zustand';
import cartStore, { centsToDollars, type CartStore } from '../../stores/cart';

import styles from './styles.css?inline';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';


@customElement('lasz-cart')
export class LaszCart extends LitElement {
  static styles = [unsafeCSS(styles)];

  private cartController: ZustandController<CartStore, {
    items: CartStore['items'];
    isLoading: CartStore['isLoading'];
    error: CartStore['error']
  }, {
    addToCart: CartStore['addToCart'],
    fetchCart: CartStore['fetchCart'],
    restoreCart: CartStore['restoreCart'],
    getSubtotal: CartStore['getSubtotal'],
    getShippingCost: CartStore['getShippingCost'],
    getTaxCost: CartStore['getTaxCost'],
    getCurrencySymbol: CartStore['getCurrencySymbol'],
    getTotal: CartStore['getTotal'],
    updateQuantity: CartStore['updateQuantity'],
    removeFromCart: CartStore['removeFromCart']
  }>

  constructor() {
    super();
    this.cartController = new ZustandController(
      this,
      cartStore,
      (state) => ({
        items: state.items,
        isLoading: state.isLoading,
        error: state.error
      }),
      (state) => ({
        addToCart: state.addToCart,
        fetchCart: state.fetchCart,
        restoreCart: state.restoreCart,
        getSubtotal: state.getSubtotal,
        getShippingCost: state.getShippingCost,
        getTaxCost: state.getTaxCost,
        getCurrencySymbol: state.getCurrencySymbol,
        getTotal: state.getTotal,
        updateQuantity: state.updateQuantity,
        removeFromCart: state.removeFromCart
      })
    );
  }

  firstUpdated() {
    this.cartController.actions?.restoreCart(); // read from local storage
    this.cartController.actions?.fetchCart(); // sync with latest data from server
  }

  render() {
    const { items, isLoading, error } = this.cartController.data;
    return html`
      <div class="cart-container">
        <div class="cart-header">
          <h1>Shopping Cart</h1>
          <p class="item-count">${items.length} ${items.length === 1 ? 'item' : 'items'}</p>
        </div>

        ${isLoading ? html`
          <div class="loading">
            <div class="spinner"></div>
            <p>Loading your cart...</p>
          </div>
        ` : error ? html`
          <div class="error">
            <p>Error loading cart: ${error}</p>
            <button class="retry-btn" onclick="window.location.reload()">Retry</button>
          </div>
        ` : items.length > 0 ? html`
          <div class="cart-content">
            <div class="cart-items">
              ${items.map((item) => html`
                <div class="cart-item" data-key="${item.key}">
                  <div class="item-image">
                    <img src=${item.images[0].thumbnail} alt=${item.name} />
                  </div>

                  <div class="item-details">
                    <h3 class="item-name">${unsafeHTML(item.name)}</h3>
                    ${this.makeVariations(item)}
                    <div class="item-price">${centsToDollars(item.prices.price)}</div>
                  </div>

                  <div class="item-quantity">
                    <label for="quantity-${item.key}">Quantity:</label>
                    <input
                      type="number"
                      id="quantity-${item.key}"
                      min="1"
                      value="${item.quantity}"
                      class="quantity-input"
                      data-key="${item.key}"
                      @change="${this.handleQuantityChange}"
                    />
                  </div>

                  <div class="item-subtotal">
                    ${centsToDollars((parseInt(item.prices.price) * item.quantity).toString())}
                  </div>

                  <div class="item-actions">
                    <button class="remove-btn" data-key="${item.key}" @click="${this.handleRemoveItem}">
                      Remove
                    </button>
                  </div>
                </div>
              `)}
            </div>

            <div class="cart-summary">
              <h2>Order Summary</h2>

              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${this.cartController.actions?.getCurrencySymbol()}${this.cartController.actions?.getSubtotal()}</span>
              </div>

              <div class="summary-row">
                <span>Shipping:</span>
                <span>${this.cartController.actions?.getCurrencySymbol()}${this.cartController.actions?.getShippingCost()}</span>
              </div>

              <div class="summary-row">
                <span>Tax:</span>
                <span>${this.cartController.actions?.getCurrencySymbol()}${this.cartController.actions?.getTaxCost()}</span>
              </div>

              <div class="summary-row total">
                <span>Total:</span>
                <span>${this.cartController.actions?.getCurrencySymbol()}${this.cartController.actions?.getTotal()}</span>
              </div>

              <div class="cart-actions">
                <button class="continue-shopping-btn">
                  Continue Shopping
                </button>
                <button class="checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        `
        : html`
          <div class="empty-cart">
            <div class="empty-cart-icon">Cart is empty. Add some products to get started</div>
            <button class="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        `}
      </div>
    `;
  }

  makeVariations(item: CartStore['items'][0]) {
    if (!item.variation || Object.keys(item.variation).length === 0) {
      return '';
    }
    return html`
      <div class="item-variations">
        ${Object.values(item.variation).map((value) => html`
          <span class="variation">${value.attribute}: ${value.value}</span>
        `)}
      </div>
    `;
  }

  handleQuantityChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const key = target.dataset.key ?? '1';
    const newQuantity = parseInt(target.value);
    
    if (newQuantity < 1) {
      target.value = '1';
      return;
    }
    
    try {
      this.cartController.actions?.updateQuantity(key, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      target.value = target.defaultValue; // Reset to original value
    }
  }

  handleRemoveItem(event: Event) {
    const target = event.target as HTMLButtonElement;
    const key = target.dataset.key ?? '';
    
    try {
      this.cartController.actions?.removeFromCart(key);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }
}
