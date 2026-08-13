<script lang="ts">
	import { ATTRS } from '#lib/attrs';
	import Trace from '#lib/Trace.svelte';
	import { reveal } from '#lib/actions';
	import { long_day, signed } from '#lib/fmt';

	let { data } = $props();

	const tracked = $derived(ATTRS.filter(([k]) => data.a.some((s) => k in s.v)));
	const series = (key: string) => data.a.map((s) => s.v[key] ?? 0);
	const latest = (key: string) => series(key).at(-1) ?? 0;
	const delta = (key: string) => latest(key) - (series(key)[0] ?? 0);
	const points = $derived(data.m.map((m) => m.pt));
	const milestones = $derived(
		data.m.filter(
			(m, i) => m.pt >= 25 && Math.floor(m.pt / 25) > Math.floor((i ? data.m[i - 1].pt : 0) / 25)
		)
	);
</script>

<svelte:head><title>my progress · mesh</title></svelte:head>

<header class="max-w-3xl">
	<p class="label" data-reveal use:reveal>
		{data.a.length} rating {data.a.length === 1 ? 'snapshot' : 'snapshots'} on file
	</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>progress</h1>
	<p class="prose-voice mt-6 text-mute" data-reveal use:reveal={120}>
		each line is every rating you have ever been given, in order. nothing is overwritten, so the
		whole climb stays visible.
	</p>
</header>

<section class="mt-16" data-reveal use:reveal>
	<div class="rule"><h2 class="head">attribute growth</h2></div>
	{#if tracked.length}
		<div class="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each tracked as [key, label] (key)}
				<div class="border-t border-line pt-4">
					<p class="label">{label}</p>
					<p class="mt-2 flex items-baseline gap-2">
						<span class="numeral text-3xl">{latest(key)}</span>
						<span
							class="text-sm {delta(key) > 0
								? 'text-good'
								: delta(key) < 0
									? 'text-bad'
									: 'text-mute'}"
						>
							{signed(delta(key))}
						</span>
					</p>
					<div class="mt-3"><Trace values={series(key)} h={38} label="{label} over time" /></div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="mt-6 text-sm text-mute">no ratings yet. the league office sets these.</p>
	{/if}
</section>

<section class="mt-20 grid gap-x-10 gap-y-12 lg:grid-cols-12">
	<div class="lg:col-span-7" data-reveal use:reveal>
		<div class="rule"><h2 class="head">career points</h2></div>
		{#if points.length > 1}
			<div class="card mt-6">
				<p class="numeral text-4xl">{points.at(-1)}</p>
				<div class="mt-4"><Trace values={points} h={110} label="career points over time" /></div>
			</div>
		{:else}
			<p class="mt-6 text-sm text-mute">no games played yet.</p>
		{/if}
	</div>

	<div class="lg:col-span-5" data-reveal use:reveal={100}>
		<div class="rule"><h2 class="head">milestones</h2></div>
		{#if milestones.length}
			<ul class="mt-6 divide-y divide-line border-b border-line">
				{#each milestones as m (m.dt)}
					<li class="flex items-baseline justify-between gap-4 py-3 text-sm">
						<span>reached {Math.floor(m.pt / 25) * 25} career points</span>
						<span class="label">{long_day(m.dt)}</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-6 text-sm text-mute">the first 25 points is the first mark.</p>
		{/if}

		<div class="rule mt-12"><h2 class="head">honours</h2></div>
		{#if data.w.length}
			<ul class="mt-6 divide-y divide-line border-b border-line">
				{#each data.w as w, i (i)}
					<li class="flex items-baseline justify-between gap-4 py-3 text-sm">
						<span>{w.n}</span>
						<span class="label">{long_day(w.d)}</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-6 text-sm text-mute">none yet.</p>
		{/if}
	</div>
</section>
