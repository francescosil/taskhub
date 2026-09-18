//fetch api per mandare richieste - tasks
export async function createTask(token, body) {
  const res = await fetch("http://localhost:3001/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok || !data._id) {
    throw new Error(data.error || "Errore creazione task");
  }

  return data;
}

export async function getTasks(token) {
  const res = await fetch("http://localhost:3001/tasks", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  return data;
}




export async function updateTask(token, taskId, updates) {
  if (!taskId || typeof taskId !== "string") {
    console.error("updateTask ERROR: taskId non valido:", taskId);
    throw new Error("taskId non valido");
  }

  const res = await fetch(`http://localhost:3001/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Errore updateTask:", text);
    throw new Error("Errore updateTask");
  }

  return res.json();
}


export async function deleteTask(token, id) {
  const res = await fetch("http://localhost:3001/tasks/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  return res.json();
}
