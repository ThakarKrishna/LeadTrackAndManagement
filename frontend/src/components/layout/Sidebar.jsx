import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, FileEdit, ListChecks, BarChart3 } from 'lucide-react';

const navItems = [
	{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ to: '/websites', label: 'Websites', icon: Globe },
	{ to: '/forms', label: 'Forms', icon: FileEdit },
	{ to: '/leads', label: 'Leads', icon: ListChecks },
	{ to: '/analytics', label: 'Analytics', icon: BarChart3 }
];

export const Sidebar = () => {
	return (
		<aside className="hidden w-56 shrink-0 border-r border-border bg-card p-3 md:block">
			<nav className="space-y-1">
				{navItems.map(({ to, label, icon: Icon }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`
						}
					>
						<Icon size={18} />
						<span>{label}</span>
					</NavLink>
				))}
			</nav>
		</aside>
	);
};



