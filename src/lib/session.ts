export const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

export const SESSION_COOKIE = 's';

export function new_id(): string {
	return crypto.randomUUID();
}

export function cookie_opts(secure: boolean) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		maxAge: SESSION_MS / 1000,
		secure
	};
}

export function is_expired(x: number, now: number): boolean {
	return now >= x;
}

export function is_admin(u: { r: string } | null | undefined): boolean {
	return !!u && u.r === 'a';
}
