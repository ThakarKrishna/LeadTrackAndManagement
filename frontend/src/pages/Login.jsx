import React, { useState } from 'react';
import { api, endpoints } from '../api/client.js';
import { useAuth } from '../providers/AuthProvider.jsx';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Mail } from 'lucide-react';
import { PasswordInput } from '../components/ui/PasswordInput.jsx';

export default function Login() {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const onSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const { data } = await api.post(endpoints.auth.login, { email, password });
			login(data.token, data.user);
		} catch (err) {
			setError(err?.response?.data?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<h2 className="mb-4 text-xl font-semibold">Login</h2>
				<form onSubmit={onSubmit} className="space-y-3">
					<div>
						<label className="mb-1 block text-sm">Email</label>
						<Input startIcon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>
					<div>
						<label className="mb-1 block text-sm">Password</label>
						<PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					{error && <div className="text-sm text-red-500">{error}</div>}
					<Button className="w-full" disabled={loading} type="submit">{loading ? 'Loading...' : 'Login'}</Button>
				</form>
				<div className="mt-3 text-sm">
					No account? <Link className="underline" to="/signup">Sign up</Link>
				</div>
			</Card>
		</div>
	);
}



