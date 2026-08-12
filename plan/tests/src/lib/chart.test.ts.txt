import { describe, it, expect } from 'vitest';
import { scale_points, line_path } from './chart';

describe('scale_points', () => {
	it('spreads x evenly and inverts y', () => {
		expect(scale_points([0, 10], 100, 50)).toEqual([
			[0, 50],
			[100, 0]
		]);
	});

	it('centres a flat series', () => {
		expect(scale_points([5, 5, 5], 100, 50)).toEqual([
			[0, 25],
			[50, 25],
			[100, 25]
		]);
	});

	it('centres a single point', () => {
		expect(scale_points([7], 100, 50)).toEqual([[0, 25]]);
	});

	it('is empty for no data', () => {
		expect(scale_points([], 100, 50)).toEqual([]);
	});
});

describe('line_path', () => {
	it('builds an svg path', () => {
		expect(line_path([0, 10, 5], 100, 50)).toBe('M0,50 L50,0 L100,25');
	});

	it('rounds to two decimals', () => {
		expect(line_path([0, 1, 2], 3, 1)).toBe('M0,1 L1.5,0.5 L3,0');
	});

	it('is an empty string for no data', () => {
		expect(line_path([], 100, 50)).toBe('');
	});
});
