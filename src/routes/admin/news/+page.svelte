<script lang="ts">
	import { day } from '#lib/fmt';
	import { ctrlEnter } from '#lib/actions';

	let { data, form } = $props();

	let editor: HTMLFormElement;

	const field = 'field';
	const button = 'btn';
</script>

<svelte:head><title>news · mesh admin</title></svelte:head>

<h1 class="title">news</h1>
{#if form?.m}
	<p class="mt-2 text-sm text-bad">{form.m}</p>
{/if}

<form
	method="post"
	action="?/save"
	bind:this={editor}
	use:ctrlEnter={() => editor.requestSubmit()}
	class="card mt-6"
>
	{#if data.e}
		<input type="hidden" name="i" value={data.e.i} />
	{/if}
	<label for="ti" class="label block">title</label>
	<input id="ti" name="ti" required value={data.e?.ti ?? ''} class="mt-1 w-full {field}" />
	<label for="bd" class="label mt-3 block">body</label>
	<textarea id="bd" name="bd" rows="14" required class="mt-1 w-full {field}"
		>{data.e?.bd ?? ''}</textarea
	>
	<button type="submit" class="mt-3 {button}">save</button>
	<span class="ml-2 text-sm text-mute">
		ctrl+enter to submit. blank line between paragraphs. no html.
	</span>
</form>

<div class="rule mt-16"><h2 class="head">posts</h2></div>
{#if data.n.length}
	<div class="sheet mt-4">
		<table class="data">
			<thead>
				<tr><th class="text-left">title</th><th class="text-left">status</th><th></th></tr>
			</thead>
			<tbody>
				{#each data.n as n (n.i)}
					<tr>
						<td class="py-2"><a href="/admin/news?i={n.i}" class="hover:text-brand">{n.ti}</a></td>
						<td class="text-mute">
							{n.pb ? day(n.pb) : 'draft'}
						</td>
						<td>
							<form method="post" class="flex gap-3">
								<input type="hidden" name="i" value={n.i} />
								{#if n.pb}
									<button type="submit" formaction="?/unpublish" class="btn-quiet">
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
