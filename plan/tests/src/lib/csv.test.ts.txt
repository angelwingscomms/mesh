import { describe, it, expect } from 'vitest';
import {
	parse_csv,
	norm_header,
	auto_map,
	header_hash,
	map_rows,
	missing_fields,
	parse_toi,
	REQUIRED
} from './csv';

describe('parse_csv', () => {
	it('splits plain rows', () => {
		expect(parse_csv('a,b\n1,2')).toEqual([
			['a', 'b'],
			['1', '2']
		]);
	});

	it('strips the bom and trims unquoted fields', () => {
		expect(parse_csv('\uFEFF a , b \n 1 , 2 ')).toEqual([
			['a', 'b'],
			['1', '2']
		]);
	});

	it('keeps quoted content literal', () => {
		expect(parse_csv('"a, b"," c "')).toEqual([['a, b', ' c ']]);
	});

	it('handles escaped quotes and newlines inside quotes', () => {
		expect(parse_csv('"he said ""hi""","two\nlines"')).toEqual([['he said "hi"', 'two\nlines']]);
	});

	it('handles crlf and ignores the trailing blank line', () => {
		expect(parse_csv('a,b\r\n1,2\r\n')).toEqual([
			['a', 'b'],
			['1', '2']
		]);
	});

	it('keeps empty fields', () => {
		expect(parse_csv('a,,c')).toEqual([['a', '', 'c']]);
	});
});

describe('norm_header', () => {
	it('lowercases and drops punctuation', () => {
		expect(norm_header(' Shots On Goal ')).toBe('shotsongoal');
	});

	it('spells out plus and minus so +/- survives', () => {
		expect(norm_header('+/-')).toBe('plusminus');
	});
});

describe('auto_map', () => {
	it('matches every known column by alias', () => {
		const m = auto_map(['Player', 'Team', 'Date', 'Opponent', 'G', 'A', '+/-', 'TOI']);
		expect(m).toEqual({
			player: 'Player',
			team: 'Team',
			date: 'Date',
			opp: 'Opponent',
			gl: 'G',
			a: 'A',
			pm: '+/-',
			toi: 'TOI'
		});
		expect(missing_fields(m)).toEqual([]);
	});

	it('reports the required fields it could not find', () => {
		expect(missing_fields(auto_map(['Name', 'Tm', 'GD']))).toEqual(['opp']);
	});

	it('requires player, team, date and opp', () => {
		expect(REQUIRED).toEqual(['player', 'team', 'date', 'opp']);
	});
});

describe('header_hash', () => {
	it('ignores order and case', () => {
		expect(header_hash(['B', 'a'])).toBe(header_hash(['a', 'B']));
	});

	it('differs on a different header set', () => {
		expect(header_hash(['a'])).not.toBe(header_hash(['b']));
	});
});

describe('map_rows', () => {
	const headers = ['Player', 'Team', 'Date', 'Opponent', 'G', 'A', 'TOI'];

	it('coerces numbers and time on ice', () => {
		expect(map_rows(headers, [['Ed', 'TOR', '2026-01-02', 'MTL', '1', '2', '18:24']], auto_map(headers))).toEqual([
			{ player: 'Ed', team: 'TOR', date: '2026-01-02', opp: 'MTL', gl: 1, a: 2, toi: 1104 }
		]);
	});

	it('skips rows with no player', () => {
		expect(map_rows(headers, [['', 'TOR', '2026-01-02', 'MTL', '1', '2', '0:00']], auto_map(headers))).toEqual(
			[]
		);
	});

	it('treats a blank number as zero', () => {
		const r = map_rows(headers, [['Ed', 'TOR', '2026-01-02', 'MTL', '', '', '']], auto_map(headers));
		expect(r[0].gl).toBe(0);
		expect(r[0].toi).toBe(0);
	});
});

describe('parse_toi', () => {
	it('reads mm:ss', () => {
		expect(parse_toi('18:24')).toBe(1104);
	});

	it('reads hh:mm:ss', () => {
		expect(parse_toi('1:02:03')).toBe(3723);
	});

	it('treats a bare number as seconds', () => {
		expect(parse_toi('45')).toBe(45);
	});

	it('is zero for junk', () => {
		expect(parse_toi('')).toBe(0);
		expect(parse_toi('-')).toBe(0);
	});
});
