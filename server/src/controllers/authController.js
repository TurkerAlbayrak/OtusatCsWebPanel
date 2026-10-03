const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabase');

const SECRET = process.env.JWT_SECRET || 'secret';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Supabase'den kullanıcıyı çek
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);
      
    if (error || !users || users.length === 0) {
      return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı." });
    }
    
    const user = users[0];
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı." });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.name }, 
      SECRET, 
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

exports.me = (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Oturum yok" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, username, role');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
