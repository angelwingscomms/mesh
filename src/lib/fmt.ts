const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export const day = (dt: number) => {
	const d = new Date(dt);
	return MONTHS[d.getUTCMonth()] + ' ' + d.getUTCDate();
};

export const long_day = (dt: number) => day(dt) + ' ' + new Date(dt).getUTCFullYear();

export const day_key = (dt: number) => Math.floor(dt / 86400000);

export const mmss = (n: number) =>
	Math.floor((n ?? 0) / 60) + ':' + String(Math.round(n ?? 0) % 60).padStart(2, '0');

export const POS: Record<string, string> = {
	c: 'centre',
	l: 'left wing',
	r: 'right wing',
	d: 'defence',
	g: 'goalie'
};

export const FIELD: Record<string, string> = {
	n: 'name',
	j: 'jersey',
	b: 'bio',
	h: 'headshot'
};

export const signed = (n: number) => (n > 0 ? '+' + n : String(n));

export const pct = (n: number) => (n ? n.toFixed(3).replace(/^0/, '') : '—');

export const ord = (n: number) => {
	const rest = n % 100;
	if (rest >= 11 && rest <= 13) return n + 'th';
	return n + (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
};

export const paragraphs = (s: string) =>
	s
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);
