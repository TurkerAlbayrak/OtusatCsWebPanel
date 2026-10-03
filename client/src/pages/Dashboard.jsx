import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveTask = async (taskData) => {
    const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
    const method = editingTask ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(taskData)
    });

    setIsModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTasks();
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');

  const isAdmin = user?.role === 'admin';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Aktif Görevler</h1>
        {isAdmin && (
          <button
            onClick={openNewTaskModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Yeni Görev</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Todo Column */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              Yapılacak
            </h2>
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{todoTasks.length}</span>
          </div>
          <div className="space-y-4">
            {todoTasks.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Görev yok</p>
            ) : (
              todoTasks.map(task => (
                <TaskCard key={task.id} task={task} isAdmin={isAdmin} onEdit={openEditModal} onDelete={handleDeleteTask} />
              ))
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-blue-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Devam Ediyor
            </h2>
            <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{inProgressTasks.length}</span>
          </div>
          <div className="space-y-4">
            {inProgressTasks.length === 0 ? (
              <p className="text-blue-400 text-sm text-center py-4">Görev yok</p>
            ) : (
              inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} isAdmin={isAdmin} onEdit={openEditModal} onDelete={handleDeleteTask} />
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          task={editingTask}
        />
      )}
    </div>
  );
}
