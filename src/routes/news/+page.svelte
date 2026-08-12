<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>news · mesh</title></svelte:head>

<h1 class="text-2xl font-bold text-brand">news</h1>

{#if data.n.length}
	<ul class="mt-6 space-y-3">
		{#each data.n as n (n.i)}
			<li class="border-b border-line pb-3">
				<a href="/news/{n.sl}" class="font-semibold hover:text-brand">{n.ti}</a>
				<span class="mt-1 block text-sm text-mute">{new Date(n.pb).toLocaleDateString()}</span>
			</li>
		{/each}
	</ul>
{:else}
	<p class="mt-6 text-sm text-mute">no news yet</p>
{/if}
