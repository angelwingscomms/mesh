<script lang="ts">
	let { data } = $props();

	const groups = $derived([
		['forwards', data.p.filter((p) => ['c', 'l', 'r'].includes(p.ps))],
		['defence', data.p.filter((p) => p.ps === 'd')],
		['goalies', data.p.filter((p) => p.ps === 'g')]
	] as const);
</script>

<svelte:head>
	<title>{data.t.n} · mesh</title>
	<meta name="description" content="roster and season scoring for {data.t.n} in the mesh sim hockey league." />
</svelte:head>

<h1 class="text-2xl font-bold text-brand">{data.t.n}</h1>
<p class="mt-1 text-sm text-mute">{data.t.ab.toUpperCase()} · {data.t.d}</p>

{#each groups as [label, rows] (label)}
	{#if rows.length}
		<h2 class="mt-8 text-sm font-semibold text-mute">{label}</h2>
		<div class="mt-2 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="text-mute">
					<tr>
						<th>#</th>
						<th class="text-left">player</th>
						<th>pos</th>
						<th>gp</th>
						<th>g</th>
						<th>a</th>
						<th>pts</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as p (p.i)}
						<tr class="border-b border-line">
							<td class="text-center text-mute">{p.j ?? ''}</td>
							<td class="py-1"><a href="/player/{p.i}" class="hover:text-brand">{p.n}</a></td>
							<td class="text-center text-mute">{p.ps}</td>
							<td class="text-center">{p.gp}</td>
							<td class="text-center">{p.gl}</td>
							<td class="text-center">{p.a}</td>
							<td class="text-center font-semibold">{p.gl + p.a}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{/each}

{#if !data.p.length}
	<p class="mt-6 text-sm text-mute">no players on this roster yet</p>
{/if}
