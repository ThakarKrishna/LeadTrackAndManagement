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
	const resp = await axios.get(pageUrl, { timeout: 15000, headers: { 'User-Agent': 'LeadTrackerBot/1.0' } });
	const dom = new JSDOM(resp.data);
	const { document } = dom.window;
	const forms = [...document.querySelectorAll('form')] || [];
	return forms.map((form) => {
		const action = form.getAttribute('action');
		const formUrl = toAbsoluteUrl(pageUrl, action);
		const fields = extractFieldsFromDocument(form);
		return { formUrl, fields };
	});
};

export const extractFieldsFromSingleUrl = async (pageUrl) => {
	const resp = await axios.get(pageUrl, { timeout: 15000, headers: { 'User-Agent': 'LeadTrackerBot/1.0' } });
	const dom = new JSDOM(resp.data);
	const { document } = dom.window;
	const forms = [...document.querySelectorAll('form')] || [];
	return forms.map((form) => {
		const action = form.getAttribute('action');
		const formUrl = toAbsoluteUrl(pageUrl, action);
		const fields = extractFieldsFromDocument(form);
		return { formUrl, fields };
	});
};



