<script lang="ts">
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	type Option = {
		id: string;
		label: string;
		icon?: any;
		emoji?: string;
	};

	let { 
		options, 
		activeId = $bindable(),
		name = 'default' 
	} = $props<{ options: Option[], activeId: string, name?: string }>();

	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 300),
		fallback(node, params) {
			return {
				duration: 300,
				easing: quintOut,
				css: t => `opacity: ${t}`
			};
		}
	});
</script>

<div class="inline-flex bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner min-w-max w-full sm:w-auto">
	{#each options as option}
		{@const Icon = option.icon}
		<button 
			class="relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 {activeId === option.id ? 'text-amogus-dark' : 'text-slate-500 hover:text-amogus-dark'}" 
			onclick={() => activeId = option.id}
		>
			{#if activeId === option.id}
				<div class="absolute inset-0 bg-white rounded-full shadow-sm z-0" in:receive={{key: `active-tab-${name}`}} out:send={{key: `active-tab-${name}`}}></div>
			{/if}
			<span class="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap tracking-wide uppercase">
				{#if Icon}
					<Icon size={20} weight={activeId === option.id ? 'fill' : 'regular'} />
				{/if}
				{#if option.emoji}
					<span class="text-lg leading-none">{option.emoji}</span>
				{/if}
				{option.label}
			</span>
		</button>
	{/each}
</div>
