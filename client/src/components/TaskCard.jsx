import { Calendar, User, Flag, Edit, Trash2 } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, isAdmin }) {
  
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };
  
  const priorityLabels = {
    high: 'Yüksek',
    medium: 'Orta',
    low: 'Düşük'
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-gray-800 text-lg leading-tight">{task.title}</h3>
        {isAdmin && (
          <div className="flex gap-2 text-gray-400">
            <button onClick={() => onEdit(task)} className="hover:text-blue-600 transition"><Edit size={16} /></button>
            <button onClick={() => onDelete(task.id)} className="hover:text-red-600 transition"><Trash2 size={16} /></button>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${priorityColors[task.priority]}`}>
          <Flag size={12} />
          {priorityLabels[task.priority]}
        </span>
        {task.dueDate && (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
            <Calendar size={12} />
            {new Date(task.dueDate).toLocaleDateString('tr-TR')}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-sm text-gray-600">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
          {task.assignedToName.charAt(0)}
        </div>
        <span>{task.assignedToName}</span>
      </div>
    </div>
  );
}
