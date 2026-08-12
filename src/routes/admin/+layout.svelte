<script lang="ts">
	let { children } = $props();
</script>

<nav class="flex flex-wrap gap-4 border-b border-line pb-3 text-sm">
	<a href="/admin" class="hover:text-brand">overview</a>
	<a href="/admin/roster" class="hover:text-brand">roster</a>
	<a href="/admin/attrs" class="hover:text-brand">ratings</a>
	<a href="/admin/approvals" class="hover:text-brand">approvals</a>
	<a href="/admin/news" class="hover:text-brand">news</a>
	<a href="/admin/import" class="hover:text-brand">import</a>
</nav>

<div class="mt-6">{@render children()}</div>
