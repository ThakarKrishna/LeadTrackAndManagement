import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api, endpoints } from '../api/client.js';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';

export default function ManualForm() {
	const [formUrl, setFormUrl] = useState('');
	const [selectedWebsite, setSelectedWebsite] = useState('');
	const [forms, setForms] = useState([]);
	const { data: websites = [] } = useQuery({ queryKey: ['websites'], queryFn: async () => (await api.get(endpoints.websites)).data });

	useEffect(() => {
		if (websites.length && !selectedWebsite) setSelectedWebsite(websites[0]._id);
	}, [websites, selectedWebsite]);

	const extractMutation = useMutation({
		mutationFn: async (url) => (await api.post(`${endpoints.forms}/extract`, { formUrl: url })).data,
		onSuccess: (data) => setForms(data.forms || [])
	});
	const saveMutation = useMutation({
		mutationFn: async (payload) => (await api.post(endpoints.forms, payload)).data
	});

	const saveForm = async (f) => {
		await saveMutation.mutateAsync({ websiteId: selectedWebsite, formUrl: f.formUrl, fields: f.fields });
		alert('Form saved');
	};

	return (
		<div className="space-y-4">
			<Card>
				<h3 className="mb-3 text-lg font-semibold">Manual Form Extraction</h3>
				<div className="grid gap-3 md:grid-cols-4">
					<Input placeholder="https://example.com/contact" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} />
					<select className="rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={selectedWebsite} onChange={(e) => setSelectedWebsite(e.target.value)}>
						{websites.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
					</select>
					<Button onClick={() => extractMutation.mutate(formUrl)} disabled={!formUrl}>Extract</Button>
				</div>
			</Card>
			{forms.map((f, idx) => (
				<Card key={idx}>
					<div className="mb-2 font-medium">Form URL: <a className="underline" href={f.formUrl} target="_blank" rel="noreferrer">{f.formUrl}</a></div>
					<div className="mb-2 text-sm">Fields: {(f.fields || []).map(x => x.name).join(', ') || '—'}</div>
					<Button onClick={() => saveForm(f)}>Save Form</Button>
				</Card>
			))}
		</div>
	);
}



