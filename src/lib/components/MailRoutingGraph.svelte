<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { t } from '$lib/i18n';

	let { sources, target, targetActive = true } = $props();

	let containerNode: HTMLElement;
	let targetNode: HTMLElement;
	let sourceNodes: Record<string, HTMLElement> = $state({});
	
	let paths: { d: string, color: string }[] = $state([]);

	let groupedSources = $derived([
		{ title: t('graph.direct'), items: sources.filter((s: any) => s.type === 'direct') },
		{ title: t('graph.alias'), items: sources.filter((s: any) => s.type === 'alias') },
		{ title: t('graph.domain_alias'), items: sources.filter((s: any) => s.type === 'domain_alias') }
	]);

	async function updatePaths() {
		await tick();
		if (!containerNode || !targetNode || Object.keys(sourceNodes).length === 0) return;

		const containerRect = containerNode.getBoundingClientRect();
		const targetRect = targetNode.getBoundingClientRect();
		
		// For elements inside an overflow container, their getBoundingClientRect is relative to the viewport.
		// To get their position relative to the scrollable content's (0,0), we do:
		// elem.top - container.top + container.scrollTop
		const targetX = targetRect.left - containerRect.left + containerNode.scrollLeft;
		const targetY = targetRect.top - containerRect.top + containerNode.scrollTop + targetRect.height / 2;

		const colorMap: Record<string, string> = {
			'direct': '#fbbf24', // amber-400
			'alias': '#0d9488', // teal-600
			'domain_alias': '#a78bfa' // violet-400
		};

		let newPaths = [];
		for (const source of sources) {
			const sourceNode = sourceNodes[source.id];
			if (!sourceNode) continue;
			
			const sourceRect = sourceNode.getBoundingClientRect();
			const sourceX = sourceRect.right - containerRect.left + containerNode.scrollLeft;
			const sourceY = sourceRect.top - containerRect.top + containerNode.scrollTop + sourceRect.height / 2;

			// Bezier curve
			const controlPointOffset = Math.max(50, (targetX - sourceX) / 2);
			const path = `M ${sourceX} ${sourceY} C ${sourceX + controlPointOffset} ${sourceY}, ${targetX - controlPointOffset} ${targetY}, ${targetX} ${targetY}`;
			newPaths.push({
				d: path,
				color: source.active === false ? '#cbd5e1' : (colorMap[source.type] || '#cbd5e1')
			});
		}
		paths = newPaths;
	}

	onMount(() => {
		updatePaths();
		
		// Update continuously during the first 600ms to sync with the modal's fly animation
		let ticks = 0;
		const interval = setInterval(() => {
			updatePaths();
			ticks++;
			if (ticks > 40) clearInterval(interval);
		}, 15);
		
		// Update on resize
		window.addEventListener('resize', updatePaths);
		return () => {
			clearInterval(interval);
			window.removeEventListener('resize', updatePaths);
		};
	});
</script>

<div 
	bind:this={containerNode} 
	onscroll={updatePaths}
	class="w-full h-[calc(100dvh-200px)] md:h-[600px] overflow-auto custom-scrollbar border border-slate-100 bg-slate-50 rounded-2xl"
>
	<div class="relative min-h-full min-w-[1000px] w-full flex justify-between">
		<!-- SVG Lines -->
		<svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style="z-index: 0;">
			{#each paths as path}
				<path 
					d={path.d} 
					fill="none" 
					stroke={path.color} 
					stroke-width="2" 
					stroke-linecap="round"
				/>
				<!-- Dot at the start (Left) -->
				<circle cx={path.d.split(' ')[1]} cy={path.d.split(' ')[2]} r="4" fill={path.color} />
				<!-- Dot at the end (Right) -->
				<circle cx={path.d.split(' ').slice(-2)[0]} cy={path.d.split(' ').slice(-1)[0]} r="4" fill={path.color} />
			{/each}
		</svg>

		<!-- Left Sources Column -->
		<div class="flex flex-col gap-8 z-10 w-96 pt-10 pl-8 pb-10">
			{#each groupedSources as group}
				{#if group.items.length > 0}
					<div class="flex flex-col gap-3">
						<h4 class="text-2xl text-amogus-dark pl-2 mb-1">{group.title}</h4>
						{#each group.items as source}
							<div class="relative flex items-center justify-center">
								{#if source.active === false}
									<div class="absolute -top-3 right-0 bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm z-20 border-2 border-white">{t('status.inactive')}</div>
								{/if}
								<div 
									bind:this={sourceNodes[source.id]}
									class="px-5 py-3 w-full rounded-full font-bold text-sm flex items-center justify-center cursor-default z-10 {source.active === false ? 'bg-slate-100 text-slate-400' : (source.type === 'direct' ? 'bg-amber-100 text-amber-800' : source.type === 'alias' ? 'bg-teal-100 text-teal-800' : 'bg-violet-100 text-violet-800')}"
								>
									{source.label}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>

		<!-- Right Target Column (Sticky) -->
		<div class="z-10 w-[450px] flex justify-center items-center py-10 pr-8 sticky top-0 h-[500px]">
			<div class="relative w-full flex items-center justify-center">
				{#if !targetActive}
					<div class="absolute -top-3 right-0 bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-xs font-bold shadow-sm z-20 border-2 border-white">{t('status.inactive')}</div>
				{/if}
				<div 
					bind:this={targetNode}
					class="px-6 py-5 rounded-full {targetActive ? 'bg-amogus-blue text-white' : 'bg-slate-300 text-slate-500'} font-bold w-full text-center text-xl tracking-wide"
				>
					{target}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: #cbd5e1;
		border-radius: 20px;
	}
</style>
