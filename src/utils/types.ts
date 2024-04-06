export enum Suit {
	Heart,
	Diamond,
	Spade,
	Club,
} 

export enum Type {
	Two = 2,
	Three = 3,
	Four = 4,
	Five = 5,
	Six = 6,
	Seven = 7,
	Eight = 8,
	Nine = 9,
	Ten = 10,
	Jack = 11,
	Queen = 12,
	King = 13,
	Ace = 14,
}

export type Card = {
	suit: Suit,
	type: Type,
}

export type Player = {
	name: string,
	wallet: number,
	hand: Card[],
}

export enum Hand {
	HighCard,
	OnePair,
	TwoPair,
	ThreeKind,
	Straight,
	Flush,
	FullHouse,
	FourKind,
	StraightFlush,
	RoyalFlush,
}

export type Room = {
	slug: string,
	evaluated: boolean,
	top: string,
	rank: number,
	turn: number,
	pot: number,
	names: string[],
	index: number,
	current: string,
	table: Card[],
	players: Map<string, Player>
}
