<script lang="ts">
	import Trace from '#lib/Trace.svelte';
	import { reveal } from '#lib/actions';

	let { data } = $props();

	const groups = $derived(
		[...new Set(data.t.map((r) => r.d))]
			.sort()
			.map((d) => [d, data.t.filter((r) => r.d === d)] as const)
	);
</script>

<svelte:head>
	<title>teams · mesh</title>
	<meta name="description" content="every club in the mesh sim hockey league." />
</svelte:head>

<header class="max-w-3xl">
	<p class="label" data-reveal use:reveal>{data.se?.n ?? 'no season'}</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>teams</h1>
</header>

{#each groups as [division, rows], gi (division)}
	<section class="mt-16" data-reveal use:reveal={gi * 80}>
		<div class="rule"><h2 class="head">{division || 'unassigned'}</h2></div>
		<div class="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
			{#each rows as t (t.t)}
				<a
					href="/team/{t.ab}"
					class="group bg-board p-6 transition-colors duration-300 hover:bg-ice"
				>
					<p
						class="numeral text-4xl uppercase transition-colors duration-300 group-hover:text-brand"
					>
						{t.ab}
					</p>
					<p class="mt-3 text-base">{t.n}</p>
					<div class="mt-6 flex items-end justify-between gap-4 border-t border-line pt-4">
						<span class="text-sm text-mute">{t.w}–{t.l}–{t.o} · {t.pt} pts</span>
						<span class="w-20">
							{#if t.form.length > 1}
								<Trace values={t.form} h={24} label="{t.n} recent points" />
							{/if}
						</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
{:else}
	<p class="mt-16 text-sm text-mute">no teams yet.</p>
{/each}
