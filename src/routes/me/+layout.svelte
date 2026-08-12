<script lang="ts">
	let { data, children } = $props();
</script>

{#if data.p}
	<nav class="flex flex-wrap gap-4 border-b border-line pb-3 text-sm">
		<a href="/me" class="hover:text-brand">overview</a>
		<a href="/me/stats" class="hover:text-brand">stats</a>
		<a href="/me/progress" class="hover:text-brand">progress</a>
		<a href="/me/profile" class="hover:text-brand">profile</a>
	</nav>
	<div class="mt-6">{@render children()}</div>
{:else}
	<div class="rounded-[--radius-card] border border-line bg-board p-5 text-sm text-mute">
		no player linked to your account yet — ask a league admin to link you
	</div>
{/if}
