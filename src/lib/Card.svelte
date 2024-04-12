<script lang="ts">
    	import { Suit, Type } from "../utils/types";
	import { fly, scale } from "svelte/transition";
    	export let type: Type
	export let suit: Suit
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
	export let pattern = "cubes"
</script>


<div 
  class="card shadow-[0_0px_220px_2px_rgba(255,255,255,0.2)] {type === undefined && suit === undefined ? `${pattern} ` : ''} duration-500 relative grid justify-between border-[1px] border-zinc-800 w-[17vw] h-[20vh]  md:w-[160px] rounded-xl md:h-[220px]"
	style:rotate={`${r}deg`}
	style:margin-left={`${m}px`}
	in:fly={{duration: 1000}}
>
	{#if type != undefined && suit != undefined}
		<div class="flex p-[10px] rounded-md justify-between font-bold text-center items-center h-fit w-[16vw] md:w-[155px]">
			<p class="">{Icon(suit)}</p>
			<p class="text-xl">{Letter(type)}</p>
		</div>

		<div class="flip absolute bottom-0 flex p-[10px] rounded-md justify-between font-bold text-center w-[16vw] items-center h-fit md:w-[155px]">
			<p class="">{Icon(suit)}</p>
			<p class="text-xl">{Letter(type)}</p>
		</div>
		{:else}

		<div class="flex p-[10px] rounded-md justify-between font-bold text-center items-center h-fit md:w-[155px]">
		</div>

		<div class="flip absolute bottom-0 flex p-[10px] rounded-md justify-between font-bold text-center items-center h-fit md:w-[155px]">
		</div>
	{/if}
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

.cubes {
  --s: 60px; /* control the size */
  --c1: #333333;
  --c2: #111111;
  --c3: #444444;
  
  --_g: var(--c3) 0 120deg,#0000 0;
  background:
    conic-gradient(from -60deg at 50% calc(100%/3),var(--_g)),
    conic-gradient(from 120deg at 50% calc(200%/3),var(--_g)),
    conic-gradient(from  60deg at calc(200%/3),var(--c3) 60deg,var(--c2) 0 120deg,#0000 0),
    conic-gradient(from 180deg at calc(100%/3),var(--c1) 60deg,var(--_g)),
    linear-gradient(90deg,var(--c1)   calc(100%/6),var(--c2) 0 50%,
                          var(--c1) 0 calc(500%/6),var(--c2) 0);
  background-size: calc(1.732*var(--s)) var(--s);
}

.zigzag { 
  --s: 40px; /* control the size */
  --c1: #b2b2b2;
  --c2: #ffffff;
  --c3: #d9d9d9;
  
  --_s: calc(2*var(--s)) calc(2*var(--s));
  --_g1: var(--_s) conic-gradient(at calc(500%/6) 50%,var(--c3) 25%,#0000 0);
  --_g2: var(--_s) conic-gradient(at calc(200%/3) 50%,var(--c2) 25%,#0000 0);
  background:
    var(--s) var(--s)/var(--_g1),0 0/var(--_g1),
    var(--s) var(--s)/var(--_g2),0 0/var(--_g2),
    repeating-conic-gradient(var(--c1) 0 25%,#0000 0 50%) 0 0/var(--_s),
    linear-gradient(var(--c1) calc(100%/3),var(--c2) 0 calc(200%/3),var(--c3) 0)
     0 0/var(--s) var(--s); 
}


.aztec {
  --s: 120px; /* control the size */
  
  --_c: #ffffff /* color 1 */ 25%,#0000 0;
  --_g1: conic-gradient(at 62.5% 12.5%,var(--_c));
  --_g2: conic-gradient(at 87.5% 62.5%,var(--_c));
  --_g3: conic-gradient(at 25%   12.5%,var(--_c));
  background:
    var(--_g1) calc( var(--s)/-8) calc(var(--s)/2),var(--_g1) calc(-3*var(--s)/8) calc(var(--s)/4),
    var(--_g2) calc(3*var(--s)/8) calc(var(--s)/4),var(--_g2) calc(  var(--s)/-8) 0,
    var(--_g3) 0 calc(var(--s)/-4),var(--_g3) calc(var(--s)/-4) 0,
    conic-gradient(at 87.5% 87.5%,var(--_c)) calc(var(--s)/8) 0
    #b2b2b2; /* color 2 */
  background-size: var(--s) var(--s);
}


.diamonds {
  --s: 100px;   /* control the size */
  --c: #b2b2b2; /* first color */
  
  --_g1: 
    var(--c)   calc(25%/3) ,#0000 0 calc(50%/3),
    var(--c) 0 25%         ,#0000 0 75%,
    var(--c) 0 calc(250%/3),#0000 0 calc(275%/3),
    var(--c) 0;
  --_g2: 
    #0000   calc(25%/3) ,var(--c) 0 calc(50%/3),
    #0000 0 calc(250%/3),var(--c) 0 calc(275%/3),
    #0000 0;
  background:
    linear-gradient( 45deg,var(--_g2)),linear-gradient( 45deg,var(--_g1)),
    linear-gradient(-45deg,var(--_g2)),linear-gradient(-45deg,var(--_g1))
    #DAD6CA; /* second color */
  background-position: 0 0,var(--s) var(--s);
  background-size: calc(2*var(--s)) calc(2*var(--s));
}


.curves {
  --s: 50px; /* the size */
  --c: #000;
  
  --_s: calc(2*var(--s)) calc(2*var(--s));
  --_g: 35.36% 35.36% at;
  --_c: #0000 66%,#ffffff 68% 70%,#0000 72%;
  background:
    radial-gradient(var(--_g) 100% 25%,var(--_c)) var(--s) var(--s)/var(--_s),
    radial-gradient(var(--_g) 0    75%,var(--_c)) var(--s) var(--s)/var(--_s),
    radial-gradient(var(--_g) 100% 25%,var(--_c)) 0 0/var(--_s),
    radial-gradient(var(--_g) 0    75%,var(--_c)) 0 0/var(--_s),
    repeating-conic-gradient(var(--c) 0 25%,#0000 0 50%) 0 0/var(--_s),
    radial-gradient(var(--_c)) 0 calc(var(--s)/2)/var(--s) var(--s)
    var(--c);
}

.cubes2 {
  --s: 80px; /* control the size */
  --c1: #ffffff;
  --c2: #a1a1a1;
  
  --_g: var(--c1) 90deg,var(--c2) 0 135deg,#0000 0;
  background:
    conic-gradient(from  -45deg at calc(100%/3)   calc(100%/3)  ,var(--c1) 90deg,#0000 0 ),
    conic-gradient(from -135deg at calc(100%/3)   calc(2*100%/3),var(--_g)),
    conic-gradient(from  135deg at calc(2*100%/3) calc(2*100%/3),var(--_g)),
    conic-gradient(from   45deg at calc(2*100%/3) calc(100%/3)  ,var(--_g),var(--c1) 0 225deg,var(--c2) 0);
  background-size: var(--s) var(--s);
}


.hearts {
  --s: 80px; /* control the size */
  --c1: #e7525b;
  --c2: #ffffff;
  
  --_g: 80%,var(--c1) 25.4%,#0000 26%;
  background:
   radial-gradient(at 80% var(--_g)),
   radial-gradient(at 20% var(--_g)),
   conic-gradient(from -45deg at 50% 41%,var(--c1) 90deg,var(--c2) 0) 
      calc(var(--s)/2) 0;
  background-size: var(--s) var(--s);
}
</style>
