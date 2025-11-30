import React from 'react';

export const Table = ({ columns, data }) => {
	return (
		<div className="overflow-auto rounded-lg border border-border">
			<table className="min-w-full text-left text-sm">
				<thead className="bg-muted">
					<tr>
						{columns.map((c) => (
							<th key={c.key} className="px-3 py-2 font-medium">{c.header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.length === 0 ? (
						<tr><td className="px-3 py-3" colSpan={columns.length}>No data</td></tr>
					) : data.map((row, idx) => (
						<tr key={idx} className="border-t border-border">
							{columns.map((c) => (
								<td key={c.key} className="px-3 py-2">{c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};



