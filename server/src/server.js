const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes); // for /tasks and /completed-tasks

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get(/^.*$/, (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ message: "API route not found" });
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
