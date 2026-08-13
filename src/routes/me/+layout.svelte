<script lang="ts">
	import { page } from '$app/state';
	import Rink from '#lib/Rink.svelte';

	let { data, children } = $props();

	const NAV = [
		['/me', 'overview'],
		['/me/stats', 'stats'],
		['/me/progress', 'progress'],
		['/me/profile', 'profile']
	];
</script>

{#if data.p}
	<nav
		aria-label="portal"
		class="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-line pb-4 text-sm"
	>
		<span class="label">portal</span>
		{#each NAV as [href, name] (href)}
			<a
				{href}
				class="cut text-mute hover:text-ink"
				aria-current={page.url.pathname === href ? 'page' : undefined}
			>
				{name}
			</a>
		{/each}
	</nav>
	<div class="mt-12">{@render children()}</div>
{:else}
	<section class="relative mx-auto max-w-xl py-16 text-center">
		<Rink
			class="pointer-events-none absolute inset-x-0 top-1/2 -z-10 w-full -translate-y-1/2 opacity-30"
		/>
		<p class="label">portal</p>
		<h1 class="title mt-4">no player yet</h1>
		<p class="prose-voice mx-auto mt-6 text-mute">
			your account is signed in, but no skater is linked to it. ask a league admin to link you and
			this page fills with your record.
		</p>
		<a href="/" class="btn-ghost mt-8">back to the league</a>
	</section>
{/if}
