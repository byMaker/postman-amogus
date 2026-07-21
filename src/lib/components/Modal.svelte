<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';
	import { X } from 'phosphor-svelte';

	let {
		show = $bindable(false),
		title,
		maxWidth = "max-w-xl",
		children
	}: {
		show: boolean;
		title: string;
		maxWidth?: string;
		children: Snippet;
	} = $props();

	function close() {
		show = false;
	}

	$effect(() => {
		if (show) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	function flyModal(node: HTMLElement, { delay = 0, duration = 400, easing = backOut, y = 40, rotate = -5 }) {
		const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
		const r = isMobile ? 0 : rotate;
		const slideY = isMobile ? 100 : y;
		const activeEasing = isMobile ? cubicOut : easing;
		return {
			delay,
			duration,
			easing: activeEasing,
			css: (t: number, u: number) => `
				transform: translateY(${u * slideY}px) rotate(${u * r}deg);
				opacity: ${t};
			`
		};
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
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
			class="relative z-10 w-full {maxWidth} rounded-t-[40px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-auto max-h-[95dvh] md:max-h-[90vh]"
			in:flyModal={{ y: 60, duration: 500, rotate: -3, easing: backOut }}
			out:flyModal={{ y: 40, duration: 300, rotate: 3, easing: cubicOut }}
		>
			<!-- Airmail stripes border -->
			<div class="absolute inset-0 airmail-stripes opacity-90 pointer-events-none"></div>
			
			<!-- Inner white envelope background -->
			<div class="absolute inset-x-[6px] top-[6px] bottom-0 md:inset-[8px] bg-white rounded-t-[34px] md:rounded-[32px] shadow-sm pointer-events-none"></div>

			<!-- Контент окна -->
			<div class="relative z-10 flex flex-col w-full max-h-full overflow-hidden">
				<!-- Фиксированная шапка -->
				<div class="shrink-0 px-6 pt-6 md:px-10 md:pt-10 pb-4 md:pb-6 flex justify-between items-start">
					<h3 class="text-3xl md:text-4xl text-amogus-dark m-0 pr-4">{title}</h3>
					<button 
						type="button" 
						class="p-2 -mr-2 -mt-2 rounded-full text-slate-400 hover:text-amogus-brown hover:bg-orange-50 transition-colors shrink-0"
						onclick={close}
					>
						<X size={24} weight="bold" />
					</button>
				</div>
				
				<!-- Скроллируемое тело -->
				<div class="flex-1 overflow-y-auto px-6 pb-6 md:px-10 md:pb-10">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.airmail-stripes {
		background: repeating-linear-gradient(
			-45deg,
			#e11d48 0, /* rose-600 */
			#e11d48 24px,
			#ffffff 24px,
			#ffffff 48px,
			#0ea5e9 48px, /* sky-500 */
			#0ea5e9 72px,
			#ffffff 72px,
			#ffffff 96px
		);
	}
</style>
