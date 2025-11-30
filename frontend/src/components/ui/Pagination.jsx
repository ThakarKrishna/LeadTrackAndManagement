import React from 'react';
import { Button } from './Button.jsx';

export const Pagination = ({ page, total, limit, onChange }) => {
	const totalPages = Math.max(1, Math.ceil(total / limit));
	return (
		<div className="flex items-center justify-between">
			<div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
			<div className="flex gap-2">
				<Button size="sm" variant="secondary" onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1}>Prev</Button>
				<Button size="sm" variant="secondary" onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</Button>
			</div>
		</div>
	);
};



