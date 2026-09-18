//fetch api per mandare richieste - groups

export async function createGroup(token, name) {
  const res = await fetch("http://localhost:3001/groups/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ name })
  });


  const data = await res.json();

  if (!res.ok || !data._id) {
    throw new Error(data.error || "Errore creazione gruppo");
  }

  return data;
}


export async function joinGroup(token, code) {
  const res = await fetch("http://localhost:3001/groups/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ code })
  });

  const data = await res.json();

  if (!res.ok || !data._id) {
    throw new Error(data.error || "Errore join group");
  }

  return data;
}


export async function leaveGroup(token, groupId) {
  const res = await fetch("http://localhost:3001/groups/leave", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ groupId }),
  });

  if (!res.ok) throw new Error("Errore abbandono gruppo");
  return res.json();
}


export async function deleteGroup(token, id) {
  const res = await fetch(`http://localhost:3001/groups/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  return res.json();
}

export async function getGroups(token) {
  const res = await fetch("http://localhost:3001/groups", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  if (!res.ok || !Array.isArray(data)) {
    console.error("ERRORE GET /groups:", data);
    return [];
  }

  return data;
}








