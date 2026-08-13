<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';

	let { data, children } = $props();

	const NAV = [
		['/standings', 'standings'],
		['/schedule', 'schedule'],
		['/leaders', 'leaders'],
		['/teams', 'teams'],
		['/news', 'news']
	];

	const here = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(href + '/');

	let clock = $state('');

	$effect(() => {
		const tick = () => {
			const d = new Date();
			clock = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
		};
		tick();
		const id = setInterval(tick, 30000);
		return () => clearInterval(id);
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="grain"></div>

<a
	href="#main"
	class="btn sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
>
	skip to content
</a>

<header class="stands">
	<div
		class="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-8 gap-y-4 px-5 py-4 sm:px-8 lg:px-12"
	>
		<a href="/" class="group flex items-baseline gap-3">
			<span class="numeral text-[22px] leading-none">mesh</span>
			<span class="label text-board/45">{data.se?.n ?? 'no season'}</span>
		</a>

		<nav aria-label="league" class="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
			{#each NAV as [href, name] (href)}
				<a
					{href}
					class="cut text-board/70 hover:text-board"
					aria-current={here(href) ? 'page' : undefined}
					class:text-board={here(href)}
				>
					{name}
				</a>
			{/each}
		</nav>

		<div class="ml-auto flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px]">
			<form action="/search" class="hidden items-center gap-2 md:flex">
				<label for="q" class="label text-board/45">find</label>
				<input
					id="q"
					name="q"
					value={page.url.pathname === '/search' ? (page.url.searchParams.get('q') ?? '') : ''}
					placeholder="player or team"
					class="h-9 w-40 border-b border-board/25 bg-transparent px-1 text-[13px] text-board transition-colors duration-300 outline-none placeholder:text-board/35 focus:border-board"
				/>
			</form>

			{#if data.u}
				<a href="/me" class="cut text-board/70 hover:text-board">portal</a>
				{#if data.u.r === 'a'}
					<a href="/admin" class="cut text-board/70 hover:text-board">admin</a>
				{/if}
				<form method="post" action="/logout">
					<button type="submit" class="cut cursor-pointer text-board/45 hover:text-board">
						sign out
					</button>
				</form>
			{:else}
				<a href="/login" class="cut text-board/70 hover:text-board">sign in</a>
			{/if}
		</div>
	</div>
</header>

<main id="main" class="mx-auto max-w-[1400px] px-5 pt-12 pb-32 sm:px-8 lg:px-12">
	{@render children()}
</main>

<footer class="stands overflow-hidden">
	<div class="mx-auto max-w-[1400px] px-5 pt-20 pb-10 sm:px-8 lg:px-12">
		<p class="display text-board/10 select-none">mesh</p>

		<div class="mt-10 flex flex-wrap items-end justify-between gap-8 border-t border-board/15 pt-8">
			<nav aria-label="footer" class="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
				{#each NAV as [href, name] (href)}
					<a {href} class="cut text-board/60 hover:text-board">{name}</a>
				{/each}
				<a href="/login" class="cut text-board/60 hover:text-board">coaches</a>
			</nav>

			<p class="label text-board/40">
				{#if clock}local — {clock} ·{/if} simulated in nhl 25 · {new Date().getFullYear()}
			</p>
		</div>
	</div>
</footer>
