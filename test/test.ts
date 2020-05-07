import VD, { Component } from "../src/DOM";
import { main, div, p, h1, br, hr, label, button, span } from "../src/HTML";

type MyState =
	{ stringData: string
	, numberData: number
	}

const childComponent: Component<{ numberData: number }> =
	VD.registerComponent(
		({ numberData }) => {
			return [
				span({})(
					`Child component with a prop: ${numberData}`,
					button({ onclick: () => incrementEffect(1) })("Increment!"),
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
			main({})(
				h1({})("Hello World!"),
				p({})("This is my vdom implementation!"),
				p({})(`This is some data: ${stringData}`),
				br({}),
				hr({}),
				label({})(
					"This is a button, nested in a label",
					button({})("A button, but nested!"),
				),
				div({})(
					"This is a child component",
					br({}),
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
	VD.registerApp(root)(myAppView)(initialState);

const incrementEffect =
	myApp.effectRegistrator(increment);

document.addEventListener("DOMContentLoaded", myApp.render);
