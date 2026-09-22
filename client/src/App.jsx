import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompletedTasks from './pages/CompletedTasks';
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/tasks" /> : <Login />} />
          <Route path="/tasks" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/completed" element={<PrivateRoute><CompletedTasks /></PrivateRoute>} />
          <Route path="*" element={<Navigate to={user ? "/tasks" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
