import API from "./API";
import { HTMLAttributes } from "./DOM"

/// Child

export const div = API.h("div");
export const h1 = API.h("h1");
export const h2 = API.h("h2");
export const h3 = API.h("h3");
export const h4 = API.h("h4");
export const h5 = API.h("h5");
export const span = API.h("span");
export const p = API.h("p");
export const a = API.h("a");
export const button = API.h("button");
export const label = API.h("label");
export const main = API.h("main");
export const section = API.h("section");

/// No child

export const input = (attrs: HTMLAttributes) => API.h("input")(attrs)();
export const br = (attrs: HTMLAttributes) => API.h("br")(attrs)();
export const hr = (attrs: HTMLAttributes) => API.h("hr")(attrs)();
