import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ZustandController } from '../../controllers/zustand';
import cartStore, { type CartStore } from '../../stores/cart';

import styles from './styles.css?inline';

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
    restoreCart: CartStore['restoreCart']
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
        restoreCart: state.restoreCart
      })
    );
  }

  firstUpdated() {
    // First restore from localStorage for immediate display
    this.cartController.actions?.restoreCart();
    // Then fetch from server to sync with latest data
    this.cartController.actions?.fetchCart();
  }

  render() {
    const { items, isLoading, error } = this.cartController.data;

    console.log(this.cartController.data);

    const subtotal = this.calculateSubtotal(items);
    const shipping = items.length > 0 ? 9.99 : 0;
    const tax = parseFloat(subtotal) * 0.08; // 8% tax
    const calculatedTotal = (parseFloat(subtotal) + shipping + tax).toFixed(2);

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
                    <img src=${`/api/placeholder/product-${item.id}.jpg`} alt=${item.name} />
                  </div>

                  <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>

                    ${item.variation && Object.keys(item.variation).length > 0 && html`
                      <div class="item-variations">
                        ${Object.entries(item.variation).map(([key, value]) => html`
                          <span class="variation">${key}: ${value}</span>
                        `)}
                      </div>
                    `}
                    <div class="item-price">${item.prices.price}</div>
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
                    />
                  </div>

                  <div class="item-subtotal">
                    ${(parseFloat(item.prices.price) * item.quantity).toFixed(2)}
                  </div>

                  <div class="item-actions">
                    <button class="remove-btn" data-key="${item.key}">
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
                <span>${subtotal}</span>
              </div>

              <div class="summary-row">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              <div class="summary-row">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div class="summary-row total">
                <span>Total:</span>
                <span>${calculatedTotal}</span>
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

  calculateSubtotal(items: CartStore['items']) {
    return items.reduce((total, item) => total + (parseFloat(item.prices.price) * item.quantity), 0).toFixed(2);
  }
}
