import type { SecretVal } from '#lib/secret';

declare global {
	namespace App {
		interface Locals {
			user: { i: string; e: string; n: string; r: string } | null;
		}

		interface Platform {
			env: {
				DB: D1Database;
				R2: R2Bucket;
				GOOGLE_ID: SecretVal;
				GOOGLE_SECRET: SecretVal;
			};
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}
	}
}

export {};
