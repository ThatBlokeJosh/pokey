<script lang="ts">
	import CardComponent from "$lib/Card.svelte";
	import {deck, Draw, Evaluate, Deck} from "../utils/poker"
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
</script>

<div class="bg-black text-white h-[100vh] my-auto grid justify-center">
<div class="w-[100vw] grid justify-center items-center my-auto mx-auto h-fit gap-[10px]">
	<div class="w-[100vw] h-fit my-auto flex justify-center items-center gap-[10px]">
		{#if hand.length > 0}
		{#each hand as card, i}
			<CardComponent type={card.type} suit={card.suit}/>
		{/each}
		{/if}
	</div>
	<button class="bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto text-white rounded-lg py-[5px] px-[20px]" on:click={() => {
		Draw().forEach(card => {
			hand.push(card)
		});
		hand = hand
	}}>Draw</button>
	<p class="mx-auto font-bold">{ev}</p>
</div>
</div>
