import VD, { Component } from "../src/DOM";

type MyState =
	{ stringData: string
	, numberData: number
	}

const childComponent: Component<{ numberData: number }> =
	VD.registerComponent(
		({ numberData }) => {
			return [
				VD.h("span")({})(
					`Child component with a prop: ${numberData}`,
					VD.h("button")({ onclick: () => incrementEffect(1) })("Increment!"),
				)
			];
		}
	);

const initialState =
	{ stringData: "String data"
	, numberData: 69,
	}

const myAppView: Component<MyState> =
	({ numberData, stringData }: MyState) => {
		return [
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
					...childComponent({ numberData }),
				),
			)
		];
	}

const root =
	document.getElementById("app");

const increment =
	(state: MyState) =>
	(payload: number) => {
		return {
			...state,
			numberData: state.numberData + payload,
		}
	}


const myApp =
	VD.registerApp<MyState>(root)(myAppView)(initialState);

const incrementEffect =
	myApp.effectRegistrator(increment);

document.addEventListener("DOMContentLoaded", myApp.render);