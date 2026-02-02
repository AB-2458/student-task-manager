import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import StatsGrid from '../components/StatsGrid';
import FilterBar from '../components/FilterBar';

export default function Dashboard({ user, onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', priority: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, statsRes] = await Promise.all([
                tasksAPI.getAll(filters),
                tasksAPI.getStats()
            ]);
            setTasks(tasksRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await tasksAPI.delete(taskId);
            fetchData();
        } catch (error) {
            alert('Failed to delete task: ' + error.message);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await tasksAPI.update(taskId, { status: newStatus });
            fetchData();
        } catch (error) {
            alert('Failed to update status: ' + error.message);
        }
    };

    const handleSaveTask = async (taskData) => {
        try {
            if (editingTask) {
                await tasksAPI.update(editingTask.id, taskData);
            } else {
                await tasksAPI.create(taskData);
            }
            setModalOpen(false);
            fetchData();
        } catch (error) {
            throw error;
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="app">
            <header className="header">
                <div className="container header-content">
                    <div className="logo">
                        <span className="logo-icon">📚</span>
                        <span>TaskManager</span>
                    </div>
                    <div className="user-menu">
                        <div className="user-info">
                            <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
                            <span className="user-name">{user?.name || user?.email}</span>
                        </div>
                        <button className="btn btn-ghost" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard">
                <div className="container">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">My Tasks</h1>
                            <p className="dashboard-subtitle">Manage your assignments and deadlines</p>
                        </div>
                        <button className="btn btn-primary" onClick={handleCreateTask}>
                            ✨ Add New Task
                        </button>
                    </div>

                    <StatsGrid stats={stats} />

                    <FilterBar filters={filters} onFilterChange={handleFilterChange} />

                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <h3>No tasks found</h3>
                            <p>Get started by creating your first task</p>
                            <button className="btn btn-primary" onClick={handleCreateTask}>
                                Create Task
                            </button>
                        </div>
                    ) : (
                        <div className="task-list">
                            {tasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={() => handleEditTask(task)}
                                    onDelete={() => handleDeleteTask(task.id)}
                                    onStatusChange={(status) => handleStatusChange(task.id, status)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {modalOpen && (
                <TaskModal
                    task={editingTask}
                    onSave={handleSaveTask}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}
