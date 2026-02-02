import { Router } from 'express';
import { 
  getAllTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask,
  getTaskStats 
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes are protected
router.use(authenticate);

// GET /api/tasks/stats - Get task statistics
router.get('/stats', getTaskStats);

// GET /api/tasks - Get all tasks (with optional filters)
router.get('/', getAllTasks);

// GET /api/tasks/:id - Get single task
router.get('/:id', getTask);

// POST /api/tasks - Create new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask);

export default router;
