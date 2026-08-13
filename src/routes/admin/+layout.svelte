<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	const NAV = [
		['/admin', 'overview'],
		['/admin/roster', 'roster'],
		['/admin/attrs', 'ratings'],
		['/admin/approvals', 'approvals'],
		['/admin/news', 'news'],
		['/admin/import', 'import']
	];
</script>

<nav
	aria-label="league office"
	class="stands flex flex-wrap items-center gap-x-7 gap-y-3 px-5 py-4 text-sm"
>
	<span class="label text-board/45">league office</span>
	{#each NAV as [href, name] (href)}
		<a
			{href}
			class="cut text-board/70 hover:text-board"
			aria-current={page.url.pathname === href ? 'page' : undefined}
			class:text-board={page.url.pathname === href}
		>
			{name}
		</a>
	{/each}
</nav>

<div class="mt-12">{@render children()}</div>
