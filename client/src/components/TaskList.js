import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/TaskList.css";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // Fetch tasks from the backend API
  useEffect(() => {
    axios.get("http://localhost:8000/api/tasks") 
      .then((res) => {
        console.log(res.data); // Log the response data to check if it matches expectations
        setTasks(res.data);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const handleClick = (task) => {
    navigate(`/task/${task.id}`, { state: task });
  };

  // const handleComplete = async (taskId) => {
  //   try {
  //     // Mark the task as complete in the backend
  //     await axios.put(`http://localhost:8000/api/tasks/${taskId}`, {
  //       completed: true,
  //     });

  //     // Update the task status locally in the task list
  //     setTasks((prevTasks) =>
  //       prevTasks.map((task) =>
  //         task.id === taskId ? { ...task, completed: true } : task
  //       )
  //     );
  //     alert("Task marked as complete");
  //   } catch (err) {
  //     console.error("Error marking complete:", err);
  //     alert("Failed to mark task as complete");
  //   }
  // };

  return (
    <div className="task-page">
      <nav className="navbar">ToDo App</nav>

      <div className="task-container">
      {tasks.length > 0 ? (
        tasks.map((task) => (
        <div key={task.id} className="task-item" onClick={() => handleClick(task)}>
            <span className="task-title">{task.title}</span>
            <span
            className={`task-status ${task.completed ? "complete" : "pending"}`}
            >
            {task.completed ? "Complete" : "Pending"}
            </span>
      </div>
    ))
  ) : (
    <p className="no-tasks">No to-dos to do!</p>
  )}
      </div>

      <button className="fab" onClick={() => navigate("/add-task")}>
        +
      </button>
    </div>
  );
}
