import { writable, type Writable } from "svelte/store"
import { type Card, type Type, type Player, Hand } from "./types"

export let innerDeck: Card[] = new Array() 
export let deck: Writable<Card[]> = writable(new Array())

export function AllSuits(type: Type): Card[] {
	let suits: Card[] = new Array()
	for (let i = 0; i <= 3; i++) {
		suits.push({suit: i, type: type})
	}
	return suits
}

export function Shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
};


export function Deck() {
	for (let i = 2; i <= 14; i++) {
		AllSuits(i).forEach(card => {
			innerDeck.push(card)
		})
	}
	deck.set(Shuffle(innerDeck))
}


deck.subscribe(d => {
	innerDeck = d
})

export function Draw(ammount: number = 1): Card[] {
	let drawn: Card[] = new Array()
	for (let i = 0; i < ammount; i++) {
		drawn.push(innerDeck[innerDeck.length-1])	
		deck.update(d => {
			d.pop()
			return d
		})
	}
	return drawn
}

export function Evaluate(hand: Card[]): Hand {
	let sameSuits = true
	let suit = hand[0].suit
	let counter: Map<Type, number> = new Map()
	for (let i = 0; i < hand.length; i++) {
		sameSuits = sameSuits && suit === hand[i].suit
		let curr = counter.get(hand[i].type)
		if (curr === undefined) {
			curr = 0
		}
		counter.set(hand[i].type, curr+1)
	}
	counter = new Map(new Map([...counter].sort((a, b) => a[0] - b[0])))
	let rank = Hand.HighCard
	let pairs = 0
	let straight = true
	let royal = true
	let lastK = 0
	if (counter.size < hand.length) {
		straight = false
		royal = false	
	}
	counter.forEach((v, k) => {
		if (lastK === 0) {
			lastK = k
			if (k != 10) {
				royal = false	
			}
		} else if (straight && lastK != k-1) {
			straight = false
			if (royal) {
				royal = false
			}
		}
		lastK = k
		if (v === 2) {
			pairs += 1
			if (pairs === 2) {
				rank = Hand.TwoPair
			} else if (rank === Hand.ThreeKind) {
				rank = Hand.FullHouse
			} else {
				rank = Hand.OnePair
			}
		} else if (v === 3) {
			if (rank === Hand.OnePair) {
				rank = Hand.FullHouse
			} else {
				rank = Hand.ThreeKind
			}
		} else if (v === 4) {
			rank = Hand.FourKind
		}	
	})
	if (straight) {
		if (sameSuits && royal) {
			return Hand.RoyalFlush
		}

		if (sameSuits) {
			return Hand.StraightFlush
		}
		return Hand.Straight
	}
	if (sameSuits && rank < Hand.Flush) {
		return Hand.Flush
	}
	return rank
}

export let players: Writable<Map<string, Player>> = writable(new Map())

export function Join(name: string) {
	players.update(map => {
		let hand = Draw(2)
		let player: Player = {name: name, wallet: 1000, hand: hand}
		map.set(name, player)
		return new Map(map)
	})
}

export function PlayerDraw(name: string) {
	players.update(map => {
		let player = map.get(name)
		Draw(1).forEach(card => {
			player?.hand.push(card)
		})
		if (player) {
			map.set(name, player)
		}
		return new Map(map)
	})
}

export function Bet(name: string, ammount: number) {
	players.update(map => {
		let player = map.get(name)
		if (player) {
			player.wallet -= ammount
			map.set(name, player)
		}
		return new Map(map)
	})
}
