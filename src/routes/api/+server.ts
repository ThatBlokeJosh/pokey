import { json } from "@sveltejs/kit";

let turn = 0
let pot:number = 0

export function GET() {
	turn += 1
	return json({turn, pot})
}

export async function POST({request}) {
	let {bet} = await request.json();
	let b: number = +bet
	pot += b
	return json(pot)
}
