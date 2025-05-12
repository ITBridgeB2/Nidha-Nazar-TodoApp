import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/TaskDetails.css";

export default function TaskDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch task once
  useEffect(() => {
    const initialTask = location.state;
    if (initialTask) {
      setTask(initialTask);
      setEditTitle(initialTask.title);
      setEditDescription(initialTask.description);
    } else {
      axios
        .get(`http://localhost:8000/api/tasks/${id}`)
        .then((res) => {
          setTask(res.data);
          setEditTitle(res.data.title);
          setEditDescription(res.data.description);
        })
        .catch((err) => console.error("Error fetching task:", err));
    }
  }, [id, location.state]);

  const handleComplete = async () => {
    try {
      // Update the task's status to "complete" in the backend
      await axios.put(`http://localhost:8000/api/tasks/${id}`, {
        title: task.title,
        description: task.description,
        completed: true,
      });

      // Update the task state to reflect the change in the frontend
      setTask((prev) => ({ ...prev, completed: true }));
      alert(`Marked "${task.title}" as Complete`);
    } catch (err) {
      console.error("Error marking complete:", err);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    try {
      const updatedTask = {
        title: editTitle,
        description: editDescription,
        completed: task.completed,
      };
  
      // Update task on the backend
      const response = await axios.put(`http://localhost:8000/api/tasks/${id}`, updatedTask);
  
      // Assuming the API returns the updated task, update the local state
      setTask((prev) => ({
        ...prev,
        ...response.data, // Update with the latest task from the response
      }));
  
      setIsEditing(false);
      alert("Task updated successfully");
    } catch (err) {
      console.error("Error saving edits:", err);
      alert("Failed to update task");
    }
  };
  
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}`);
      alert(`Deleted task "${task.title}"`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="task-details">
      <div className="task-card">
      <button className="btn blue back-button" onClick={() => navigate("/")}>
            &larr; Back to Task List
        </button>
        {isEditing ? (
          <>
            {/* Edit Form */}
            <input
              className="task-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="task-input"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <div className="button-group">
              <button className="btn green" onClick={handleEditSave}>
                Save
              </button>
              <button className="btn gray" onClick={handleEditCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Task Details */}
            <h2 className="task-title">{task.title}</h2>
            <p className="task-desc">{task.description}</p>
            <p className="task-status">
              Status: <strong>{task.completed ? "Complete" : "Pending"}</strong>
            </p>
            <div className="button-group">
              {!task.completed && (
                <button className="btn green" onClick={handleComplete}>
                  Mark Complete
                </button>
              )}
              <button className="btn yellow" onClick={handleEditToggle}>
                Edit
              </button>
              <button className="btn red" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
