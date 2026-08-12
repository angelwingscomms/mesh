<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>teams · mesh</title></svelte:head>

<h1 class="text-2xl font-bold text-brand">teams</h1>

{#if data.t.length}
	<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.t as t (t.i)}
			<a
				href="/team/{t.ab}"
				class="rounded-[--radius-card] border border-line bg-board p-4 hover:border-brand"
			>
				<span class="block font-semibold">{t.n}</span>
				<span class="mt-1 block text-sm text-mute">{t.ab.toUpperCase()} · {t.d}</span>
			</a>
		{/each}
	</div>
{:else}
	<p class="mt-6 text-sm text-mute">no teams yet</p>
{/if}
