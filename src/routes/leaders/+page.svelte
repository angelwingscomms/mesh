<script lang="ts">
	import { reveal } from '#lib/actions';
	import { pct, signed } from '#lib/fmt';

	let { data } = $props();

	const gaa = (g: { ga: number; toi: number }) =>
		g.toi ? ((g.ga * 3600) / g.toi).toFixed(2) : '—';
</script>

<svelte:head>
	<title>leaders · mesh</title>
	<meta
		name="description"
		content="scoring, shooting and goaltending leaders in the mesh sim hockey league."
	/>
</svelte:head>

<header class="max-w-3xl">
	<p class="label" data-reveal use:reveal>{data.se?.n ?? 'no season'}</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>leaders</h1>
	<p class="mt-5 text-sm text-mute" data-reveal use:reveal={120}>
		regular season and playoff games count together. every number is recomputed from the box scores
		on each visit.
	</p>
</header>

<section class="mt-16" data-reveal use:reveal>
	<div class="rule"><h2 class="head">points</h2></div>
	{#if data.pts.length}
		<div class="sheet mt-6">
			<table class="data">
				<thead>
					<tr>
						<th>player</th>
						<th>team</th>
						<th>pos</th>
						<th>gp</th>
						<th>g</th>
						<th>a</th>
						<th>pts</th>
					</tr>
				</thead>
				<tbody>
					{#each data.pts as p, i (p.i)}
						<tr>
							<td>
								<span class="label mr-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
								<a href="/player/{p.i}" class="cut font-medium">{p.n}</a>
							</td>
							<td class="text-mute uppercase">{p.ab ?? 'fa'}</td>
							<td class="text-mute uppercase">{p.ps}</td>
							<td>{p.gp}</td>
							<td>{p.gl}</td>
							<td>{p.a}</td>
							<td class="numeral text-base">{p.v}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="mt-6 text-sm text-mute">nobody has a point yet.</p>
	{/if}
</section>

{#if data.boards.some((b) => b.rows.length)}
	<section class="mt-24" data-reveal use:reveal>
		<div class="rule"><h2 class="head">by category</h2></div>
		<div class="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.boards as board (board.key)}
				{#if board.rows.length}
					<div class="border-t border-line pt-4">
						<p class="label">{board.name}</p>
						<ol class="mt-3 space-y-2 text-sm">
							{#each board.rows as p, i (p.i)}
								<li class="flex items-baseline justify-between gap-3 border-b border-line pb-2">
									<span class="truncate">
										<span class="label mr-2 tabular-nums">{i + 1}</span>
										<a href="/player/{p.i}" class="cut">{p.n}</a>
									</span>
									<span class="numeral shrink-0">
										{board.key === 'pm' ? signed(p.v) : p.v}
									</span>
								</li>
							{/each}
						</ol>
					</div>
				{/if}
			{/each}
		</div>
	</section>
{/if}

{#if data.gk.length}
	<section class="mt-24" data-reveal use:reveal>
		<div class="rule"><h2 class="head">goaltending</h2></div>
		<div class="sheet mt-6">
			<table class="data">
				<thead>
					<tr>
						<th>goalie</th>
						<th>team</th>
						<th>gp</th>
						<th>sv</th>
						<th>sa</th>
						<th>ga</th>
						<th>sv%</th>
						<th>gaa</th>
						<th>so</th>
					</tr>
				</thead>
				<tbody>
					{#each data.gk as g, i (g.i)}
						<tr>
							<td>
								<span class="label mr-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
								<a href="/player/{g.i}" class="cut font-medium">{g.n}</a>
							</td>
							<td class="text-mute uppercase">{g.ab ?? 'fa'}</td>
							<td>{g.gp}</td>
							<td>{g.sv}</td>
							<td>{g.sa}</td>
							<td>{g.ga}</td>
							<td class="numeral text-base">{pct(g.sa ? g.sv / g.sa : 0)}</td>
							<td>{gaa(g)}</td>
							<td>{g.so}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
{/if}
