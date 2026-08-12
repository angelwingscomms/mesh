<script lang="ts">
	let { data } = $props();

	const mmss = (n: number) => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');
	const FIELD: Record<string, string> = { n: 'name', j: 'jersey', b: 'bio', h: 'headshot' };
</script>

<svelte:head><title>portal · mesh</title></svelte:head>

{#if data.p}
	<section class="rounded-[--radius-card] border border-line bg-board p-5">
		<h1 class="text-xl font-bold text-brand">{data.p.n}</h1>
		<p class="mt-1 text-sm text-mute">
			#{data.p.j ?? '—'} · {data.p.ps} · {data.t?.n ?? 'free agent'}
		</p>
	</section>
{/if}

<h2 class="mt-8 text-sm font-semibold text-mute">last 5 games</h2>
{#if data.l.length}
	<div class="mt-2 overflow-x-auto">
		<table class="w-full text-sm">
			<thead class="text-mute">
				<tr>
					<th class="text-left">date</th>
					<th>opponent</th>
					<th>g</th>
					<th>a</th>
					<th>pts</th>
					<th>toi</th>
				</tr>
			</thead>
			<tbody>
				{#each data.l as r (r.i)}
					<tr class="border-b border-line">
						<td class="py-1">
							<a href="/game/{r.gi}" class="hover:text-brand">
								{new Date(r.dt).toLocaleDateString()}
							</a>
						</td>
						<td class="text-center text-mute">{r.opp}</td>
						<td class="text-center">{r.gl}</td>
						<td class="text-center">{r.a}</td>
						<td class="text-center font-semibold">{r.gl + r.a}</td>
						<td class="text-center">{mmss(r.toi)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="mt-2 text-sm text-mute">no games played yet</p>
{/if}

{#if data.e.length}
	<h2 class="mt-8 text-sm font-semibold text-mute">pending changes</h2>
	<ul class="mt-2 space-y-1 text-sm">
		{#each data.e as e (e.i)}
			<li class="flex justify-between border-b border-line py-1">
				<span>{FIELD[e.f]}: {e.v}</span>
				<span class="text-mute">waiting for an admin</span>
			</li>
		{/each}
	</ul>
{/if}
