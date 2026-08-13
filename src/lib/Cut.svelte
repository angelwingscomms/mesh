<script lang="ts">
	let { class: klass = '' }: { class?: string } = $props();

	const d = 'M0 168 C 260 150, 430 54, 690 72 S 1010 160, 1200 108';
</script>

<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class={klass} aria-hidden="true" fill="none">
	<path
		{d}
		class="trace-spray"
		stroke="#ffffff"
		stroke-width="7"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
		transform="translate(0 4)"
	/>
	<path
		{d}
		class="trace-cut text-brand"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
		pathLength="1"
	/>
</svg>
