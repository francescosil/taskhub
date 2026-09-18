//taskColumn è il componente della colonna di elenco task + form di inserimento
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

export default function TaskColumn({
  title,
  tasks,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
  isEditable,
  editingTask,
  onInt
}) {
  return (
    <div className="task-column">
      <h2 className="column-title">{title}</h2>

      <div className="task-list">
        {tasks.map((t) => (
          <TaskItem
            key={t._id}
            task={t}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            isEditable={isEditable}
            editingTask={editingTask}
          />
        ))}
      </div>

      <TaskForm
        onAdd={(data) => onAdd(data)}
        isEditable={isEditable}
        editingTask={editingTask}
        onint={onInt}
      />
    </div>
  );
}
