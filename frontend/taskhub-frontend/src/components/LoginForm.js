//componente form login 
import { useState } from "react";

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const res = await fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    //controllo su risposta ricevuta dal backend
    if (!res.ok) {
      setError(data.error || "Credenziali errate");
      return;
    }

    if (!data.token) {
      setError("Token non ricevuto dal server");
      return;
    }

    if (!data.userId) {
      setError("userId non ricevuto dal server");
      return;
    }

    //login effettuato con successo->salvo token 
    onSuccess(data.token, data.userId);
  };

  return (
     <div className="form-modern">
      <input
        className="input-modern"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input-modern"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="error-modern">{error}</p>}

      <button className="btn-modern" onClick={handleLogin}>
        Accedi
      </button>
    </div>
  );
}
