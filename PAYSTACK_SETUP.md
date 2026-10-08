# Paystack Setup

VictoryLane uses Paystack for card and Mobile Money payments in GHS. The browser opens Paystack's checkout, while the API verifies the completed transaction before it creates a paid order.

## Configure keys

Set the public key in the frontend `.env` file or Vercel project settings:

```text
VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
```

Set the secret key only in the API environment or ignored `server/appsettings.Development.json`:

```text
Paystack__SecretKey=sk_test_...
```

For local JSON configuration, use:

```json
{ "Paystack": { "SecretKey": "sk_test_..." } }
```

Never use a `VITE_` prefix for a secret key: all Vite variables with that prefix are sent to visitors' browsers.

## Test before launch

1. Use Paystack test keys and a Paystack test payment method.
2. Place a card or Mobile Money order.
3. Confirm the order appears in `/orders` and `/admin/orders`.
4. Confirm the API marks it `paid` only after Paystack verifies its reference, currency, and amount.
5. Replace both keys with live keys only after Paystack business verification and a final live test.

Paystack test-payment details and current policies are available in the [official Paystack documentation](https://paystack.com/docs/payments/test-payments/).
