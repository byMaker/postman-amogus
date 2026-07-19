<script lang="ts">
	import { CaretUp } from "phosphor-svelte";
	import { fly } from "svelte/transition";

	let showFab = $state(false);

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
</script>

<svelte:window onscroll={() => showFab = window.scrollY > window.innerHeight * 1.5} />

{#if showFab}
	<button 
		onclick={scrollToTop}
		transition:fly={{ y: 20, duration: 200 }}
		class="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-amogus-blue text-white shadow-lg hover:bg-amogus-brown hover:-translate-y-1 transition-all flex items-center justify-center active:scale-95"
		aria-label="Scroll to top"
	>
		<CaretUp size={24} weight="bold" />
	</button>
{/if}
