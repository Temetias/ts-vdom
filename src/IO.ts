export type IO<T1, T2> = {
	run: (x: T1) => T2;
};

export const io =
	<T1, T2>(f: (x: T1) => T2) => {
		return {
			run: f,
		} as IO<T1, T2>;
	}

const map =
	<T1, T2, T3>(f: (x: T2) => T3) =>
	({ run }: IO<T1, T2>) => {
		return io((x: T1) => f(run(x)));
	}

export default {
	map,
}