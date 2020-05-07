import IO, { io, IO as IOtype } from "./IO";
import { isString, memoize } from "./utils";

type HTMLTag =
	Parameters<typeof document.createElement>[0];

type HTMLAttribute = string | number | Function;

export type HTMLAttributes =
	Record<string, HTMLAttribute>

type VDOMChild =
	VDOMNode | string;

export type VDOMNode =
	{ tag: HTMLTag
	, attributes: HTMLAttributes
	, children: VDOMChild[]
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

const renderString =
	(target: HTMLElement) =>
	(str: string) => {
		return io<void, void>(() => {
			target.innerHTML += str;
		});
	}

const addAttribute =
	(target: HTMLElement) =>
	(attribute: [string, HTMLAttribute]) => {
		return io<void, void>(() => {
			target[attribute[0]] = attribute[1];
		});
	}

const addAttributeBundle =
	(target: HTMLElement) =>
	(attributeBundle: Record<string, HTMLAttribute>) => {
		const addToTarget = addAttribute(target);
		return IO.merge<void, void>(
			...Object.entries(attributeBundle).map(addToTarget)
		);
	}

const renderVDOMNode =
	(target: HTMLElement) =>
	(node: VDOMNode): IOtype<void, void> => {
		const el = document.createElement(node.tag)
		const attachAttributes = addAttributeBundle(target)(node.attributes);
		const renderChildren = node.children.map(renderVDOMChild(el));
		return IO.merge<void, void>(
			attachAttributes,
			...renderChildren,
			io<void, void>(() => target.appendChild(el))
		);
	};

const renderVDOMChildren =
	(target: HTMLElement) =>
	(nodes: VDOMChild[]) => {
		const renderOnTarget = renderVDOMChild(target);
		return IO.merge<void, void>(...nodes.map(node => renderOnTarget(node)));
	}

const renderVDOMChild =
	(target: HTMLElement) =>
	(child: VDOMChild) => {
		return isString(child)
			? renderString(target)(child)
			: renderVDOMNode(target)(child);
	}

///

export type Component<T> =
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
				renderVDOMChildren(root)(h(state)).run(); // IMPURE !
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
			{ render: renderVDOMChildren(root)(h(state)).run
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
