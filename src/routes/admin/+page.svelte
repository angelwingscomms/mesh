<script lang="ts">
	import { reveal } from '#lib/actions';
	import { day } from '#lib/fmt';

	let { data } = $props();

	const ST: Record<string, string> = { r: 'running', s: 'done', f: 'failed' };
	const cards = $derived([
		['pending approvals', data.a, '/admin/approvals'],
		['teams', data.t, '/admin/roster'],
		['active players', data.p, '/admin/roster'],
		['games played', data.g, '/schedule'],
		['draft posts', data.n, '/admin/news']
	] as const);
</script>

<svelte:head><title>league office · mesh</title></svelte:head>

<header class="max-w-3xl">
	<p class="label" data-reveal use:reveal>everything the league keeps</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>league office</h1>
</header>

<div
	class="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
	data-reveal
	use:reveal
>
	{#each cards as [label, n, href] (label)}
		<a {href} class="group bg-board p-6 transition-colors duration-300 hover:bg-ice">
			<p class="label">{label}</p>
			<p
				class="numeral mt-3 text-5xl {label === 'pending approvals' && n > 0 ? 'text-accent' : ''}"
			>
				{n}
			</p>
		</a>
	{/each}
</div>

<section class="mt-20" data-reveal use:reveal>
	<div class="rule">
		<h2 class="head">recent imports</h2>
		<a href="/admin/import" class="cut label ml-auto self-center">import stats</a>
	</div>
	{#if data.i.length}
		<div class="sheet mt-6">
			<table class="data">
				<thead>
					<tr><th>file</th><th>rows</th><th>status</th><th>when</th><th>error</th></tr>
				</thead>
				<tbody>
					{#each data.i as r (r.i)}
						<tr>
							<td>{r.f}</td>
							<td>{r.n}</td>
							<td class={r.st === 'f' ? 'text-bad' : ''}>{ST[r.st]}</td>
							<td class="text-mute">{day(r.c)}</td>
							<td class="text-mute">{r.er ?? ''}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="mt-6 text-sm text-mute">nothing imported yet.</p>
	{/if}
</section>
