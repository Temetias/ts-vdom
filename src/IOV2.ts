type IOResult<T> = T | Promise<T>;

type IOFunction<T> = () => IOResult<T>;

type IO<T> = T extends void
	? { run: (cb: () => any) => void }
	: { run: (cb: (x: T) => any) => void };

type IOChainable =
	IO<void> &
	{ chain: (io: IO<void>) => IO<void>;
	}

const io =
	<T>(f: IOFunction<T>) => {
		return (
			{ run: (cb: (x: T) => any) => void (Promise.resolve(f()).then(cb))
			}
		) as IO<T>;
	}

const map =
	<T1, T2>(f: (x: T1) => T2) =>
	({ run }: IO<T1>) => {
		return (
			{ run: (cb: (x: T2) => any) => void (run(x => cb(f(x))))
			}
		) as IO<T2>
	}

const merge =
	(...ios: IO<void>[]) => {
		const toPromise = (x: IO<void>) => new Promise(r => x.run(r));
		return (
			{ run: (cb: () => any) => void (Promise.all(ios.map(toPromise)).then(cb))
			}
		) as IO<void>;
	}

const chain =
	(io1: IO<void>) =>
	(io2: IO<void>) => {
		const generatedIO = { run: cb => void (io1.run(() => io2.run(cb))) };
		return (
			{ ...generatedIO
			, chain: chain(generatedIO)
			}
		) as IOChainable;
	}

const toChainable =
	(io1: IO<void>) => {
		return (
			{ run: io1.run
			, chain: chain(io1)
			}
		) as IOChainable;
	}

export default
	{ io
	, map
	, merge
	, toChainable
	}
