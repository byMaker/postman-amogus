<script lang="ts">
	import type { Snippet } from 'svelte';

	let { 
		children,
		class: className = '',
		isLast = false
	} = $props<{
		children?: Snippet;
		class?: string;
		isLast?: boolean;
	}>();
</script>

<td class="flex justify-between items-center lg:table-cell px-2 py-3 lg:px-6 lg:py-5 max-lg:border-b max-lg:border-b-slate-50 transition-colors {isLast ? 'lg:rounded-bl-[32px]' : ''} {className}">
	{@render children?.()}
</td>
