import { json } from "@sveltejs/kit";
import { Deck, Draw, Evaluate } from "../../../utils/poker";
import { type Card, type Player, type Room } from "../../../utils/types";
import { rooms, GetRoom, UpdateRoom } from "../../../utils/rooms";

let room: Room

rooms.subscribe((r) => {
	if (room != undefined) {
		if (room.turn > 5 && !room.evaluated) {
			for (let i = 0; i < room.names.length; i++) {
				let name = room.names[i]
				let player = room.players.get(name)
				let hand = Evaluate([...player?.hand, ...room.table])
				if (hand > room.rank) {
					room.top = name
					let h = +hand
					room.rank = h
				}
			}
			let winner = room.players.get(room.top)
			if (winner) {
				winner.wallet += room.pot  
			}
			room.players.set(room.top, winner)
			room.pot = 0
			room.evaluated = true
			UpdateRoom(room.slug, room)
		}
	}
})

export async function GET(event) {
	let name = event.url.searchParams.get("name")
	let player = room.players.get(name)
	return json({room, player})
}

export async function POST({request}) {
	let {name} = await request.json()
	let slug = request.url.toString().split("/")[3]
	room = GetRoom(slug) 
	if (room.players.has(name)) {
		let player = room.players.get(name) 
		return json({room, player})
	}
	if (room.names.length === 0) {
		room.current = name
		Deck()
	}
	let hand = Draw(2)
	let player: Player = {name: name, wallet: 1000, hand: hand}
	room.players.set(name, player)
	room.names.push(name)
	room.slug = slug
	UpdateRoom(slug, room)
	return json({room, player})
}

export async function PATCH({request}) {
	let {bet} = await request.json();
	let slug = request.url.toString().split("/")[3]
	let player = room.players.get(room.current)
	player.wallet -= bet
	room.players.set(room.current, player)
	let b: number = +bet
	if (b) {
		room.pot += b
	}
	room.index += 1
	room.current = room.names[room.index % room.names.length]
	if (room.current === room.names[0]) {
		room.turn += 1
		if (room.turn <= 5) {
			Draw(1).forEach(card => {
				room.table.push(card)
			})
		}
		
	}
	UpdateRoom(slug, room)
	return json({room, player})
}


export function DELETE({request}) {
	let slug = request.url.toString().split("/")[3]
	room.names = []
	room.turn = 0
	room.current = ""
	room.pot = 0
	room.table = []
	room.players = new Map()
	UpdateRoom(slug, room)
	return json("sucker")
}

export async function PUT({request}) {
	let {name} = await request.json()
	let slug = request.url.toString().split("/")[3]
	room.turn = 0
	room.index = 0
	room.current = room.names[0]
	room.table = []
	room.top = ""
	room.rank = -1
	room.evaluated = false
	Deck()
	let player = room.players.get(name) 
	let hand = Draw(2)
	player.hand = hand
	if (player?.wallet <= 0) {
		player.wallet = 1000
	}
	room.players.set(name, player)
	UpdateRoom(slug, room)
	return json({room, player})
}
