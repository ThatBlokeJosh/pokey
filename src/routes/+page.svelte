<script lang="ts">
	import CardComponent from "$lib/Card.svelte";
	import {deck, Draw, Evaluate, Deck} from "../utils/poker"
	import { scale } from "svelte/transition";
	import { Hand, type Card, Suit } from "../utils/types";
	Deck()
	let hand: Card[] = []
	Draw(5).forEach(card => {
		hand.push(card)
	})
	let ev = Hand[Hand.HighCard]
	$: {
		if (hand.length > 0) {
			ev = Hand[Evaluate(hand)]
		}
	}
	let pot = 86
</script>

<div class="bg-black text-white h-[100vh] my-auto grid justify-center">
<div class="h-fit flex justify-between px-[20px] m-[10px] items-center">
	<h1 class="font-bold text-xl"><span class="opacity-70 italic text-sm">Name: </span>ThatBlokeJosh</h1>
	<h1 class="text-xl font-bold text-black bg-white py-[5px] px-[10px] rounded-md w-fit h-fit shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)]"><span class="opacity-70 italic text-sm">Pot: </span>{pot}$</h1>
</div>
<div class="w-[100vw] grid justify-center items-center my-auto mx-auto h-fit gap-[15px]">
	<p class="mx-auto font-bold">{ev}</p>
	<div class="w-[100vw] h-fit my-auto flex justify-center items-center gap-[10px] duration-500"
		in:scale={{duration: 500}}
	>
		{#if hand.length > 0}
		{#each hand as card, i}
			<CardComponent type={card.type} suit={card.suit}/>
		{/each}
		{/if}
	</div>
	<button class="mt-[30px] bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={() => {
		Draw().forEach(card => {
			hand.push(card)
		});
		hand = hand
	}}>Draw</button>
</div>
</div>
