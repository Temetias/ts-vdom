import { io } from "./IO";
import { isString, memoize, killReference } from "./utils";

type HTMLTag =
	Parameters<typeof document.createElement>[0];
	
type HTMLAttributes =
	Record<string, string | number | Function>

type VDOMChild =
	VDOMNode | string;

export type VDOMNode = {
	tag: HTMLTag;
	attributes: HTMLAttributes;
	children: VDOMChild[];
}

const h =
	<T>(tag: HTMLTag) =>
	(attributes: HTMLAttributes & T) =>
	(...children: VDOMChild[]) => {
		return {
			tag,
			attributes,
			children,
		} as VDOMNode;
	}

const renderString =
	(target: HTMLElement) =>
	(str: string) => {
		return io<void, void>(() => {
			target.innerHTML += str;
		});
	}

const renderVDOMNode =
	(target: HTMLElement) =>
	(node: VDOMNode) => {
		return io<void, void>(() => {
			const el = document.createElement(node.tag, node.attributes);
			Object.keys(node.attributes).forEach(k => el[k] = node.attributes[k]);
			node.children.forEach(child => renderVDOMChild(el)(child).run());
			target.appendChild(el);
		});
	};

const renderVDOMChild =
	(target: HTMLElement) =>
	(child: VDOMChild) => {
		return isString(child)
			? renderString(target)(child as string)
			: renderVDOMNode(target)(child as VDOMNode);
	}

///

export type Component<T> =
	(props: T) =>
		VDOMNode;

export type Effect<T1, T2> =
	(payload: T2) =>
		T1;


type Reducer<T1, T2> =
	(state: T1) =>
		Effect<T1, T2>

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
			(payload: T2) => {
				state = reducer(state)(payload); // IMPURE !
				root.innerHTML = ""; // IMPURE !
				renderVDOMNode(root)(h(state)).run(); // IMPURE !
				return state;
			}
		);
	}

const registerApp =
	<T>(root: HTMLElement) =>
	(h: Component<T>) => {
		return memoize((data: T) => {
			return renderVDOMNode(root)(h(data));
		});

	}

export default {
	registerComponent,
	registerApp,
	registerEffect,
	h,
}
