<script lang="ts">
	import type { Line } from './+page.server';
	import { reveal } from '#lib/actions';
	import { long_day, mmss, paragraphs, pct, signed } from '#lib/fmt';

	let { data } = $props();

	const skaters = (rows: Line[]) => rows.filter((r) => r.sv === null);
	const goalies = (rows: Line[]) => rows.filter((r) => r.sv !== null);
	const sides = $derived([
		{ t: data.a, rows: data.s.a, goals: data.g.ag },
		{ t: data.h, rows: data.s.h, goals: data.g.hg }
	]);
	const STAR = ['first star', 'second star', 'third star'];
	const won = (goals: number | null) =>
		data.g.st === 'f' && goals !== null && goals === Math.max(data.g.hg ?? 0, data.g.ag ?? 0);
</script>

<svelte:head>
	<title>{data.a?.ab} @ {data.h?.ab} · mesh</title>
	<meta
		name="description"
		content="box score and recap: {data.a?.n} at {data.h?.n} in the mesh sim hockey league."
	/>
</svelte:head>

<header data-reveal use:reveal>
	<p class="label">{long_day(data.g.dt)} · {data.g.ty === 'p' ? 'playoffs' : 'regular season'}</p>

	<div class="mt-6 grid gap-6 border-y border-ink py-8 sm:grid-cols-2">
		{#each sides as side (side.t?.i)}
			<a
				href="/team/{side.t?.ab}"
				class="group flex items-center justify-between gap-6 {won(side.goals) ? '' : 'text-mute'}"
			>
				<span>
					<span
						class="numeral block text-4xl uppercase transition-colors duration-300 group-hover:text-brand"
					>
						{side.t?.ab}
					</span>
					<span class="mt-1 block text-sm">{side.t?.n}</span>
				</span>
				<span class="display text-[clamp(48px,7vw,96px)] leading-none">
					{data.g.st === 'f' ? side.goals : '–'}
				</span>
			</a>
		{/each}
	</div>

	<p class="label mt-4">
		{#if data.g.st === 'f'}
			final{data.g.ot === 'o' ? ' · overtime' : data.g.ot === 's' ? ' · shootout' : ''}
		{:else}
			not played yet
		{/if}
	</p>
</header>

{#if data.stars.length}
	<section class="mt-20" data-reveal use:reveal>
		<div class="rule"><h2 class="head">three stars</h2></div>
		<ol class="mt-6 grid gap-6 sm:grid-cols-3">
			{#each data.stars as s, i (s.i)}
				<li class="card">
					<p class="label">{STAR[i]}</p>
					<a href="/player/{s.pi}" class="cut mt-3 block text-lg font-medium">{s.pn}</a>
					<p class="mt-2 text-sm text-mute">
						{#if s.sv === null}
							{s.gl} g · {s.a} a · {s.sog} shots
						{:else}
							{s.sv} saves · {pct(s.sa ? s.sv / s.sa : 0)} sv%
						{/if}
					</p>
				</li>
			{/each}
		</ol>
	</section>
{/if}

{#each sides as side (side.t?.i)}
	<section class="mt-20" data-reveal use:reveal>
		<div class="rule">
			<h2 class="head">{side.t?.n}</h2>
			<span class="label ml-auto self-center">box score</span>
		</div>

		{#if skaters(side.rows).length}
			<div class="sheet mt-6">
				<table class="data">
					<thead>
						<tr>
							<th>player</th>
							<th>#</th>
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
							<tr>
								<td><a href="/player/{r.pi}" class="cut font-medium">{r.pn}</a></td>
								<td class="text-mute">{r.pj ?? ''}</td>
								<td class="text-mute uppercase">{r.pps}</td>
								<td>{r.gl}</td>
								<td>{r.a}</td>
								<td class="numeral">{r.gl + r.a}</td>
								<td class={r.pm > 0 ? 'text-good' : r.pm < 0 ? 'text-bad' : ''}>{signed(r.pm)}</td>
								<td>{r.pim}</td>
								<td>{r.sog}</td>
								<td>{r.hit}</td>
								<td>{r.blk}</td>
								<td>{mmss(r.toi)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="mt-6 text-sm text-mute">no skater lines recorded.</p>
		{/if}

		{#if goalies(side.rows).length}
			<div class="sheet mt-4">
				<table class="data">
					<thead>
						<tr>
							<th>goalie</th>
							<th>sv</th>
							<th>sa</th>
							<th>ga</th>
							<th>sv%</th>
							<th>toi</th>
						</tr>
					</thead>
					<tbody>
						{#each goalies(side.rows) as r (r.i)}
							<tr>
								<td><a href="/player/{r.pi}" class="cut font-medium">{r.pn}</a></td>
								<td>{r.sv}</td>
								<td>{r.sa}</td>
								<td>{r.ga}</td>
								<td class="numeral">{pct(r.sa ? (r.sv ?? 0) / r.sa : 0)}</td>
								<td>{mmss(r.toi)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
{/each}

{#if data.g.rc}
	<section class="mt-20" data-reveal use:reveal>
		<div class="rule"><h2 class="head">recap</h2></div>
		<div class="prose-voice mt-8 space-y-5">
			{#each paragraphs(data.g.rc) as para, i (i)}
				<p>{para}</p>
			{/each}
		</div>
	</section>
{/if}
