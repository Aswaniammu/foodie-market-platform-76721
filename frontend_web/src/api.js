//
// foodie-market-platform frontend: API helper module
//
// This file contains helper functions to interact with the Django REST API backend.
// All API base urls etc. are provided here.
//
// Usage: `import api from './api'; api.login(username, password)` etc.
//

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

// Helper for API calls with automatic JSON, token, and error handling.
async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
    credentials: "include",
  });
  if (!res.ok) {
    let msg = "API error";
    try { msg = (await res.json()).detail || res.statusText; } catch (e) {}
    throw new Error(msg);
  }
  // Some endpoints (204) have no json
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export async function login(username, password) {
  // POST /auth/login/
  return apiRequest("/auth/login/", "POST", { username, password });
}

// PUBLIC_INTERFACE
export async function register(username, password) {
  // POST /auth/register/
  return apiRequest("/auth/register/", "POST", { username, password });
}

// PUBLIC_INTERFACE
export async function logout(token) {
  // POST /auth/logout/
  return apiRequest("/auth/logout/", "POST", null, token);
}

// PUBLIC_INTERFACE
export async function fetchProducts() {
  // GET /products/
  return apiRequest("/products/");
}

// PUBLIC_INTERFACE
export async function fetchProductDetail(productId) {
  // GET /products/:id/
  return apiRequest(`/products/${productId}/`);
}

// PUBLIC_INTERFACE
export async function placeOrder(order, token) {
  // POST /orders/
  return apiRequest("/orders/", "POST", order, token);
}

// PUBLIC_INTERFACE
export async function getOrderHistory(token) {
  // GET /orders/history/
  return apiRequest("/orders/history/", "GET", null, token);
}

// PUBLIC_INTERFACE
export async function createStripeSession(cart, token) {
  // POST /payments/create-stripe-session/
  return apiRequest("/payments/create-stripe-session/", "POST", { cart }, token);
}

// PUBLIC_INTERFACE
export async function getUser(token) {
  // GET /users/me/
  return apiRequest("/users/me/", "GET", null, token);
}
