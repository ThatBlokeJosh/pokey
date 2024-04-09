<script lang="ts">
	import Blob from "$lib/Blob.svelte";
	import CardComponent from "$lib/Card.svelte";
	import { onMount } from "svelte";
	import { GetName, SetName } from "../utils/localStorage";
	import { fly, scale } from "svelte/transition";
	import { Deck, Draw } from "../utils/poker";
	function getHexaNumb() {
	    return Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")
	}
	let hex = getHexaNumb()
	let join = ""
	let x = 0
	let y = 0

	let name = ""
	let open = false
	let nameOpen = false
	onMount(() => {
		name = GetName()
		open = name === ""
		nameOpen = name === ""
	})
	let deck = Deck()
	let hand = Draw(5, deck)
	$: innerWidth = 0
	$: innerHeight = 0
</script>

<svelte:window bind:innerWidth bind:innerHeight/>


{#if !open}
	<Blob bind:x bind:y/>
{/if}


{#if innerWidth > 0}
	{#each hand as card, i}
		<div
			class="w-fit h-fit text-white absolute" style:top={`${(Math.floor(innerHeight/2)-110)}px`} style:left={`${Math.floor(((Math.floor(innerWidth/2)-((hand.length/2)*220))+i*220))}px`}
			style:rotate={`${-30 + (i*15)}deg`}
			transition:scale|global={{duration:500, delay: 500*i}}
		>
			<CardComponent type={card.type} suit={card.suit}/>
		</div>
	{/each}
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
					open = false
					nameOpen = false
					SetName(name)
				}
			}}
		>
	{/if}
</div>
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="bg-black text-white h-[100vh] my-auto grid justify-center items-center w-[100vw]"
on:mousemove={(e) => {
	x = e.clientX
	y = e.clientY
}}
>

	<div class="absolute top-[10px] left-[10px] px-[10px] flex gap-[10px]">
		<h1 class="font-bold text-2xl z-[50]"><span class="opacity-70 italic text-lg">Name: </span>{name}</h1>
		<button class="hover:scale-[1.2] duration-200 my-auto mx-auto bg-white rounded-md w-[30px] h-[30px] text-center shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)]" 
			on:click={() => {open = true; nameOpen = true}}><i class="fa-solid text-[16px] text-center grid justify-center items-center self-center mx-auto my-auto text-black fa-pen"></i></button>
	</div>
	<div class="h-fit grid gap-[20px] z-[30]">
		<div class="relative w-fit mx-auto text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 m-[10px] rounded-md px-[20px] py-[10px]">
			<div class="absolute z-[-50] top-0 left-0 h-full w-full blur-xl bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-md">
				<p class="text-[7rem]"><span class="opacity-80 italic text-5xl">Welcome to </span>Pokey!</p> 
			</div>
			<p class="text-[7rem]"><span class="opacity-80 italic text-5xl">Welcome to </span>Pokey!</p> 
		</div>
		<div class="flex gap-[20px]">
			<a href={`/${hex}`}><button class="bg-white rounded-md px-[10px] py-[5px] text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold hover:scale-110 duration-500">Create room</button></a>
			<div class="grid justify-center items-center gap-[10px]">
				<input bind:value={join} type="text" placeholder="Room code" class="italic bg-white rounded-md px-[10px] py-[5px] text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold">
				<p class="text-xs italic opacity-80">I am not liable for dumb decissions made while playing this game</p>
			</div>
			<a href="/{join}"><button class="bg-white rounded-md px-[10px] py-[5px] text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold hover:scale-110 duration-500">Join room</button></a>
		</div>
	</div>

	<div class="absolute bottom-[10px] right-[10px] px-[10px] flex gap-[10px] items-center">
		<p class="text-sm font-bold italic opacity-80">Courtesy of ThatBlokeJosh, made with ❤️ and ☕</p>
		<a href="https://github.com/ThatBlokeJosh">
			<button class="hover:scale-[1.2] duration-200 my-auto mx-auto bg-white rounded-md w-[30px] h-[30px] text-center shadow-[0_0px_20px_5px_rgba(255,255,255,0.3)]"> 
				<i class="fa-brands text-[16px] text-center grid justify-center items-center self-center mx-auto my-auto text-black fa-github"></i>
			</button> 
		</a>
	</div>
</div>

<style>
</style>
