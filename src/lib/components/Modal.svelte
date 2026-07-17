<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';

	let {
		show = $bindable(false),
		title,
		children
	}: {
		show: boolean;
		title: string;
		children: Snippet;
	} = $props();

	function close() {
		show = false;
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<!-- Затемненный фон -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
			in:fade={{ duration: 300, easing: cubicOut }} 
			out:fade={{ duration: 200 }}
			onclick={close}
		></div>

		<!-- Само окно -->
		<div 
			class="relative z-10 w-full max-w-xl rounded-[40px] bg-white p-10 shadow-2xl border border-slate-100"
			in:fly={{ y: 40, duration: 400, easing: backOut }}
			out:fly={{ y: 20, duration: 200, opacity: 0 }}
		>
			<h3 class="font-black text-3xl text-[#1E3A8A] mb-8">{title}</h3>
			{@render children()}
		</div>
	</div>
{/if}
