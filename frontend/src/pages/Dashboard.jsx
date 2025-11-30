import React from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';

export default function Dashboard() {
	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card>
				<h3 className="mb-2 text-lg font-semibold">Websites</h3>
				<p className="mb-3 text-sm text-muted-foreground">Manage your websites and auto-detect forms.</p>
				<Link to="/websites"><Button>Go to Websites</Button></Link>
			</Card>
			<Card>
				<h3 className="mb-2 text-lg font-semibold">Forms</h3>
				<p className="mb-3 text-sm text-muted-foreground">Manage detected and manual forms.</p>
				<Link to="/forms"><Button>Go to Forms</Button></Link>
			</Card>
			<Card>
				<h3 className="mb-2 text-lg font-semibold">Leads</h3>
				<p className="mb-3 text-sm text-muted-foreground">View captured leads with filters.</p>
				<Link to="/leads"><Button>View Leads</Button></Link>
			</Card>
			<Card>
				<h3 className="mb-2 text-lg font-semibold">Analytics</h3>
				<p className="mb-3 text-sm text-muted-foreground">See leads per day and per form.</p>
				<Link to="/analytics"><Button>Open Analytics</Button></Link>
			</Card>
		</div>
	);
}



