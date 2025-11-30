import React from 'react';
import { cn } from '../../lib/utils.js';

export const Input = ({ className = '', startIcon: StartIcon, endIcon: EndIcon, ...props }) => {
	const inputClassName = cn(
		'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none',
		StartIcon ? 'pl-9' : '',
		EndIcon ? 'pr-9' : '',
		className
	);

	const inputEl = <input className={inputClassName} {...props} />;

	if (!StartIcon && !EndIcon) return inputEl;

	return (
		<div className="relative">
			{StartIcon ? <StartIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /> : null}
			{EndIcon ? <EndIcon size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /> : null}
			{inputEl}
		</div>
	);
};



