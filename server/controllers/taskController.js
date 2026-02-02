import db from '../db/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all tasks for current user
export const getAllTasks = (req, res, next) => {
  try {
    const { status, priority, subject, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query = 'SELECT * FROM tasks WHERE userId = ?';
    const params = [req.userId];
    
    // Apply filters
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }
    if (subject) {
      query += ' AND subject LIKE ?';
      params.push(`%${subject}%`);
    }
    
    // Apply sorting
    const allowedSortFields = ['createdAt', 'dueDate', 'priority', 'title'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;
    
    const tasks = db.prepare(query).all(...params);
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// Get single task
export const getTask = (req, res, next) => {
  try {
    const { id } = req.params;
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?').get(id, req.userId);
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Create new task
export const createTask = (req, res, next) => {
  try {
    const { title, description, subject, dueDate, priority, status } = req.body;
    
    if (!title) {
      throw new AppError('Task title is required', 400);
    }
    
    db.prepare(`
      INSERT INTO tasks (userId, title, description, subject, dueDate, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.userId,
      title,
      description || null,
      subject || null,
      dueDate || null,
      priority || 'medium',
      status || 'pending'
    );
    
    // Get the newly created task (most recent for this user)
    const newTask = db.prepare('SELECT * FROM tasks WHERE userId = ? ORDER BY id DESC LIMIT 1').get(req.userId);
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};


// Update task
export const updateTask = (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, subject, dueDate, priority, status } = req.body;
    
    // Check if task exists and belongs to user
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?').get(id, req.userId);
    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }
    
    // Build dynamic update query
    const updates = [];
    const params = [];
    
    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (subject !== undefined) { updates.push('subject = ?'); params.push(subject); }
    if (dueDate !== undefined) { updates.push('dueDate = ?'); params.push(dueDate); }
    if (priority !== undefined) { updates.push('priority = ?'); params.push(priority); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    
    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }
    
    updates.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id, req.userId);
    
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND userId = ?`;
    db.prepare(query).run(...params);
    
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};


// Delete task
export const deleteTask = (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if task exists and belongs to user
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?').get(id, req.userId);
    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }
    
    db.prepare('DELETE FROM tasks WHERE id = ? AND userId = ?').run(id, req.userId);
    
    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Get task stats for current user
export const getTaskStats = (req, res, next) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM tasks WHERE userId = ?
    `).get(req.userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
