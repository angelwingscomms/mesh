export const uid = () => crypto.randomUUID();

export const now = () => Date.now();

export async function one<T>(db: D1Database, sql: string, ...a: unknown[]): Promise<T | null> {
	return (await db
		.prepare(sql)
		.bind(...a)
		.first()) as T | null;
}

export async function all<T>(db: D1Database, sql: string, ...a: unknown[]): Promise<T[]> {
	return ((
		await db
			.prepare(sql)
			.bind(...a)
			.all()
	).results ?? []) as T[];
}

export function run(db: D1Database, sql: string, ...a: unknown[]) {
	return db
		.prepare(sql)
		.bind(...a)
		.run();
}

export function active_season(db: D1Database) {
	return one<{ i: string; n: string }>(
		db,
		"select i, n from se where st = 'a' order by c desc limit 1"
	);
}

export async function team_map(db: D1Database) {
	const rows = await all<{ i: string; n: string; ab: string; d: string }>(
		db,
		'select i, n, ab, d from t'
	);
	return Object.fromEntries(rows.map((r) => [r.i, r]));
}
