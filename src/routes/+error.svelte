<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="mx-auto max-w-sm py-16 text-center">
	<h1 class="text-3xl font-bold text-brand">{page.status}</h1>
	<p class="mt-2 text-sm text-mute">{page.error?.message ?? 'something went wrong'}</p>
	<a href="/" class="mt-6 inline-block text-sm text-brand hover:text-brand-2">back to the league</a>
</div>
