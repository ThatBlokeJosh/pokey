<script lang="ts">
	function getHexaNumb() {
	    return Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")
	}
	let hex = getHexaNumb()
	let join = ""
</script>


<div class="bg-black text-white h-[100vh] my-auto grid justify-center items-center w-[100vw]">
	<div class="h-fit grid gap-[10px]">
		<h1 class="text-center text-9xl font-bold">Welcome to <span class="pokey rounded-md px-[10px] py-[5px] text-black"
			style:background-color={`#${hex}`}
			style:box-shadow={`0 0px 20px 5px #${hex}`}
		>Pokey ♠️</span></h1>
		<div class="flex gap-[20px]">
			<a href={`/${hex}`}><button class="bg-white rounded-md px-[10px] py-[5px] text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold hover:scale-110 duration-500">Create room</button></a>
			<input bind:value={join} type="text" placeholder="Room code" class="italic bg-white rounded-md px-[10px] py-[5px] text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold">
			<a href="/{join}"><button class="bg-white rounded-md px-[10px] py-[5px] text-black shadow-[0_0px_20px_5px_rgba(255,255,255,0.5)] font-bold hover:scale-110 duration-500">Join room</button></a>
		</div>
	</div>
</div>

<style>
	h1 {
		font-size: 3rem;
	}
	.pokey {
		font-size: 5rem;
	}
</style>
