//Task Item è il componente della singola task che avrà tutte le info e funzionalita per ogni task: quindi tasto modifica, cecked, ecc...
export default function TaskItem({ task, onToggle, onDelete, onEdit, isEditable, editingTask }) {
  
  const priorityColor = {
    low: "#4cd964",
    medium: "#ffd60a",
    high: "#ff453a"      
  }[task.priority];

return (
<div className={`task-item ${editingTask&&editingTask.title===task.title ? "editing" : ""}`}>

  {/* priorità+ceckeed */}
  <div className="task-row-top">

  <span
    className="priority-bullet"
    style={{ backgroundColor: priorityColor }}></span>

  <span className={`task-title ${task.completed ? "completed" : ""}`}>
      {task.title}
  </span>

  <div
    className={`checkbox ${task.completed ? "checked" : ""}`}
    onClick={() => isEditable && onToggle(task)}
  >

    <svg className="checkmark" viewBox="0 0 24 24">
      <path d="M6 12l4 4 8-8" />
    </svg>
  </div>



   <button
      className="edit-btn"
      disabled={!isEditable}
      onClick={() => isEditable && onEdit(task)}>
      ✎
   </button>

</div>

{/* descrizione+modifica */}
<div className="task-row-bottom">

    {task.comment && (
      <p className="task-description">{task.comment}</p>
    )}

    <button
      className="delete-btn"
      disabled={!isEditable}
      onClick={() => isEditable && onDelete(task._id)}
    >
      X
    </button>
</div>

</div>

  );
}
