import { active_season } from '#lib/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, platform }) => ({
	u: locals.user,
	se: platform ? await active_season(platform.env.DB) : null
});
