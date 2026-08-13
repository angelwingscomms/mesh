<script lang="ts">
	import { ATTRS } from '#lib/attrs';
	import Trace from '#lib/Trace.svelte';
	import { reveal } from '#lib/actions';
	import { long_day, ord, pct, POS, signed } from '#lib/fmt';

	let { data } = $props();

	const goalie = $derived(data.p.ps === 'g');
	const latest = $derived(data.snaps.at(-1)?.v ?? {});
	const first = $derived(data.snaps[0]?.v ?? {});
	const tracked = $derived(ATTRS.filter(([k]) => data.snaps.some((s) => k in s.v)));
	const splits = $derived([
		[data.se?.n ?? 'season', data.s.r],
		['playoffs', data.s.p],
		['career', data.s.c]
	] as const);
</script>

<svelte:head>
	<title>{data.p.n} · mesh</title>
	<meta
		name="description"
		content="{data.p.n}, {POS[data.p.ps]} for {data.t?.n ??
			'free agency'} — career record in the mesh sim hockey league."
	/>
</svelte:head>

<header class="grid gap-x-10 gap-y-8 lg:grid-cols-12">
	<div class="lg:col-span-8">
		<p class="label" data-reveal use:reveal>
			{POS[data.p.ps]} ·
			{#if data.t}
				<a href="/team/{data.t.ab}" class="cut">{data.t.n}</a>
			{:else}free agent{/if}
			{#if data.p.st === 'r'}
				· retired{/if}
		</p>
		<h1 class="title mt-4" data-reveal use:reveal={60}>{data.p.n}</h1>
		{#if data.p.b}
			<p class="prose-voice mt-6 text-mute" data-reveal use:reveal={120}>{data.p.b}</p>
		{/if}
	</div>

	<div class="flex items-start gap-6 lg:col-span-4 lg:justify-end" data-reveal use:reveal={160}>
		{#if data.p.h}
			<img
				src="/img/{data.p.h}"
				alt="{data.p.n} headshot"
				class="h-32 w-32 border border-line object-cover"
			/>
		{/if}
		<p class="numeral text-[88px] leading-none text-line select-none">{data.p.j ?? '—'}</p>
	</div>
</header>

<section class="mt-20" data-reveal use:reveal>
	<div class="rule">
		<h2 class="head">record</h2>
		{#if data.rank && !goalie && data.s.r.gp}
			<span class="label ml-auto self-center">{ord(data.rank)} in league scoring</span>
		{/if}
	</div>
	<div class="sheet mt-6">
		<table class="data">
			<thead>
				{#if goalie}
					<tr>
						<th>split</th>
						<th>gp</th>
						<th>sv</th>
						<th>sa</th>
						<th>ga</th>
						<th>sv%</th>
						<th>gaa</th>
						<th>so</th>
					</tr>
				{:else}
					<tr>
						<th>split</th>
						<th>gp</th>
						<th>g</th>
						<th>a</th>
						<th>pts</th>
						<th>+/-</th>
						<th>pim</th>
						<th>sog</th>
						<th>hits</th>
						<th>blk</th>
					</tr>
				{/if}
			</thead>
			<tbody>
				{#each splits as [label, s] (label)}
					<tr>
						<td class="font-medium">{label}</td>
						<td>{s.gp}</td>
						{#if goalie}
							<td>{s.sv}</td>
							<td>{s.sa}</td>
							<td>{s.ga}</td>
							<td class="numeral">{pct(s.sv_pct)}</td>
							<td>{s.gaa.toFixed(2)}</td>
							<td>{s.so}</td>
						{:else}
							<td>{s.gl}</td>
							<td>{s.a}</td>
							<td class="numeral text-base">{s.pt}</td>
							<td class={s.pm > 0 ? 'text-good' : s.pm < 0 ? 'text-bad' : ''}>{signed(s.pm)}</td>
							<td>{s.pim}</td>
							<td>{s.sog}</td>
							<td>{s.hit}</td>
							<td>{s.blk}</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

{#if data.history.length > 1}
	<section class="mt-24" data-reveal use:reveal>
		<div class="rule"><h2 class="head">season by season</h2></div>
		<div class="sheet mt-6">
			<table class="data">
				<thead>
					<tr>
						<th>season</th>
						<th>gp</th>
						{#if goalie}
							<th>sv</th><th>ga</th><th>sv%</th><th>gaa</th>
						{:else}
							<th>g</th><th>a</th><th>pts</th><th>+/-</th><th>sog</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each data.history as row (row.n)}
						<tr>
							<td class="font-medium">{row.n}</td>
							<td>{row.t.gp}</td>
							{#if goalie}
								<td>{row.t.sv}</td>
								<td>{row.t.ga}</td>
								<td class="numeral">{pct(row.t.sv_pct)}</td>
								<td>{row.t.gaa.toFixed(2)}</td>
							{:else}
								<td>{row.t.gl}</td>
								<td>{row.t.a}</td>
								<td class="numeral">{row.t.pt}</td>
								<td>{signed(row.t.pm)}</td>
								<td>{row.t.sog}</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
{/if}

<section class="mt-24" data-reveal use:reveal>
	<div class="rule">
		<h2 class="head">ratings</h2>
		{#if data.snaps.length}
			<span class="label ml-auto self-center">{data.snaps.length} snapshots</span>
		{/if}
	</div>

	{#if data.snaps.length}
		<div class="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each tracked as [key, label] (key)}
				{@const now = latest[key] ?? 0}
				{@const delta = now - (first[key] ?? 0)}
				<div class="border-t border-line pt-4">
					<p class="label">{label}</p>
					<p class="mt-2 flex items-baseline gap-2">
						<span class="numeral text-3xl">{now}</span>
						<span class="text-sm {delta > 0 ? 'text-good' : delta < 0 ? 'text-bad' : 'text-mute'}">
							{signed(delta)}
						</span>
					</p>
					<div class="mt-3">
						<Trace values={data.snaps.map((s) => s.v[key] ?? 0)} h={34} label="{label} over time" />
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="mt-6 text-sm text-mute">no ratings have been recorded yet.</p>
	{/if}
</section>

{#if data.w.length}
	<section class="mt-24" data-reveal use:reveal>
		<div class="rule"><h2 class="head">honours</h2></div>
		<ul class="mt-6 divide-y divide-line border-b border-line">
			{#each data.w as w, i (i)}
				<li class="flex flex-wrap items-baseline justify-between gap-4 py-3">
					<span class="text-base">{w.n}</span>
					<span class="label">{w.ty === 'm' ? 'milestone' : 'award'} · {long_day(w.d)}</span>
				</li>
			{/each}
		</ul>
	</section>
{/if}
