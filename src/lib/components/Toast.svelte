<script lang="ts">
	import { toast } from '$lib/state/toast.svelte';
	import { fly, fade } from 'svelte/transition';
</script>

<div class="toast toast-top toast-center z-[100] mt-4">
	{#each toast.toasts as t (t.id)}
		<div
			in:fly={{ y: -50, duration: 300 }}
			out:fade
			class="alert rounded-full shadow-lg font-bold text-white px-8 py-4 border-none flex items-center gap-3"
			class:bg-emerald-500={t.type === 'success'}
			class:bg-rose-500={t.type === 'error'}
			class:bg-blue-500={t.type === 'info'}
		>
			{#if t.type === 'success'}
				<span class="text-xl">✅</span>
			{:else if t.type === 'error'}
				<span class="text-xl">❌</span>
			{:else}
				<span class="text-xl">ℹ️</span>
			{/if}
			<span>{t.message}</span>
		</div>
	{/each}
</div>
