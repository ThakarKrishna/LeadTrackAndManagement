import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, endpoints } from '../api/client.js';
import { Card } from '../components/ui/Card.jsx';
import { Table } from '../components/ui/Table.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';

export default function Leads() {
	const [websiteId, setWebsiteId] = useState('');
	const [formId, setFormId] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data: websites = [] } = useQuery({ queryKey: ['websites'], queryFn: async () => (await api.get(endpoints.websites)).data });
	const { data: forms = [] } = useQuery({
		queryKey: ['forms', websiteId],
		queryFn: async () => (await api.get(endpoints.forms, { params: { websiteId: websiteId || undefined } })).data
	});
	const { data = { items: [], total: 0 } } = useQuery({
		queryKey: ['leads', websiteId, formId, startDate, endDate, page],
		queryFn: async () => (await api.get(endpoints.leads, { params: { websiteId: websiteId || undefined, formId: formId || undefined, startDate: startDate || undefined, endDate: endDate || undefined, page, limit } })).data
	});

	const columns = useMemo(() => [
		{ key: 'submittedAt', header: 'Submitted', render: (v) => new Date(v).toLocaleString() },
		{ key: 'websiteId', header: 'Website', render: (_, row) => websites.find(w => w._id === row.websiteId)?.name || '—' },
		{ key: 'formId', header: 'Form', render: (v) => (forms.find(f => f._id === v)?.formUrl || v) },
		{ key: 'data', header: 'Data', render: (v) => <pre className="max-w-[40ch] overflow-auto text-xs">{JSON.stringify(v, null, 2)}</pre> }
	], [websites, forms]);

	return (
		<div className="space-y-4">
			<Card>
				<h3 className="mb-3 text-lg font-semibold">Filters</h3>
				<div className="grid gap-3 md:grid-cols-5">
					<select className="rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={websiteId} onChange={(e) => setWebsiteId(e.target.value)}>
						<option value="">All websites</option>
						{websites.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
					</select>
					<select className="rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={formId} onChange={(e) => setFormId(e.target.value)}>
						<option value="">All forms</option>
						{forms.map(f => <option key={f._id} value={f._id}>{f.formUrl}</option>)}
					</select>
					<input type="date" className="rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
					<input type="date" className="rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
					<button className="rounded-md border border-input px-3 py-2 text-sm" onClick={() => setPage(1)}>Apply</button>
				</div>
			</Card>
			<Card>
				<Table columns={columns} data={data.items || []} />
				<div className="mt-3">
					<Pagination page={page} total={data.total || 0} limit={limit} onChange={setPage} />
				</div>
			</Card>
		</div>
	);
}



