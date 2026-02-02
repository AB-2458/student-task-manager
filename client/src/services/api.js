const API_BASE = 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  async register(email, password, name) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async getMe() {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to get user');
    return data;
  }
};

// Tasks API
export const tasksAPI = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = `${API_BASE}/tasks${params ? `?${params}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch tasks');
    return data;
  },

  async getById(id) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch task');
    return data;
  },

  async create(task) {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(task)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create task');
    return data;
  },

  async update(id, task) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(task)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update task');
    return data;
  },

  async delete(id) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete task');
    return data;
  },

  async getStats() {
    const response = await fetch(`${API_BASE}/tasks/stats`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch stats');
    return data;
  }
};
