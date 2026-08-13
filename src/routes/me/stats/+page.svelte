<script lang="ts">
	import { reveal } from '#lib/actions';
	import { day, mmss, pct, signed } from '#lib/fmt';

	let { data } = $props();

	const goalie = $derived(data.ps === 'g');
	const splits = $derived(
		data.s
			? ([
					[data.se?.n ?? 'this season', data.s.r],
					['playoffs', data.s.p],
					['career', data.s.c]
				] as const)
			: []
	);
</script>

<svelte:head><title>my stats · mesh</title></svelte:head>

<header class="max-w-3xl">
	<p class="label" data-reveal use:reveal>every number below is recomputed from the box scores</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>stats</h1>
</header>

<section class="mt-16" data-reveal use:reveal>
	<div class="rule"><h2 class="head">splits</h2></div>
	<div class="sheet mt-6">
		<table class="data">
			<thead>
				{#if goalie}
					<tr
						><th>split</th><th>gp</th><th>sv</th><th>sa</th><th>ga</th><th>sv%</th><th>gaa</th><th
							>so</th
						></tr
					>
				{:else}
					<tr
						><th>split</th><th>gp</th><th>g</th><th>a</th><th>pts</th><th>+/-</th><th>pim</th><th
							>sog</th
						><th>hits</th><th>blk</th></tr
					>
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

<section class="mt-20" data-reveal use:reveal>
	<div class="rule"><h2 class="head">game log</h2></div>
	{#if data.l.length}
		<div class="sheet mt-6">
			<table class="data">
				<thead>
					{#if goalie}
						<tr
							><th>date</th><th>opp</th><th>result</th><th>sv</th><th>sa</th><th>ga</th><th>sv%</th
							></tr
						>
					{:else}
						<tr
							><th>date</th><th>opp</th><th>g</th><th>a</th><th>pts</th><th>+/-</th><th>pim</th><th
								>sog</th
							><th>hits</th><th>blk</th><th>toi</th></tr
						>
					{/if}
				</thead>
				<tbody>
					{#each data.l as r (r.i)}
						<tr>
							<td><a href="/game/{r.gi}" class="cut">{day(r.dt)}</a></td>
							<td class="text-mute uppercase">{r.opp}</td>
							{#if goalie}
								<td class="uppercase">{r.r ?? '—'}</td>
								<td>{r.sv ?? 0}</td>
								<td>{r.sa ?? 0}</td>
								<td>{r.ga ?? 0}</td>
								<td class="numeral">{pct(r.sa ? (r.sv ?? 0) / r.sa : 0)}</td>
							{:else}
								<td>{r.gl}</td>
								<td>{r.a}</td>
								<td class="numeral">{(r.gl ?? 0) + (r.a ?? 0)}</td>
								<td class={(r.pm ?? 0) > 0 ? 'text-good' : (r.pm ?? 0) < 0 ? 'text-bad' : ''}>
									{signed(r.pm ?? 0)}
								</td>
								<td>{r.pim}</td>
								<td>{r.sog}</td>
								<td>{r.hit}</td>
								<td>{r.blk}</td>
								<td>{mmss(r.toi ?? 0)}</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="mt-6 text-sm text-mute">no games played yet.</p>
	{/if}
</section>
