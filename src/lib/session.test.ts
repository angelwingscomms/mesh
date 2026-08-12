import { describe, it, expect } from 'vitest';
import { new_id, cookie_str, clear_cookie, is_expired, is_admin, SESSION_MS } from './session';

describe('new_id', () => {
	it('never repeats', () => {
		expect(new_id()).not.toBe(new_id());
	});
});

describe('cookie_str', () => {
	it('builds a hardened cookie', () => {
		expect(cookie_str('abc', 600, true)).toBe(
			's=abc; Path=/; HttpOnly; SameSite=Lax; Max-Age=600; Secure'
		);
	});

	it('drops Secure on plain http so local dev can log in', () => {
		expect(cookie_str('abc', 600, false)).toBe('s=abc; Path=/; HttpOnly; SameSite=Lax; Max-Age=600');
	});

	it('clears by expiring immediately', () => {
		expect(clear_cookie(true)).toBe('s=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure');
	});
});

describe('is_expired', () => {
	it('expires on the exact millisecond', () => {
		expect(is_expired(100, 99)).toBe(false);
		expect(is_expired(100, 100)).toBe(true);
		expect(is_expired(100, 101)).toBe(true);
	});
});

describe('is_admin', () => {
	it('is true only for role a', () => {
		expect(is_admin({ r: 'a' })).toBe(true);
		expect(is_admin({ r: 'u' })).toBe(false);
		expect(is_admin(null)).toBe(false);
		expect(is_admin(undefined)).toBe(false);
	});
});

describe('SESSION_MS', () => {
	it('is thirty days', () => {
		expect(SESSION_MS).toBe(30 * 24 * 60 * 60 * 1000);
	});
});
