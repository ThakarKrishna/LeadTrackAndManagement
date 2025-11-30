import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
	baseURL: apiBase
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const endpoints = {
	auth: {
		login: '/auth/login',
		signup: '/auth/signup'
	},
	websites: '/api/websites',
	forms: '/api/forms',
	leads: '/api/leads',
	analytics: '/api/analytics'
};



