import DOM, { HTMLAttributes } from "./DOM";

/// Child

export const div = DOM.h("div");
export const h1 = DOM.h("h1");
export const h2 = DOM.h("h2");
export const h3 = DOM.h("h3");
export const h4 = DOM.h("h4");
export const h5 = DOM.h("h5");
export const span = DOM.h("span");
export const p = DOM.h("p");
export const a = DOM.h("a");
export const button = DOM.h("button");
export const label = DOM.h("label");
export const main = DOM.h("main");
export const section = DOM.h("section");

/// No child

export const input = (attrs: HTMLAttributes) => DOM.h("input")(attrs)();
export const br = (attrs: HTMLAttributes) => DOM.h("br")(attrs)();
export const hr = (attrs: HTMLAttributes) => DOM.h("hr")(attrs)();
