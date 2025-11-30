import React from 'react';
import { cn } from '../../lib/utils.js';

export const Button = ({ className = '', variant = 'default', size = 'md', ...props }) => {
	const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
	const variants = {
		default: 'bg-primary text-primary-foreground hover:opacity-90',
		secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
		destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
		ghost: 'bg-transparent hover:bg-accent'
	};
	const sizes = {
		sm: 'h-8 px-3 text-sm',
		md: 'h-10 px-4',
		lg: 'h-12 px-6 text-lg'
	};
	return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
};



