//fetch api per mandare richieste - user
export async function login(email, password) {
  const res = await fetch("http://localhost:3001/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Errore login");
  }

  return data;
}

export async function register(nome, cognome, email, password, age, sex, birthplace) {
  const res = await fetch("http://localhost:3001/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, cognome, email, password, age, sex, birthplace })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return data; 
  }

  return data; 
}

export async function getMyInfo(token) {
  const res = await fetch("http://localhost:3001/user/me", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) throw new Error("Errore caricamento dati utente");
  return res.json();
}


export async function updateMyInfo(token, payload) {
  const res = await fetch("http://localhost:3001/user/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}


export async function deleteMyAccount(token) {
  const res = await fetch("http://localhost:3001/user/me", {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Errore eliminazione account:", text);
    throw new Error("Errore eliminazione account");
  }

  return res.json();
}

