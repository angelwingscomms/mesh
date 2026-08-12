<script lang="ts">
	let { data } = $props();

	const groups = $derived(
		data.g.reduce<[string, typeof data.g][]>((acc, g) => {
			const key = new Date(g.dt).toDateString();
			const last = acc[acc.length - 1];
			if (last && last[0] === key) last[1].push(g);
			else acc.push([key, [g]]);
			return acc;
		}, [])
	);
</script>

<svelte:head><title>schedule · mesh</title></svelte:head>

<h1 class="text-2xl font-bold text-brand">schedule</h1>

{#if groups.length}
	<div class="mt-6 space-y-6">
		{#each groups as [day, games] (day)}
			<section>
				<h2 class="text-sm font-semibold text-mute lowercase">{day.toLowerCase()}</h2>
				<ul class="mt-2 divide-y divide-line rounded-[--radius-card] border border-line bg-board">
					{#each games as g (g.i)}
						<li>
							<a href="/game/{g.i}" class="flex justify-between px-4 py-3 text-sm hover:text-brand">
								<span>{g.a} @ {g.h}</span>
								<span class="text-mute">
									{#if g.st === 'f'}
										{g.ag} — {g.hg}{g.ot ? ' (ot)' : ''}
									{:else}
										{new Date(g.dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
									{/if}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
{:else}
	<p class="mt-6 text-sm text-mute">no games scheduled yet</p>
{/if}
