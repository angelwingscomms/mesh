<script lang="ts">
	let { data, form } = $props();

	const ST: Record<string, string> = { r: 'running', s: 'done', f: 'failed' };
	const field = 'rounded-[--radius-card] border border-line px-3 py-2 text-sm';
	const button = 'rounded-[--radius-card] bg-brand px-3 py-1.5 text-sm text-board';
</script>

<svelte:head><title>import · mesh admin</title></svelte:head>

<h1 class="text-xl font-bold text-brand">import stats</h1>
<p class="mt-1 text-sm text-mute">
	upload a csv export from the sim. the column list and troubleshooting live in docs/imports.md in
	the repository.
</p>

{#if form?.m}
	<p class="mt-2 text-sm text-bad">{form.m}</p>
{/if}

{#if form?.n !== undefined}
	<p class="mt-4 rounded-[--radius-card] border border-line bg-board p-4 text-sm">
		{form.n} stat lines imported, {form.sk} rows skipped, {form.gc} games created.
		<a href="/admin/roster" class="text-brand hover:text-brand-2">check the scores</a>.
	</p>
{/if}

<form
	method="post"
	action="?/upload"
	enctype="multipart/form-data"
	class="mt-6 rounded-[--radius-card] border border-line bg-board p-4"
>
	<label for="file" class="block text-sm text-mute">step 1 · choose a file</label>
	<input id="file" name="file" type="file" accept=".csv" required class="mt-2 block text-sm" />
	<button type="submit" class="mt-3 {button}">upload</button>
</form>

{#if form?.k}
	<form method="post" action="?/commit" class="mt-6 rounded-[--radius-card] border border-line bg-board p-4">
		<input type="hidden" name="k" value={form.k} />
		<input type="hidden" name="f" value={form.f} />
		<h2 class="text-sm font-semibold text-mute">step 2 · map the columns</h2>
		{#if form.mi.length}
			<p class="mt-2 text-sm text-bad">still needed: {form.mi.join(', ')}</p>
		{/if}

		<div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.fields as f (f)}
				<div>
					<label for="map-{f}" class="block text-sm text-mute">
						{f}{data.required.includes(f) ? ' (required)' : ''}
					</label>
					<select id="map-{f}" name={f} class="mt-1 w-full {field}">
						<option value="">— none —</option>
						{#each form.h as h (h)}
							<option value={h} selected={form.m[f] === h}>{h}</option>
						{/each}
					</select>
				</div>
			{/each}
		</div>

		<h2 class="mt-6 text-sm font-semibold text-mute">preview</h2>
		{#if form.pv.length}
			<div class="mt-2 overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="text-mute">
						<tr>
							{#each Object.keys(form.pv[0]) as c (c)}<th class="text-left">{c}</th>{/each}
						</tr>
					</thead>
					<tbody>
						{#each form.pv as row, i (i)}
							<tr class="border-b border-line">
								{#each Object.keys(form.pv[0]) as c (c)}<td class="py-1">{row[c]}</td>{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="mt-2 text-sm text-mute">nothing to preview</p>
		{/if}

		<button type="submit" class="mt-4 {button}">import</button>
	</form>
{/if}

<h2 class="mt-8 text-sm font-semibold text-mute">import history</h2>
{#if data.h.length}
	<div class="mt-2 overflow-x-auto">
		<table class="w-full text-sm">
			<thead class="text-mute">
				<tr>
					<th class="text-left">file</th>
					<th>rows</th>
					<th>status</th>
					<th class="text-left">error</th>
					<th class="text-left">when</th>
				</tr>
			</thead>
			<tbody>
				{#each data.h as r (r.i)}
					<tr class="border-b border-line">
						<td class="py-1">{r.f}</td>
						<td class="text-center">{r.n}</td>
						<td class="text-center">{ST[r.st]}</td>
						<td class="text-mute">{r.er ?? ''}</td>
						<td class="text-mute">{new Date(r.c).toLocaleDateString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="mt-2 text-sm text-mute">nothing imported yet</p>
{/if}
