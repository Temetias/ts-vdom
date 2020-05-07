export const isString =
	<T>(x: T) => {
		return typeof x === "string";
	}
	
export const isDefined =
	<T>(x: T) => {
		return x !== undefined;
	}

export const memoize =
	<T1, T2>(f: (x: T1) => T2) => {
		const memCache = {
			param: undefined as unknown as T1,
			result: undefined as unknown as T2,
		}
		return (x: T1) => {
			if (isDefined(memCache.param) && deepEqual(memCache.param)(x)) {
				console.log("memoized!", memCache.param, memCache.result);
				return memCache.result;
			}
			else {
				memCache.param = x;
				const computedResult = f(x);
				typeof computedResult === "function" && computedResult.length === 1
					? memCache.result = memoize(computedResult as unknown as (x: unknown) => unknown) as unknown as T2
					: memCache.result = computedResult;
				return computedResult;
			}
		}
	}

export const deepEqual =
	<T>(x: T) =>
	(y: T): boolean => {
		return x === y
			|| typeof x === "function" && typeof y === "function" && x.toString() === y.toString()
			||
				x
				&& y
				&& typeof x === "object"
				&& (x as any).constructor === (y as any).constructor
				&& Object.keys(x).length === Object.keys(y).length
				&& !Object.keys(x).find(k => !deepEqual(x[k as keyof typeof x])(y[k as keyof typeof y]));
	}

export const killReference =
	<T>(x: T) => {
		return JSON.parse(JSON.stringify(x));
	}

export const flat =
	<T>(x: T[]) => {
		return x.flat(Infinity);
	}