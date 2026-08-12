<script lang="ts">
	import { ATTRS } from '#lib/attrs';
	import { line_path } from '#lib/chart';

	let { data } = $props();

	const series = (key: string) => data.a.map((s) => s.v[key] ?? 0);
	const delta = (key: string) => {
		const s = series(key);
		return s.length ? s[s.length - 1] - s[0] : 0;
	};
	const latest = (key: string) => {
		const s = series(key);
		return s.length ? s[s.length - 1] : 0;
	};
	const points = $derived(data.m.map((m) => m.pt));
	const milestones = $derived(
		data.m.filter(
			(m, i) => Math.floor(m.pt / 25) > Math.floor((i ? data.m[i - 1].pt : 0) / 25) && m.pt >= 25
		)
	);
</script>

<svelte:head><title>my progress · mesh</title></svelte:head>

<h1 class="text-xl font-bold text-brand">progress</h1>

<h2 class="mt-6 text-sm font-semibold text-mute">attribute growth</h2>
{#if data.a.length}
	<div class="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each ATTRS as [key, label] (key)}
			<div class="rounded-[--radius-card] border border-line bg-board p-4">
				<span class="text-sm text-mute">{label}</span>
				<div class="mt-1 flex items-baseline gap-2">
					<span class="text-2xl font-bold">{latest(key)}</span>
					<span
						class="text-sm {delta(key) > 0 ? 'text-good' : delta(key) < 0 ? 'text-bad' : 'text-mute'}"
					>
						{delta(key) > 0 ? '+' : ''}{delta(key)}
					</span>
				</div>
				<div class="mt-2 text-brand">
					<svg viewBox="0 0 160 48" class="h-12 w-full" role="img" aria-label="{label} over time">
						<path
							d={line_path(series(key), 160, 48)}
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						/>
					</svg>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="mt-2 text-sm text-mute">no ratings yet</p>
{/if}

<h2 class="mt-8 text-sm font-semibold text-mute">career points</h2>
{#if points.length}
	<div class="mt-2 rounded-[--radius-card] border border-line bg-board p-4 text-brand-2">
		<svg viewBox="0 0 160 48" class="h-24 w-full" role="img" aria-label="career points over time">
			<path d={line_path(points, 160, 48)} fill="none" stroke="currentColor" stroke-width="2" />
		</svg>
	</div>
{:else}
	<p class="mt-2 text-sm text-mute">no games played yet</p>
{/if}

<h2 class="mt-8 text-sm font-semibold text-mute">milestones</h2>
{#if milestones.length}
	<ul class="mt-2 space-y-1 text-sm">
		{#each milestones as m (m.dt)}
			<li class="flex justify-between border-b border-line py-1">
				<span>reached {Math.floor(m.pt / 25) * 25} career points</span>
				<span class="text-mute">{new Date(m.dt).toLocaleDateString()}</span>
			</li>
		{/each}
	</ul>
{:else}
	<p class="mt-2 text-sm text-mute">none yet</p>
{/if}

<h2 class="mt-8 text-sm font-semibold text-mute">awards</h2>
{#if data.w.length}
	<ul class="mt-2 space-y-1 text-sm">
		{#each data.w as w, i (i)}
			<li class="flex justify-between border-b border-line py-1">
				<span>{w.n}</span>
				<span class="text-mute">{new Date(w.d).toLocaleDateString()}</span>
			</li>
		{/each}
	</ul>
{:else}
	<p class="mt-2 text-sm text-mute">none yet</p>
{/if}
