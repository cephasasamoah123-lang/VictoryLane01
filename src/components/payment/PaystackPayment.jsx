import { usePaystackPayment } from 'react-paystack'
import Button from '../ui/Button'

const PaystackPayment = ({ amount, email, onSuccess, onClose, metadata = {} }) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: Math.round(amount * 100), // Paystack expects amount in kobo (pesewas for Ghana)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'GHS', // Ghana Cedis
    metadata: {
      ...metadata,
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: metadata.name || 'N/A',
        },
        {
          display_name: 'Phone Number',
          variable_name: 'phone_number',
          value: metadata.phone || 'N/A',
        },
      ],
    },
  }

  const initializePayment = usePaystackPayment(config)

  const handlePayment = () => {
    initializePayment(onSuccess, onClose)
  }

  return (
    <Button
      type="button"
      onClick={handlePayment}
      fullWidth
      className="bg-primary-600 hover:bg-primary-700"
    >
      Pay ₵{amount.toFixed(2)} with Paystack
    </Button>
  )
}

export default PaystackPayment
