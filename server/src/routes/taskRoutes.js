const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/tasks', verifyToken, taskController.getTasks);
router.get('/completed-tasks', verifyToken, taskController.getCompletedTasks);

router.post('/tasks', verifyToken, isAdmin, taskController.createTask);
router.put('/tasks/:id', verifyToken, isAdmin, taskController.updateTask);
router.delete('/tasks/:id', verifyToken, isAdmin, taskController.deleteTask);

module.exports = router;
