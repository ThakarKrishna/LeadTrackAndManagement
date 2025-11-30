import React from 'react';
import { cn } from '../../lib/utils.js';

export const Input = ({ className = '', ...props }) => {
	return <input className={cn('flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none', className)} {...props} />;
};



