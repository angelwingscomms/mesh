<script lang="ts">
	import { ctrlEnter } from '#lib/actions';
	import { reveal } from '#lib/actions';
	import { day, FIELD } from '#lib/fmt';

	let { data, form } = $props();

	let name_form: HTMLFormElement | undefined = $state();
	let jersey_form: HTMLFormElement | undefined = $state();
	let bio_form: HTMLFormElement | undefined = $state();

	const ERR: Record<string, string> = {
		field: 'that field cannot be changed',
		name: 'name must be 2 to 40 characters',
		jersey: 'jersey must be 1 to 99',
		bio: 'bio is too long',
		headshot: 'that image is not allowed',
		image: 'upload a jpg, png or webp under 2mb'
	};
</script>

<svelte:head><title>my profile · mesh</title></svelte:head>

<header class="max-w-3xl">
	<p class="label" data-reveal use:reveal>nothing here changes until an admin approves it</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>profile</h1>
</header>

{#if form?.m && ERR[form.m]}
	<p class="mt-8 border-l-2 border-accent pl-4 text-sm text-accent">{ERR[form.m]}</p>
{/if}

<div class="mt-14 grid gap-x-12 gap-y-12 lg:grid-cols-12">
	<div class="space-y-10 lg:col-span-7">
		<form
			method="post"
			action="?/request"
			bind:this={name_form}
			use:ctrlEnter={() => name_form?.requestSubmit()}
			data-reveal
			use:reveal
		>
			<input type="hidden" name="f" value="n" />
			<div class="rule">
				<h2 class="head">name</h2>
				<span class="label ml-auto self-center">now: {data.p?.n}</span>
			</div>
			<label for="n" class="sr-only">name</label>
			<input id="n" name="v" value={data.p?.n ?? ''} class="field mt-5 w-full" />
			<div class="mt-4 flex flex-wrap items-center gap-4">
				<button type="submit" class="btn">request change</button>
				<span class="label">ctrl+enter</span>
			</div>
		</form>

		<form
			method="post"
			action="?/request"
			bind:this={jersey_form}
			use:ctrlEnter={() => jersey_form?.requestSubmit()}
			data-reveal
			use:reveal={60}
		>
			<input type="hidden" name="f" value="j" />
			<div class="rule">
				<h2 class="head">jersey</h2>
				<span class="label ml-auto self-center">now: {data.p?.j ?? '—'}</span>
			</div>
			<label for="j" class="sr-only">jersey number</label>
			<input
				id="j"
				name="v"
				type="number"
				min="1"
				max="99"
				value={data.p?.j ?? ''}
				class="field mt-5 w-28"
			/>
			<div class="mt-4 flex flex-wrap items-center gap-4">
				<button type="submit" class="btn">request change</button>
				<span class="label">ctrl+enter</span>
			</div>
		</form>

		<form
			method="post"
			action="?/request"
			bind:this={bio_form}
			use:ctrlEnter={() => bio_form?.requestSubmit()}
			data-reveal
			use:reveal={120}
		>
			<input type="hidden" name="f" value="b" />
			<div class="rule">
				<h2 class="head">bio</h2>
				<span class="label ml-auto self-center">800 characters</span>
			</div>
			<label for="b" class="sr-only">bio</label>
			<textarea id="b" name="v" rows="7" class="field mt-5 w-full">{data.p?.b ?? ''}</textarea>
			<div class="mt-4 flex flex-wrap items-center gap-4">
				<button type="submit" class="btn">request change</button>
				<span class="label">ctrl+enter · blank line between paragraphs</span>
			</div>
		</form>
	</div>

	<div class="space-y-10 lg:col-span-5">
		<form
			method="post"
			action="?/headshot"
			enctype="multipart/form-data"
			data-reveal
			use:reveal={160}
		>
			<div class="rule"><h2 class="head">headshot</h2></div>
			{#if data.p?.h}
				<img
					src="/img/{data.p.h}"
					alt="your current headshot"
					class="mt-6 h-40 w-40 border border-line object-cover"
				/>
			{:else}
				<div class="mt-6 flex h-40 w-40 items-center justify-center border border-line bg-board">
					<span class="label">no photo</span>
				</div>
			{/if}
			<label for="file" class="label mt-5 block">jpg, png or webp · under 2mb</label>
			<input id="file" name="file" type="file" accept="image/*" class="mt-3 block text-sm" />
			<button type="submit" class="btn mt-4">upload</button>
		</form>

		{#if data.e?.length}
			<div data-reveal use:reveal={200}>
				<div class="rule"><h2 class="head">in review</h2></div>
				<ul class="mt-5 divide-y divide-line border-b border-line">
					{#each data.e as e (e.i)}
						<li class="flex items-baseline justify-between gap-4 py-3 text-sm">
							<span>{FIELD[e.f]}: {e.v}</span>
							<span class="label">{day(e.c)}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
