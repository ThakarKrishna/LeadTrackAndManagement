import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, endpoints } from '../api/client.js';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Table } from '../components/ui/Table.jsx';
import { CopySnippet } from '../components/CopySnippet.jsx';
import { Link } from 'react-router-dom';

export default function Websites() {
	const qc = useQueryClient();
	const [name, setName] = useState('');
	const [url, setUrl] = useState('');
	const [snippetOpen, setSnippetOpen] = useState(false);
	const [selectedFormId, setSelectedFormId] = useState('');

	const { data: websites = [], isLoading } = useQuery({
		queryKey: ['websites'],
		queryFn: async () => (await api.get(endpoints.websites)).data
	});

	const createMutation = useMutation({
		mutationFn: async (payload) => (await api.post(endpoints.websites, payload)).data,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['websites'] });
			setName(''); setUrl('');
		}
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => (await api.delete(`${endpoints.websites}/${id}`)).data,
		onSuccess: () => qc.invalidateQueries({ queryKey: ['websites'] })
	});
	const updateMutation = useMutation({
		mutationFn: async ({ id, payload }) => (await api.put(`${endpoints.websites}/${id}`, payload)).data,
		onSuccess: () => qc.invalidateQueries({ queryKey: ['websites'] })
	});
	const autoDetectMutation = useMutation({
		mutationFn: async (websiteId) => (await api.post(`${endpoints.forms}/auto-detect/${websiteId}`)).data,
		onSuccess: (data) => {
			alert(`Detected and saved ${data?.count || 0} form(s). Check the Forms page.`);
		},
		onError: (err) => {
			alert(err?.response?.data?.message || 'Auto-detect failed');
		}
	});

	const columns = useMemo(() => [
		{ key: 'name', header: 'Name' },
		{ key: 'url', header: 'URL' },
		{
			key: 'actions', header: 'Actions', render: (_, row) => (
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="secondary"
						onClick={() => autoDetectMutation.mutate(row._id)}
						disabled={autoDetectMutation.isPending}
					>
						{autoDetectMutation.isPending ? 'Detecting...' : 'Auto-detect'}
					</Button>
					<Button size="sm" onClick={() => { setSnippetOpen(true); setSelectedFormId(''); }}>Snippet</Button>
					<Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(row._id)}>Delete</Button>
				</div>
			)
		}
	], []);

	return (
		<div className="space-y-4">
			<Card>
				<h3 className="mb-3 text-lg font-semibold">Add Website</h3>
				<div className="grid gap-3 md:grid-cols-3">
					<Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
					<Input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
					<Button onClick={() => createMutation.mutate({ name, url })} disabled={!name || !url}>Add</Button>
				</div>
				<div className="mt-2 text-sm text-muted-foreground">You can then auto-detect forms from this website.</div>
				<div className="mt-2 text-sm"><Link className="underline" to="/forms">Manage forms</Link></div>
			</Card>
			<Card>
				<h3 className="mb-3 text-lg font-semibold">Websites</h3>
				{isLoading ? 'Loading...' : <Table columns={columns} data={websites} />}
			</Card>
			<CopySnippet open={snippetOpen} onClose={() => setSnippetOpen(false)} backendUrl={import.meta.env.VITE_API_URL || 'http://localhost:5000'} formId={selectedFormId} />
		</div>
	);
}



