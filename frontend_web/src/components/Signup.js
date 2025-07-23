import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

// PUBLIC_INTERFACE
export default function Signup() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.username, form.password);
      nav("/catalog");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="container auth-container">
      <h2>Sign Up</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          required
          placeholder="Username"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        <button className="btn btn-large" type="submit">Create Account</button>
        {error && <div className="error-msg">{error}</div>}
        <div>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
