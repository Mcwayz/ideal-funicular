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
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody.message) errorMessage += ` - ${errorBody.message}`;
    } catch (e) {
      // Body not a JSON or no message
    }
    throw new Error(errorMessage);
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
  risks: {
    list: () => fetchApi('/risks'),
    listByProject: (projectId: string) => fetchApi(`/risks/project/${projectId}`),
    create: (projectId: string, data: any) => fetchApi(`/risks/project/${projectId}`, { method: 'POST', body: JSON.stringify(data) }),
  },
  documents: {
    list: () => fetchApi('/documents'),
    listByProject: (projectId: string) => fetchApi(`/documents/project/${projectId}`),
    create: (projectId: string, data: any) => fetchApi(`/documents/project/${projectId}`, { method: 'POST', body: JSON.stringify(data) }),
  },
  users: {
    list: () => fetchApi('/users'),
    listByProject: (projectId: string) => fetchApi(`/users/project/${projectId}`),
  },
  auth: {
    login: (data: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
};
