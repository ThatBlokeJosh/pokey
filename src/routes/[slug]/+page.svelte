<script lang="ts">
	import CardComponent from "$lib/Card.svelte";
	import Blob from "$lib/Blob.svelte";
	import {Evaluate} from "../../utils/poker"
	import {hand, Check, pot, Bet, current, Join, turn, Status, winner, Reset, table, wallet, NextRound, room, player} from "../../utils/helpers"
	import { fly, scale } from "svelte/transition";
	import { Hand, type Card, Suit } from "../../utils/types";
	import { page } from "$app/stores";
	import { writable } from "svelte/store";
	import { GetName, SetName } from "../../utils/localStorage"
	let name = ""
	let open = false
	let nameOpen = false
	onMount(() => {
		name = GetName()
		open = name === ""
		nameOpen = name === ""
		if (name != "") {
			Join(name, $page.url.toString())
		}
	})
	function SplitEv(ev: string): string {
		let output = ""
		for (let i = 0; i < ev.length; i++) {
			if (ev[i].charCodeAt(0) < 97 && i > 0) {
				output += " "
			}
			output += ev[i]
		}
		return output
	}


	let ev = SplitEv(Hand[Hand.HighCard]) 
	$: {
		if ($hand.length > 0) {
			ev = SplitEv(Hand[Evaluate([...$hand, ...$table])])
		}
	}
	let betOpen = false
	import { source } from 'sveltekit-sse'
	import { onMount } from "svelte";
	source(`${$page.url.toString()}/api/stream`).select('message').subscribe(() => {
		if (name != "") {
			Check(name)	
		}
	}) 
	let x = 0
	let y = 0

	let patterns = ["cubes", "zigzag", "aztec", "diamonds", "curves", "cubes2", "hearts"]
	let call = writable(0)
	player.subscribe(p => {
		if (p) {
			call.set($player.owes);
		}
	})
</script>

