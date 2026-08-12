<script lang="ts">
	import { ctrlEnter } from '#lib/actions';
	import { ATTRS } from '#lib/attrs';

	let { data, form } = $props();

	let snap_form: HTMLFormElement;
	let award_form: HTMLFormElement;

	const latest = $derived(
		data.a.length ? (JSON.parse(data.a[0].v) as Record<string, number>) : ({} as Record<string, number>)
	);
	const field = 'rounded-[--radius-card] border border-line px-3 py-2 text-sm';
	const button = 'rounded-[--radius-card] bg-brand px-3 py-1.5 text-sm text-board';
	const compact = (v: string) =>
		ATTRS.map(([k]) => k + ' ' + ((JSON.parse(v) as Record<string, number>)[k] ?? 0)).join(' · ');
</script>

<svelte:head><title>ratings · mesh</title></svelte:head>

<h1 class="text-xl font-bold text-brand">ratings</h1>
<p class="mt-1 text-sm text-mute">every save appends a dated snapshot; nothing is overwritten.</p>
{#if form?.m}
	<p class="mt-2 text-sm text-bad">{form.m}</p>
{/if}

<form method="get" class="mt-6 flex flex-wrap items-end gap-3">
	<div>
		<label for="pick" class="block text-sm text-mute">player</label>
		<select id="pick" name="p" class="mt-1 {field}">
			{#each data.pl as p (p.i)}
				<option value={p.i} selected={p.i === data.p?.i}>{p.n} ({p.ab ?? 'fa'})</option>
			{/each}
		</select>
	</div>
	<button type="submit" class={button}>load</button>
</form>

{#if data.p}
	<form
		method="post"
		action="?/snap"
		bind:this={snap_form}
		use:ctrlEnter={() => snap_form.requestSubmit()}
		class="mt-6 rounded-[--radius-card] border border-line bg-board p-4"
	>
		<input type="hidden" name="p" value={data.p.i} />
		<h2 class="text-sm font-semibold text-mute">{data.p.n}</h2>
		<div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each ATTRS as [key, label] (key)}
				<div>
					<label for={key} class="block text-sm text-mute">{label}</label>
					<input
						id={key}
						name={key}
						type="number"
						min="0"
						max="99"
						value={latest[key] ?? 0}
						class="mt-1 w-full {field}"
					/>
				</div>
			{/each}
		</div>
		<label for="no" class="mt-4 block text-sm text-mute">note</label>
		<input id="no" name="no" class="mt-1 w-full {field}" />
		<button type="submit" class="mt-3 {button}">save snapshot</button>
		<span class="ml-2 text-sm text-mute">ctrl+enter to submit</span>
	</form>

	<form
		method="post"
		action="?/award"
		bind:this={award_form}
		use:ctrlEnter={() => award_form.requestSubmit()}
		class="mt-6 flex flex-wrap items-end gap-3 rounded-[--radius-card] border border-line bg-board p-4"
	>
		<input type="hidden" name="p" value={data.p.i} />
		<div>
			<label for="an" class="block text-sm text-mute">award or milestone</label>
			<input id="an" name="n" required class="mt-1 {field}" />
		</div>
		<div>
			<label for="aty" class="block text-sm text-mute">type</label>
			<select id="aty" name="ty" class="mt-1 {field}">
				<option value="a">award</option>
				<option value="m">milestone</option>
			</select>
		</div>
		<button type="submit" class={button}>add</button>
	</form>

	<h2 class="mt-8 text-sm font-semibold text-mute">snapshot history</h2>
	{#if data.a.length}
		<ul class="mt-2 space-y-1 text-sm">
			{#each data.a as s (s.i)}
				<li class="border-b border-line py-1">
					<span class="text-mute">{new Date(s.d).toLocaleDateString()}</span>
					{#if s.no}<span class="text-mute"> · {s.no}</span>{/if}
					<span class="mt-1 block">{compact(s.v)}</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mt-2 text-sm text-mute">no snapshots yet</p>
	{/if}
{/if}
