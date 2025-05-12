import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/TaskForm.css";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      await axios.post("http://localhost:8000/api/tasks", {
        title,
        description,
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  return (
    <div className="task-form-page">
      <form onSubmit={handleSubmit} className="task-form">
        <h2>To-Do List</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="task-input"
        />
        <button type="submit" className="task-button">Add Task</button>
      </form>
    </div>
  );
}
