<script lang="ts">
	import { toast } from '$lib/state/toast.svelte';
	import { fly } from 'svelte/transition';
	import { backOut, cubicIn } from 'svelte/easing';
</script>

<div class="toast toast-bottom toast-center z-[100] mb-4">
	{#each toast.toasts as t (t.id)}
		<div
			in:fly={{ y: 50, duration: 400, easing: backOut }}
			out:fly={{ y: 50, duration: 300, easing: cubicIn }}
			class="alert rounded-full shadow-2xl font-bold text-white px-8 py-4 border-none flex justify-center"
			class:bg-emerald-500={t.type === 'success'}
			class:bg-rose-500={t.type === 'error'}
			class:bg-blue-500={t.type === 'info'}
		>
			<span class="text-lg">{t.message}</span>
		</div>
	{/each}
</div>
