import { writable, type Writable } from "svelte/store";
import { Hand, type Card, type Player, type Room } from "./types";
import { Evaluate } from "./poker";
import { rooms } from "./rooms";

export let room: Writable<Room> = writable()
export let player: Writable<Player> = writable()
export let players: Writable<Map<string, Player>> = writable(new Map())
export let hand: Writable<Card[]> = writable(new Array())
export let table: Writable<Card[]> = writable(new Array())
export let pot: Writable<number> = writable(0)
export let wallet: Writable<number> = writable(0)
export let current: Writable<string> = writable("")
export let winner: Writable<string> = writable("")
export let winnerHand: Writable<number> = writable(0)
export let turn: Writable<number> = writable(0)
export let userName: string = ""
export let url: string = ""

export async function Join(name: string, href: string) {
	url = href
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = {
	method: 'POST',
	headers: headers,
	body: JSON.stringify({name: name}),
	};
	let res = await fetch(`${url}/api`, requestOptions)
	res.json().then((data)=> {
		hand.set(data.player.hand)
		wallet.set(data.player.wallet)
		current.set(data.room.current)
		pot.set(data.room.pot)
		turn.set(data.room.turn)
		table.set(data.room.table)
		winner.set(data.room.top)
		winnerHand.set(data.room.rank)
		room.set(data.room)
		player.set(data.player)
	})
	userName = name
}


export async function Check(name: string) {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = { method: 'GET', headers: headers }
	let res = await fetch(`${url}/api/?name=${name}`, requestOptions);
	res.json().then((data) => {
		pot.set(data.room.pot)
		current.set(data.room.current)
		turn.set(data.room.turn)
		table.set(data.room.table)
		wallet.set(data.player.wallet)
		winner.set(data.room.top)
		winnerHand.set(data.room.rank)
		room.set(data.room)
		player.set(data.player)
		players.set(new Map(Object.entries(JSON.parse(data.players))))
	})
}


export async function Bet(ammount: number, fold:bool = false) {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = { method: 'PATCH', headers: headers, body: JSON.stringify({bet: ammount, fold: fold}) }
	let res = await fetch(`${url}/api/`, requestOptions);
	res.json().then((data) => {
		pot.set(data.room.pot)
		turn.set(data.room.turn)
		current.set(data.room.current)
		table.set(data.room.table)
		wallet.set(data.player.wallet)
		winner.set(data.room.top)
		winnerHand.set(data.room.rank)
		room.set(data.room)
		player.set(data.player)
		players.set(new Map(Object.entries(JSON.parse(data.players))))
	})
}

export async function NextRound(name: string) {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = {
	method: 'PUT',
	headers: headers,
	body: JSON.stringify({name: name}),
	};
	let res = await fetch(`${url}/api`, requestOptions)
	res.json().then((data)=> {
		pot.set(data.room.pot)
		hand.set(data.player.hand)
		wallet.set(data.player.wallet)
		current.set(data.room.current)
		turn.set(data.room.turn)
		table.set(data.room.table)
		winner.set(data.room.top)
		winnerHand.set(data.room.rank)
		room.set(data.room)
		player.set(data.player)
		players.set(new Map(Object.entries(JSON.parse(data.players))))
	})
}

export async function Ev(name: string, rank: number) {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = { method: 'POST', headers: headers, body: JSON.stringify({name: name, hand: rank}) }
	let res = await fetch(`${url}/api/evaluate`, requestOptions);
	res.json().then((data) => {
		winner.set(data.room.top)
		winnerHand.set(data.room.rank)
	})
}

export async function Status() {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = { method: 'GET', headers: headers}
	let res = await fetch(`${url}/api/evaluate`, requestOptions);
	res.json().then((data) => {
		winner.set(data.room.top)
		winnerHand.set(data.room.rank)
	})
}


export function Reset() {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = { method: 'DELETE', headers: headers}
	fetch(`${url}/api`, requestOptions);
	fetch(`${url}/api/evaluate`, requestOptions);
}

let evaluated = false

// turn.subscribe(async (t) => {
// 	if (t === 6) {
// 		if (!evaluated)	{
// 			let rank = Hand.HighCard
// 			hand.subscribe(h => {
// 				table.subscribe(t => {
// 					rank = Evaluate([...h, ...t])
// 				})
// 			})
//
// 			await Ev(userName, rank)
// 		}
// 	}
// })
