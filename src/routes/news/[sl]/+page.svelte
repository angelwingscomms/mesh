<script lang="ts">
	import { reveal } from '#lib/actions';
	import { long_day, paragraphs } from '#lib/fmt';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.n.ti} · mesh</title>
	<meta name="description" content={paragraphs(data.n.bd)[0]?.slice(0, 160) ?? data.n.ti} />
</svelte:head>

<article class="mx-auto max-w-3xl">
	<p class="label" data-reveal use:reveal>{long_day(data.n.pb)} · {data.n.an}</p>
	<h1 class="title mt-5 font-prose font-normal tracking-normal" data-reveal use:reveal={60}>
		{data.n.ti}
	</h1>
	<div class="mt-10 space-y-6 border-t border-ink pt-10" data-reveal use:reveal={120}>
		{#each paragraphs(data.n.bd) as para, i (i)}
			<p class="prose-voice">{para}</p>
		{/each}
	</div>
	<a href="/news" class="cut label mt-14 inline-block">all news</a>
</article>
