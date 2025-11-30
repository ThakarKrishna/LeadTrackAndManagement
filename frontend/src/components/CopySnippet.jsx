import React, { useMemo, useState } from 'react';
import { Modal } from './ui/Modal.jsx';
import { Button } from './ui/Button.jsx';

export const CopySnippet = ({ open, onClose, backendUrl = 'http://localhost:5000', formId }) => {
	const [copied, setCopied] = useState(false);
	const script = useMemo(() => {
		const idPart = formId ? `\n<script>window.LTM_FORM_ID='${formId}'</script>` : '';
		return `<script src="${backendUrl}/capture.js" async></script>${idPart}`;
	}, [backendUrl, formId]);
	const copy = async () => {
		await navigator.clipboard.writeText(script);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	return (
		<Modal open={open} onClose={onClose} title="Install Snippet" footer={<Button onClick={copy}>{copied ? 'Copied!' : 'Copy'}</Button>}>
			<p className="mb-2 text-sm text-muted-foreground">Paste this into your site’s HTML before closing body tag:</p>
			<pre className="overflow-auto rounded bg-muted p-3 text-xs">{script}</pre>
			<p className="mt-3 text-sm">Or add <code>data-ltm-form="{'{FORM_ID}'}"</code> to your form element.</p>
		</Modal>
	);
};