{#if !open}
<Blob bind:x bind:y/>
{/if}

<!-- svelte-ignore a11y-autofocus -->
{#if open}
<div class="absolute flex justify-center items-center z-[50] w-[100vw] h-[100vh] backdrop-blur-[1000px]"
in:fly={{duration: 500}}
out:fly={{duration: 500}}
>
	{#if nameOpen}
		<input bind:value={name} type="text" autofocus placeholder="ThatBlokeJosh" class="w-[20vw] p-[10px] mx-auto rounded-md shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold text-center italic h-fit"
			on:keydown={(e) => {
				if (e.key.toString() === "Enter") {
					Join(name, $page.url.toString())
					open = false
					nameOpen = false
					SetName(name)
				}
			}}
		>
		{:else if betOpen}

		<div class="grid gap-[5px] mx-auto my-auto justify-center items-center"
			in:scale={{duration: 500}}
		>
			<h1 in:scale={{duration: 500}} class="text-xl font-bold text-black bg-white py-[5px] px-[10px] rounded-md w-fit h-fit shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)]"><span class="opacity-70 italic text-sm">Wallet: </span>{$wallet}$</h1>
			<input in:scale={{duration: 500}} type="text" inputmode="numeric" autofocus placeholder="100$" class="w-[20vw] p-[10px] mx-auto rounded-md shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold text-center italic h-fit"
				on:keydown={async (e) => {
					if (e.key.toString() === "Enter") {
						let ammount = +e.target.value + $call
						if (ammount && ammount <= $wallet && ammount > 0) {
							await Bet(Math.ceil(ammount))
						} else if (ammount && ammount > $wallet && ammount > 0) {
							await Bet($wallet)
						} 
						open = false
						betOpen = false
					}
				}}
			>
		</div>
	{/if}
</div>
{/if}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="bg-black text-white h-[100vh] my-auto grid justify-center overflow-hidden"
	on:mousemove={(e) => {
		x = e.clientX
		y = e.clientY
	}}
>	
<div class="h-fit z-[50] flex justify-between px-[20px] m-[10px] items-center">
	<h1 class="font-bold text-xl"><span class="opacity-70 italic text-sm">Name: </span>{name}</h1>
	{#if !open}
	<div class="flex gap-[10px]">
		<h1 class="text-xl font-bold text-black bg-white py-[5px] px-[10px] rounded-md w-fit h-fit shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)]"><span class="opacity-70 italic text-sm">Pot: </span>{$pot}$</h1>
		<h1 class="text-xl font-bold text-black bg-white py-[5px] px-[10px] rounded-md w-fit h-fit shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)]"><span class="opacity-70 italic text-sm">Wallet: </span>{$wallet}$</h1>
		<h1 class="text-xl font-bold text-white py-[5px] px-[10px] rounded-md w-fit h-fit bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"><span class="opacity-80 italic text-sm">Turn: </span>{$turn}</h1>
	</div>
	{/if}
</div>
	{#if $winner}
		<div in:scale={{duration: 500, delay: 500}} out:scale={{duration: 500}} class="relative mx-auto text-xl font-bold text-white py-[5px] px-[10px] rounded-md w-fit h-fit {$winner === name ? 'bg-green-500 shadow-[0_0px_20px_5px_rgba(0,255,0,0.5)]' : 'bg-red-500 shadow-[0_0px_20px_5px_rgba(255,0,0,0.5)]'}">
			<h1 class=""><span class="opacity-90 italic text-sm">Winner: </span>{$winner}</h1>
			<p class="absolute top-[-15px] right-[-17px] rotate-[45deg] text-[30px]">{$winner === name ? "👑" : "🤡"}</p>
		</div>
	{/if}
	{#if $current && !$winner && $room}
		<div class="flex gap-[5px] w-fit mx-auto" in:scale={{duration: 500, delay: 1500}} out:scale={{duration: 500}}>
			{#each $room.names as player}
				{#if player != name}
					<h1 class="text-xl mx-auto font-bold text-white duration-500 {$current === player ? 'bg-yellow-500 shadow-[0_0px_20px_5px_rgba(255,255,0,0.5)]' : 'bg-gray-500 shadow-[0_0px_20px_5px_rgba(128,128,128,0.5)]'} py-[5px] px-[10px] rounded-md w-fit h-fit  z-[30]">
						<span class="opacity-90 italic text-sm">{$current === player ? "Current player: " : "Player: "}</span>{player}
					</h1>
					{:else}
					<h1 class="text-xl mx-auto font-bold text-white duration-500 {$current === name ? 'bg-green-500 shadow-[0_0px_20px_5px_rgba(0,255,0,0.5)]' : 'bg-red-500 shadow-[0_0px_20px_5px_rgba(255,0,0,0.5)]'} py-[5px] px-[10px] rounded-md w-fit h-fit  z-[30]">
						<span class="opacity-90 italic text-sm">{$current === player ? "Current player: " : "Player: "}</span>You
					</h1>
				{/if}
			{/each}	
		</div>
	{/if}
	<div class="h-fit my-auto flex justify-center items-center gap-[10px] duration-500 table-cards"
		in:scale={{duration: 500}}
	>
		{#each $table as card}
			<CardComponent type={card.type} suit={card.suit}/>
		{/each}
		{#each {length: 5} as _, i}
			{#if !$table[i]}
				<CardComponent/>
			{/if}
		{/each}
	</div>
<div class="w-[100vw] grid justify-center items-center my-auto mx-auto h-fit gap-[15px] z-[30]">
	{#if $hand.length > 0}
		<p class="mx-auto font-bold"
			in:scale={{duration: 500, delay: 500}}
		><span class="opacity-70 italic text-sm">Evaluation:</span> {ev}</p>
	{/if}
	<div class="w-[100vw] h-fit my-auto flex justify-center items-center gap-[10px] duration-500"
		in:scale={{duration: 500}}
	>
		{#each $hand as card}
			<CardComponent type={card.type} suit={card.suit}/>
		{/each}
	</div>
	{#if $hand.length > 0}
	<div class="mt-[30px] w-fit mx-auto flex gap-[20px]"
		in:scale={{duration: 500, delay: 1000}}
	>
		{#if $turn < 6}
			<button class="{$current === name ? '' : 'pointer-events-none cursor-not-allowed opacity-50'} hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={async () => {
				if ($current === name) {
					await Bet($call)
				}
			}}>{$call > 0 ? `Call ${$call}$` : "Check"}</button>
			<button class="{$current === name || $wallet <= 0 ? '' : 'pointer-events-none cursor-not-allowed opacity-50'} hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={async () => {
				if ($current === name) {
					open = true
					betOpen = true
				}
			}}>{$call > 0 ? "Raise" : "Bet"}</button>
			<!-- <button class="hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={async () => { -->
			<!-- }}>Fold</button> -->
		{:else}
			<button class="hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={() => {
				Reset()
			}}>Delete Room</button>
			<button class="hover:scale-110 duration-500 bg-white text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)] font-bold w-fit mx-auto my-auto rounded-lg py-[5px] px-[20px]" on:click={() => {
				NextRound(name)
			}}>Next Round</button>
		{/if}
	</div>
	{/if}
</div>
</div>

<style>
	.table-cards {
		scrollbar-width: none;
		overflow: scroll;
	}
</style>
