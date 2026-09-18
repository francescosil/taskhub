import { useEffect, useState, useRef, useMemo } from "react";
import { getTasks, updateTask, createTask, deleteTask } from "../api/tasks";
import {getGroups, joinGroup, createGroup, deleteGroup, leaveGroup} from "../api/groups";
import { getMyInfo } from "../api/user";
import TaskColumn from "../components/TaskColumn";
import GroupList from "../components/GroupList";
import GroupForm from "../components/GroupForm";
import "./dashboardPage.css";

import { io } from "socket.io-client";

export default function DashboardPage({ token, onLogout }) {
  //stati fondamentali
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState(null);

  const resetEditing = () => {
      setEditingTask(null);
      setEditingGroupId(null);
  };


  const socketRef = useRef(null);
  const userId = localStorage.getItem("userId");

  //variabili su data utili a fare controlli su cose fattibili solo nel giorno attuale
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const isToday = selectedDate === today;


  
  //SOCKET.IO
  useEffect(() => {
    if (!token) return;

    socketRef.current = io("http://localhost:3001", {
      auth: { token }
    });

    socketRef.current.on("connect", () => {
    //join stanza utente
      socketRef.current.emit("joinRooms", { userId, groups: [] });
    });

    //Quando arriva task reata dal server
    socketRef.current.on("task:new", (task) => {
      setTasks(prev => {
        if (prev.some(t => t._id === task._id)) return prev;
        return [...prev, task];
      });
    });

    //Aggiornamento task
    socketRef.current.on("task:update", (task) => {
      setTasks(prev =>prev.map(t => (t._id === task._id ? task : t))
      );
    });

    //Elimina task
    socketRef.current.on("task:delete", ({ _id }) => {
      setTasks(prev=>prev.filter(t => t._id !== _id));
    });

    //Elimina gruppo
    socketRef.current.on("group:deleted", ({ groupId }) => {
      setGroups(prev => prev.filter(g => g._id !== groupId));
      setTasks(prev => prev.filter(t => t.groupId !== groupId));
    });

    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [token, userId]);



  //Carica le task iniziali dopo accesso (serve il token)
  useEffect(() => {
    if (!token) return;
    getTasks(token)
      .then((res) => {
        if (Array.isArray(res)) setTasks(res);
        else {
          console.error("GET /tasks risposta non valida:", res);
          setTasks([]);
        }
      })
      .catch(err => {
        console.error("Errore getTasks:", err);
        setTasks([]);
      });
  }, [token]);

  //Carica gruppi e poi fai join alle stanze dei gruppi
  useEffect(() => {
    if (!token) return;
    getGroups(token)
      .then((res) => {
        if (Array.isArray(res)) {
          setGroups(res);
          //join stanze gruppo + stanza utente
          if (socketRef.current) {
            const gids = res.map(g => g._id);
            socketRef.current.emit("joinRooms", { userId, groups: gids });
          }
        } else {
          console.error("GET /groups risposta non valida:", res);
          setGroups([]);
        }
      })
      .catch(err => {
        console.error("Errore getGroups:", err);
        setGroups([]);
      });

  }, [token, userId]);


  //ottieni info utente
  useEffect(() => {
  getMyInfo(token)
    .then(data => setUserInfo(data))
    .catch(err => console.error("Errore caricamento info utente:", err));
  }, [token]);



  //far vedere task e gruppi in base al giorno
  const isInSelectedDate = t => t.date?.slice(0,10) === selectedDate;

  const personalTasks = tasks
  .filter(t => !t.groupId && isInSelectedDate(t))
  .sort((a, b) => {
    const priorityOrder = { low: 1, medium: 2, high: 3 };
    return priorityOrder[b.priority] - priorityOrder[a.priority]; // Ordinamento crescente in base alla priorità
  });

  const groupedTasks = groups.map(g => ({
    group: g,
    tasks: tasks
    .filter(t => t.groupId === g._id && isInSelectedDate(t))
    .sort((a, b) => {
    const priorityOrder = { low: 1, medium: 2, high: 3 };
    return priorityOrder[b.priority] - priorityOrder[a.priority]; // Ordinamento crescente in base alla priorità
  })
  }));


  // Aggiungi task
  const addTask = async (payload, groupId = null) => {
    if (!isToday) {
      console.warn("Aggiunta task disabilitata: non è il giorno attuale");
      return;
    }

    if (editingTask) {
    await handleEditTask(payload);
    return;
    }

    let body;
    if (typeof payload === "string") {
      body = { title: payload, priority: "low", comment: "" };
    } else if (payload && typeof payload === "object") {
      body = {
        title: payload.title || "",
        priority: payload.priority || "low",
        comment: payload.comment || ""
      };
    } else {
      return;
    }

    if (!body.title || !body.title.trim()) return;

    try {
      await createTask(token, {
        title: body.title,
        priority: body.priority,
        comment: body.comment,
        completed: false,
        groupId,
        date: selectedDate
      });
    } catch (err) {
      console.error("Errore creazione task:", err);
    }
  };



  // Toggle completamento
  const toggleTask = async (task) => {
    if (!isToday) {
      console.warn("Modifica task disabilitata: non è il giorno attuale");
      return;
    }

    try {
      const updated = await updateTask(token, task._id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
    } catch (err) {
      console.error("Errore aggiornamento task:", err);
    }
  };

  // Modifica task
  const handleEditTask = async (data) => {
  if (!editingTask) return;

  try {
    await updateTask(token, editingTask._id, {
      title: data.title,
      priority: data.priority,
      comment: data.comment,
      groupId: editingGroupId
    });

    

    resetEditing();

  } catch (err) {
    console.error("Errore modifica task:", err);
  }
};

  //Elimina task
  const handleDeleteTask = async (taskId) => {
    if (!isToday) {
      console.warn("Eliminazione task disabilitata: non è il giorno attuale");
      return;
    }


    if (editingTask && editingTask._id === taskId) {
    resetEditing();
    }

    try {
      await deleteTask(token, taskId);
      
    } catch (err) {
      console.error("Errore eliminazione task:", err);
    }
};



  //Creazione gruppo
  const handleCreateGroup = async () => {
    if (!newGroupName || !newGroupName.trim()) return;
    try {
      const newGroup = await createGroup(token, newGroupName);
      setGroups(prev => [...prev, newGroup] );
      setNewGroupName("");
      if (socketRef.current) {
      socketRef.current.emit("joinRooms", {
        userId,
        groups: [newGroup._id]
      });
     }
    } catch (err) {
      console.error("Errore creazione gruppo:", err);
      alert(err.message || "Errore creazione gruppo");
    }
  };

  //Entra nel gruppo
  const handleJoinGroup = async () => {
    if (!joinCode || !joinCode.trim()) return;

    try {
      const group = await joinGroup(token, joinCode);
      setGroups(prev => (prev.some(g => g._id === group._id) ? prev : [...prev, group]));
      setJoinCode("");
      if (socketRef.current) socketRef.current.emit("joinRooms", { userId, groups: [group._id] });
    } catch (err) {
      console.error("Errore join group:", err);
    }
    
  };

  
  const handleDeleteGroup = async (groupId, createdBy) => {

    try {
    // caso 1: l'utente è il creatore del gruppo, elimina gruppo definitivamente
    if (createdBy === userId) {
      await deleteGroup(token, groupId);

      // rimuovi visualmente
      
      setGroups(prev => prev.filter(g => g._id !== groupId));
      setTasks(prev => prev.filter(t => t.groupId !== groupId));

      alert("Gruppo eliminato definitivamente");
      return;
    }

    // caso 2: utente NON creatord, lascia il gruppo
    else {await leaveGroup(token, groupId)}
    
    setGroups(prev => prev.filter(g => g._id !== groupId));
    setTasks(prev => prev.filter(t => t.groupId !== groupId));
  } catch (err) {
    console.error("Errore nella rimozione gruppo:", err);
    alert("Errore");
  }
  };



  return (
   <div className="dashboard-wrapper">

  {/* HEADER */}
  <header className="dashboard-header">
    <div className="logo">
      <img src="/logo.png" alt="Logo TaskHub" className="logo-img" />
      <span>TaskHub</span>
    </div>

    <div className="nav-links">
      <span onClick={() => window.location.href = "/account"}>Il mio account</span>
      <span className="divider">|</span>
      <span className="logout" onClick={onLogout}>Logout</span>
    </div>
  </header>


  <div className="dashboard-layout">
    
    <aside className="sidebar">

    <>
      <h2 className="sidebar-title">I miei gruppi</h2>

      <GroupList
        groups={groups}
        onDelete={handleDeleteGroup}
      />

      <GroupForm
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        joinCode={joinCode}
        setJoinCode={setJoinCode}
        onCreate={handleCreateGroup}
        onJoin={handleJoinGroup}
      />
    </>
  

    </aside>

    <main className="dashboard-main">
      
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="calendar-wrapper">
        <input
          type="date"
          className="calendar"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="columns-container">
        <TaskColumn

          title={userInfo ? `Task di ${userInfo.nome}` : "Le mie task"}
          tasks={personalTasks}
          onToggle={toggleTask}
          onAdd={(payload) => addTask(payload, null)}
          onEdit={(task) => {
              if (!task.completed) {
                setEditingTask(task);
                setEditingGroupId(null);
              }}}
          onDelete={handleDeleteTask}
          isEditable={isToday}
          editingTask={editingTask?.groupId ? null : editingTask}
          onInt={(int)=>{if(int){setEditingTask(null);}}}
        />

        {groupedTasks.map(g => (
            <div key={g.group._id} className="group-column-wrapper">
             <TaskColumn
                title={g.group.name}
                tasks={g.tasks}
                onToggle={toggleTask}
                onAdd={(payload) => addTask(payload, g.group._id)}
                onEdit={(task) => {
                    setEditingTask(task);
                    setEditingGroupId(task.groupId || null);
                }}
                onDelete={handleDeleteTask}
                isEditable={isToday}
                editingTask={
                  editingTask && editingTask.groupId === g.group._id 
                  ? editingTask 
                  : null}
                editingGroupId={editingGroupId}
              />

            </div>
          ))
        }
      </div>

  

    </main>

  </div>
</div>

  );
}









