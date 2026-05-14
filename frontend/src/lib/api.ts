const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  projects: {
    list: () => fetchApi('/projects'),
    get: (id: string) => fetchApi(`/projects/${id}`),
    create: (data: any) => fetchApi('/projects', { method: 'POST', body: JSON.stringify(data) }),
  },
  tasks: {
    listByProject: (projectId: string) => fetchApi(`/tasks/project/${projectId}`),
    create: (projectId: string, data: any) => fetchApi(`/tasks/project/${projectId}`, { method: 'POST', body: JSON.stringify(data) }),
  },
  auth: {
    login: (data: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
};
