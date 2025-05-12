import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import TaskList from './components/TaskList';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/add-task" element={<TaskForm />} />
        {/* details page */}
        <Route path="/task/:id" element={<TaskDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
