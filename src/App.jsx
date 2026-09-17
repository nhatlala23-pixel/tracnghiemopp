import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import WrongQuestions from './pages/WrongQuestions';
import Bookmarks from './pages/Bookmarks';
import Statistics from './pages/Statistics';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/wrong-questions" element={<WrongQuestions />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
