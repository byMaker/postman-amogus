<script lang="ts">
	import { toast } from '$lib/state/toast.svelte';
	import { fly } from 'svelte/transition';
	import { backOut, cubicIn } from 'svelte/easing';

	function flyEnvelope(node: HTMLElement, { delay = 0, duration = 600, easing = backOut, y = 150, rotate = -15 }) {
		return {
			delay,
			duration,
			easing,
			css: (t: number, u: number) => `
				transform: translateY(${u * y}px) rotate(${u * rotate}deg);
			`
		};
	}
</script>

<div class="toast toast-bottom toast-center z-[100] mb-6">
	{#each toast.toasts as t (t.id)}
		<div
			in:flyEnvelope={{ duration: 500, y: 200, rotate: -25, easing: backOut }}
			out:flyEnvelope={{ duration: 300, y: 200, rotate: 25, easing: cubicIn }}
			class="relative shadow-2xl font-bold px-10 py-5 flex justify-center items-center overflow-hidden rounded-xl bg-white w-max max-w-[90vw] mx-auto pointer-events-auto"
		>
			<!-- Airmail stripes border -->
			<div class="absolute inset-0 airmail-stripes opacity-90"></div>
			
			<!-- Inner white envelope background -->
			<div class="absolute inset-[6px] bg-white rounded-lg shadow-sm border border-slate-100"></div>
			
			<!-- Content -->
			<div class="relative z-10 flex items-center gap-4">
				{#if t.type === 'success'}
					<div class="bg-emerald-100 text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32Z"/></svg>
					</div>
				{:else if t.type === 'error'}
					<div class="bg-rose-100 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>
					</div>
				{:else}
					<div class="bg-sky-100 text-sky-600 rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-4 48a12 12 0 1 1 12 12a12 12 0 0 1-12-12Zm12 112a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 0 16Z"/></svg>
					</div>
				{/if}
				<span class="text-[17px] text-slate-800 tracking-wide mt-0.5">{t.message}</span>
			</div>
		</div>
	{/each}
</div>

<style>
	.airmail-stripes {
		background: repeating-linear-gradient(
			-45deg,
			#e11d48 0, /* rose-600 */
			#e11d48 18px,
			#ffffff 18px,
			#ffffff 36px,
			#0ea5e9 36px, /* sky-500 */
			#0ea5e9 54px,
			#ffffff 54px,
			#ffffff 72px
		);
	}
</style>
