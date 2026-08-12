export function scale_points(values: number[], w: number, h: number): [number, number][] {
	if (!values.length) return [];
	const min = Math.min(...values);
	const max = Math.max(...values);
	const flat = max === min;
	return values.map((v, i) => [
		values.length === 1 ? 0 : (i / (values.length - 1)) * w,
		flat ? h / 2 : h - ((v - min) / (max - min)) * h
	]);
}

const round = (n: number) => String(Math.round(n * 100) / 100);

export function line_path(values: number[], w: number, h: number): string {
	const pts = scale_points(values, w, h);
	if (!pts.length) return '';
	return pts.map(([x, y], i) => (i ? 'L' : 'M') + round(x) + ',' + round(y)).join(' ');
}
