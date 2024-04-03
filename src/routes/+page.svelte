<script lang="ts">
	import CardComponent from "$lib/Card.svelte";
	import {deck, Draw, Evaluate, Deck} from "../utils/poker"
	import {hand, Check, pot, Bet, current, Join, turn, Status, winner, Reset} from "../utils/helpers"
	import { scale } from "svelte/transition";
	import { Hand, type Card, Suit } from "../utils/types";
	import { page } from "$app/stores";
	let name = ""
	let ev = Hand[Hand.HighCard]
	$: {
		if ($hand.length > 0) {
			ev = Hand[Evaluate($hand)]
		}
	}
	let open = true
	let betOpen = false
	let nameOpen = true
</script>


{#if open}
<div class="absolute flex justify-center items-center z-[50] w-[100vw] h-[100vh]">
	{#if nameOpen}
		<input bind:value={name} type="text" placeholder="ThatBlokeJosh" class="w-[20vw] p-[10px] mx-auto rounded-md shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold text-center italic h-fit"
			on:keydown={(e) => {
				if (e.key.toString() === "Enter") {
					Join(name, $page.url.origin)
					open = false
					nameOpen = false
				}
			}}
		>
		{:else if betOpen}

		<input type="number" placeholder="100$" class="w-[20vw] p-[10px] mx-auto rounded-md shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold text-center italic h-fit"
			on:keydown={async (e) => {
				if (e.key.toString() === "Enter") {
					let ammount = +e.target.value
					if (ammount) {
						await Bet(ammount)
					}
					open = false
					betOpen = false
				}
			}}
		>
	{/if}
</div>
{/if}
<div class="bg-black text-white h-[100vh] my-auto grid justify-center">
<div class="h-fit flex justify-between px-[20px] m-[10px] items-center">
	<h1 class="font-bold text-xl"><span class="opacity-70 italic text-sm">Name: </span>{name}</h1>
	<div class="flex gap-[10px]">
		<h1 class="text-xl font-bold text-black bg-white py-[5px] px-[10px] rounded-md w-fit h-fit shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)]"><span class="opacity-70 italic text-sm">Pot: </span>{$pot}$</h1>
		<h1 class="text-xl font-bold text-black bg-white py-[5px] px-[10px] rounded-md w-fit h-fit shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)]"><span class="opacity-70 italic text-sm">Current: </span>{$current}</h1>
		<h1 class="text-xl font-bold text-black bg-white py-[5px] px-[10px] rounded-md w-fit h-fit shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)]"><span class="opacity-70 italic text-sm">Turn: </span>{$turn}</h1>
		<h1 class="text-xl font-bold text-black bg-white py-[5px] px-[10px] rounded-md w-fit h-fit shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)]"><span class="opacity-70 italic text-sm">Winner: </span>{$winner}</h1>
	</div>
</div>
<div class="w-[100vw] grid justify-center items-center my-auto mx-auto h-fit gap-[15px]">
	<p class="mx-auto font-bold">{ev}</p>
	<div class="w-[100vw] h-fit my-auto flex justify-center items-center gap-[10px] duration-500"
		in:scale={{duration: 500}}
	>
		{#if $hand.length > 0}
		{#each $hand as card}
			<CardComponent type={card.type} suit={card.suit}/>
		{/each}
		{/if}
	</div>
	<div class="mt-[30px] w-fit mx-auto flex gap-[50px]">
		{#if $turn < 4}
			<button class="hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={async () => {
				if ($current === name) {
					await Bet(0)
				}
			}}>Check</button>
			<button class="hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={async () => {
				if ($current === name) {
					open = true
					betOpen = true
				}
			}}>Bet</button>
			<button class="hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={async () => {
			}}>Fold</button>
		{:else}
			<button class="hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={() => {
				Reset()
			}}>Replay</button>
		{/if}
		<button class="hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={async () => {
			if (name != "" && $turn < 4) {
				Check(name)
			} else if ($turn >= 4){
				Status()
			}
		}}>Update</button>
	</div>
</div>
</div>
