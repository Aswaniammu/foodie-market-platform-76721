import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { AuthProvider, AuthContext } from "./AuthContext";
import Navbar from "./components/Navbar";
import Catalog from "./components/Catalog";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Signup from "./components/Signup";
import OrderHistory from "./components/OrderHistory";
import StripeCheckout from "./components/StripeCheckout";
import * as api from "./api";

// PUBLIC_INTERFACE
function App() {
  // Theme (light/dark) from original code preserved
  const [theme, setTheme] = useState("light");
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  // Cart state managed in localstorage for persistence
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]);
  const addToCart = (product) => {
    setCart((c) => {
      const idx = c.findIndex(i => i.id === product.id);
      if (idx > -1) {
        return c.map((item, i) =>
          i === idx ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...c, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (productId) => {
    setCart((c) => c.filter(i => i.id !== productId));
  };

  // Stripe checkout and simple message state
  const [stripeSession, setStripeSession] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  // Authenticated checkout
  function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = React.useContext(AuthContext);
    if (loading) return <div className="container">Loading account...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
  }

  // Checkout (Cart → Stripe)
  const onCheckout = async (token) => {
    setCheckoutError("");
    try {
      // call backend to create Stripe session and get sessionId
      const result = await api.createStripeSession(
        cart.map(({ id, qty }) => ({ id, qty })), token
      );
      setStripeSession(result.sessionId);
      setCart([]);
    } catch (err) {
      setCheckoutError(err.message || "Error starting payment.");
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <Navbar cartItemsCount={cart.reduce((acc, i) => acc + i.qty, 0)} />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/catalog" />} />
              <Route path="/catalog" element={<Catalog onAddToCart={addToCart} />} />
              <Route path="/cart" element={
                <Cart
                  cart={cart}
                  onRemove={removeFromCart}
                  onCheckout={() =>
                    <AuthContext.Consumer>
                      {({ token, isAuthenticated }) =>
                        isAuthenticated
                        ? onCheckout(token)
                        : <Navigate to="/login" />
                      }
                    </AuthContext.Consumer>
                  }
                />
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } />
              <Route
                path="/payment"
                element={
                  stripeSession
                    ? <StripeCheckout sessionId={stripeSession} />
                    : <div className="container">No payment session found.</div>
                }
              />
              <Route path="*" element={<Navigate to="/catalog" />} />
            </Routes>
            {checkoutError && <div className="error-msg">{checkoutError}</div>}
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
