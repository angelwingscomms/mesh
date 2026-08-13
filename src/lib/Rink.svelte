<script lang="ts">
	let { class: klass = '' }: { class?: string } = $props();

	const dots: [number, number][] = [
		[31, 20.5],
		[31, 64.5],
		[169, 20.5],
		[169, 64.5]
	];

	const neutral: [number, number][] = [
		[80, 20.5],
		[80, 64.5],
		[120, 20.5],
		[120, 64.5]
	];
</script>

<svg viewBox="0 0 200 85" class={klass} aria-hidden="true" fill="none" stroke-width="0.6">
	<rect x="0.6" y="0.6" width="198.8" height="83.8" rx="24" class="stroke-line" />

	<g class="stroke-line">
		{#each dots as [cx, cy] (cx + '-' + cy)}
			<circle {cx} {cy} r="15" />
			<circle {cx} {cy} r="1.2" class="fill-line stroke-none" />
		{/each}
		{#each neutral as [cx, cy] (cx + '-' + cy)}
			<circle {cx} {cy} r="1.2" class="fill-line stroke-none" />
		{/each}
	</g>

	<g class="stroke-brand">
		<line x1="75" y1="0.6" x2="75" y2="84.4" />
		<line x1="125" y1="0.6" x2="125" y2="84.4" />
		<path d="M11 34.5 a12 12 0 0 1 0 16" />
		<path d="M189 34.5 a12 12 0 0 0 0 16" />
	</g>

	<g class="stroke-accent">
		<line x1="11" y1="6" x2="11" y2="79" />
		<line x1="189" y1="6" x2="189" y2="79" />
		<line x1="100" y1="0.6" x2="100" y2="84.4" />
		<circle cx="100" cy="42.5" r="15" />
		<circle cx="100" cy="42.5" r="1.2" class="fill-accent stroke-none" />
	</g>
</svg>
