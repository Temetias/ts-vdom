import VD, { Component } from "../src/API";
import { main, div, p, h1, br, hr, label, button, span } from "../src/HTML";
import { VDOMChild } from "../src/DOM";

type MyState =
	{ stringData: string
	, numberData: number
	}

const childComponent: Component<{ numberData: number }> =
	VD.registerComponent(
		({ numberData }) => {
			return (
				[ div({})
					( div({})(`Child component with a prop: ${numberData}`)
					, button({ style: "color: red;", onclick: () => incrementEffect(1) })("Increment!")
					, numberData > 100 ? "IT'S OVER 100!" : ""
					, br({})
					, ...childComponentWithSlot({ child: span({})("This is slotted content!") })
					)
				]
			);
		}
	);

const childComponentWithSlot: Component<{ child: VDOMChild }> =
	VD.registerComponent(
		({ child }) => {
			return (
				[ div({})
					( span({})("This is a component with a slot")
					, br({})
					, child
					)
				]
			);
		}
	);

const initialState =
	{ stringData: "String data"
	, numberData: 69
	}

const myAppView: Component<MyState> =
	({ numberData, stringData }: MyState) => {
		return (
			[ main({})
				( h1({})("Hello World!")
				, p({})("This is my vdom implementation!")
				, p({})(`This is some data: ${stringData}`)
				, br({})
				, hr({})
				, label({})
					( "This is a button, nested in a label"
					, button({ onclick: () => incrementEffect(1)})("A button, but nested!")
					)
				, div({})
					( "This is a child component"
					, br({})
					, ...childComponent({ numberData })
					)
				)
			]
		);
	}

const increment =
	(state: MyState) =>
	(payload: number) => {
		return (
			{ ...state
			, numberData: state.numberData + payload
			}
		);
	}


const myApp =
	VD.registerApp
		(document.getElementById("app"))
		(myAppView)
		(initialState);

const incrementEffect =
	myApp.effectRegistrator(increment);

document.addEventListener("DOMContentLoaded", myApp.render);
