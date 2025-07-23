import React, { useEffect, useState, useContext } from "react";
import * as api from "../api";
import { AuthContext } from "../AuthContext";

// PUBLIC_INTERFACE
export default function OrderHistory() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrderHistory(token)
      .then(setOrders, () => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="container">Loading your orders...</div>;
  if (!orders.length) return <div className="container">No previous orders.</div>;

  return (
    <div className="container">
      <h2>Order History</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.created_at ? new Date(o.created_at).toLocaleString() : ""}</td>
              <td>${o.total}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
