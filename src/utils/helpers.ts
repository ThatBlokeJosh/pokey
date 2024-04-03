import { writable, type Writable } from "svelte/store";
import { Hand, type Card } from "./types";
import { Evaluate } from "./poker";

export let hand: Writable<Card[]> = writable(new Array())
export let pot: Writable<number> = writable(0)
export let current: Writable<string> = writable("")
export let winner: Writable<string> = writable("")
export let winnerHand: Writable<number> = writable(0)
export let turn: Writable<number> = writable(0)
export let userName: string = ""
export let url: string = ""

export async function Join(name: string, url: string) {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = {
	method: 'POST',
	headers: headers,
	body: JSON.stringify({name: name}),
	};
	let res = await fetch(`${url}/api`, requestOptions)
	res.json().then(data => {
		hand.set(data)
	})
	userName = name
}


export async function Check(name: string) {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = { method: 'GET', headers: headers }
	let res = await fetch(`${url}/api/?name=${name}`, requestOptions);
	res.json().then((data) => {
		current.set(data.current)
		pot.set(data.pot)
		turn.set(data.turn)
		hand.update(h => {
			data.drawn.forEach((card: Card) => {
				h.push(card)
			})
			return h
		})
	})
}


export async function Bet(ammount: number) {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = { method: 'PUT', headers: headers, body: JSON.stringify({bet: ammount}) }
	let res = await fetch(`${url}/api/`, requestOptions);
	res.json().then((data) => {
		pot.set(data.pot)
		turn.set(data.turn)
		current.set(data.current)
	})
}

export async function Ev(name: string, rank: number) {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = { method: 'POST', headers: headers, body: JSON.stringify({name: name, hand: rank}) }
	let res = await fetch(`${url}/api/evaluate`, requestOptions);
	res.json().then((data) => {
		winner.set(data.top)
		winnerHand.set(data.rank)
	})
}

export async function Status() {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const requestOptions = { method: 'GET', headers: headers}
	let res = await fetch(`http://${url}/api/evaluate`, requestOptions);
	res.json().then((data) => {
		winner.set(data.top)
		winnerHand.set(data.rank)
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

turn.subscribe(async (t) => {
	if (t === 4) {
		if (!evaluated)	{
			let rank = Hand.HighCard
			hand.subscribe(h => {
				rank = Evaluate(h)
			})
			await Ev(userName, rank)
		}
	}
})
