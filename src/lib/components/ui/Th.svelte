<script lang="ts">
	import type { Snippet } from 'svelte';

	let { 
		children,
		onclick,
		class: className = '',
		sortable = false,
		align = 'left'
	} = $props<{
		children?: Snippet;
		onclick?: () => void;
		class?: string;
		sortable?: boolean;
		align?: 'left' | 'right' | 'center';
	}>();
</script>

<th 
	class="px-6 py-5 select-none transition-colors {sortable ? 'cursor-pointer hover:text-amogus-blue' : ''} text-{align} {className}" 
	{onclick}
>
	{@render children?.()}
</th>
