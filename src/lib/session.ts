export const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

export function new_id(): string {
	return crypto.randomUUID();
}

export function cookie_str(id: string, max_age: number, secure: boolean): string {
	return `s=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${max_age}` + (secure ? '; Secure' : '');
}

export function clear_cookie(secure: boolean): string {
	return cookie_str('', 0, secure);
}

export function is_expired(x: number, now: number): boolean {
	return now >= x;
}

export function is_admin(u: { r: string } | null | undefined): boolean {
	return !!u && u.r === 'a';
}
