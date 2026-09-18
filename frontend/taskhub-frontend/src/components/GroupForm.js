//componente form per gestione gruppi
export default function GroupForm({
  newGroupName,
  setNewGroupName,
  joinCode,
  setJoinCode,
  onCreate,
  onJoin,
}) {
  return (
    <div className="sidebar-actions">
      <input
        placeholder="Nome gruppo"
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
      />
      <button onClick={onCreate}>Crea gruppo</button>

      <input
        placeholder="Codice gruppo"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
      />
      <button onClick={onJoin}>Unisciti</button>
    </div>
  );
}
