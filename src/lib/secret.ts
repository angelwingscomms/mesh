export type SecretVal = string | { get?: () => Promise<string> } | undefined;

export async function get_secret(v: SecretVal): Promise<string> {
	if (typeof v === 'string' && v) return v;
	if (v && typeof v === 'object' && typeof v.get === 'function') {
		const s = await v.get();
		if (s) return s;
	}
	throw new Error('missing secret');
}
