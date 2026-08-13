<script lang="ts">
	import { reveal } from '#lib/actions';
	import { long_day, paragraphs } from '#lib/fmt';

	let { data } = $props();
</script>

<svelte:head>
	<title>news · mesh</title>
	<meta
		name="description"
		content="league news and notes from the mesh sim hockey league office."
	/>
</svelte:head>

<header class="max-w-3xl">
	<p class="label" data-reveal use:reveal>the league office</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>news</h1>
</header>

{#if data.n.length}
	<div class="mt-16 divide-y divide-line border-t border-ink">
		{#each data.n as n, i (n.i)}
			<article data-reveal use:reveal={Math.min(i, 6) * 70}>
				<a href="/news/{n.sl}" class="group grid gap-x-10 gap-y-3 py-8 lg:grid-cols-12">
					<p class="label lg:col-span-3">{long_day(n.pb)} · {n.an}</p>
					<div class="lg:col-span-9">
						<h2
							class="font-prose text-3xl leading-tight transition-colors duration-300 group-hover:text-brand"
						>
							{n.ti}
						</h2>
						<p class="mt-3 line-clamp-2 max-w-2xl text-sm text-mute">{paragraphs(n.bd)[0]}</p>
					</div>
				</a>
			</article>
		{/each}
	</div>
{:else}
	<p class="mt-16 text-sm text-mute">nothing has been published yet.</p>
{/if}
