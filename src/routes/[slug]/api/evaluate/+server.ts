import { json } from "@sveltejs/kit";
import type { Room } from "../../../../utils/types";
import { GetRoom, UpdateRoom } from "../../../../utils/rooms";

let room: Room

export function GET({request}) {
	let slug = request.url.toString().split("/")[3]
	room = GetRoom(slug)
	return json({room})
}

export async function POST({request}) {
	let slug = request.url.toString().split("/")[3]
	room = GetRoom(slug)
	let {name, hand} = await request.json()	
	if (hand > room.rank) {
		room.top = name
		let h = +hand
		room.rank = h
	}
	UpdateRoom(slug, room)
	return json({room})
}

