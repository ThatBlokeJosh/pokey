import { json } from "@sveltejs/kit";

let top = ""
let rank = -1

export function GET() {
	return json({top, rank})
}

export async function POST({request}) {
	let {name, hand} = await request.json()	
	if (hand > rank) {
		top = name
		let h = +hand
		rank = h
	}
	return json({top, rank})
}
