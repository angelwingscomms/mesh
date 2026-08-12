<script lang="ts">
	import { ctrlEnter } from '#lib/actions';

	let { data, form } = $props();

	let editor: HTMLFormElement;

	const field = 'rounded-[--radius-card] border border-line px-3 py-2 text-sm';
	const button = 'rounded-[--radius-card] bg-brand px-3 py-1.5 text-sm text-board';
</script>

<svelte:head><title>news · mesh admin</title></svelte:head>

<h1 class="text-xl font-bold text-brand">news</h1>
{#if form?.m}
	<p class="mt-2 text-sm text-bad">{form.m}</p>
{/if}

<form
	method="post"
	action="?/save"
	bind:this={editor}
	use:ctrlEnter={() => editor.requestSubmit()}
	class="mt-6 rounded-[--radius-card] border border-line bg-board p-4"
>
	{#if data.e}
		<input type="hidden" name="i" value={data.e.i} />
	{/if}
	<label for="ti" class="block text-sm text-mute">title</label>
	<input id="ti" name="ti" required value={data.e?.ti ?? ''} class="mt-1 w-full {field}" />
	<label for="bd" class="mt-3 block text-sm text-mute">body</label>
	<textarea id="bd" name="bd" rows="14" required class="mt-1 w-full {field}"
		>{data.e?.bd ?? ''}</textarea
	>
	<button type="submit" class="mt-3 {button}">save</button>
	<span class="ml-2 text-sm text-mute">
		ctrl+enter to submit. blank line between paragraphs. no html.
	</span>
</form>

<h2 class="mt-8 text-sm font-semibold text-mute">posts</h2>
{#if data.n.length}
	<div class="mt-2 overflow-x-auto">
		<table class="w-full text-sm">
			<thead class="text-mute">
				<tr><th class="text-left">title</th><th class="text-left">status</th><th></th></tr>
			</thead>
			<tbody>
				{#each data.n as n (n.i)}
					<tr class="border-b border-line">
						<td class="py-2"><a href="/admin/news?i={n.i}" class="hover:text-brand">{n.ti}</a></td>
						<td class="text-mute">
							{n.pb ? new Date(n.pb).toLocaleDateString() : 'draft'}
						</td>
						<td>
							<form method="post" class="flex gap-3">
								<input type="hidden" name="i" value={n.i} />
								{#if n.pb}
									<button type="submit" formaction="?/unpublish" class="text-sm text-bad">
										unpublish
									</button>
									<a href="/news/{n.sl}" class="text-sm text-brand hover:text-brand-2">view</a>
								{:else}
									<button type="submit" formaction="?/publish" class={button}>publish</button>
								{/if}
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="mt-2 text-sm text-mute">nothing written yet</p>
{/if}
