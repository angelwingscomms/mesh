<script lang="ts">
	import { ctrlEnter } from '#lib/actions';

	let { data, form } = $props();

	let name_form: HTMLFormElement;
	let jersey_form: HTMLFormElement;
	let bio_form: HTMLFormElement;

	const FIELD: Record<string, string> = { n: 'name', j: 'jersey', b: 'bio', h: 'headshot' };
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

<h1 class="text-xl font-bold text-brand">profile</h1>
<p class="mt-1 text-sm text-mute">every change is reviewed by a league admin before it goes live.</p>

{#if form?.m && ERR[form.m]}
	<p class="mt-4 text-sm text-bad">{ERR[form.m]}</p>
{/if}

<div class="mt-6 space-y-6">
	<form
		method="post"
		action="?/request"
		bind:this={name_form}
		use:ctrlEnter={() => name_form.requestSubmit()}
		class="rounded-[--radius-card] border border-line bg-board p-4"
	>
		<input type="hidden" name="f" value="n" />
		<label for="n" class="block text-sm text-mute">name</label>
		<p class="mt-1 text-sm">current: {data.p?.n}</p>
		<input
			id="n"
			name="v"
			value={data.p?.n ?? ''}
			class="mt-2 w-full rounded-[--radius-card] border border-line px-3 py-2 text-sm"
		/>
		<button type="submit" class="mt-3 rounded-[--radius-card] bg-brand px-3 py-1.5 text-sm text-board">
			request change
		</button>
		<span class="ml-2 text-sm text-mute">ctrl+enter to submit</span>
	</form>

	<form
		method="post"
		action="?/request"
		bind:this={jersey_form}
		use:ctrlEnter={() => jersey_form.requestSubmit()}
		class="rounded-[--radius-card] border border-line bg-board p-4"
	>
		<input type="hidden" name="f" value="j" />
		<label for="j" class="block text-sm text-mute">jersey number</label>
		<p class="mt-1 text-sm">current: {data.p?.j ?? '—'}</p>
		<input
			id="j"
			name="v"
			type="number"
			min="1"
			max="99"
			value={data.p?.j ?? ''}
			class="mt-2 w-24 rounded-[--radius-card] border border-line px-3 py-2 text-sm"
		/>
		<button type="submit" class="mt-3 rounded-[--radius-card] bg-brand px-3 py-1.5 text-sm text-board">
			request change
		</button>
		<span class="ml-2 text-sm text-mute">ctrl+enter to submit</span>
	</form>

	<form
		method="post"
		action="?/request"
		bind:this={bio_form}
		use:ctrlEnter={() => bio_form.requestSubmit()}
		class="rounded-[--radius-card] border border-line bg-board p-4"
	>
		<input type="hidden" name="f" value="b" />
		<label for="b" class="block text-sm text-mute">bio</label>
		<textarea
			id="b"
			name="v"
			rows="6"
			class="mt-2 w-full rounded-[--radius-card] border border-line px-3 py-2 text-sm"
			>{data.p?.b ?? ''}</textarea
		>
		<button type="submit" class="mt-3 rounded-[--radius-card] bg-brand px-3 py-1.5 text-sm text-board">
			request change
		</button>
		<span class="ml-2 text-sm text-mute">ctrl+enter to submit. blank line between paragraphs.</span>
	</form>

	<form
		method="post"
		action="?/headshot"
		enctype="multipart/form-data"
		class="rounded-[--radius-card] border border-line bg-board p-4"
	>
		<label for="file" class="block text-sm text-mute">headshot</label>
		{#if data.p?.h}
			<img src="/img/{data.p.h}" alt="" class="mt-2 h-24 w-24 rounded-full object-cover" />
		{/if}
		<input id="file" name="file" type="file" accept="image/*" class="mt-2 block text-sm" />
		<button type="submit" class="mt-3 rounded-[--radius-card] bg-brand px-3 py-1.5 text-sm text-board">
			upload
		</button>
	</form>
</div>

{#if data.e?.length}
	<h2 class="mt-8 text-sm font-semibold text-mute">waiting for approval</h2>
	<ul class="mt-2 space-y-1 text-sm">
		{#each data.e as e (e.i)}
			<li class="flex justify-between border-b border-line py-1">
				<span>{FIELD[e.f]}: {e.v}</span>
				<span class="text-mute">{new Date(e.c).toLocaleDateString()}</span>
			</li>
		{/each}
	</ul>
{/if}
