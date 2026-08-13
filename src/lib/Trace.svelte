<script lang="ts">
	import { line_path, scale_points } from './chart';

	let {
		values = [],
		w = 160,
		h = 44,
		label = 'trend'
	}: { values?: number[]; w?: number; h?: number; label?: string } = $props();

	const inner = $derived(h - 4);
	const d = $derived(line_path(values, w, inner));
	const head = $derived(scale_points(values, w, inner).at(-1));
</script>

<svg
	viewBox="0 0 {w} {h}"
	class="w-full"
	style:height="{h}px"
	preserveAspectRatio="none"
	role="img"
	aria-label={label}
>
	<g
		class="text-line"
		stroke="currentColor"
		stroke-width="0.5"
		stroke-dasharray="2 4"
		opacity="0.7"
	>
		<line x1="0" y1={inner * 0.25 + 2} x2={w} y2={inner * 0.25 + 2} />
		<line x1="0" y1={inner * 0.75 + 2} x2={w} y2={inner * 0.75 + 2} />
	</g>

	{#if d}
		<g transform="translate(0 2)">
			<path
				{d}
				class="trace-spray"
				fill="none"
				stroke="#ffffff"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
				transform="translate(0 1.6)"
			/>
			<path
				{d}
				class="trace-cut text-brand"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				pathLength="1"
			/>
			{#if head}
				<circle
					cx={head[0]}
					cy={head[1]}
					r="2"
					class="trace-head text-brand"
					fill="currentColor"
					stroke="#ffffff"
					stroke-width="1"
				/>
			{/if}
		</g>
	{/if}
</svg>
