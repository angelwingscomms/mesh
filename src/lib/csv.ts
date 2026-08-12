export function parse_csv(text: string): string[][] {
	const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
	const rows: string[][] = [];
	let row: string[] = [];
	let field = '';
	let quoted = false;
	let fresh = true;
	let i = 0;
	const push_field = () => {
		row.push(quoted ? field : field.trim());
		field = '';
		quoted = false;
		fresh = true;
	};
	const push_row = () => {
		push_field();
		rows.push(row);
		row = [];
	};
	while (i < src.length) {
		const ch = src[i];
		if (fresh && ch === '"') {
			quoted = true;
			fresh = false;
			i += 1;
			while (i < src.length) {
				if (src[i] === '"') {
					if (src[i + 1] === '"') {
						field += '"';
						i += 2;
						continue;
					}
					i += 1;
					break;
				}
				field += src[i];
				i += 1;
			}
			continue;
		}
		fresh = false;
		if (ch === ',') {
			push_field();
			i += 1;
			continue;
		}
		if (ch === '\r' && src[i + 1] === '\n') {
			push_row();
			i += 2;
			continue;
		}
		if (ch === '\n' || ch === '\r') {
			push_row();
			i += 1;
			continue;
		}
		field += ch;
		i += 1;
	}
	if (field !== '' || row.length) push_row();
	return rows;
}

export function norm_header(h: string): string {
	return h
		.toLowerCase()
		.replaceAll('+', 'plus')
		.replaceAll('-', 'minus')
		.replaceAll('/', '')
		.replace(/[^a-z0-9]/g, '');
}

export const ALIASES: Record<string, string[]> = {
	player: ['player', 'name', 'playername', 'skater'],
	team: ['team', 'tm', 'club'],
	date: ['date', 'gamedate', 'gd'],
	opp: ['opp', 'opponent', 'vs', 'against'],
	gl: ['g', 'goals', 'gl'],
	a: ['a', 'assists', 'ast'],
	pm: ['plusminus', 'pm'],
	pim: ['pim', 'penaltyminutes'],
	sog: ['s', 'shots', 'sog', 'shotsongoal'],
	hit: ['hits', 'hit', 'hts'],
	blk: ['blk', 'blocks', 'blockedshots', 'bs'],
	toi: ['toi', 'timeonice'],
	fow: ['fow', 'faceoffswon', 'fw'],
	fol: ['fol', 'faceoffslost', 'fl'],
	sv: ['sv', 'saves'],
	ga: ['ga', 'goalsagainst'],
	sa: ['sa', 'shotsagainst'],
	so: ['so', 'shutout', 'shutouts']
};

export const REQUIRED = ['player', 'team', 'date', 'opp'];

const TEXT_FIELDS = ['player', 'team', 'date', 'opp'];

export function auto_map(headers: string[]): Record<string, string> {
	const map: Record<string, string> = {};
	const taken = new Set<string>();
	for (const [field, aliases] of Object.entries(ALIASES)) {
		for (const h of headers) {
			if (taken.has(h)) continue;
			if (aliases.includes(norm_header(h))) {
				map[field] = h;
				taken.add(h);
				break;
			}
		}
	}
	return map;
}

export function missing_fields(map: Record<string, string>): string[] {
	return REQUIRED.filter((f) => !map[f]);
}

export function header_hash(headers: string[]): string {
	return headers.map(norm_header).sort().join('|');
}

export function parse_toi(v: string): number {
	const s = (v ?? '').trim();
	if (!s) return 0;
	if (s.includes(':')) {
		const parts = s.split(':').map((n) => Number(n));
		if (parts.some((n) => !Number.isFinite(n))) return 0;
		return parts.reduce((acc, n) => acc * 60 + n, 0);
	}
	const n = Number(s);
	return Number.isFinite(n) ? Math.round(n) : 0;
}

export function map_rows(
	headers: string[],
	rows: string[][],
	map: Record<string, string>
): Record<string, string | number>[] {
	const index: Record<string, number> = {};
	for (const [field, header] of Object.entries(map)) {
		const at = headers.indexOf(header);
		if (at >= 0) index[field] = at;
	}
	const out: Record<string, string | number>[] = [];
	for (const row of rows) {
		const player = (row[index.player] ?? '').trim();
		if (!player) continue;
		const rec: Record<string, string | number> = {};
		for (const [field, at] of Object.entries(index)) {
			const raw = row[at] ?? '';
			if (TEXT_FIELDS.includes(field)) rec[field] = raw.trim();
			else if (field === 'toi') rec[field] = parse_toi(raw);
			else {
				const n = Number(raw.trim());
				rec[field] = Number.isFinite(n) ? n : 0;
			}
		}
		out.push(rec);
	}
	return out;
}
