<script lang="ts">
	let { data } = $props();

	const FIELD: Record<string, string> = { n: 'name', j: 'jersey', b: 'bio', h: 'headshot' };
	const ST: Record<string, string> = { s: 'approved', f: 'rejected' };
	const button = 'rounded-[--radius-card] bg-brand px-3 py-1.5 text-sm text-board';
</script>

<svelte:head><title>approvals · mesh</title></svelte:head>

<h1 class="text-xl font-bold text-brand">approvals</h1>
<p class="mt-1 text-sm text-mute">oldest request first.</p>

{#if data.q.length}
	<ul class="mt-6 space-y-3">
		{#each data.q as r (r.i)}
			<li class="rounded-[--radius-card] border border-line bg-board p-4">
				<div class="flex flex-wrap items-center justify-between gap-2 text-sm">
					<span>
						<a href="/player/{r.pi}" class="font-semibold hover:text-brand">{r.pn}</a>
						<span class="text-mute"> · {r.ue} · {FIELD[r.f]}</span>
					</span>
					<span class="text-mute">{new Date(r.c).toLocaleDateString()}</span>
				</div>

				{#if r.f === 'h'}
					<img src="/img/{r.v}" alt="" class="mt-3 h-16 w-16 rounded object-cover" />
				{:else}
					<p class="mt-3 text-sm">{r.v}</p>
				{/if}

				<form method="post" class="mt-3 flex gap-3">
					<input type="hidden" name="i" value={r.i} />
					<button type="submit" formaction="?/ok" class={button}>approve</button>
					<button type="submit" formaction="?/no" class="text-sm text-bad">reject</button>
				</form>
			</li>
		{/each}
	</ul>
{:else}
	<p class="mt-6 text-sm text-mute">nothing waiting</p>
{/if}

<h2 class="mt-8 text-sm font-semibold text-mute">decided</h2>
{#if data.h.length}
	<ul class="mt-2 space-y-1 text-sm text-mute">
		{#each data.h as r (r.i)}
			<li class="flex flex-wrap justify-between gap-2 border-b border-line py-1">
				<span>{r.pn} · {FIELD[r.f]} · {ST[r.st]}</span>
				<span>{r.rn ?? '—'} · {r.rd ? new Date(r.rd).toLocaleDateString() : ''}</span>
			</li>
		{/each}
	</ul>
{:else}
	<p class="mt-2 text-sm text-mute">nothing decided yet</p>
{/if}
