<script lang="ts">
	let { data } = $props();

	const mmss = (n: number) => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');
	const splits = $derived(
		data.s
			? ([
					['this season', data.s.r],
					['playoffs', data.s.p],
					['career', data.s.c]
				] as const)
			: []
	);
	const goalie = $derived(data.ps === 'g');
</script>

<svelte:head><title>my stats · mesh</title></svelte:head>

<h1 class="text-xl font-bold text-brand">stats</h1>

<h2 class="mt-6 text-sm font-semibold text-mute">splits</h2>
<div class="mt-2 overflow-x-auto">
	<table class="w-full text-sm">
		<thead class="text-mute">
			{#if goalie}
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
					{#if goalie}
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

<h2 class="mt-8 text-sm font-semibold text-mute">game log</h2>
{#if data.l.length}
	<div class="mt-2 overflow-x-auto">
		<table class="w-full text-sm">
			<thead class="text-mute">
				{#if goalie}
					<tr>
						<th class="text-left">date</th>
						<th>opponent</th>
						<th>result</th>
						<th>sv</th>
						<th>sa</th>
						<th>ga</th>
						<th>sv%</th>
					</tr>
				{:else}
					<tr>
						<th class="text-left">date</th>
						<th>opponent</th>
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
				{/if}
			</thead>
			<tbody>
				{#each data.l as r (r.i)}
					<tr class="border-b border-line">
						<td class="py-1">
							<a href="/game/{r.gi}" class="hover:text-brand">
								{new Date(r.dt).toLocaleDateString()}
							</a>
						</td>
						<td class="text-center text-mute">{r.opp}</td>
						{#if goalie}
							<td class="text-center">{r.r ?? '—'}</td>
							<td class="text-center">{r.sv ?? 0}</td>
							<td class="text-center">{r.sa ?? 0}</td>
							<td class="text-center">{r.ga ?? 0}</td>
							<td class="text-center">{(r.sa ? (r.sv ?? 0) / r.sa : 0).toFixed(3)}</td>
						{:else}
							<td class="text-center">{r.gl}</td>
							<td class="text-center">{r.a}</td>
							<td class="text-center font-semibold">{(r.gl ?? 0) + (r.a ?? 0)}</td>
							<td class="text-center">{r.pm}</td>
							<td class="text-center">{r.pim}</td>
							<td class="text-center">{r.sog}</td>
							<td class="text-center">{r.hit}</td>
							<td class="text-center">{r.blk}</td>
							<td class="text-center">{mmss(r.toi ?? 0)}</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="mt-2 text-sm text-mute">no games played yet</p>
{/if}
