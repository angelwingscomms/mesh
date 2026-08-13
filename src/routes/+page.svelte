<script lang="ts">
	import Cut from '#lib/Cut.svelte';
	import Trace from '#lib/Trace.svelte';
	import { reveal } from '#lib/actions';
	import { day, paragraphs } from '#lib/fmt';

	let { data } = $props();

	const leader = $derived(data.st[0]);
	const played = $derived(data.st.reduce((n, r) => n + r.gp, 0) / 2);
	const ab = (id: string) => data.tm[id]?.ab ?? '—';
</script>

<svelte:head>
	<title>mesh sim hockey league</title>
</svelte:head>

<section class="relative">
	<Cut
		class="pointer-events-none absolute top-32 left-1/2 -z-10 h-56 w-screen max-w-none -translate-x-1/2 opacity-70"
	/>

	<div class="grid gap-x-10 gap-y-12 lg:grid-cols-12">
		<div class="lg:col-span-7">
			<p class="label" data-reveal use:reveal>
				{data.se?.n ?? 'no season yet'} · {played || 0} games played
			</p>
			<h1 class="display mt-5" data-reveal use:reveal={80}>mesh</h1>
			<p class="prose-voice mt-7 text-mute" data-reveal use:reveal={160}>
				a simulation hockey league. the games are played overnight in nhl 25 — this is where the
				record of them is kept, one cut at a time.
			</p>
			<div class="mt-9 flex flex-wrap gap-3" data-reveal use:reveal={220}>
				<a href="/standings" class="btn">standings</a>
				<a href="/login" class="btn-ghost">coach portal</a>
			</div>
		</div>

		<div class="flex flex-col gap-6 lg:col-span-5" data-reveal use:reveal={300}>
			{#if leader}
				<a href="/team/{leader.ab}" class="card group block">
					<p class="label">first place</p>
					<p
						class="numeral mt-3 text-5xl uppercase transition-colors duration-300 group-hover:text-brand"
					>
						{leader.ab}
					</p>
					<p class="mt-2 text-sm">{leader.n}</p>
					<div class="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
						<span class="text-sm text-mute">
							{leader.w}–{leader.l}–{leader.o} · {leader.pt} pts
						</span>
						<span class="w-24"><Trace values={leader.form} h={30} label="recent points" /></span>
					</div>
				</a>
			{/if}

			{#if data.g.length}
				<div class="card">
					<p class="label">next up</p>
					<ul class="mt-3 space-y-2 text-sm">
						{#each data.g as g (g.i)}
							<li>
								<a href="/game/{g.i}" class="flex items-baseline justify-between gap-4 py-1">
									<span class="numeral uppercase"
										>{ab(g.a)} <span class="text-mute">@</span> {ab(g.h)}</span
									>
									<span class="label">{day(g.dt)}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
</section>

<section class="mt-28 grid gap-x-10 gap-y-14 lg:grid-cols-12">
	<div class="lg:col-span-5" data-reveal use:reveal>
		<div class="rule">
			<h2 class="head">results</h2>
			<a href="/schedule" class="cut label ml-auto self-center">full schedule</a>
		</div>
		{#if data.r.length}
			<ul class="mt-6 divide-y divide-line">
				{#each data.r as g (g.i)}
					<li>
						<a href="/game/{g.i}" class="group flex items-baseline justify-between gap-4 py-3">
							<span
								class="numeral text-lg uppercase transition-colors duration-300 group-hover:text-brand"
							>
								{ab(g.a)}
								{g.ag} <span class="text-mute">–</span>
								{g.hg}
								{ab(g.h)}
							</span>
							<span class="label">{day(g.dt)}{g.ot ? ' · ot' : ''}</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-6 text-sm text-mute">no games have been simmed yet.</p>
		{/if}
	</div>

	<div class="lg:col-span-7" data-reveal use:reveal={100}>
		<div class="rule">
			<h2 class="head">scoring</h2>
			<a href="/leaders" class="cut label ml-auto self-center">all leaders</a>
		</div>
		{#if data.l.length}
			<div class="sheet mt-6">
				<table class="data">
					<thead>
						<tr>
							<th>player</th>
							<th>team</th>
							<th>gp</th>
							<th>g</th>
							<th>a</th>
							<th>pts</th>
						</tr>
					</thead>
					<tbody>
						{#each data.l as p, i (p.i)}
							<tr>
								<td>
									<span class="label mr-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
									<a href="/player/{p.i}" class="cut font-medium">{p.n}</a>
								</td>
								<td class="text-mute uppercase">{p.ab ?? 'fa'}</td>
								<td>{p.gp}</td>
								<td>{p.gl}</td>
								<td>{p.a}</td>
								<td class="numeral">{p.v}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="mt-6 text-sm text-mute">nobody has a point yet.</p>
		{/if}
	</div>
</section>

{#if data.n.length}
	<section class="mt-28" data-reveal use:reveal>
		<div class="rule">
			<h2 class="head">from the league office</h2>
			<a href="/news" class="cut label ml-auto self-center">all news</a>
		</div>
		<div class="mt-8 grid gap-8 md:grid-cols-3">
			{#each data.n as post (post.i)}
				<a href="/news/{post.sl}" class="group border-t border-ink pt-5">
					<p class="label">{day(post.pb)}</p>
					<h3
						class="mt-3 font-prose text-2xl leading-snug transition-colors duration-300 group-hover:text-brand"
					>
						{post.ti}
					</h3>
					<p class="mt-3 line-clamp-3 text-sm text-mute">{paragraphs(post.bd)[0]}</p>
				</a>
			{/each}
		</div>
	</section>
{/if}
