//componente form registrazione
import { useState } from "react";
import { register } from "../api/user";

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ nome: "", cognome: "", email: "", password: "", age: "", sex:"Sesso", birthplace: "" });
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await register(form.nome, form.cognome, form.email, form.password, form.age, form.sex, form.birthplace);
      
      if (res.error) {
        setIsError(true);
        setMsg(res.error); 
        return;
      }

      setIsError(false);
      setMsg(res.message || "Registrazione effettuata, ora accedi");
      //torna a login dopo 1.5 secondi
      setTimeout(() => onSuccess && onSuccess(), 1500);
    } catch (err) {
      console.error("Errore register:", err);
      setIsError(true);
      setMsg(err.message || "Errore di registrazione");
    }
  };

  return (
    <form className="form-modern" onSubmit={handleSubmit}>
      <input
        className="input-modern"
        name="nome"
        placeholder="Nome"
        value={form.nome}
        onChange={handleChange}
      />

      <input
        className="input-modern"
        name="cognome"
        placeholder="Cognome"
        value={form.cognome}
        onChange={handleChange}
      />

      <input
        className="input-modern"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        className="input-modern"
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <input
        className="input-modern"
        name="age"
        placeholder="Età"
        value={form.age}
        onChange={handleChange}
      />

      <select
        className="input-modern"
        name="sex"
        placeholder="Sesso"
        value={form.sex}
        onChange={handleChange}
      >
        <option disabled>Sesso</option>
        <option value="F">F</option>
        <option value="M">M</option>
        <option value="Altro">Altro</option>
      </select>

      <input
        className="input-modern"
        name="birthplace"
        placeholder="Luogo di nascita"
        value={form.birthplace}
        onChange={handleChange}
      />

      {msg && (
        <p className={`msg-modern ${isError ? "error" : "success"}`}>
          {msg}
        </p>
      )}

      <button type="submit" className="btn-modern">
        Registrati
      </button>
    </form>
  );
}
