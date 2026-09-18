import { useState, useRef } from "react";
import "./HomePage.css";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function HomePage({ onLoginSuccess }) {
  const [formMode, setFormMode] = useState("login");
  
  const formRef = useRef(null);
  const section1Ref = useRef(null);

  const scrollToSection1 = () => {
    section1Ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  

  const scrollToForm = () => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
  };

  return (
  <div className="home-container">

      {/* HEADER */}
      <header className="home-header">
        <div className="logo">
          <img src="/logo.png" alt="Logo TaskHub" className="logo-img" />
          <span>TaskHub</span>
        </div>

        <button
          className="header-btn"
          onClick={() => {
            setFormMode("login");
            scrollToForm();
          }}
        >
          Accedi
        </button>
      </header>

      {/* HERO */}
    <section className="hero">
      <h1 className="hero-title">TaskHub</h1>
      <p className="hero-subtitle">Organizza, collabora e rimani aggiornato.</p>

      <p className="hero-text">
          TaskHub è un’applicazione progettata per aiutarti a gestire le tue attività quotidiane
          in modo semplice ed efficace. Le funzionalità in tempo reale migliorano la produttività
          e permettono la collaborazione fluida tra utenti.
      </p>

      <button
          className="primary-btn"
          onClick={() => {
            scrollToSection1();
          }}>
          Scopri di più
      </button>
      
    </section>

    <div className="divider"></div>

      {/* SECTION 1 */}
    <section className="split-section" ref={section1Ref}>

        <div className="split-text">
          <h2 className="feature-title">Collabora con altre persone</h2>
          <p className="feature-text">
            Condividi le tue liste di attività con colleghi, amici o familiari tramite un codice
            gruppo. Coordina facilmente progetti o attività quotidiane con aggiornamenti in tempo reale.
          </p>
        </div>

        <div className="split-image">
          <img src="/collabora.png" alt="collabora" className="feature-image" />
        </div>
    </section>

    <div className="divider"></div>

      {/* SECTION 2 */}
    <section className="split-section reverse">
        <div className="split-image">
          <img src="/realtime.jpg" alt="realtime" className="feature-image" />
        </div>

        <div className="split-text">
          <h2 className="feature-title">Aggiornamenti in tempo reale</h2>
          <p className="feature-text">
            Le modifiche alle attività vengono sincronizzate immediatamente su tutti i dispositivi,
            rendendo semplice monitorare ogni cambiamento quando collabori con altri utenti.
          </p>
        </div>
    </section>

    <div className="divider"></div>

      {/* FORM */}
    <section className="form-section" ref={formRef}>
        <div className="form-box">
        {formMode === "login" && (
          <>
            <h3 className="form-title">Bentornato</h3>
              <p className="form-subtitle">Accedi al tuo spazio personale</p>

            <LoginForm
                onSuccess={(token, userId) => onLoginSuccess(token, userId)}
              />

              <p className="switch-text">
                Non hai un account?
                <button className="switch-btn" onClick={() => setFormMode("register")}>
                Registrati
              </button>
              </p>
          </>
          )
        }



        {formMode === "register" && (
            
            <>
             <h3 className="form-title">Registrati</h3>
              <p className="form-subtitle">Inserisci le tue credenziali</p>

              <RegisterForm onSuccess={() => setFormMode("login")} />

              <p className="switch-text">
                Hai già un account?{" "}
                <button className="switch-btn" onClick={() => setFormMode("login")}>
                  Accedi
                </button>
              </p>
            </>
          )
        }
      </div>
    </section>

  </div>
  );
}
