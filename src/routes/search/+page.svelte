<script lang="ts">
	import { reveal } from '#lib/actions';
	import { POS } from '#lib/fmt';

	let { data } = $props();

	const found = $derived(data.p.length + data.t.length);
</script>

<svelte:head><title>{data.q ? data.q + ' · search' : 'search'} · mesh</title></svelte:head>

<header class="max-w-3xl">
	<p class="label" data-reveal use:reveal>search</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>
		{#if data.q}{data.q}{:else}find anyone{/if}
	</h1>

	<form class="mt-8 flex flex-wrap items-end gap-3" data-reveal use:reveal={120}>
		<div class="grow">
			<label for="sq" class="label block">player or team</label>
			<input
				id="sq"
				name="q"
				value={data.q}
				class="field mt-2 w-full"
				placeholder="two letters is enough"
			/>
		</div>
		<button type="submit" class="btn">search</button>
	</form>

	{#if data.q}
		<p class="label mt-6">{found} {found === 1 ? 'result' : 'results'}</p>
	{/if}
</header>

{#if data.t.length}
	<section class="mt-16" data-reveal use:reveal>
		<div class="rule"><h2 class="head">teams</h2></div>
		<ul class="mt-5 divide-y divide-line border-b border-line">
			{#each data.t as t (t.i)}
				<li>
					<a href="/team/{t.ab}" class="group flex items-baseline justify-between gap-4 py-3">
						<span class="text-base transition-colors duration-300 group-hover:text-brand"
							>{t.n}</span
						>
						<span class="label uppercase">{t.ab} · {t.d}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

{#if data.p.length}
	<section class="mt-16" data-reveal use:reveal={80}>
		<div class="rule"><h2 class="head">players</h2></div>
		<ul class="mt-5 divide-y divide-line border-b border-line">
			{#each data.p as p (p.i)}
				<li>
					<a href="/player/{p.i}" class="group flex items-baseline justify-between gap-4 py-3">
						<span class="text-base transition-colors duration-300 group-hover:text-brand">
							{p.n}{#if p.st === 'r'}<span class="label ml-3">retired</span>{/if}
						</span>
						<span class="label">{POS[p.ps]} · <span class="uppercase">{p.ab ?? 'fa'}</span></span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

{#if data.q && !found}
	<p class="mt-16 text-sm text-mute">nothing on the sheet matches that.</p>
{/if}
