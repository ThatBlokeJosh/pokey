import { json } from "@sveltejs/kit";
import { Deck, Draw, Evaluate, players } from "../../../utils/poker";
import { type Card, type Player, type Room } from "../../../utils/types";
import { rooms, GetRoom, UpdateRoom } from "../../../utils/rooms";


export async function GET(event) {
	let name = event.url.searchParams.get("name")
	let slug = event.url.toString().split("/")[3]
	let room = GetRoom(slug) 
	let player = room.players.get(name)
	return json({room, player})
}

export async function POST({request}) {
	let {name} = await request.json()
	let slug = request.url.toString().split("/")[3]
	let room = GetRoom(slug) 
	if (room.players.has(name)) {
		let player = room.players.get(name) 
		return json({room, player})
	}
	if (room.names.length === 0) {
		room.current = name
		Deck()
	}
	let hand = Draw(2, room.deck)
	let player: Player = {name: name, wallet: 1000, hand: hand, owes: 0}
	room.players.set(name, player)
	room.names.push(name)
	room.slug = slug
	UpdateRoom(slug, room)
	return json({room, player})
}

export async function PATCH({request}) {
	let {bet} = await request.json();
	let slug = request.url.toString().split("/")[3]
	let room = GetRoom(slug) 
	let player = room.players.get(room.current)
	player.wallet -= bet
	room.players.set(room.current, player)
	let b: number = +bet
	if (b) {
		room.pot += b
	}
	let raise = b - player?.owes
	room.players.forEach(p => {
		if (p.name != room.current) {
			p.owes += raise
		}
	})
	player.owes = 0
	room.index += 1
	room.current = room.names[room.index % room.names.length]
	if (room.current === room.names[0]) {
		room.turn += 1
		if (room.turn <= 5) {
			Draw(1, room.deck).forEach(card => {
				room.table.push(card)
			})
		}
		
	}
	UpdateRoom(slug, room)
	return json({room, player})
}


export function DELETE({request}) {
	let slug = request.url.toString().split("/")[3]
	let room = GetRoom(slug) 
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
	let room = GetRoom(slug) 
	room.turn = 0
	room.index = 0
	room.current = room.names[0]
	room.table = []
	room.top = ""
	room.rank = -1
	room.evaluated = false
	room.deck = Deck()
	room.players.forEach(player => {
		let hand = Draw(2, room.deck)
		player.hand = hand
		if (player?.wallet <= 0) {
			player.wallet = 1000
		}
		room.players.set(player.name, player)
	})
	UpdateRoom(slug, room)
	let returnPlayer = room.players.get(name)
	return json({room, player:returnPlayer})
}
