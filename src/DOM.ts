import IO, { io, IO as IOtype } from "./IO";
import { isString } from "./utils";

export type HTMLTag =
	Parameters<typeof document.createElement>[0];

type HTMLAttribute = string | number | Function;

export type HTMLAttributes =
	Record<string, HTMLAttribute>

export type VDOMChild =
	VDOMNode | string;

export type VDOMNode =
	{ tag: HTMLTag
	, attributes: HTMLAttributes
	, children: VDOMChild[]
	}

const renderString =
	(target: HTMLElement) =>
	(str: string) => {
		return io<void, void>(() => {
			target.insertAdjacentHTML("beforeend", str);
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
		const attachAttributes = addAttributeBundle(el)(node.attributes);
		const renderChildren = node.children.map(renderVDOMChild(el));
		return IO.merge<void, void>(
			attachAttributes,
			...renderChildren,
			io<void, void>(() => target.appendChild(el))
		);
	};

const renderVDOMChild =
	(target: HTMLElement) =>
	(child: VDOMChild) => {
		return isString(child)
			? renderString(target)(child)
			: renderVDOMNode(target)(child);
	}

export default
	{ renderVDOMNode
	}
