<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.n.ti} · mesh</title>
	<meta name="description" content="{data.n.bd.slice(0, 150)}" />
</svelte:head>

<article class="max-w-prose">
	<h1 class="text-2xl font-bold text-brand">{data.n.ti}</h1>
	<p class="mt-1 text-sm text-mute">
		{data.n.an} · {new Date(data.n.pb).toLocaleDateString()}
	</p>
	<div class="mt-6 space-y-3 text-sm">
		{#each data.n.bd.split('\n\n') as para, i (i)}
			<p>{para}</p>
		{/each}
	</div>
</article>
