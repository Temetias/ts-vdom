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

const merge =
	<T1, T2>(...ios: IO<T1, T2>[]) => {
		return io((x: T1) => {
			return ios.map(({ run }) => run(x));
		}) as IO<T1, T2[]>;
	}

export default
	{ map
	, merge
	}