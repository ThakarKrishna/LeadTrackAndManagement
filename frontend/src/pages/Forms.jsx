import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, endpoints } from '../api/client.js';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Table } from '../components/ui/Table.jsx';
import { Link } from 'react-router-dom';

export default function Forms() {
	const qc = useQueryClient();
	const [websiteId, setWebsiteId] = useState('');
	const { data: websites = [] } = useQuery({ queryKey: ['websites'], queryFn: async () => (await api.get(endpoints.websites)).data });
	const { data: forms = [], isLoading } = useQuery({
		queryKey: ['forms', websiteId],
		queryFn: async () => (await api.get(endpoints.forms, { params: { websiteId: websiteId || undefined } })).data
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => (await api.delete(`${endpoints.forms}/${id}`)).data,
		onSuccess: () => qc.invalidateQueries({ queryKey: ['forms'] })
	});

	const columns = useMemo(() => [
		{ key: 'websiteId', header: 'Website', render: (_, row) => websites.find(w => w._id === row.websiteId)?.name || '—' },
		{ key: 'formUrl', header: 'Form URL' },
		{ key: 'fields', header: 'Fields', render: (v) => (v || []).map(f => f.name).join(', ') },
		{
			key: 'actions', header: 'Actions', render: (_, row) => (
				<div className="flex gap-2">
					<Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(row._id)}>Delete</Button>
				</div>
			)
		}
	], [websites]);

	return (
		<div className="space-y-4">
			<Card>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h3 className="text-lg font-semibold">Forms</h3>
					<Link to="/forms/manual"><Button>Manual Extraction</Button></Link>
				</div>
				<div className="mt-3">
					<select className="rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={websiteId} onChange={(e) => setWebsiteId(e.target.value)}>
						<option value="">All websites</option>
						{websites.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
					</select>
				</div>
			</Card>
			<Card>
				{isLoading ? 'Loading...' : <Table columns={columns} data={forms} />}
			</Card>
		</div>
	);
}



