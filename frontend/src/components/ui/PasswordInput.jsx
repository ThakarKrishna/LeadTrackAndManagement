import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Input.jsx';

export const PasswordInput = ({ className = '', startIcon = Lock, ...props }) => {
	const [show, setShow] = useState(false);
	return (
		<div className="relative">
			<Input
				className={className}
				type={show ? 'text' : 'password'}
				startIcon={startIcon}
				{...props}
			/>
			<button
				type="button"
				aria-label={show ? 'Hide password' : 'Show password'}
				onClick={() => setShow((s) => !s)}
				className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:opacity-80"
			>
				{show ? <EyeOff size={16} /> : <Eye size={16} />}
			</button>
		</div>
	);
};


