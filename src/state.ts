import { IO, io } from "./IO"
import { killReference } from "./utils";

type Mutation<T1, T2> =
	(previousState: T1) => (payload: T2) => T1;

export type MutationBundle<T1> =
	Record<string, Mutation<T1, unknown>>;

type State<T1, T2 extends MutationBundle<T1>> =
	{ get: IO<void, T1>
	, dispatch: <T3 extends keyof T2>(mutationName: T3) => (payload: Parameters<ReturnType<T2[T3]>>[0]) => IO<void, void>
	}

const initializeState =
	<T1 extends object>(initialState: T1) =>
	<T2 extends MutationBundle<T1>>(mutations: T2) => {
		const stateContainer = { state: killReference(initialState) }; // SOURCE OF TRUTH! WILL CHANGE WHEN MUTATIONS ARE DISPATCHED!
		return (
			{ get: io<void, T1>(() => killReference(stateContainer.state))
			, dispatch: dispatchOnStateRef(stateContainer)(mutations)
			}
		) as State<T1, T2>;
	}

const dispatchOnStateRef =
	<T1>(stateContainer: { state: T1 }) =>
	<T2 extends MutationBundle<T1>>(mutationBundle: T2) =>
	<T3 extends keyof T2>(mutationName: T3) =>
	(payload: T2[T3]) => {
		return io<void, void>(() => {
			const previousState = killReference(stateContainer.state);
			stateContainer.state = mutationBundle[mutationName](previousState)(payload);
		});
	}

export default
	{ initializeState
	}
