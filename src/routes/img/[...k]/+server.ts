import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const o = await platform!.env.R2.get(params.k);
	if (!o) error(404, 'no such image');
	return new Response(o.body, {
		headers: {
			'content-type': o.httpMetadata?.contentType ?? 'application/octet-stream',
			'cache-control': 'public, max-age=31536000, immutable'
		}
	});
};
