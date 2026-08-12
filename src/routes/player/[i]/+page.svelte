<script lang="ts">
	import { ATTRS } from '#lib/attrs';

	let { data } = $props();

	const POS: Record<string, string> = {
		c: 'centre',
		l: 'left wing',
		r: 'right wing',
		d: 'defence',
		g: 'goalie'
	};

	const splits = $derived([
		['regular season', data.s.r],
		['playoffs', data.s.p],
		['career', data.s.c]
	] as const);
</script>

<svelte:head>
	<title>{data.p.n} · mesh</title>
	<meta
		name="description"
		content="{data.p.n}, {POS[data.p.ps]} for {data.t?.n ??
			'free agency'} in the mesh sim hockey league."
	/>
</svelte:head>

<div class="flex items-center gap-4">
	{#if data.p.h}
		<img src="/img/{data.p.h}" alt="" class="h-24 w-24 rounded-full object-cover" />
	{:else}
		<span
			class="flex h-24 w-24 items-center justify-center rounded-full bg-line text-2xl font-bold text-mute"
		>
			{data.p.j ?? '—'}
		</span>
	{/if}
	<div>
		<h1 class="text-2xl font-bold text-brand">{data.p.n}</h1>
		<p class="mt-1 text-sm text-mute">
			#{data.p.j ?? '—'} · {POS[data.p.ps]} ·
			{#if data.t}<a href="/team/{data.t.ab}" class="hover:text-brand">{data.t.n}</a>{:else}free
				agent{/if}
		</p>
	</div>
</div>

{#if data.p.b}
	<p class="mt-4 max-w-prose text-sm">{data.p.b}</p>
{/if}

<h2 class="mt-8 text-sm font-semibold text-mute">splits</h2>
<div class="mt-2 overflow-x-auto">
	<table class="w-full text-sm">
		<thead class="text-mute">
			{#if data.p.ps === 'g'}
				<tr>
					<th class="text-left">split</th>
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
					<th class="text-left">split</th>
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
				<tr class="border-b border-line">
					<td class="py-1">{label}</td>
					<td class="text-center">{s.gp}</td>
					{#if data.p.ps === 'g'}
						<td class="text-center">{s.sv}</td>
						<td class="text-center">{s.sa}</td>
						<td class="text-center">{s.ga}</td>
						<td class="text-center">{s.sv_pct.toFixed(3)}</td>
						<td class="text-center">{s.gaa.toFixed(2)}</td>
						<td class="text-center">{s.so}</td>
					{:else}
						<td class="text-center">{s.gl}</td>
						<td class="text-center">{s.a}</td>
						<td class="text-center font-semibold">{s.pt}</td>
						<td class="text-center">{s.pm}</td>
						<td class="text-center">{s.pim}</td>
						<td class="text-center">{s.sog}</td>
						<td class="text-center">{s.hit}</td>
						<td class="text-center">{s.blk}</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<h2 class="mt-8 text-sm font-semibold text-mute">attributes</h2>
{#if data.at}
	<dl class="mt-2 grid max-w-md grid-cols-2 gap-x-6 text-sm">
		{#each ATTRS as [key, label] (key)}
			<div class="flex justify-between border-b border-line py-1">
				<dt class="text-mute">{label}</dt>
				<dd>{data.at.v[key] ?? 0}</dd>
			</div>
		{/each}
	</dl>
{:else}
	<p class="mt-2 text-sm text-mute">no ratings yet</p>
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
