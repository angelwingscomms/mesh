<script lang="ts">
	import { page } from '$app/state';
	import Rink from '#lib/Rink.svelte';

	const copy: Record<number, string> = {
		403: 'that room is for the league office.',
		404: 'nothing has been cut into the ice here.'
	};
</script>

<svelte:head><title>error · mesh</title></svelte:head>

<section class="relative py-20">
	<Rink
		class="pointer-events-none absolute inset-x-0 top-1/2 -z-10 w-full -translate-y-1/2 opacity-25"
	/>

	<p class="label">error</p>
	<h1 class="display mt-4">{page.status}</h1>
	<p class="prose-voice mt-6 text-mute">
		{copy[page.status] ?? page.error?.message ?? 'something came apart.'}
	</p>
	<a href="/" class="btn mt-8">back to the league</a>
</section>
