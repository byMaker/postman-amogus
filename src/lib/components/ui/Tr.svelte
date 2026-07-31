<script lang="ts">
	import type { Snippet } from 'svelte';
	import { highlightRow } from '$lib/actions/highlightRow';

	let { 
		children,
		id = null,
		class: className = ''
	} = $props<{
		children?: Snippet;
		id?: string | null;
		class?: string;
	}>();
</script>

<tr 
	{id} 
	use:highlightRow
	class="hover:bg-slate-50 transition-colors block lg:table-row p-4 lg:p-0 max-lg:border-b max-lg:border-slate-100 max-lg:last:border-b-0 group first:rounded-t-[32px] lg:first:rounded-none last:rounded-b-[32px] {className}"
>
	{@render children?.()}
</tr>
