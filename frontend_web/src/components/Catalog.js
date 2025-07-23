import React, { useEffect, useState } from "react";
import * as api from "../api";

// PUBLIC_INTERFACE
export default function Catalog({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container catalog-grid">
      {products.map(product => (
        <div className="card product-card" key={product.id}>
          <img src={product.image || "/placeholder.jpg"} alt={product.name} className="product-img" />
          <div className="product-content">
            <h3>{product.name}</h3>
            <div className="product-desc">{product.description}</div>
            <div className="product-meta">
              <span className="product-price">${product.price}</span>
              <button className="btn" onClick={() => onAddToCart(product)}>Add to Cart</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
