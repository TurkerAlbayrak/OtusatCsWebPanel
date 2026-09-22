const supabase = require('../lib/supabase');

exports.getTasks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .neq('status', 'completed')
      .order('createdAt', { ascending: false });
      
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

exports.getCompletedTasks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'completed')
      .order('completedAt', { ascending: false });
      
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, assignedToName, status, priority, dueDate } = req.body;
    
    const newTask = {
      id: "task-" + Date.now(),
      title,
      description,
      assignedTo,
      assignedToName,
      status: status || 'todo',
      priority: priority || 'medium',
      createdAt: new Date().toISOString(),
      dueDate: dueDate || null
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select();
      
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ message: "Görev bulunamadı." });
    
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    res.json({ message: "Görev silindi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
