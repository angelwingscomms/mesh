<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>standings · mesh</title></svelte:head>

<h1 class="text-2xl font-bold text-brand">standings</h1>
{#if data.se}
	<p class="mt-1 text-sm text-mute">{data.se.n}</p>
{/if}

{#if data.s.length}
	<div class="mt-6 overflow-x-auto">
		<table class="w-full text-sm">
			<thead class="text-mute">
				<tr>
					<th class="py-2 text-left">team</th>
					<th>div</th>
					<th>gp</th>
					<th>w</th>
					<th>l</th>
					<th>otl</th>
					<th>pts</th>
					<th>gf</th>
					<th>ga</th>
					<th>diff</th>
				</tr>
			</thead>
			<tbody>
				{#each data.s as r (r.t)}
					<tr class="border-b border-line">
						<td class="py-2"><a href="/team/{r.ab}" class="hover:text-brand">{r.n}</a></td>
						<td class="text-center text-mute">{r.d}</td>
						<td class="text-center">{r.gp}</td>
						<td class="text-center">{r.w}</td>
						<td class="text-center">{r.l}</td>
						<td class="text-center">{r.o}</td>
						<td class="text-center font-semibold">{r.pt}</td>
						<td class="text-center">{r.gf}</td>
						<td class="text-center">{r.ga}</td>
						<td class="text-center">{r.gf - r.ga}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="mt-6 text-sm text-mute">no games played yet</p>
{/if}
