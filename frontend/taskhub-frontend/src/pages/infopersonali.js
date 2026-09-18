import { useEffect, useState } from "react";
import { getMyInfo, updateMyInfo, deleteMyAccount } from "../api/user";
import "./infopersonali.css";

export default function InfoPersonali({ token, onLogout }) {
  const [info, setInfo] = useState(null);

  //modalità sola visualizzazione/modifica
  const [editing, setEditing] = useState(false);

  //form interno con i dati modificabili
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    age: "",
    birthplace: ""
  });

  //carico info utente all'apertura pagina
  useEffect(() => {
    getMyInfo(token)
      .then(data => {
        setInfo(data);
        setForm({
          nome: data.nome || "",
          cognome: data.cognome || "",
          email: data.email || "",
          age: data.age || "",
          birthplace: data.birthplace || ""
        });
      })
      .catch(err => console.error("Errore getMyInfo:", err));
  }, [token]);

  if (!info) {
    return <p style={{ padding: 20 }}>Caricamento...</p>;
  }

  //salva modifiche 
  async function handleSave() {
    try {
      const updated = await updateMyInfo(token, form);

      setInfo(updated);   //aggiorno i dati mostrati
      setEditing(false);  //torna in modalità sola visualizzazione

      alert("Modifiche salvate!");
    } catch (err) {
      alert("Errore: " + err.message);
    }
  }

  const handleDelete = async () => {
  if (!window.confirm("Sei sicuro di voler eliminare DEFINITIVAMENTE il tuo account?")) {
    return;
  }

  try {
    await deleteMyAccount(token);
    //con eliminazione account torno a homepage
    localStorage.clear();
    window.location.href = "/";
  } catch (err) {
    console.error("Errore eliminazione account:", err);
    alert("Errore durante l'eliminazione dell'account.");
  }
};





return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <img src="/logo.png" alt="Logo TaskHub" className="logo-img" />
          <span>TaskHub</span>
        </div>

        <div className="nav-links">
          <span onClick={() => (window.location.href = "/dashboard")}>
            Dashboard
          </span>

          <span className="divider">|</span>
          <span className="logout" onClick={onLogout}>
            Logout
          </span>
        </div>
      </header>

      {/*Informazioni utente */}
      <div className="account-wrapper">
        <div className="account-card">
          <h2 className="account-title">Il mio account</h2>

          <div className="account-info">

            
            <div className="info-row">
              <span className="info-label">Nome</span>
              {editing ? (
                <input
                  className="edit-input"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              ) : (
                <span className="info-value">{info.nome}</span>
              )}
            </div>

            
            <div className="info-row">
              <span className="info-label">Cognome</span>
              {editing ? (
                <input
                  className="edit-input"
                  value={form.cognome}
                  onChange={(e) =>
                    setForm({ ...form, cognome: e.target.value })
                  }
                />
              ) : (
                <span className="info-value">{info.cognome}</span>
              )}
            </div>

            
            <div className="info-row">
              <span className="info-label">Email</span>
              {editing ? (
                <input
                  className="edit-input"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              ) : (
                <span className="info-value">{info.email}</span>
              )}
            </div>

          
            <div className="info-row">
              <span className="info-label">Età</span>
              {editing ? (
                <input
                  className="edit-input"
                  value={form.age}
                  onChange={(e) =>
                    setForm({ ...form, age: e.target.value })
                  }
                />
              ) : (
                <span className="info-value">{info.age}</span>
              )}
            </div>

            
            <div className="info-row">
              <span className="info-label">Luogo di nascita</span>
              {editing ? (
                <input
                  className="edit-input"
                  value={form.birthplace}
                  onChange={(e) =>
                    setForm({ ...form, birthplace: e.target.value })
                  }
                />
              ) : (
                <span className="info-value">{info.birthplace}</span>
              )}
            </div>

          </div>

          {/*Bottoni*/}
          {!editing ? (
            <button className="modify-btn" onClick={() => setEditing(true)}>
              Modifica informazioni
            </button>
          ) : (
            <button className="modify-btn" onClick={handleSave}>
              Salva modifiche
            </button>
          )}
          <button
            className="delete-account-btn"
            onClick={handleDelete}
          >
            Elimina Account
          </button>


        </div>
      </div>

    </div>
  );
}
