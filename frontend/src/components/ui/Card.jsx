import React from 'react';
import { cn } from '../../lib/utils.js';

export const Card = ({ className = '', children }) => {
	return <div className={cn('rounded-lg border border-border bg-card p-4 shadow-sm', className)}>{children}</div>;
};



