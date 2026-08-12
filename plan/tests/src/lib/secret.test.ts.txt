import { describe, it, expect } from 'vitest';
import { get_secret } from './secret';

describe('get_secret', () => {
	it('passes a plain string through', async () => {
		expect(await get_secret('abc')).toBe('abc');
	});

	it('unwraps a secrets store binding', async () => {
		expect(await get_secret({ get: async () => 'xyz' })).toBe('xyz');
	});

	it('throws when the binding is missing', async () => {
		await expect(get_secret(undefined)).rejects.toThrow('secret');
		await expect(get_secret('')).rejects.toThrow('secret');
	});
});
