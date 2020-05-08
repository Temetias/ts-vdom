import { isDefined } from "./utils";

type Just<T> =
	T;

type Nothing =
	undefined;

export type Maybe<T> =
	Just<T> | Nothing;

const maybe =
	<T>(x: T | Nothing): Maybe<T> => {
		return x as Maybe<T>;
	}

const map =
	<T1, T2>(f: (inner: T1) => T2) =>
	(x: Maybe<T1>) => {
		return isDefined(x)
			? maybe(f(x))
			: maybe(undefined);
	}

export default
	{ maybe
	, map
	}
