<script lang="ts">
	import { page } from '$app/stores';
	import { Ghost } from 'phosphor-svelte';
</script>

<div class="flex flex-col items-center p-8 text-center mt-12">
	<div class="mb-2 text-rose-500 opacity-90 hover:opacity-100 transition-opacity duration-300">
		<Ghost size={120} weight="duotone" class="animate-bounce" style="animation-duration: 3s;" />
	</div>
	
	<p class="text-2xl text-slate-600 font-medium max-w-xl mx-auto mb-1 leading-relaxed">
		{#if $page.status === 404}
			Looks like this page got lost in the mail.
		{:else if $page.status === 500}
			Oops! Something broke on our end. Please try again later.
		{:else}
			{$page.error?.message || 'An unexpected error occurred.'}
		{/if}
	</p>

	<div class="text-sm font-semibold text-slate-400/70 uppercase tracking-widest">
		Error Code: {$page.status}
	</div>
</div>
