import { writable, type Writable } from "svelte/store";
import {type Room, type Card, type Player} from "./types"

export let rooms: Writable<Map<string, Room>> = writable(new Map())
let innerRooms: Map<string, Room> = new Map()

rooms.subscribe(r => {
	innerRooms = new Map()
	innerRooms = r
})

export function GetRoom(slug: string): Room {
	if (innerRooms.has(slug)) {
		return innerRooms.get(slug)
	}

	let turn = 0
	let pot:number = 0
	let names: string[] = []
	let index = 0
	let current = ""
	let table: Card[] = new Array()
	let players: Map<string, Player> = new Map()
	let top = ""
	let rank = -1
	let room: Room = {turn, pot, names, index, current, table, players, top, rank}
	rooms.update(r => {
		r.set(slug, room)
		return new Map(r)
	})
	return room
}

export function UpdateRoom(slug: string, room: Room) {
	rooms.update(r => {
		r.set(slug, room)
		return r
	})
}
