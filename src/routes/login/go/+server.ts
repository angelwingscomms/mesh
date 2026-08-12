import { redirect } from '@sveltejs/kit';
import { get_secret } from '#lib/secret';
import { new_id } from '#lib/session';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform, cookies }) => {
	const state = new_id();
	cookies.set('st', state, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 600,
		secure: url.protocol === 'https:'
	});
	const q = new URLSearchParams({
		client_id: await get_secret(platform!.env.GOOGLE_ID),
		redirect_uri: new URL('/google', url.origin).toString(),
		response_type: 'code',
		scope: 'openid email profile',
		state,
		prompt: 'select_account'
	});
	redirect(302, 'https://accounts.google.com/o/oauth2/v2/auth?' + q.toString());
};
