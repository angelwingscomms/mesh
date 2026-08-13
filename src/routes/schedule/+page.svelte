<script lang="ts">
	import { reveal } from '#lib/actions';
	import { day, day_key, long_day } from '#lib/fmt';

	let { data } = $props();

	const ab = (id: string) => (data.tm as Record<string, { ab: string }>)[id]?.ab ?? '—';

	const groups = $derived(
		data.g.reduce<[number, typeof data.g][]>((acc, g) => {
			const key = day_key(g.dt);
			const last = acc.at(-1);
			if (last && last[0] === key) last[1].push(g);
			else acc.push([key, [g]]);
			return acc;
		}, [])
	);

	const TYPE: Record<string, string> = { r: '', p: 'playoff', e: 'preseason' };
</script>

<svelte:head>
	<title>schedule · mesh</title>
	<meta name="description" content="every fixture and result in the mesh sim hockey league." />
</svelte:head>

<header class="flex flex-wrap items-end justify-between gap-8">
	<div>
		<p class="label" data-reveal use:reveal>{data.se?.n ?? 'no season'}</p>
		<h1 class="title mt-4" data-reveal use:reveal={60}>schedule</h1>
	</div>

	<form class="flex flex-wrap items-end gap-3" data-reveal use:reveal={120}>
		<div>
			<label for="t" class="label block">team</label>
			<select id="t" name="t" class="field mt-2">
				<option value="">every team</option>
				{#each data.teams as t (t.i)}
					<option value={t.ab} selected={t.ab === data.t}>{t.n}</option>
				{/each}
			</select>
		</div>
		<button type="submit" class="btn-ghost">filter</button>
	</form>
</header>

{#if groups.length}
	<div class="mt-16 space-y-12">
		{#each groups as [key, games], gi (key)}
			<section data-reveal use:reveal={Math.min(gi, 6) * 60}>
				<div class="rule">
					<h2 class="label !text-ink">{long_day(games[0].dt)}</h2>
				</div>
				<ul class="mt-4 divide-y divide-line border-b border-line">
					{#each games as g (g.i)}
						<li>
							<a
								href="/game/{g.i}"
								class="group grid grid-cols-[1fr_auto] items-baseline gap-4 py-4 sm:grid-cols-[1fr_auto_6rem]"
							>
								<span
									class="numeral text-lg uppercase transition-colors duration-300 group-hover:text-brand"
								>
									{ab(g.a)} <span class="mx-1 text-mute">@</span>
									{ab(g.h)}
								</span>
								<span class="numeral text-lg tabular-nums">
									{#if g.st === 'f'}
										{g.ag}<span class="text-mute"> – </span>{g.hg}
									{:else}
										<span class="label">scheduled</span>
									{/if}
								</span>
								<span class="label col-span-2 sm:col-span-1 sm:text-right">
									{#if g.st === 'f' && g.ot}{g.ot === 'o' ? 'ot' : 'so'}{:else if TYPE[g.ty]}{TYPE[
											g.ty
										]}{:else}{day(g.dt)}{/if}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
{:else}
	<p class="mt-16 text-sm text-mute">no games on the calendar yet.</p>
{/if}
