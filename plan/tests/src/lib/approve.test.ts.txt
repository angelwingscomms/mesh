import { describe, it, expect } from 'vitest';
import { EDITABLE, validate_edit, apply_edit } from './approve';

describe('validate_edit', () => {
	it('lists exactly the editable fields', () => {
		expect(EDITABLE).toEqual(['n', 'j', 'b', 'h']);
	});

	it('rejects a field a user must never set', () => {
		expect(validate_edit('r', 'a')).toBe('field');
		expect(validate_edit('t', 'tor')).toBe('field');
	});

	it('keeps the jersey between 1 and 99', () => {
		expect(validate_edit('j', '0')).toBe('jersey');
		expect(validate_edit('j', '100')).toBe('jersey');
		expect(validate_edit('j', 'x')).toBe('jersey');
		expect(validate_edit('j', '7')).toBeNull();
		expect(validate_edit('j', '99')).toBeNull();
	});

	it('checks name length', () => {
		expect(validate_edit('n', 'a')).toBe('name');
		expect(validate_edit('n', 'x'.repeat(41))).toBe('name');
		expect(validate_edit('n', 'ed gold')).toBeNull();
	});

	it('caps the bio at 800 characters', () => {
		expect(validate_edit('b', 'x'.repeat(801))).toBe('bio');
		expect(validate_edit('b', 'x'.repeat(800))).toBeNull();
		expect(validate_edit('b', '')).toBeNull();
	});

	it('only accepts a headshot key we wrote ourselves', () => {
		expect(validate_edit('h', 'http://evil/x.png')).toBe('headshot');
		expect(validate_edit('h', '../secret')).toBe('headshot');
		expect(validate_edit('h', 'h/abc-123.webp')).toBeNull();
	});
});

describe('apply_edit', () => {
	it('applies the value, coercing the jersey to a number', () => {
		expect(apply_edit({ i: 'p1', j: 9, b: '' }, 'j', '22')).toEqual({ i: 'p1', j: 22, b: '' });
	});

	it('leaves the original untouched', () => {
		const p = { i: 'p1', b: 'old' };
		apply_edit(p, 'b', 'new');
		expect(p.b).toBe('old');
	});

	it('throws instead of applying an invalid value', () => {
		expect(() => apply_edit({ i: 'p1', j: 9 }, 'j', '0')).toThrow('jersey');
		expect(() => apply_edit({ i: 'p1' }, 'r', 'a')).toThrow('field');
	});
});
