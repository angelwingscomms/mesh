import { describe, it, expect } from 'vitest';
import {
	new_id,
	cookie_opts,
	is_expired,
	is_admin,
	SESSION_MS,
	SESSION_COOKIE
} from './session';

describe('new_id', () => {
	it('never repeats', () => {
		expect(new_id()).not.toBe(new_id());
	});
});

describe('cookie_opts', () => {
	it('is named s', () => {
		expect(SESSION_COOKIE).toBe('s');
	});

	it('builds a hardened cookie', () => {
		expect(cookie_opts(true)).toEqual({
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: SESSION_MS / 1000,
			secure: true
		});
	});

	it('drops secure on plain http so local dev can sign in', () => {
		expect(cookie_opts(false).secure).toBe(false);
	});

	it('keeps SameSite lax so the google redirect does not drop the cookie', () => {
		expect(cookie_opts(true).sameSite).toBe('lax');
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
