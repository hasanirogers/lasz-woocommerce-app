import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ZustandController } from '../../controllers/zustand';
import cartStore, { type CartStore } from '../../stores/cart';
import { usStates } from '../../shared/data';
import styles from './styles.css?inline';

interface EventTarget {
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    dispatchEvent(event: Event): void;
  }

interface CheckoutForm {
  billing_first_name: string;
  billing_last_name: string;
  billing_email: string;
  billing_phone: string;
  billing_address_1: string;
  billing_address_2: string;
  billing_city: string;
  billing_state: string;
  billing_postcode: string;
  billing_country: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address_1: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postcode: string;
  shipping_country: string;
  customer_note: string;
  payment_method: string;
  ship_to_different_address: boolean;
  // Card payment fields
  card_number: string;
  card_expiry: string;
  card_cvc: string;
  card_name: string;
  // Bank account fields
  account_holder_name: string;
  routing_number: string;
  account_number: string;
  // Payment details field
  payment_details: string;
}

@customElement('lasz-checkout')
export class LaszCheckout extends LitElement {
  static styles = [unsafeCSS(styles)];

  private cartController: ZustandController<CartStore, {
    items: CartStore['items'];
    isLoading: CartStore['isLoading'];
    error: CartStore['error'];
    total: CartStore['total'];
    totals: CartStore['totals'];
  }, {
    fetchCart: CartStore['fetchCart'],
    getTotal: CartStore['getTotal'],
    getSubtotal: CartStore['getSubtotal'],
    getShippingCost: CartStore['getShippingCost'],
    getTaxCost: CartStore['getTaxCost'],
    getCurrencySymbol: CartStore['getCurrencySymbol']
  }>;

  @state()
  private formData: CheckoutForm = {
    billing_first_name: 'First',
    billing_last_name: 'Last',
    billing_email: 'first.last@email.com',
    billing_phone: '',
    billing_address_1: '1234 Address St',
    billing_address_2: '',
    billing_city: 'Southfield',
    billing_state: 'MI',
    billing_postcode: '48075',
    billing_country: 'US',
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_address_1: '',
    shipping_address_2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postcode: '',
    shipping_country: 'US',
    customer_note: '',
    payment_method: 'stripe',
    ship_to_different_address: false,
    // Card payment fields
    card_number: '',
    card_expiry: '',
    card_cvc: '',
    card_name: '',
    // Bank account fields
    account_holder_name: '',
    routing_number: '',
    account_number: '',
    // Payment details field
    payment_details: ''
  };

  @state()
  private isProcessing = false;

  @state()
  private checkoutError = '';

  @state()
  private paymentMethods: any[] = [];

  @state()
  private paymentMethodsError = '';

  @state()
  private stripe: any = null;

  @state()
  private stripeElements: any = null;

  @state()
  private cardElement: any = null;

