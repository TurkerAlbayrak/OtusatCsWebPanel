const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Geçersiz token." });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Oturum açmanız gerekiyor." });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
  }
};
