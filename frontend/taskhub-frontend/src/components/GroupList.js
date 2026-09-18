//componente lista gruppi
export default function GroupList({ groups, onDelete }) {
  return (
    <div className="group-list">
      {groups.map((g) => (
        <div key={g._id} className="group-item">
          <div className="group-name">{g.name}</div>
          <div className="group-code">{g.code}</div>

          <button
            className="group-remove-btn"
            onClick={() => onDelete(g._id, g.createdBy)}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
