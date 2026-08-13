<script lang="ts">
	import Trace from '#lib/Trace.svelte';
	import { reveal } from '#lib/actions';
	import { signed } from '#lib/fmt';

	let { data } = $props();

	const groups = $derived(
		[...new Set(data.s.map((r) => r.d))]
			.sort()
			.map((d) => [d, data.s.filter((r) => r.d === d)] as const)
	);

	const split = $derived(groups.length > 1);
	const PLAYOFF = 4;
</script>

<svelte:head>
	<title>standings · mesh</title>
	<meta name="description" content="league standings for the mesh sim hockey league." />
</svelte:head>

<header class="max-w-3xl">
	<p class="label" data-reveal use:reveal>{data.se?.n ?? 'no season'}</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>standings</h1>
	<p class="mt-5 text-sm text-mute" data-reveal use:reveal={120}>
		two points for a win, one for an overtime loss. ties break on wins, then goal difference.
	</p>
</header>

{#each groups as [division, rows], gi (division)}
	<section class="mt-16" data-reveal use:reveal={gi * 80}>
		{#if split}
			<div class="rule">
				<h2 class="head">{division || 'unassigned'}</h2>
			</div>
		{/if}

		<div class="sheet {split ? 'mt-6' : 'mt-10'}">
			<table class="data">
				<thead>
					<tr>
						<th>team</th>
						<th>gp</th>
						<th>w</th>
						<th>l</th>
						<th>otl</th>
						<th>pts</th>
						<th>gf</th>
						<th>ga</th>
						<th>diff</th>
						<th>streak</th>
						<th class="w-28">form</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as r, i (r.t)}
						<tr class={rows.length > PLAYOFF && i === PLAYOFF - 1 ? 'border-b-2 border-b-ink' : ''}>
							<td>
								<span class="label mr-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
								<a href="/team/{r.ab}" class="cut font-medium">{r.n}</a>
							</td>
							<td>{r.gp}</td>
							<td>{r.w}</td>
							<td>{r.l}</td>
							<td>{r.o}</td>
							<td class="numeral text-base">{r.pt}</td>
							<td>{r.gf}</td>
							<td>{r.ga}</td>
							<td class={r.gf - r.ga > 0 ? 'text-good' : r.gf - r.ga < 0 ? 'text-bad' : ''}>
								{signed(r.gf - r.ga)}
							</td>
							<td>{r.streak}</td>
							<td class="px-3">
								{#if r.form.length > 1}
									<Trace values={r.form} h={26} label="{r.n} recent points" />
								{:else}
									<span class="text-line">—</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if rows.length > PLAYOFF}
			<p class="label mt-3">the line after {PLAYOFF} is the playoff cut</p>
		{/if}
	</section>
{:else}
	<p class="mt-16 text-sm text-mute">no games have been played yet.</p>
{/each}
