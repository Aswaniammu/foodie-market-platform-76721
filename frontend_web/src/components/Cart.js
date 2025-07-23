import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Cart({ cart, onRemove, onCheckout }) {
  const total = cart.reduce((acc, { price, qty }) => acc + price * qty, 0);

  if (cart.length === 0) {
    return <div className="container">Your cart is empty.</div>;
  }

  return (
    <div className="container cart-summary">
      <h2>Your Shopping Cart</h2>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <img src={item.image || "/placeholder.jpg"} alt={item.name} className="cart-item-img" />
            <div>
              <span className="item-title">{item.name}</span> 
              <span className="item-qty">x{item.qty}</span>
              <span className="item-price">${item.price * item.qty}</span>
              <button onClick={() => onRemove(item.id)} className="btn btn-link">Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        Total: <strong>${total.toFixed(2)}</strong>
        <button className="btn btn-large" onClick={onCheckout}>Checkout</button>
        <Link to="/catalog" className="btn btn-link">Continue Shopping</Link>
      </div>
    </div>
  );
}
