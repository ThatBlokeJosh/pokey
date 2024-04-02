<script lang="ts">
    	import { Suit, Type } from "../utils/types";
	import { scale } from "svelte/transition";
    	export let type: Type = Type.Ace
	export let suit: Suit = Suit.Heart
	export let r: number = 0
	export let m: number = 0
	function Icon(suit: Suit): string {
		if (suit === Suit.Heart) {
			return "♥️"
		} else if (suit === Suit.Diamond) {
			return "♦️"
		} else if (suit === Suit.Club) {
			return "♣️"
		}
		return "♠️"
	}

	let special: {[value: number]: string} = {
		11: "J",
		12: "Q",
		13: "K",
		14: "A"
	}

	function Letter(type: Type): string {
		if (type > 10) {
			return special[type]
		}
		return type.toString()
	}
	

</script>


<div class="card relative grid justify-between border-[1px] border-zinc-800 shadow-[0_0px_220px_2px_rgba(255,255,255,0.2)] w-[160px] rounded-xl h-[220px]"
	style:rotate={`${r}deg`}
	style:margin-left={`${m}px`}
	in:scale={{duration: 500}}
>
	<div class="flex p-[10px] rounded-md justify-between font-bold text-center items-center h-fit w-[155px]">
		<p class="">{Icon(suit)}</p>
		<p class="text-xl">{Letter(type)}</p>
	</div>

	<div class="flip absolute bottom-0 flex p-[10px] rounded-md justify-between font-bold text-center items-center h-fit w-[155px]">
		<p class="">{Icon(suit)}</p>
		<p class="text-xl">{Letter(type)}</p>
	</div>
</div>

<style>
      .flip {
        transform: scale(-1, -1);
        -moz-transform: scale(-1, -1);
        -webkit-transform: scale(-1, -1);
        -o-transform: scale(-1, -1);
        -ms-transform: scale(-1, -1);
        transform: scale(-1, -1);
      }
</style>
