import VD, { Component, VDOMNode, Effect } from "../src/DOM";

type MyState = {
	stringData: string;
	numberData: number;
}

const childComponent: Component<{ numberData: number }> = VD.registerComponent(
	({ numberData }) =>
		VD.h("span")({})(
			`Child component with a prop: ${numberData}`,
			VD.h("button")({ onclick: () => incrementEffect(1) })("Increment!"),
		));

const initialData = {
	stringData: "String data",
	numberData: 69,
};

function myAppView({ numberData, stringData }: MyState): VDOMNode {
	return (
		VD.h("main")({})(
			VD.h("h1")({})("Hello World!"),
			VD.h("p")({})("This is my vdom implementation!"),
			VD.h("p")({})(`This is some data: ${stringData}`),
			VD.h("br")({})(),
			VD.h("hr")({})(),
			VD.h("label")({})(
				"This is a button, nested in a label",
				VD.h("button")({})("A button, but nested!"),
			),
			VD.h("div")({})(
				"This is a child component",
				VD.h("br")({})(),
				childComponent({ numberData }),
			),
		)
	);
}

const root = document.getElementById("app");

const myEffectRegistrer = VD.registerEffect(root)(myAppView)(initialData)

const increment =
	(state: MyState) =>
	(payload: number) => {
		return {
			...state,
			numberData: state.numberData + payload,
		}
	}

const incrementEffect: Effect<MyState, number> =
	myEffectRegistrer(increment);


const myApp = VD.registerApp
	<MyState>
	(root)
	(myAppView)

document.addEventListener("DOMContentLoaded", () => {
	myApp(initialData).run();
});