import axios from 'axios';
import { JSDOM } from 'jsdom';

const toAbsoluteUrl = (baseUrl, action) => {
	try {
		if (!action) return baseUrl;
		return new URL(action, baseUrl).toString();
	} catch {
		return baseUrl;
	}
};

const ensureHttpUrl = (value) => {
	try {
		const u = new URL(value);
		if (u.protocol !== 'http:' && u.protocol !== 'https:') {
			const err = new Error('Only http/https URLs are supported');
			err.status = 400;
			throw err;
		}
		return u.toString();
	} catch (e) {
		const err = new Error('Invalid URL');
		err.status = 400;
		throw err;
	}
};

const fetchHtml = async (pageUrl) => {
	try {
		const resp = await axios.get(pageUrl, {
			timeout: 15000,
			headers: { 'User-Agent': 'LeadTrackerBot/1.0' },
			responseType: 'text',
			validateStatus: (s) => s >= 200 && s < 400 // accept redirects too
		});
		return resp.data;
	} catch (e) {
		let message = 'Failed to fetch the page';
		let status = 502;
		if (e.response) {
			message = `Upstream responded with status ${e.response.status}`;
			status = 502;
		} else if (e.code === 'ECONNABORTED' || e.message?.includes('timeout')) {
			message = 'Request to target URL timed out';
			status = 504;
		} else if (e.code === 'ENOTFOUND' || e.code === 'EAI_AGAIN') {
			message = 'DNS lookup failed for target URL';
			status = 502;
		} else if (e.code === 'ECONNREFUSED') {
			message = 'Connection refused by target host';
			status = 502;
		}
		const err = new Error(message);
		err.status = status;
		throw err;
	}
};

const extractFieldsFromDocument = (document) => {
	const fields = [];
	const inputs = document.querySelectorAll('input');
	inputs.forEach((el) => {
		const type = (el.getAttribute('type') || 'text').toLowerCase();
		if (['submit', 'button', 'image', 'file', 'reset'].includes(type)) return;
		const name = el.getAttribute('name') || el.getAttribute('id');
		if (!name) return;
		fields.push({ name, type });
	});
	const textareas = document.querySelectorAll('textarea');
	textareas.forEach((el) => {
		const name = el.getAttribute('name') || el.getAttribute('id');
		if (!name) return;
		fields.push({ name, type: 'textarea' });
	});
	const selects = document.querySelectorAll('select');
	selects.forEach((el) => {
		const name = el.getAttribute('name') || el.getAttribute('id');
		if (!name) return;
		fields.push({ name, type: 'select' });
	});
	// Deduplicate by name
	const seen = new Set();
	return fields.filter((f) => {
		if (seen.has(f.name)) return false;
		seen.add(f.name);
		return true;
	});
};

export const detectFormsOnUrl = async (pageUrl) => {
	const validUrl = ensureHttpUrl(pageUrl);
	const html = await fetchHtml(validUrl);
	const dom = new JSDOM(html);
	const { document } = dom.window;
	const forms = [...document.querySelectorAll('form')] || [];
	return forms.map((form) => {
		const action = form.getAttribute('action');
		const formUrl = toAbsoluteUrl(validUrl, action);
		const fields = extractFieldsFromDocument(form);
		return { formUrl, fields };
	});
};

export const extractFieldsFromSingleUrl = async (pageUrl) => {
	const validUrl = ensureHttpUrl(pageUrl);
	const html = await fetchHtml(validUrl);
	const dom = new JSDOM(html);
	const { document } = dom.window;
	const forms = [...document.querySelectorAll('form')] || [];
	return forms.map((form) => {
		const action = form.getAttribute('action');
		const formUrl = toAbsoluteUrl(validUrl, action);
		const fields = extractFieldsFromDocument(form);
		return { formUrl, fields };
	});
};



