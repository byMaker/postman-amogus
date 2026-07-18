<script lang="ts">
	import { backOut } from 'svelte/easing';
	import { X, Gear, Info } from 'phosphor-svelte';

	let { show = $bindable(false) } = $props();

	let activeTab = $state('general');

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

	function flyModal(node: HTMLElement, { delay = 0, duration = 400, easing = backOut, y = 40, rotate = -3 }) {
		return {
			delay,
			duration,
			easing,
			css: (t: number) => {
				const rotation = (1 - t) * rotate;
				const translateY = (1 - t) * y;
				return `
					transform: translateY(${translateY}px) rotate(${rotation}deg);
					opacity: ${t};
				`;
			}
		};
	}
</script>

{#if show}
	<!-- Backdrop -->
	<div 
		class="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity"
		onclick={close}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && close()}
	></div>

	<!-- Modal Box -->
	<div class="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
		<div 
			class="pointer-events-auto relative w-full max-w-4xl bg-white shadow-2xl rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]"
			transition:flyModal={{ duration: 400 }}
		>
			<!-- Airmail decorative top border -->
			<div class="h-3 w-full" style="background: repeating-linear-gradient(45deg, #e11d48 0px, #e11d48 15px, transparent 15px, transparent 30px, #0284c7 30px, #0284c7 45px, transparent 45px, transparent 60px);"></div>
			
			<!-- Header -->
			<div class="border-b-2 border-slate-100 bg-slate-50/50 p-6 pb-0 flex flex-col gap-4">
				<div class="flex justify-between items-start">
					<div class="flex items-center gap-3 text-amogus-dark">
						<div class="p-2 bg-slate-100 rounded-full">
							<Gear size={32} weight="fill" class="text-slate-600" />
						</div>
						<div>
							<div class="font-sans text-3xl font-black uppercase tracking-widest text-amogus-dark">Settings</div>
							<p class="text-slate-400 font-mono text-xs uppercase tracking-widest mt-1">Реквизиты почтового письма</p>
						</div>
					</div>
					<button 
						onclick={close}
						class="text-slate-400 hover:text-amogus-brown hover:bg-orange-50 p-2 rounded-full transition-colors"
					>
						<X size={28} weight="bold" />
					</button>
				</div>

				<!-- Tabs -->
				<div class="flex gap-2 mt-4 font-mono text-sm uppercase font-bold">
					<button 
						class="px-6 py-3 border-t-2 border-l-2 border-r-2 transition-colors rounded-t-[16px] {activeTab === 'general' ? 'border-slate-200 bg-white text-amogus-blue' : 'border-transparent text-slate-400 hover:bg-slate-100'}"
						onclick={() => activeTab = 'general'}
					>
						<div class="flex items-center gap-2"><Gear size={18} weight="bold"/> General</div>
					</button>
					<button 
						class="px-6 py-3 border-t-2 border-l-2 border-r-2 transition-colors rounded-t-[16px] {activeTab === 'about' ? 'border-slate-200 bg-white text-amogus-blue' : 'border-transparent text-slate-400 hover:bg-slate-100'}"
						onclick={() => activeTab = 'about'}
					>
						<div class="flex items-center gap-2"><Info size={18} weight="bold"/> About</div>
					</button>
				</div>
			</div>

			<!-- Content Area -->
			<div class="p-8 overflow-y-auto font-sans text-slate-700 flex-1">
				{#if activeTab === 'general'}
					<div class="space-y-8 animate-in fade-in duration-300">
						<div>
							<div class="font-sans text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
								System Configuration
							</div>
							<p class="text-slate-500 mb-6">Manage global preferences and operational settings for your Postman Amogus instance.</p>
							
							<div class="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-4">
								<div class="flex items-center justify-between">
									<div>
										<div class="font-sans font-bold text-slate-700">Strict Anti-Spam Mode</div>
										<p class="text-sm text-slate-500">Automatically reject emails with Rspamd scores higher than 15.</p>
									</div>
									<input type="checkbox" class="toggle toggle-amogus" checked />
								</div>
								<div class="divider my-2 border-slate-100"></div>
								<div class="flex items-center justify-between">
									<div>
										<div class="font-sans font-bold text-slate-700">Enable Daily Analytics Report</div>
										<p class="text-sm text-slate-500">Send an aggregated statistical report to the postmaster daily.</p>
									</div>
									<input type="checkbox" class="toggle toggle-amogus" />
								</div>
							</div>
						</div>
					</div>
				{:else if activeTab === 'about'}
					<div class="space-y-6 animate-in fade-in duration-300 flex flex-col items-center justify-center py-12 text-center">
						<img src="/postman_amogus_logo_small.png" alt="Logo" class="w-32 h-32 rounded-full shadow-md border-4 border-white mb-4" />
						<div>
							<div class="font-sans text-3xl font-black text-amogus-dark uppercase tracking-wide">Postman Amogus</div>
							<p class="text-slate-400 font-mono mt-2">v1.4.0 "Rapid Delivery"</p>
						</div>
						<p class="max-w-md text-slate-600 leading-relaxed">
							A robust, highly tactical mail administration dashboard. 
							Built with SvelteKit, powered by Exim, Dovecot, and Rspamd.
						</p>
						
						<div class="mt-8 grid grid-cols-2 gap-4 w-full max-w-md font-mono text-sm">
							<div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
								<div class="text-slate-400 uppercase text-xs font-bold mb-1">Developer</div>
								<div class="text-slate-700 font-bold">byMaker Team</div>
							</div>
							<div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
								<div class="text-slate-400 uppercase text-xs font-bold mb-1">License</div>
								<div class="text-slate-700 font-bold">Proprietary</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="border-t border-slate-100 bg-slate-50 p-4 flex justify-end gap-4 rounded-b-[32px]">
				<button onclick={close} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6">Close</button>
				{#if activeTab === 'general'}
					<button class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">Apply Settings</button>
				{/if}
			</div>
			
			<!-- Airmail decorative bottom border -->
			<div class="h-3 w-full" style="background: repeating-linear-gradient(45deg, #0284c7 0px, #0284c7 15px, transparent 15px, transparent 30px, #e11d48 30px, #e11d48 45px, transparent 45px, transparent 60px);"></div>
		</div>
	</div>
{/if}
