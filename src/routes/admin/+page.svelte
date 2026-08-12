<script lang="ts">
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

<svelte:head><title>admin · mesh</title></svelte:head>

<h1 class="text-xl font-bold text-brand">league office</h1>

<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each cards as [label, n, href] (label)}
		<a href={href} class="rounded-[--radius-card] border border-line bg-board p-4 hover:border-brand">
			<span class="block text-sm text-mute">{label}</span>
			<span class="mt-1 block text-2xl font-bold {label === 'pending approvals' && n > 0 ? 'text-accent' : ''}">
				{n}
			</span>
		</a>
	{/each}
</div>

<h2 class="mt-8 text-sm font-semibold text-mute">recent imports</h2>
{#if data.i.length}
	<div class="mt-2 overflow-x-auto">
		<table class="w-full text-sm">
			<thead class="text-mute">
				<tr><th class="text-left">file</th><th>rows</th><th>status</th><th class="text-left">error</th></tr>
			</thead>
			<tbody>
				{#each data.i as r (r.i)}
					<tr class="border-b border-line">
						<td class="py-1">{r.f}</td>
						<td class="text-center">{r.n}</td>
						<td class="text-center">{ST[r.st]}</td>
						<td class="text-mute">{r.er ?? ''}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="mt-2 text-sm text-mute">nothing imported yet</p>
{/if}
