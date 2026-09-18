import { useState, useEffect } from "react";

export default function TaskForm({ onAdd, isEditable, editingTask, onint  }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");
  const [comment, setComment] = useState("");
  const [inter, setInter] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setPriority(editingTask.priority || "low");
      setComment(editingTask.comment || "");
    } else {
      setTitle("");
      setPriority("low");
      setComment("");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) return;
    if (!title.trim()) return;

    onAdd({ title, priority, comment });

    //dopo che inserisco task, il form si svuota
    setTitle("");
    setPriority("low");
    setComment("");
  };

  const handleInterrupt = (e) => {
    e.preventDefault();
    onint({inter});
  };

  
  
  return (
    <form onSubmit={handleSubmit} className={`task-form ${!isEditable ? "disabled" : ""}`}>
      
      <input
        placeholder="Titolo task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={!isEditable}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        disabled={!isEditable}
      >
        <option value="low">🟢 Non urgente</option>
        <option value="medium">🟡 Urgenza media</option>
        <option value="high">🔴 Urgente</option>
      </select>

      <textarea
        placeholder="Aggiungi un commento..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={!isEditable}
      />

      <button disabled={!isEditable}>
        {editingTask ? "Salva modifiche" : "Aggiungi"}
      </button>


      {editingTask ? 
      
        <>
         <form onSubmit={handleInterrupt} className={`task-form }`}>
              <button disabled={!isEditable}
              onClick={()=>setInter(true)}>             
                Annulla modifiche
              </button>
          </form>
        </>
        :
        null}

    </form>
  );
}
