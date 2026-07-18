<script lang="ts">
	import { fade } from 'svelte/transition';

	let { 
		text, 
		children, 
		position = 'bottom',
		align = 'center'
	} = $props<{
		text: string;
		children: any;
		position?: 'top' | 'bottom' | 'left' | 'right';
		align?: 'left' | 'center' | 'right';
	}>();

	let show = $state(false);
	let currentPosition = $state<'top' | 'bottom' | 'left' | 'right'>('bottom');
	let tooltipRef = $state<HTMLDivElement | null>(null);

	let hideTimeout: ReturnType<typeof setTimeout> | null = null;

	function handleMouseEnter() {
		if (hideTimeout) clearTimeout(hideTimeout);
		if (tooltipRef) {
			const rect = tooltipRef.getBoundingClientRect();
			if (position === 'bottom' && rect.bottom > window.innerHeight - 100) {
				currentPosition = 'top';
			} else if (position === 'top' && rect.top < 100) {
				currentPosition = 'bottom';
			} else {
				currentPosition = position;
			}
		} else {
			currentPosition = position;
		}
		show = true;
		hideTimeout = setTimeout(() => {
			show = false;
		}, 1500); // Hide after 1.5s
	}

	function handleMouseLeave() {
		if (hideTimeout) clearTimeout(hideTimeout);
		show = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
	class="relative inline-flex items-center justify-center" 
	bind:this={tooltipRef}
	onmouseenter={handleMouseEnter} 
	onmouseleave={handleMouseLeave}
>
	{@render children()}
	
	{#if show}
		<div 
			transition:fade={{ duration: 150 }}
			class={`absolute z-[9999] px-3 py-2 text-xs font-bold text-white bg-amogus-brown rounded-xl shadow-lg whitespace-nowrap pointer-events-none 
				${currentPosition === 'top' ? 'bottom-full mb-3' : ''}
				${currentPosition === 'bottom' ? 'top-full mt-3' : ''}
				${(currentPosition === 'top' || currentPosition === 'bottom') && align === 'center' ? 'left-1/2 -translate-x-1/2' : ''}
				${(currentPosition === 'top' || currentPosition === 'bottom') && align === 'right' ? 'right-0' : ''}
				${(currentPosition === 'top' || currentPosition === 'bottom') && align === 'left' ? 'left-0' : ''}
				${currentPosition === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-3' : ''}
				${currentPosition === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-3' : ''}
			`}
		>
			{text}
			<!-- Arrow -->
			<div 
				class={`absolute w-3 h-3 bg-amogus-brown rotate-45 
					${currentPosition === 'top' ? 'bottom-[-4px]' : ''}
					${currentPosition === 'bottom' ? 'top-[-4px]' : ''}
					${(currentPosition === 'top' || currentPosition === 'bottom') && align === 'center' ? 'left-1/2 -translate-x-1/2' : ''}
					${(currentPosition === 'top' || currentPosition === 'bottom') && align === 'right' ? 'right-3.5' : ''}
					${(currentPosition === 'top' || currentPosition === 'bottom') && align === 'left' ? 'left-3.5' : ''}
					${currentPosition === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
					${currentPosition === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
				`}
			></div>
		</div>
	{/if}
</div>
