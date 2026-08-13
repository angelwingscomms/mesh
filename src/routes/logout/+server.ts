import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '#lib/session';
import { run } from '#lib/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ platform, cookies }) => {
	const s = cookies.get(SESSION_COOKIE);
	if (s) await run(platform!.env.DB, 'delete from ss where i = ?', s);
	cookies.delete(SESSION_COOKIE, { path: '/' });
	redirect(303, '/');
};
