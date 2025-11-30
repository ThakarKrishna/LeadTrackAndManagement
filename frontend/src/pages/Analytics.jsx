import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, endpoints } from '../api/client.js';
import { Card } from '../components/ui/Card.jsx';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Analytics() {
	const { data: perDay = [] } = useQuery({
		queryKey: ['analytics', 'perDay'],
		queryFn: async () => (await api.get(`${endpoints.analytics}/leads-per-day`)).data
	});
	const { data: perForm = [] } = useQuery({
		queryKey: ['analytics', 'perForm'],
		queryFn: async () => (await api.get(`${endpoints.analytics}/leads-per-form`)).data
	});

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card>
				<h3 className="mb-3 text-lg font-semibold">Leads per Day</h3>
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={perDay}>
							<XAxis dataKey="date" />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</Card>
			<Card>
				<h3 className="mb-3 text-lg font-semibold">Leads per Form</h3>
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={perForm}>
							<XAxis dataKey="_id" />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Bar dataKey="count" fill="#16a34a" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</Card>
		</div>
	);
}



