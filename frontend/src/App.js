import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Cases from './pages/Cases';
import Tasks from './pages/Tasks';
import Deadlines from './pages/Deadlines';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/deadlines" element={<Deadlines />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

