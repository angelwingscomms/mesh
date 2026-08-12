export const EDITABLE = ['n', 'j', 'b', 'h'];

const HEADSHOT = /^h\/[a-z0-9-]+\.(jpg|png|webp)$/;

export function validate_edit(f: string, v: string): string | null {
	if (!EDITABLE.includes(f)) return 'field';
	if (f === 'n') {
		const n = v.trim().length;
		return n >= 2 && n <= 40 ? null : 'name';
	}
	if (f === 'j') {
		if (!/^\d{1,2}$/.test(v)) return 'jersey';
		const j = Number(v);
		return j >= 1 && j <= 99 ? null : 'jersey';
	}
	if (f === 'b') return v.length <= 800 ? null : 'bio';
	return HEADSHOT.test(v) ? null : 'headshot';
}

export function apply_edit<T extends Record<string, unknown>>(player: T, f: string, v: string): T {
	const bad = validate_edit(f, v);
	if (bad) throw new Error(bad);
	return { ...player, [f]: f === 'j' ? Number(v) : v };
}
