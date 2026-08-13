<script lang="ts">
	import Trace from '#lib/Trace.svelte';
	import { reveal } from '#lib/actions';
	import { day, ord, pct, signed } from '#lib/fmt';

	let { data } = $props();

	const ab = (id: string) => (data.tm as Record<string, { ab: string }>)[id]?.ab ?? '—';
	const groups = $derived([
		['forwards', data.p.filter((p) => ['c', 'l', 'r'].includes(p.ps))],
		['defence', data.p.filter((p) => p.ps === 'd')],
		['goaltending', data.p.filter((p) => p.ps === 'g')]
	] as const);
	const played = $derived(
		data.g
			.filter((g) => g.st === 'f')
			.slice(-5)
			.reverse()
	);
	const upcoming = $derived(data.g.filter((g) => g.st === 's').slice(0, 5));
</script>

<svelte:head>
	<title>{data.t.n} · mesh</title>
	<meta
		name="description"
		content="roster, record and schedule for {data.t.n} in the mesh sim hockey league."
	/>
</svelte:head>

<header class="grid gap-x-10 gap-y-8 lg:grid-cols-12">
	<div class="lg:col-span-7">
		<p class="label" data-reveal use:reveal>{data.t.d || 'the league'} · {data.se?.n ?? ''}</p>
		<h1 class="title mt-4" data-reveal use:reveal={60}>{data.t.n}</h1>
		<p class="numeral mt-4 text-2xl text-mute uppercase" data-reveal use:reveal={100}>
			{data.t.ab}
		</p>
	</div>

	{#if data.row}
		<div class="card lg:col-span-5" data-reveal use:reveal={160}>
			<p class="label">{ord(data.rank)} in the league</p>
			<p class="numeral mt-3 text-5xl">{data.row.pt}<span class="text-lg text-mute"> pts</span></p>
			<dl class="mt-5 grid grid-cols-4 gap-3 border-t border-line pt-4 text-sm">
				<div>
					<dt class="label">w</dt>
					<dd class="numeral mt-1">{data.row.w}</dd>
				</div>
				<div>
					<dt class="label">l</dt>
					<dd class="numeral mt-1">{data.row.l}</dd>
				</div>
				<div>
					<dt class="label">otl</dt>
					<dd class="numeral mt-1">{data.row.o}</dd>
				</div>
				<div>
					<dt class="label">diff</dt>
					<dd class="numeral mt-1">{signed(data.row.gf - data.row.ga)}</dd>
				</div>
			</dl>
			{#if data.row.form.length > 1}
				<div class="mt-5 border-t border-line pt-4">
					<p class="label">form · streak {data.row.streak}</p>
					<div class="mt-2"><Trace values={data.row.form} h={38} label="recent points" /></div>
				</div>
			{/if}
		</div>
	{/if}
</header>

<section class="mt-24 grid gap-x-10 gap-y-12 lg:grid-cols-2">
	<div data-reveal use:reveal>
		<div class="rule">
			<h2 class="head">last games</h2>
			<a href="/schedule?t={data.t.ab}" class="cut label ml-auto self-center">full schedule</a>
		</div>
		{#if played.length}
			<ul class="mt-5 divide-y divide-line border-b border-line">
				{#each played as g (g.i)}
					{@const home = g.h === data.t.i}
					{@const mine = home ? g.hg : g.ag}
					{@const theirs = home ? g.ag : g.hg}
					<li>
						<a href="/game/{g.i}" class="group flex items-baseline justify-between gap-4 py-3">
							<span class="numeral uppercase transition-colors duration-300 group-hover:text-brand">
								<span class="text-mute">{home ? 'vs' : 'at'}</span>
								{ab(home ? g.a : g.h)}
							</span>
							<span class="numeral">
								<span class={(mine ?? 0) > (theirs ?? 0) ? 'text-good' : 'text-bad'}>
									{(mine ?? 0) > (theirs ?? 0) ? 'w' : g.ot ? 'otl' : 'l'}
								</span>
								<span class="ml-2 text-mute">{mine}–{theirs}</span>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-5 text-sm text-mute">no games played yet.</p>
		{/if}
	</div>

	<div data-reveal use:reveal={100}>
		<div class="rule"><h2 class="head">next games</h2></div>
		{#if upcoming.length}
			<ul class="mt-5 divide-y divide-line border-b border-line">
				{#each upcoming as g (g.i)}
					<li>
						<a href="/game/{g.i}" class="group flex items-baseline justify-between gap-4 py-3">
							<span class="numeral uppercase transition-colors duration-300 group-hover:text-brand">
								<span class="text-mute">{g.h === data.t.i ? 'vs' : 'at'}</span>
								{ab(g.h === data.t.i ? g.a : g.h)}
							</span>
							<span class="label">{day(g.dt)}</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-5 text-sm text-mute">nothing on the calendar.</p>
		{/if}
	</div>
</section>

<section class="mt-24" data-reveal use:reveal>
	<div class="rule"><h2 class="head">roster</h2></div>

	{#each groups as [label, rows] (label)}
		{#if rows.length}
			<p class="label mt-10">{label}</p>
			<div class="sheet mt-3">
				<table class="data">
					<thead>
						{#if label === 'goaltending'}
							<tr>
								<th>player</th>
								<th>#</th>
								<th>gp</th>
								<th>sv</th>
								<th>sa</th>
								<th>ga</th>
								<th>sv%</th>
							</tr>
						{:else}
							<tr>
								<th>player</th>
								<th>#</th>
								<th>pos</th>
								<th>gp</th>
								<th>g</th>
								<th>a</th>
								<th>pts</th>
								<th>+/-</th>
								<th>sog</th>
							</tr>
						{/if}
					</thead>
					<tbody>
						{#each rows as p (p.i)}
							<tr>
								<td><a href="/player/{p.i}" class="cut font-medium">{p.n}</a></td>
								<td class="text-mute">{p.j ?? ''}</td>
								{#if label === 'goaltending'}
									<td>{p.gp}</td>
									<td>{p.sv ?? 0}</td>
									<td>{p.sa ?? 0}</td>
									<td>{p.ga ?? 0}</td>
									<td class="numeral">{pct(p.sa ? (p.sv ?? 0) / p.sa : 0)}</td>
								{:else}
									<td class="text-mute uppercase">{p.ps}</td>
									<td>{p.gp}</td>
									<td>{p.gl}</td>
									<td>{p.a}</td>
									<td class="numeral">{p.gl + p.a}</td>
									<td class={p.pm > 0 ? 'text-good' : p.pm < 0 ? 'text-bad' : ''}>{signed(p.pm)}</td
									>
									<td>{p.sog}</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/each}

	{#if !data.p.length}
		<p class="mt-6 text-sm text-mute">nobody is signed to this club yet.</p>
	{/if}
</section>
