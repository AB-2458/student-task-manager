import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Task Manager API is running 🚀",
    status: "OK"
  });
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Student Task Manager API is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: `Route ${req.method} ${req.url} not found` 
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓 Student Task Manager API                             ║
║   Server running on http://localhost:${PORT}               ║
║                                                           ║
║   Endpoints:                                              ║
║   • POST   /api/auth/register  - Register new user        ║
║   • POST   /api/auth/login     - Login user               ║
║   • GET    /api/auth/me        - Get current user         ║
║   • GET    /api/tasks          - Get all tasks            ║
║   • GET    /api/tasks/:id      - Get single task          ║
║   • POST   /api/tasks          - Create task              ║
║   • PUT    /api/tasks/:id      - Update task              ║
║   • DELETE /api/tasks/:id      - Delete task              ║
║   • GET    /api/tasks/stats    - Get task statistics      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
