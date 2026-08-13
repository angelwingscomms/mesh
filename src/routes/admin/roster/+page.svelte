<script lang="ts">
	import { day } from '#lib/fmt';
	import { ctrlEnter } from '#lib/actions';

	let { data, form } = $props();

	let season_form: HTMLFormElement;
	let team_form: HTMLFormElement;
	let player_form: HTMLFormElement;
	let game_form: HTMLFormElement;
	let recap_form: HTMLFormElement;

	let recap_game = $state('');
	const recap_text = $derived(data.g.find((g) => g.i === recap_game)?.rc ?? '');

	const POS = ['c', 'l', 'r', 'd', 'g'];
	const field = 'field';
	const button = 'btn';
</script>

<svelte:head><title>roster · mesh</title></svelte:head>

<h1 class="title">roster</h1>
{#if form?.m}
	<p class="mt-2 text-sm text-bad">{form.m}</p>
{/if}

<div class="rule mt-16"><h2 class="head">seasons</h2></div>
<p class="mt-1 text-sm text-mute">
	standings, splits and imports all read the active season. exactly one season is active at a time.
</p>
<form
	method="post"
	action="?/season_new"
	bind:this={season_form}
	use:ctrlEnter={() => season_form.requestSubmit()}
	class="card mt-2 flex flex-wrap items-end gap-3"
>
	<div>
		<label for="sn" class="label block">name</label>
		<input id="sn" name="n" required placeholder="season 2" class="mt-1 {field}" />
	</div>
	<button type="submit" class={button}>add season and make it active</button>
</form>

<div class="sheet mt-4">
	<table class="data">
		<thead>
			<tr><th class="text-left">season</th><th class="text-left">status</th><th></th></tr>
		</thead>
		<tbody>
			{#each data.s as s (s.i)}
				<tr>
					<td class="py-2">{s.n}</td>
					<td class={s.st === 'a' ? 'text-good' : 'text-mute'}>
						{s.st === 'a' ? 'active' : 'closed'}
					</td>
					<td>
						<form method="post" class="flex gap-3">
							<input type="hidden" name="i" value={s.i} />
							{#if s.st === 'a'}
								<button type="submit" formaction="?/season_close" class="btn-quiet"> close </button>
							{:else}
								<button type="submit" formaction="?/season_active" class={button}>
									make active
								</button>
							{/if}
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="rule mt-16"><h2 class="head">teams</h2></div>
<form
	method="post"
	action="?/team_new"
	bind:this={team_form}
	use:ctrlEnter={() => team_form.requestSubmit()}
	class="card mt-2 flex flex-wrap items-end gap-3"
>
	<div>
		<label for="tn" class="label block">name</label>
		<input id="tn" name="n" required class="mt-1 {field}" />
	</div>
	<div>
		<label for="tab" class="label block">abbrev</label>
		<input id="tab" name="ab" required maxlength="4" class="mt-1 w-24 {field}" />
	</div>
	<div>
		<label for="td" class="label block">division</label>
		<input id="td" name="d" class="mt-1 {field}" />
	</div>
	<button type="submit" class={button}>add team</button>
</form>

<div class="sheet mt-4">
	<table class="data">
		<thead>
			<tr><th class="text-left">team</th><th>abbrev</th><th>division</th></tr>
		</thead>
		<tbody>
			{#each data.t as t (t.i)}
				<tr>
					<td class="py-1">{t.n}</td>
					<td class="text-center">{t.ab}</td>
					<td class="text-center text-mute">{t.d}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="rule mt-16"><h2 class="head">players</h2></div>
<form
	method="post"
	action="?/player_new"
	bind:this={player_form}
	use:ctrlEnter={() => player_form.requestSubmit()}
	class="card mt-2 flex flex-wrap items-end gap-3"
>
	<div>
		<label for="pn" class="label block">name</label>
		<input id="pn" name="n" required class="mt-1 {field}" />
	</div>
	<div>
		<label for="pj" class="label block">jersey</label>
		<input id="pj" name="j" type="number" min="1" max="99" class="mt-1 w-20 {field}" />
	</div>
	<div>
		<label for="pps" class="label block">position</label>
		<select id="pps" name="ps" class="mt-1 {field}">
			{#each POS as ps (ps)}<option value={ps}>{ps}</option>{/each}
		</select>
	</div>
	<div>
		<label for="pt" class="label block">team</label>
		<select id="pt" name="t" class="mt-1 {field}">
			<option value="">free agent</option>
			{#each data.t as t (t.i)}<option value={t.i}>{t.n}</option>{/each}
		</select>
	</div>
	<button type="submit" class={button}>add player</button>
</form>

<div class="sheet mt-4">
	<table class="data">
		<thead>
			<tr>
				<th class="text-left">player</th>
				<th class="text-left">team</th>
				<th class="text-left">details</th>
				<th class="text-left">linked user</th>
			</tr>
		</thead>
		<tbody>
			{#each data.p as p (p.i)}
				<tr class="align-top">
					<td class="py-2">{p.n}</td>
					<td>
						<form method="post" action="?/player_move" class="flex gap-2">
							<input type="hidden" name="i" value={p.i} />
							<select name="t" class={field}>
								<option value="">free agent</option>
								{#each data.t as t (t.i)}
									<option value={t.i} selected={t.i === p.t}>{t.ab}</option>
								{/each}
							</select>
							<button type="submit" class={button}>save</button>
						</form>
					</td>
					<td>
						<form method="post" action="?/player_edit" class="flex gap-2">
							<input type="hidden" name="i" value={p.i} />
							<input
								name="j"
								type="number"
								min="1"
								max="99"
								value={p.j ?? ''}
								class="w-20 {field}"
							/>
							<select name="ps" class={field}>
								{#each POS as ps (ps)}<option value={ps} selected={ps === p.ps}>{ps}</option>{/each}
							</select>
							<select name="st" class={field}>
								<option value="a" selected={p.st === 'a'}>active</option>
								<option value="r" selected={p.st === 'r'}>retired</option>
							</select>
							<button type="submit" class={button}>save</button>
						</form>
					</td>
					<td>
						<form method="post" action="?/player_link" class="flex gap-2">
							<input type="hidden" name="i" value={p.i} />
							<select name="u" class={field}>
								<option value="">nobody</option>
								{#each data.u as u (u.i)}
									<option value={u.i} selected={u.i === p.u}>{u.e}</option>
								{/each}
							</select>
							<button type="submit" class={button}>link</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="rule mt-16"><h2 class="head">games</h2></div>
<form
	method="post"
	action="?/game_new"
	bind:this={game_form}
	use:ctrlEnter={() => game_form.requestSubmit()}
	class="card mt-2 flex flex-wrap items-end gap-3"
>
	<div>
		<label for="gh" class="label block">home</label>
		<select id="gh" name="h" required class="mt-1 {field}">
			{#each data.t as t (t.i)}<option value={t.i}>{t.ab}</option>{/each}
		</select>
	</div>
	<div>
		<label for="ga" class="label block">away</label>
		<select id="ga" name="a" required class="mt-1 {field}">
			{#each data.t as t (t.i)}<option value={t.i}>{t.ab}</option>{/each}
		</select>
	</div>
	<div>
		<label for="gdt" class="label block">date</label>
		<input id="gdt" name="dt" type="date" required class="mt-1 {field}" />
	</div>
	<div>
		<label for="gty" class="label block">type</label>
		<select id="gty" name="ty" class="mt-1 {field}">
			<option value="r">regular</option>
			<option value="p">playoff</option>
			<option value="e">preseason</option>
		</select>
	</div>
	<button type="submit" class={button}>add game</button>
</form>

<div class="sheet mt-4">
	<table class="data">
		<thead>
			<tr
				><th class="text-left">date</th><th class="text-left">game</th><th class="text-left"
					>result</th
				></tr
			>
		</thead>
		<tbody>
			{#each data.g as g (g.i)}
				<tr>
					<td class="py-2">{day(g.dt)}</td>
					<td>{g.a} @ {g.h}</td>
					<td>
						<form method="post" action="?/game_result" class="flex gap-2">
							<input type="hidden" name="i" value={g.i} />
							<input name="ag" type="number" min="0" value={g.ag ?? ''} class="w-16 {field}" />
							<input name="hg" type="number" min="0" value={g.hg ?? ''} class="w-16 {field}" />
							<select name="ot" class={field}>
								<option value="" selected={!g.ot}>regulation</option>
								<option value="o" selected={g.ot === 'o'}>overtime</option>
								<option value="s" selected={g.ot === 's'}>shootout</option>
							</select>
							<button type="submit" class={button}>save</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="rule mt-16"><h2 class="head">recap</h2></div>
<form
	method="post"
	action="?/game_recap"
	bind:this={recap_form}
	use:ctrlEnter={() => recap_form.requestSubmit()}
	class="card mt-2"
>
	<label for="rg" class="label block">game</label>
	<select id="rg" name="i" bind:value={recap_game} class="mt-1 {field}">
		<option value="">choose a game</option>
		{#each data.g as g (g.i)}<option value={g.i}>{day(g.dt)} · {g.a} @ {g.h}</option>{/each}
	</select>
	<label for="rc" class="label mt-3 block">recap</label>
	<textarea id="rc" name="rc" rows="8" class="mt-1 w-full {field}">{recap_text}</textarea>
	<button type="submit" class="mt-3 {button}">save recap</button>
	<span class="ml-2 text-sm text-mute">ctrl+enter to submit. blank line between paragraphs.</span>
</form>
