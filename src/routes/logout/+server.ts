import { redirect } from '@sveltejs/kit';
import { clear_cookie } from '#lib/session';
import { run } from '#lib/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, platform, cookies, setHeaders }) => {
	const s = cookies.get('s');
	if (s) await run(platform!.env.DB, 'delete from ss where i = ?', s);
	setHeaders({ 'set-cookie': clear_cookie(url.protocol === 'https:') });
	redirect(303, '/');
};
