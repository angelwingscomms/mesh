export function ctrlEnter(node: HTMLElement, fn: () => void) {
	const on_key = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			fn();
		}
	};
	node.addEventListener('keydown', on_key);
	return { destroy: () => node.removeEventListener('keydown', on_key) };
}

export function reveal(node: HTMLElement, delay = 0) {
	const show = () => {
		node.style.transitionDelay = delay + 'ms';
		node.dataset.shown = 'true';
	};
	if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) {
		show();
		return;
	}
	const io = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;
			show();
			io.disconnect();
		},
		{ rootMargin: '0px 0px -10% 0px' }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}
