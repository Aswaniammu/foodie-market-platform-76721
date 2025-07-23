import React, { useEffect } from "react";

// PUBLIC_INTERFACE
export default function StripeCheckout({ sessionId }) {
  useEffect(() => {
    if (sessionId) {
      // Redirect to Stripe Checkout portal
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    }
  }, [sessionId]);

  return (
    <div className="container">
      <h2>Redirecting to Stripe Payment...</h2>
      <p>If you are not redirected, <a href={`https://checkout.stripe.com/pay/${sessionId}`}>click here</a> to pay.</p>
    </div>
  );
}
