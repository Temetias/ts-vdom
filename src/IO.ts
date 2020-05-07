import { compose2 } from "./utils";

export type IO<T1, T2> =
	T1 extends void
		? { run: () => T2 }
		: { run: (x: T1) => T2 };

export const io =
	<T1, T2>(f: (x: T1) => T2) => {
		return {
			run: f,
		} as IO<T1, T2>;
	}

const map =
	<T2, T3>(f: (x: T2) => T3) =>
	<T1>({ run }: IO<T1, T2>) => {
		return io((x: T1) => f(run(x)));
	}

const merge =
	<T1, T2>(...ios: IO<T1, T2>[]) => {
		return io((x: T1) => {
			return ios.map(({ run }) => run(x));
		});
	}

const flat =
	<T1, T2>(ioMonad: IO<T1, IO<T1, T2>>) => {
		return io((x: T1) => {
			return ioMonad.run(x).run(x);
		});
	}

const compose2io =
	<T1, T2>(io1: IO<T1, T2>) =>
	<T3>(io2: IO<T3, T1>) => {
		return io(compose2(io1.run)(io2.run));
	}

const compose3io =
	<T1, T2>(io1: IO<T1, T2>) =>
	<T3>(io2: IO<T3, T1>) =>
	<T4>(io3: IO<T4, T3>) => {
		return io((x: T4) => {
			return io1.run(io2.run(io3.run(x)));
		});
	}

export default
	{ map
	, merge
	, compose2io
	, compose3io
	, flat
	}