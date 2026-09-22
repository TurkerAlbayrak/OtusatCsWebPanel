import { useState, useEffect } from 'react';
import { Calendar, User, Flag, CheckCircle } from 'lucide-react';

export default function CompletedTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:5000/api/completed-tasks', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Sort by completed date descending
        data.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        setTasks(data);
      }
    };
    fetchTasks();
  }, []);

  const priorityLabels = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CheckCircle className="text-green-500" />
          Tamamlanan Görevler
        </h1>
        <p className="text-gray-500 mt-1">Ekip tarafından tamamlanmış görevlerin geçmişi.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Henüz tamamlanmış görev bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map(task => (
              <div key={task.id} className="p-5 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {task.assignedToName.charAt(0)}
                      </div>
                      <span>{task.assignedToName}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Flag size={14} className="text-gray-400" />
                      <span>{priorityLabels[task.priority]} Öncelik</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg sm:bg-transparent sm:p-0">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Oluşturulma: {new Date(task.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-600 font-medium">
                    <CheckCircle size={14} />
                    <span>Tamamlanma: {new Date(task.completedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