  constructor() {
    super();
    this.cartController = new ZustandController(
      this,
      cartStore,
      (state) => ({
        items: state.items,
        isLoading: state.isLoading,
        error: state.error,
        total: state.total,
        totals: state.totals
      }),
      (state) => ({
        fetchCart: state.fetchCart,
        getTotal: state.getTotal,
        getSubtotal: state.getSubtotal,
        getShippingCost: state.getShippingCost,
        getTaxCost: state.getTaxCost,
        getCurrencySymbol: state.getCurrencySymbol
      })
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadPaymentMethods();
  }

  updated(changedProperties: Map<string, any>) {
    // Re-render when form data changes to update shipping/tax calculations
    if (changedProperties.has('formData')) {
      this.requestUpdate();
    }

    // Mount Stripe Element after DOM updates
    if (this.cardElement) {
      this.mountStripeElement();
    }
  }

  firstUpdated() {
    this.cartController.actions?.fetchCart();
    this.initializeStripe();
    this.loadPaymentMethods();
  }

  private initializeStripe() {
    // Initialize Stripe with your publishable key
    const publishableKey = import.meta.env.PUBLIC_STRIPE_KEY || 'pk_test_51234567890abcdef';

    console.log('Stripe initialization debug:', {
      hasWindow: typeof window !== 'undefined',
      hasStripeScript: !!(window as any).Stripe,
      publishableKey: publishableKey,
      isPlaceholder: publishableKey === 'pk_test_51234567890abcdef',
      envKey: import.meta.env.PUBLIC_STRIPE_KEY
    });

    if (typeof window !== 'undefined' && publishableKey !== 'pk_test_51234567890abcdef') {
      if ((window as any).Stripe) {
        // Stripe script is loaded, initialize it
        this.stripe = (window as any).Stripe(publishableKey);
        this.stripeElements = this.stripe.elements();

        // Create the card element
        this.cardElement = this.stripeElements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
          },
        });

        console.log('Stripe initialized with Elements:', publishableKey.substring(0, 10) + '...');
      } else {
        // Stripe script not loaded yet, wait and retry
        console.warn('Stripe script not loaded yet, waiting and retrying...');
        setTimeout(() => {
          this.initializeStripe();
        }, 1000);
      }
    } else {
      console.warn('Stripe not initialized - missing or invalid publishable key');
      console.warn('Please set PUBLIC_STRIPE_KEY environment variable with a real Stripe publishable key');
    }
  }

  async loadPaymentMethods() {
    try {
      const response = await fetch('/api/payment-gateways');
      if (response.ok) {
        const data = await response.json();
        this.paymentMethods = data;
      } else {
        const errorData = await response.json();
        this.paymentMethodsError = errorData.message || 'Failed to load payment methods';
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      this.paymentMethodsError = 'Unable to connect to payment service. Please try again later.';
    }
  }

  private handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;

    if (type === 'checkbox') {
      const checkbox = target as HTMLInputElement;
      this.formData = {
        ...this.formData,
        [name]: checkbox.checked
      };
    } else {
      this.formData = {
        ...this.formData,
        [name]: value
      };
    }
  }

  private async handleSubmit(event: Event) {
    console.log('handleSubmit called!');
    event.preventDefault();
    this.isProcessing = true;
    this.checkoutError = '';

    try {
      const cartState = this.cartController.data;
      const cartStoreState = cartStore.getState();
      const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL || 'https://woocommerce.deificarts.com';

      console.log('Checkout - Cart state:', {
        itemsCount: cartState.items.length,
        hasCartToken: !!cartStoreState.cartToken,
        cartToken: cartStoreState.cartToken ? `${cartStoreState.cartToken.substring(0, 8)}...` : null,
        isLoading: cartState.isLoading
      });

      // Get cart token from store or fetch it if missing
      let cartToken = cartStoreState.cartToken;
      if (!cartToken) {
        // Try to get cart token from localStorage as fallback
        const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('lasz-cart-token') : null;
        cartToken = storedToken;
        console.log('Checkout - Fallback cart token from localStorage:', cartToken ? `${cartToken.substring(0, 8)}...` : null);
      }

      // If still no cart token, try to fetch cart first
      if (!cartToken && !cartState.isLoading) {
        console.log('Checkout - No cart token, fetching cart...');
        await this.cartController.actions?.fetchCart();

        // Try again after fetch
        const updatedStoreState = cartStore.getState();
        cartToken = updatedStoreState.cartToken;
        console.log('Checkout - Cart token after fetch:', cartToken ? `${cartToken.substring(0, 8)}...` : null);
      }

      // Validate cart token exists
      if (!cartToken) {
        this.checkoutError = 'Cart session is missing. Please add items to your cart and try again.';
        this.isProcessing = false;
        return;
      }

      // Validate card details for Stripe payments
      console.log('Validating card details for payment method:', this.formData.payment_method);
      console.log('Card details:', {
        hasCardElement: !!this.cardElement,
        card_name: !!this.formData.card_name
      });

      if (this.formData.payment_method === 'stripe') {
        if (!this.cardElement || !this.formData.card_name) {
          console.log('Card validation failed - missing Stripe Element or cardholder name');
          this.checkoutError = 'Please enter cardholder name and ensure card details are complete for Stripe payment.';
          this.isProcessing = false;
          return;
        }
        console.log('Card validation passed');
      }

      const stripePMId = await this.createStripePaymentMethod();

      if (this.formData.payment_method === 'stripe' && !stripePMId) {
          this.checkoutError = 'Could not initialize Stripe payment.';
          this.isProcessing = false;
          return;
      }

      const checkoutData = {
        cart_token: cartToken,
        billing_address: {
          first_name: this.formData.billing_first_name,
          last_name: this.formData.billing_last_name,
          company: '', // Add empty company field
          address_1: this.formData.billing_address_1,
          address_2: this.formData.billing_address_2,
          city: this.formData.billing_city,
          state: this.formData.billing_state,
          postcode: this.formData.billing_postcode,
          country: this.formData.billing_country,
          email: this.formData.billing_email,
          phone: this.formData.billing_phone
        },
        shipping_address: this.formData.ship_to_different_address ? {
          first_name: this.formData.shipping_first_name,
          last_name: this.formData.shipping_last_name,
          company: '', // Add empty company field
          address_1: this.formData.shipping_address_1,
          address_2: this.formData.shipping_address_2,
          city: this.formData.shipping_city,
          state: this.formData.shipping_state,
          postcode: this.formData.shipping_postcode,
          country: this.formData.shipping_country
        } : {
          first_name: this.formData.billing_first_name,
          last_name: this.formData.billing_last_name,
          company: '', // Add empty company field
          address_1: this.formData.billing_address_1,
          address_2: this.formData.billing_address_2,
          city: this.formData.billing_city,
          state: this.formData.billing_state,
          postcode: this.formData.billing_postcode,
          country: this.formData.billing_country
        },
        customer_note: this.formData.customer_note,
        // payment_method: this.formData.payment_method,
        // Hardcode payment method to stripe for now
        payment_method: 'stripe',
        payment_data: await this.getPaymentData(),
        // Send this specifically for your Astro route to catch
        payment_method_id: stripePMId
      };

      console.log('Payment data being sent:', checkoutData.payment_data);

      // Use the local API proxy to avoid CORS issues
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
      });

      const result = await response.json();

      if (response.ok && result.order_id) {
        window.location.href = `/orders/received/${result.order_id}`;
      } else {
        this.checkoutError = result.message || 'Checkout failed. Please try again.';
      }
    } catch (error) {
      this.checkoutError = 'An error occurred during checkout. Please try again.';
      console.error('Checkout error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async getPaymentData() {
    const paymentData = [
      // This tells the gateway WHICH Stripe flow to use
      { key: 'wc-stripe-payment-type', value: 'card' },
      { key: 'wc-stripe-new-payment-method', value: 'true' },
      { key: 'billing_email', value: this.formData.billing_email }
    ];

    if (this.formData.payment_method === 'stripe') {
      const stripePaymentMethodId = await this.createStripePaymentMethod();

      if (stripePaymentMethodId) {
        // THE KEY: Use 'payment_method' as the key name if 'wc-stripe-payment-method' fails
        paymentData.push({ key: 'payment_method', value: stripePaymentMethodId });
        paymentData.push({ key: 'wc-stripe-payment-method', value: stripePaymentMethodId });
      } else {
        throw new Error('Could not initialize Stripe payment.');
      }
    }

    return paymentData;
  }

  private async createStripePaymentMethod() {
    if (!this.stripe || !this.cardElement) return null;

    try {
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
        billing_details: {
          name: this.formData.card_name,
          email: this.formData.billing_email,
          address: {
            line1: this.formData.billing_address_1,
            city: this.formData.billing_city,
            state: this.formData.billing_state,
            postal_code: this.formData.billing_postcode,
            country: this.formData.billing_country,
          }
        }
      });

      if (error) {
        this.checkoutError = error.message;
        return null;
      }

      return paymentMethod.id; // Returns 'pm_...'
    } catch (err) {
      console.error('Stripe PM Error:', err);
      return null;
    }
  }

  render() {
    const { items, isLoading, error, total, totals } = this.cartController.data;
    let subtotal = '0.00';
    let shippingCost = '0.00';
    let taxCost = '0.00';
    let currencySymbol = '$';
    let grandTotal = '0.00';

    // Check if user has entered address info for both tax and shipping calculations
    const hasAddressInfo = !!(this.formData.billing_state);

    try {
      subtotal = this.cartController.actions?.getSubtotal() || '0.00';
      shippingCost = this.cartController.actions?.getShippingCost(hasAddressInfo) || '0.00';
      taxCost = this.cartController.actions?.getTaxCost(hasAddressInfo, this.formData.billing_state) || '0.00';
      currencySymbol = this.cartController.actions?.getCurrencySymbol() || '$';
      currencySymbol = this.cartController.actions?.getCurrencySymbol() || '$';

      // Calculate grand total as subtotal + shipping + tax to avoid double-counting
      grandTotal = (parseFloat(subtotal) + parseFloat(shippingCost) + parseFloat(taxCost)).toFixed(2);
    } catch (error) {
      console.error('Error accessing cart controller methods:', error);
      console.log('Cart controller actions:', this.cartController.actions);
      console.log('Has address info:', hasAddressInfo);
      console.log('Form data:', this.formData);
    }

    console.log('Checkout Totals Debug:', {
      itemsCount: items.length,
      items: items,
      subtotal,
      shippingCost,
      taxCost,
      grandTotal,
      cartTotal: total,
      apiTotals: totals,
      hasItems: items.length > 0
    });

    if (isLoading) {
      return html`
        <lasz-checkout-container>
          <div class="loading">
            <p>Loading checkout...</p>
          </div>
        </lasz-checkout-container>
      `;
    }

    if (error) {
      return html`
        <lasz-checkout-container>
          <div class="error">
            <p>Error: ${error}</p>
          </div>
        </lasz-checkout-container>
      `;
    }

    if (items.length === 0) {
      return html`
        <lasz-checkout-container>
          <div class="empty-cart">
            <p>Your cart is empty.</p>
            <a href="/products">Continue Shopping</a>
          </div>
        </lasz-checkout-container>
      `;
    }

    return html`
      <lasz-checkout-container>
        <form @submit=${this.handleSubmit} class="checkout-form">
          <div class="checkout-columns">
            <div class="billing-column">
              <h2>Billing Details</h2>

              <div class="form-row">
                <div class="form-group">
                  <label for="billing_first_name">First Name *</label>
                  <input
                    type="text"
                    id="billing_first_name"
                    name="billing_first_name"
                    .value=${this.formData.billing_first_name}
                    @input=${this.handleInputChange}
                    @change=${this.handleInputChange}
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="billing_last_name">Last Name *</label>
                  <input
                    type="text"
                    id="billing_last_name"
                    name="billing_last_name"
                    .value=${this.formData.billing_last_name}
                    @input=${this.handleInputChange}
                    @change=${this.handleInputChange}
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="billing_email">Email Address *</label>
                <input
                  type="email"
                  id="billing_email"
                  name="billing_email"
                  .value=${this.formData.billing_email}
                  @input=${this.handleInputChange}
                  required
                />
              </div>

              <div class="form-group">
                <label for="billing_phone">Phone</label>
                <input
                  type="tel"
                  id="billing_phone"
                  name="billing_phone"
                  .value=${this.formData.billing_phone}
                  @input=${this.handleInputChange}
                />
              </div>

              <div class="form-group">
                <label for="billing_address_1">Address *</label>
                <input
                  type="text"
                  id="billing_address_1"
                  name="billing_address_1"
                  .value=${this.formData.billing_address_1}
                  @input=${this.handleInputChange}
                  @change=${this.handleInputChange}
                  required
                />
              </div>

              <div class="form-group">
                <label for="billing_address_2">Address Line 2</label>
                <input
                  type="text"
                  id="billing_address_2"
                  name="billing_address_2"
                  .value=${this.formData.billing_address_2}
                  @input=${this.handleInputChange}
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="billing_city">City *</label>
                  <input
                    type="text"
                    id="billing_city"
                    name="billing_city"
                    .value=${this.formData.billing_city}
                    @input=${this.handleInputChange}
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="billing_state">State *</label>
                  <select
                    id="billing_state"
                    name="billing_state"
                    .value=${this.formData.billing_state}
                    @change=${this.handleInputChange}
                    required
                  >
                    <option value="">Select a state</option>
                    ${usStates.map(state => html`
                      <option value=${state.value}>${state.label}</option>
                    `)}
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="billing_postcode">ZIP Code *</label>
                  <input
                    type="text"
                    id="billing_postcode"
                    name="billing_postcode"
                    .value=${this.formData.billing_postcode}
                    @input=${this.handleInputChange}
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="ship_to_different_address"
                    .checked=${this.formData.ship_to_different_address}
                    @change=${this.handleInputChange}
                  />
                  Ship to a different address?
                </label>
              </div>

              ${this.formData.ship_to_different_address ? this.renderShippingAddress() : ''}
            </div>

            <div class="order-column">
              <h2>Order Summary</h2>

              <div class="order-items">
                ${items.map(item => html`
                  <div class="order-item">
                    <div class="item-info">
                      <div class="item-name">${item.name}</div>
                      <div class="item-quantity">Qty: ${item.quantity}</div>
                    </div>
                    <div class="item-total">${currencySymbol}${(parseFloat(item.prices.price) * item.quantity * 0.01).toFixed(2)}</div>
                  </div>
                `)}
              </div>

              <div class="order-totals">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>${currencySymbol}${subtotal}</span>
                </div>
                <div class="total-row">
                  <span>Shipping:</span>
                  <span>${currencySymbol}${shippingCost}</span>
                </div>
                <div class="total-row">
                  <span>Tax:</span>
                  <span>${currencySymbol}${taxCost}</span>
                </div>
                <div class="total-row grand-total">
                  <span>Total:</span>
                  <span>${currencySymbol}${grandTotal}</span>
                </div>
              </div>

              <div class="payment-section">
                <h3>Payment Method</h3>
                ${this.paymentMethodsError ? html`
                  <div class="payment-methods-error">
                    <p>${this.paymentMethodsError}</p>
                  </div>
                ` : html`
                  <div class="payment-methods">
                    ${this.paymentMethods.map(method => html`
                      <label class="payment-method">
                        <input
                          type="radio"
                          name="payment_method"
                          value=${method.id}
                          .checked=${this.formData.payment_method === method.id}
                          @change=${this.handleInputChange}
                        />
                        <span>${method.title}</span>
                      </label>
                    `)}
                  </div>
                `}
              </div>

              ${this.renderPaymentDetails()}

              <div class="form-group">
                <label for="customer_note">Order Notes (Optional)</label>
                <textarea
                  id="customer_note"
                  name="customer_note"
                  .value=${this.formData.customer_note}
                  @input=${this.handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              ${this.checkoutError ? html`
                <div class="checkout-error">
                  <p>${this.checkoutError}</p>
                </div>
              ` : ''}

              <button
                type="submit"
                class="checkout-button"
                ?disabled=${this.isProcessing}
              >
                ${this.isProcessing ? 'Processing...' : `Place Order ${currencySymbol}${grandTotal}`}
              </button>
            </div>
          </div>
        </form>
      </lasz-checkout-container>
    `;
  }

  private renderPaymentDetails() {
    const paymentMethod = this.formData.payment_method;

    // Handle Stripe payment methods dynamically
    if (paymentMethod?.startsWith('stripe')) {
      return this.renderStripePaymentDetails(paymentMethod);
    }

    // Handle legacy hardcoded methods
    if (paymentMethod === 'woocommerce_payments') {
      return html`
        <div class="payment-details-section">
          <h4>Card Details</h4>
          <div class="form-group">
            <label for="card_number">Card Number *</label>
            <input
              type="text"
              id="card_number"
              name="card_number"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
              @input=${this.handleInputChange}
              required
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="card_expiry">Expiry Date *</label>
              <input
                type="text"
                id="card_expiry"
                name="card_expiry"
                placeholder="MM/YY"
                maxlength="5"
                @input=${this.handleInputChange}
                required
              />
            </div>
            <div class="form-group">
              <label for="card_cvc">CVC *</label>
              <input
                type="text"
                id="card_cvc"
                name="card_cvc"
                placeholder="123"
                maxlength="4"
                @input=${this.handleInputChange}
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="card_name">Name on Card *</label>
            <input
              type="text"
              id="card_name"
              name="card_name"
              placeholder="John Doe"
              @input=${this.handleInputChange}
              required
            />
          </div>
        </div>
      `;
    }

    if (paymentMethod === 'paypal') {
      return html`
        <div class="payment-details-section">
          <h4>PayPal</h4>
          <p>You will be redirected to PayPal to complete your payment after placing the order.</p>
          <div class="paypal-notice">
            <p><strong>Note:</strong> Make sure you have a PayPal account or can pay with credit/debit card through PayPal.</p>
          </div>
        </div>
      `;
    }

    if (paymentMethod === 'cod') {
      return html`
        <div class="payment-details-section">
          <h4>Cash on Delivery</h4>
          <p>Pay with cash when your order is delivered.</p>
          <div class="cod-notice">
            <p><strong>Please have the exact amount ready:</strong> ${this.cartController.data ? this.cartController.actions?.getCurrencySymbol() || '$' : '$'}${this.cartController.actions?.getTotal() || '0.00'}</p>
          </div>
        </div>
      `;
    }

    // Generic fallback for unknown payment methods
    if (paymentMethod) {
      return html`
        <div class="payment-details-section">
          <h4>${paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
          <p>You will be redirected to complete your payment after placing the order.</p>
        </div>
      `;
    }

    return html``;
  }

  private renderStripePaymentDetails(paymentMethod: string) {
    return html`
      <div class="payment-details-section">
        <h4>Card Details</h4>

        <div class="form-group">
          <label for="card_name">Name on Card *</label>
          <input
            type="text"
            id="card_name"
            name="card_name"
            .value=${this.formData.card_name}
            placeholder="John Doe"
            @input=${this.handleInputChange}
            required
          />
        </div>

        <div class="form-group">
          <label>Secure Card Information *</label>
          <slot name="stripe-element-container"></slot>
          <slot name="stripe-errors-container"></slot>
        </div>
      </div>
    `;
  }

  private mountStripeElement() {
    // Look in the main document (Light DOM) because it's slotted
    const mountPoint = document.getElementById('card-element');

    if (mountPoint && this.cardElement) {
      // Check if it's already mounted to avoid Stripe errors
      if (mountPoint.children.length === 0) {
        this.cardElement.mount(mountPoint);
        console.log('Stripe Element mounted to Light DOM slot');
      }
    }
  }

  private renderShippingAddress() {
    return html`
      <div class="shipping-address-section">
        <h3>Shipping Address</h3>

        <div class="form-row">
          <div class="form-group">
            <label for="shipping_first_name">First Name *</label>
            <input
              type="text"
              id="shipping_first_name"
              name="shipping_first_name"
              .value=${this.formData.shipping_first_name}
              @input=${this.handleInputChange}
              required
            />
          </div>
          <div class="form-group">
            <label for="shipping_last_name">Last Name *</label>
            <input
              type="text"
              id="shipping_last_name"
              name="shipping_last_name"
              .value=${this.formData.shipping_last_name}
              @input=${this.handleInputChange}
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="shipping_address_1">Address *</label>
          <input
            type="text"
            id="shipping_address_1"
            name="shipping_address_1"
            .value=${this.formData.shipping_address_1}
            @input=${this.handleInputChange}
            required
          />
        </div>

        <div class="form-group">
          <label for="shipping_address_2">Address Line 2</label>
          <input
            type="text"
            id="shipping_address_2"
            name="shipping_address_2"
            .value=${this.formData.shipping_address_2}
            @input=${this.handleInputChange}
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="shipping_city">City *</label>
            <input
              type="text"
              id="shipping_city"
              name="shipping_city"
              .value=${this.formData.shipping_city}
              @input=${this.handleInputChange}
              required
            />
          </div>
          <div class="form-group">
            <label for="shipping_state">State *</label>
            <input
              type="text"
              id="shipping_state"
              name="shipping_state"
              .value=${this.formData.shipping_state}
              @input=${this.handleInputChange}
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="shipping_postcode">ZIP Code *</label>
            <input
              type="text"
              id="shipping_postcode"
              name="shipping_postcode"
              .value=${this.formData.shipping_postcode}
              @input=${this.handleInputChange}
              required
            />
          </div>
          <div class="form-group">
            <label for="shipping_country">Country *</label>
            <select
              id="shipping_country"
              name="shipping_country"
              .value=${this.formData.shipping_country}
              @change=${this.handleInputChange}
              required
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }
}
