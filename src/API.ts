import DOM, { VDOMChild, HTMLTag, HTMLAttributes, VDOMNode } from "./DOM";
import { memoize } from "./utils";

export type Component<T = {}> =
	(props: T) =>
		VDOMChild[];

export type Effect<T1, T2> =
	(payload: T2) =>
		T1;


type Reducer<T1, T2> =
	(state: T1) =>
		Effect<T1, T2>

type App<T1> =
	{ render: () => void
	, effectRegistrator: <T2>(reducer: Reducer<T1, T2>) => Effect<T1, T2>
	}

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
				state = reducer(state)(payload); // IMPURE !
				root.innerHTML = ""; // IMPURE !
				DOM.renderVDOM(root)(h(state)).run(); // IMPURE !
				return state;
			}
		);
	}

const registerApp =
	(root: HTMLElement) =>
	<T>(h: Component<T>) =>
	(initialState: T) => {
		const state = Object.freeze(initialState);
		return (
			{ render: DOM.renderVDOM(root)(h(state)).run
			, effectRegistrator: registerEffect(root)(h)(state)
			}
		) as App<T>;
	}

export default
	{ registerComponent
	, registerApp
	, registerEffect
	, h
	}