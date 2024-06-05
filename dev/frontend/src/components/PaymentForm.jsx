import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setPaymentError(error.message);
      setPaymentSuccess(null);
    } else {
      try {
        const { data } = await axios.post('/api/payment', {
          payment_method: paymentMethod.id,
          amount: 1000, // Adjust the amount as needed
        });

        setPaymentError(null);
        setPaymentSuccess(data.message);
      } catch (error) {
        setPaymentError('An error occurred. Please try again.');
        setPaymentSuccess(null);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {paymentError && <div className="error">{paymentError}</div>}
      {paymentSuccess && <div className="success">{paymentSuccess}</div>}
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default PaymentForm;