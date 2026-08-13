<script lang="ts">
	import Trace from '#lib/Trace.svelte';
	import { reveal } from '#lib/actions';
	import { day, FIELD, mmss, ord, POS } from '#lib/fmt';

	let { data } = $props();

	const points = $derived(
		data.l
			.slice()
			.reverse()
			.reduce<number[]>((acc, r) => [...acc, (acc.at(-1) ?? 0) + r.gl + r.a], [])
	);
</script>

<svelte:head><title>portal · mesh</title></svelte:head>

{#if data.p}
	<header class="grid gap-x-10 gap-y-8 lg:grid-cols-12">
		<div class="lg:col-span-8">
			<p class="label" data-reveal use:reveal>
				{POS[data.p.ps]} · {data.t?.n ?? 'free agent'}
			</p>
			<h1 class="title mt-4" data-reveal use:reveal={60}>{data.p.n}</h1>
			<div class="mt-6 flex flex-wrap gap-3" data-reveal use:reveal={120}>
				<a href="/player/{data.p.i}" class="btn-ghost">public page</a>
				<a href="/me/profile" class="btn-ghost">edit profile</a>
			</div>
		</div>

		<div class="lg:col-span-4 lg:justify-self-end" data-reveal use:reveal={160}>
			<p class="numeral text-[88px] leading-none text-line select-none">{data.p.j ?? '—'}</p>
		</div>
	</header>

	<section class="mt-20 grid gap-x-10 gap-y-12 lg:grid-cols-12">
		<div class="lg:col-span-7" data-reveal use:reveal>
			<div class="rule">
				<h2 class="head">last games</h2>
				<a href="/me/stats" class="cut label ml-auto self-center">full log</a>
			</div>
			{#if data.l.length}
				<div class="sheet mt-6">
					<table class="data">
						<thead>
							<tr><th>date</th><th>opp</th><th>g</th><th>a</th><th>pts</th><th>toi</th></tr>
						</thead>
						<tbody>
							{#each data.l as r (r.i)}
								<tr>
									<td><a href="/game/{r.gi}" class="cut">{day(r.dt)}</a></td>
									<td class="text-mute uppercase">{r.opp}</td>
									<td>{r.gl}</td>
									<td>{r.a}</td>
									<td class="numeral">{r.gl + r.a}</td>
									<td>{mmss(r.toi)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="mt-6 text-sm text-mute">you have not been dressed for a game yet.</p>
			{/if}
		</div>

		<div class="flex flex-col gap-6 lg:col-span-5" data-reveal use:reveal={100}>
			{#if points.length > 1}
				<div class="card">
					<p class="label">career points</p>
					<p class="numeral mt-2 text-4xl">{points.at(-1)}</p>
					<div class="mt-4"><Trace values={points} h={52} label="career points" /></div>
				</div>
			{/if}

			{#if data.rank}
				<div class="card">
					<p class="label">league scoring</p>
					<p class="numeral mt-2 text-4xl">{ord(data.rank)}</p>
				</div>
			{/if}

			{#if data.e.length}
				<div class="card">
					<p class="label">waiting on the league office</p>
					<ul class="mt-3 space-y-2 text-sm">
						{#each data.e as e (e.i)}
							<li class="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
								<span>{FIELD[e.f]}: {e.v}</span>
								<span class="label">pending</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</section>
{/if}
