<script lang="ts">
	let { data } = $props();

	const day = (dt: number) => new Date(dt).toLocaleDateString();
</script>

<svelte:head><title>mesh</title></svelte:head>

<h1 class="text-2xl font-bold text-brand">the league</h1>

<div class="mt-6 grid gap-6 md:grid-cols-2">
	<section class="rounded-[--radius-card] border border-line bg-board p-5">
		<h2 class="text-sm font-semibold text-mute">upcoming</h2>
		{#if data.g.length}
			<ul class="mt-3 space-y-2 text-sm">
				{#each data.g as g (g.i)}
					<li>
						<a href="/game/{g.i}" class="flex justify-between hover:text-brand">
							<span>{g.a} @ {g.h}</span>
							<span class="text-mute">{day(g.dt)}</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-3 text-sm text-mute">nothing yet</p>
		{/if}
	</section>

	<section class="rounded-[--radius-card] border border-line bg-board p-5">
		<h2 class="text-sm font-semibold text-mute">recent results</h2>
		{#if data.r.length}
			<ul class="mt-3 space-y-2 text-sm">
				{#each data.r as g (g.i)}
					<li>
						<a href="/game/{g.i}" class="flex justify-between hover:text-brand">
							<span>{g.a} {g.ag} — {g.hg} {g.h}{g.ot ? ' (ot)' : ''}</span>
							<span class="text-mute">{day(g.dt)}</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-3 text-sm text-mute">nothing yet</p>
		{/if}
	</section>

	<section class="rounded-[--radius-card] border border-line bg-board p-5">
		<h2 class="text-sm font-semibold text-mute">league news</h2>
		{#if data.n.length}
			<ul class="mt-3 space-y-2 text-sm">
				{#each data.n as n (n.i)}
					<li><a href="/news/{n.sl}" class="hover:text-brand">{n.ti}</a></li>
				{/each}
			</ul>
		{:else}
			<p class="mt-3 text-sm text-mute">nothing yet</p>
		{/if}
	</section>

	<section class="rounded-[--radius-card] border border-line bg-board p-5">
		<h2 class="text-sm font-semibold text-mute">points leaders</h2>
		{#if data.l.length}
			<div class="overflow-x-auto">
				<table class="mt-3 w-full text-sm">
					<thead class="text-mute">
						<tr><th class="text-left">player</th><th>team</th><th>g</th><th>a</th><th>pts</th></tr>
					</thead>
					<tbody>
						{#each data.l as p (p.i)}
							<tr class="border-t border-line">
								<td class="py-1"><a href="/player/{p.i}" class="hover:text-brand">{p.n}</a></td>
								<td class="text-center text-mute">{p.ab ?? '—'}</td>
								<td class="text-center">{p.gl}</td>
								<td class="text-center">{p.a}</td>
								<td class="text-center font-semibold">{p.pt}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="mt-3 text-sm text-mute">nothing yet</p>
		{/if}
	</section>
</div>
