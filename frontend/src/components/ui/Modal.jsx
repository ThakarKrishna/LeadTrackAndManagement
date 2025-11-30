import React from 'react';
import { Button } from './Button.jsx';

export const Modal = ({ open, title, children, onClose, footer }) => {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-2xl rounded-lg bg-card p-4 shadow-lg">
				<div className="mb-3 flex items-center justify-between">
					<h3 className="text-lg font-semibold">{title}</h3>
					<Button variant="ghost" onClick={onClose}>✕</Button>
				</div>
				<div className="max-h-[70vh] overflow-auto">{children}</div>
				{footer ? <div className="mt-4 flex justify-end gap-2">{footer}</div> : null}
			</div>
		</div>
	);
};



