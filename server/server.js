require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');



const todoApp = express();

// Load the environment variables

// MIDDLEWARE
todoApp.use(cors());
todoApp.use(express.json());

// MySQL connection using .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
  });


//   add task-api
todoApp.post('/api/tasks', (request,response) => {
    const { title, description } = request.body;
    const sql = `INSERT INTO tasks (title, description) VALUES (?,?)`;

    db.query(sql, [title,description], (err,result) => {
        if (err) {
            return response.status(500).json({error : err.message});
        }
        response.status(201).json({
            id: result.insertId,
            title,
            description,
            completed: false,
          });
    })
});


// Get All Tasks
todoApp.get('/api/tasks', (req, res) => {
  console.log('Received GET request for /api/tasks');
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
  });
});



  
//  Update Task (edit title, description, or completed)
todoApp.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
  
    const sql = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?';
    db.query(sql, [title, description, completed, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
  
      // Fetch the updated task data after successful update
      db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, updatedResults) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(updatedResults[0]); // Send back the updated task
      });
    });
  });
  



  todoApp.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
      console.log(`Task with ID ${id} deleted successfully`);
      res.json({ message: 'Task deleted successfully' });
    });
  });
  

const PORT = process.env.PORT;
todoApp.listen(PORT, () => console.log(`Server running on port ${PORT}`));