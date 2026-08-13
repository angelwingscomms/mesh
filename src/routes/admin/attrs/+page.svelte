<script lang="ts">
	import { day } from '#lib/fmt';
	import { ctrlEnter } from '#lib/actions';
	import { ATTRS } from '#lib/attrs';

	let { data, form } = $props();

	let snap_form: HTMLFormElement | undefined = $state();
	let award_form: HTMLFormElement | undefined = $state();

	const latest = $derived(
		data.a.length
			? (JSON.parse(data.a[0].v) as Record<string, number>)
			: ({} as Record<string, number>)
	);
	const field = 'field';
	const button = 'btn';
	const compact = (v: string) =>
		ATTRS.map(([k]) => k + ' ' + ((JSON.parse(v) as Record<string, number>)[k] ?? 0)).join(' · ');
</script>

<svelte:head><title>ratings · mesh</title></svelte:head>

<h1 class="title">ratings</h1>
<p class="mt-1 text-sm text-mute">every save appends a dated snapshot; nothing is overwritten.</p>
{#if form?.m}
	<p class="mt-2 text-sm text-bad">{form.m}</p>
{/if}

<form method="get" class="mt-6 flex flex-wrap items-end gap-3">
	<div>
		<label for="pick" class="label block">player</label>
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
		use:ctrlEnter={() => snap_form?.requestSubmit()}
		class="card mt-6"
	>
		<input type="hidden" name="p" value={data.p.i} />
		<p class="label">{data.p.n}</p>
		<div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each ATTRS as [key, label] (key)}
				<div>
					<label for={key} class="label block">{label}</label>
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
		use:ctrlEnter={() => award_form?.requestSubmit()}
		class="card mt-6 flex flex-wrap items-end gap-3"
	>
		<input type="hidden" name="p" value={data.p.i} />
		<div>
			<label for="an" class="label block">award or milestone</label>
			<input id="an" name="n" required class="mt-1 {field}" />
		</div>
		<div>
			<label for="aty" class="label block">type</label>
			<select id="aty" name="ty" class="mt-1 {field}">
				<option value="a">award</option>
				<option value="m">milestone</option>
			</select>
		</div>
		<button type="submit" class={button}>add</button>
	</form>

	<div class="rule mt-16"><h2 class="head">snapshot history</h2></div>
	{#if data.a.length}
		<ul class="mt-2 space-y-1 text-sm">
			{#each data.a as s (s.i)}
				<li class="border-b border-line py-1">
					<span class="text-mute">{day(s.d)}</span>
					{#if s.no}<span class="text-mute"> · {s.no}</span>{/if}
					<span class="mt-1 block">{compact(s.v)}</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mt-2 text-sm text-mute">no snapshots yet</p>
	{/if}
{/if}
