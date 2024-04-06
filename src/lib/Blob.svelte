<script lang="ts">
    import { fly } from "svelte/transition";

	export let x = 0
	export let y = 0
</script>

<div class="blur-[200px]">
	<div 
in:fly={{duration: 500}}
		class="blob w-[10vw] h-[10vw] duration-100 absolute rounded-full bg-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
		style:top={`${y}px`}
		style:left={`${x}px`}
	>
	</div>
</div>

<style>
	@keyframes rotate {
		from {
			rotate: 0deg;
		}
		
		to {
			rotate: 360deg;
		}
	}
	.blob {
		animation: rotate 20s infinite;
	}
</style>
