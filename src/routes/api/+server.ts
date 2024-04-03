import { json } from "@sveltejs/kit";
import { Deck, Draw, innerDeck } from "../../utils/poker";
import { Card } from "../../utils/types";

let turn = 0
let pot:number = 0
let names: string[] = []
let index = 0
let current = ""
let lastDraw = ""


export async function GET(event) {
	let name = event.url.searchParams.get("name")
	let drawn: Card[] = new Array()
	if (turn === 4) {
		return json({current, pot, turn, drawn, names})
	}
	if (name === current) {
		if (lastDraw != name && turn > 0) {
			drawn = Draw(1)
			lastDraw = name
		}
		return json({current, pot, turn, drawn})
	}
	return json({current, pot, turn, drawn, names})
}

export async function POST({request}) {
	let {name} = await request.json()
	if (names.includes(name)) {
		return json([])
	}
	if (names.length === 0) {
		current = name
		Deck()
	}
	names.push(name)
	return json(Draw(2))
}

export async function PUT({request}) {
	let {bet} = await request.json();
	let b: number = +bet
	if (b) {
		pot += b
	}
	index += 1
	current = names[index % names.length]
	if (current === names[0]) {
		turn += 1
	}
	return json({pot, current, turn})
}


export function DELETE() {
	names = []
	turn = 0
	lastDraw = ""
	current = ""
	pot = 0
	return json("sucker")
}
