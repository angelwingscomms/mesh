<script lang="ts">
	import Rink from '#lib/Rink.svelte';
	import { reveal } from '#lib/actions';
</script>

<svelte:head><title>sign in · mesh</title></svelte:head>

<section class="relative mx-auto max-w-xl py-16 text-center">
	<Rink
		class="pointer-events-none absolute inset-x-0 top-1/2 -z-10 w-full -translate-y-1/2 opacity-30"
	/>

	<p class="label" data-reveal use:reveal>coaches</p>
	<h1 class="title mt-4" data-reveal use:reveal={60}>sign in</h1>
	<p class="prose-voice mx-auto mt-6 text-mute" data-reveal use:reveal={120}>
		your portal holds one skater: their stats, their progression, and the profile you shape between
		sims.
	</p>
	<div data-reveal use:reveal={180}>
		<a href="/login/go" data-sveltekit-reload class="btn mt-10">continue with google</a>
	</div>
	<p class="label mt-6" data-reveal use:reveal={220}>
		no player linked yet? an admin links your account after you sign in once.
	</p>
</section>
