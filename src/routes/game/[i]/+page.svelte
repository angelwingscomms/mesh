<script lang="ts">
	import type { Line } from './+page.server';

	let { data } = $props();

	const mmss = (n: number) => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');
	const skaters = (rows: Line[]) => rows.filter((r) => r.sv === null);
	const goalies = (rows: Line[]) => rows.filter((r) => r.sv !== null);
</script>

<svelte:head>
	<title>{data.a?.ab} @ {data.h?.ab} · mesh</title>
	<meta
		name="description"
		content="box score and recap for {data.a?.n} at {data.h?.n} in the mesh sim hockey league."
	/>
</svelte:head>

<section class="rounded-[--radius-card] border border-line bg-board p-5">
	<div class="flex items-center justify-between text-lg font-semibold">
		<span>{data.a?.n}</span>
		<span>{data.g.st === 'f' ? data.g.ag : ''}</span>
	</div>
	<div class="mt-2 flex items-center justify-between text-lg font-semibold">
		<span>{data.h?.n}</span>
		<span>{data.g.st === 'f' ? data.g.hg : ''}</span>
	</div>
	<p class="mt-3 text-sm text-mute">
		{#if data.g.st === 'f'}
			final{data.g.ot === 'o' ? ' (ot)' : data.g.ot === 's' ? ' (so)' : ''}
		{:else}
			{new Date(data.g.dt).toLocaleString()}
		{/if}
	</p>
</section>

{#each [{ t: data.a, rows: data.s.a }, { t: data.h, rows: data.s.h }] as side (side.t?.i)}
	<h2 class="mt-8 text-sm font-semibold text-mute">{side.t?.n}</h2>
	{#if skaters(side.rows).length}
		<div class="mt-2 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="text-mute">
					<tr>
						<th>#</th>
						<th class="text-left">player</th>
						<th>pos</th>
						<th>g</th>
						<th>a</th>
						<th>pts</th>
						<th>+/-</th>
						<th>pim</th>
						<th>sog</th>
						<th>hits</th>
						<th>blk</th>
						<th>toi</th>
					</tr>
				</thead>
				<tbody>
					{#each skaters(side.rows) as r (r.i)}
						<tr class="border-b border-line">
							<td class="text-center text-mute">{r.pj ?? ''}</td>
							<td class="py-1"><a href="/player/{r.pi}" class="hover:text-brand">{r.pn}</a></td>
							<td class="text-center text-mute">{r.pps}</td>
							<td class="text-center">{r.gl}</td>
							<td class="text-center">{r.a}</td>
							<td class="text-center font-semibold">{r.gl + r.a}</td>
							<td class="text-center">{r.pm}</td>
							<td class="text-center">{r.pim}</td>
							<td class="text-center">{r.sog}</td>
							<td class="text-center">{r.hit}</td>
							<td class="text-center">{r.blk}</td>
							<td class="text-center">{mmss(r.toi)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="mt-2 text-sm text-mute">no skater lines</p>
	{/if}

	{#if goalies(side.rows).length}
		<div class="mt-3 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="text-mute">
					<tr><th class="text-left">goalie</th><th>sv</th><th>sa</th><th>ga</th></tr>
				</thead>
				<tbody>
					{#each goalies(side.rows) as r (r.i)}
						<tr class="border-b border-line">
							<td class="py-1"><a href="/player/{r.pi}" class="hover:text-brand">{r.pn}</a></td>
							<td class="text-center">{r.sv}</td>
							<td class="text-center">{r.sa}</td>
							<td class="text-center">{r.ga}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{/each}

{#if data.g.rc}
	<h2 class="mt-8 text-sm font-semibold text-mute">recap</h2>
	<div class="mt-2 max-w-prose space-y-3 text-sm">
		{#each data.g.rc.split('\n\n') as para, i (i)}
			<p>{para}</p>
		{/each}
	</div>
{/if}
