<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';

	let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="sticky top-0 z-10 border-b border-line bg-board">
	<div class="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3 text-sm">
		<a href="/" class="text-lg font-bold text-brand">mesh</a>
		<nav class="flex flex-wrap items-center gap-4">
			<a href="/standings" class="hover:text-brand">standings</a>
			<a href="/schedule" class="hover:text-brand">schedule</a>
			<a href="/teams" class="hover:text-brand">teams</a>
			<a href="/news" class="hover:text-brand">news</a>
		</nav>
		<div class="ml-auto flex flex-wrap items-center gap-4">
			{#if data.u}
				<a href="/me" class="hover:text-brand">portal</a>
				{#if data.u.r === 'a'}
					<a href="/admin" class="hover:text-brand">admin</a>
				{/if}
				<form method="post" action="/logout">
					<button type="submit" class="text-mute hover:text-brand">sign out</button>
				</form>
			{:else}
				<a href="/login" class="hover:text-brand">sign in</a>
			{/if}
		</div>
	</div>
</header>

<main class="mx-auto max-w-5xl px-4 py-8">{@render children()}</main>

<footer class="mx-auto max-w-5xl px-4 py-8 text-sm text-mute">
	mesh sim hockey league · {new Date().getFullYear()}
</footer>
