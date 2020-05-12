import DOM, { VDOMChild, HTMLTag, HTMLAttributes, VDOMNode } from "./DOM";
import { memoize, killReference } from "./utils";
import State, { MutationBundle } from "./state";
import IO from "./IO";

export type Component<T = {}> =
	(props: T) =>
		VDOMNode;

export type Effect<T1, T2> =
	(payload: T2) =>
		T1;


type Reducer<T1, T2> =
	(state: T1) =>
		Effect<T1, T2>

type App<T1> =
	{ start: () => void
	, effectRegistrator: <T2>(reducer: Reducer<T1, T2>) => Effect<T1, T2>
	}

type ApiState<T> =
	{ appState: T
	, components: Component<T>[]
	}

const stateEngineMutations: MutationBundle<ApiState<unknown>> =
	{ setState: state => <T>(appState: T) => ({ ...state, appState })
	, registerComponent: state => <T>(component: Component<T>) => ({ ...state, components: [ ...state.components, component ] })
	}

const stateEngine =
	State.initializeState<ApiState<unknown>>({ appState: {}, components: [] })(stateEngineMutations);

const h =
	<T>(tag: HTMLTag) =>
	(attributes: HTMLAttributes & T) =>
	(...children: VDOMChild[]) => {
		return (
			{ tag
			, attributes
			, children
			}
		) as VDOMNode;
	}

const registerComponent =
	<T>(h: Component<T>) => {
		stateEngine.dispatch("registerComponent")(h).run();
		return memoize(h);
	}

const registerEffect =
	(root: HTMLElement) =>
	<T1, T2>(h: Component<T1>) =>
	(state: T1) =>
	(reducer: Reducer<T1, T2>) => {
		return (
			// Maybe expose the IO.run to user for ability to manually determine update schedule?
			(payload: T2) => {
				const computedState = reducer(stateEngine.get.run().appState as T1)(payload) as T1;
				stateEngine.dispatch("setState")(computedState).run(); // IMPURE !
				root.innerHTML = ""; // IMPURE !
				DOM.renderVDOMNode(root)(h(computedState)).run(); // IMPURE !
				return state;
			}
		);
	}

const registerApp =
	(root: HTMLElement) =>
	<T>(h: Component<T>) =>
	(initialState: T) => {
		return (
			{ start:
				IO.chain(
					stateEngine.dispatch("setState")(initialState),
					DOM.renderVDOMNode(root)(h(initialState))
				).run
			, effectRegistrator: registerEffect(root)(h)(initialState)
			}
		) as App<T>;
	}

export default
	{ registerComponent
	, registerApp
	, registerEffect
	, h
	}