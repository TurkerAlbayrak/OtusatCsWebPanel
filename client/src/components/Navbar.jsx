import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, CheckSquare, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <CheckSquare className="text-blue-600" size={28} />
        <span className="text-xl font-bold text-gray-800">Görev Paneli</span>
      </div>
      
      <div className="flex items-center gap-6">
        <Link 
          to="/tasks" 
          className={`flex items-center gap-2 font-medium transition ${location.pathname === '/tasks' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <LayoutDashboard size={20} />
          <span>Görevler</span>
        </Link>
        <Link 
          to="/completed" 
          className={`flex items-center gap-2 font-medium transition ${location.pathname === '/completed' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <CheckSquare size={20} />
          <span>Tamamlananlar</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-gray-500">Hoş geldin, </span>
          <span className="font-bold text-gray-800">{user?.name}</span>
          {user?.role === 'admin' && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold">Admin</span>}
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Çıkış Yap</span>
        </button>
      </div>
    </nav>
  );
}
