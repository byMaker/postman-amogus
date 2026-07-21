<script lang="ts">
	import { backOut } from 'svelte/easing';
	import { X, Gear, Info, Translate, GithubLogo, FileText } from 'phosphor-svelte';
	import licenseText from '../../../LICENSE?raw';
	import { t } from '$lib/i18n';
	import { settings } from '$lib/stores/settings.svelte';

	let { show = $bindable(false), activeTab = $bindable('general') } = $props();
	let showLicense = $state(false);

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
	<div class="fixed inset-0 z-[101] flex items-center justify-center p-0 md:p-4 pointer-events-none">
		<div 
			class="pointer-events-auto relative w-full max-w-4xl bg-white shadow-2xl rounded-none md:rounded-[32px] overflow-hidden flex flex-col h-[100dvh] md:h-auto max-h-[100dvh] md:max-h-[90vh]"
			transition:flyModal={{ duration: 400 }}
		>
			<!-- Airmail decorative top border -->
			<div class="h-3 w-full" style="background: repeating-linear-gradient(45deg, #e11d48 0px, #e11d48 15px, transparent 15px, transparent 30px, #0284c7 30px, #0284c7 45px, transparent 45px, transparent 60px);"></div>
			
			<!-- Header -->
			<div class="border-b border-slate-100 bg-slate-50/50 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div class="flex justify-between items-start w-full md:w-auto">
					<div class="flex items-center gap-3 text-amogus-dark">
						<div class="p-2 bg-slate-100 rounded-full shrink-0">
							{#if activeTab === 'general'}
								<Gear size={32} weight="fill" class="text-slate-600" />
							{:else}
								<Info size={32} weight="fill" class="text-slate-600" />
							{/if}
						</div>
						<div>
							<div class="font-sans text-2xl md:text-3xl font-black uppercase tracking-widest text-amogus-dark leading-none mt-1">
								{activeTab === 'general' ? t('settings.title') : t('about.title')}
							</div>
							{#if activeTab === 'general'}
								<p class="text-slate-400 font-mono text-[10px] md:text-xs uppercase tracking-widest mt-1">
									{t('settings.subtitle')}
								</p>
							{/if}
						</div>
					</div>
					<button 
						onclick={close}
						class="md:hidden text-slate-400 hover:text-amogus-brown hover:bg-orange-50 p-2 rounded-full transition-colors shrink-0 -mt-2 -mr-2"
					>
						<X size={28} weight="bold" />
					</button>
				</div>

				<div class="flex items-center gap-4">

					<button 
						onclick={close}
						class="hidden md:block text-slate-400 hover:text-amogus-brown hover:bg-orange-50 p-2 rounded-full transition-colors shrink-0 -mr-2"
					>
						<X size={28} weight="bold" />
					</button>
				</div>
			</div>

			<!-- Content Area -->
			<div class="p-4 md:p-8 overflow-y-auto font-sans text-slate-700 flex-1">
				{#if activeTab === 'general'}
					<div class="space-y-8 animate-in fade-in duration-300">
						<div>
							<div class="font-sans text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
								{t('settings.sysconf')}
							</div>
							
							<div class="space-y-4">
								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div class="flex items-center gap-4">
										<div>
											<div class="font-sans font-bold text-slate-700">{t('settings.lang')}</div>
											<p class="text-sm text-slate-500">{t('settings.lang.desc')}</p>
										</div>
									</div>
									<div class="inline-flex bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner w-full sm:w-auto overflow-x-auto custom-scrollbar">
										<button 
											class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 {settings.language === 'auto' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}"
											onclick={() => settings.language = 'auto'}
										><span class="text-lg leading-none">🌐</span> {t('settings.auto')}</button>
										<button 
											class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 {settings.language === 'en' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}"
											onclick={() => settings.language = 'en'}
										><span class="text-lg leading-none">🇬🇧</span> EN</button>
										<button 
											class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 {settings.language === 'ru' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}"
											onclick={() => settings.language = 'ru'}
										><span class="text-lg leading-none">🇷🇺</span> RU</button>
									</div>
								</div>

								<div class="h-px bg-slate-100 w-full my-2"></div>

								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div class="flex items-center gap-4">
										<div>
											<div class="font-sans font-bold text-slate-700">{t('settings.font')}</div>
											<p class="text-sm text-slate-500">{t('settings.font.desc')}</p>
										</div>
									</div>
									<select 
										bind:value={settings.fontFamily}
										class="select select-bordered bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 font-bold rounded-2xl w-full sm:w-auto"
									>
										<option value="balsamiq">{t('font.balsamiq')}</option>
										<option value="huninn">{t('font.huninn')}</option>
										<option value="inter">{t('font.inter')}</option>
										<option value="roboto">{t('font.roboto')}</option>
										<option value="golos">{t('font.golos')}</option>
										<option value="raleway">{t('font.raleway')}</option>
										<option value="oswald">{t('font.oswald')}</option>
										<option value="jura">{t('font.jura')}</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				{:else if activeTab === 'about'}
					<div class="space-y-6 animate-in fade-in duration-300 flex flex-col items-center justify-center py-6 text-center max-w-2xl mx-auto">
						<div class="flex flex-col items-center">
							<img src="/postman_amogus_logo_small.png" alt="Logo" class="w-24 h-24 rounded-full shadow-sm border-2 border-white mb-3" />
							<div class="font-sans text-3xl font-black text-amogus-dark tracking-wide">Postman Amogus</div>
							<p class="text-slate-500 font-sans font-medium text-sm mt-1">Highly Sus Mail Administration Dashboard</p>
							<p class="text-slate-400 font-mono text-xs mt-1">v1.1.0</p>
						</div>

						<p class="text-slate-600 leading-relaxed max-w-lg mt-2">
							A sophisticated alternative to PostfixAdmin, built upon a custom, highly-optimized database schema. Designed for seamless orchestration of Exim and Dovecot server environments. Powered by SvelteKit.
						</p>
						
						<div class="w-full text-left bg-slate-50/80 border border-slate-100 rounded-2xl rounded-l-none border-l-[6px] border-l-amogus-blue p-6 my-4 shadow-sm relative overflow-hidden">
							<div class="absolute -top-4 -left-2 text-amogus-blue/10 font-serif text-[100px] leading-none select-none">"</div>
							<p class="italic text-slate-600 font-sans text-sm md:text-base leading-relaxed relative z-10">
								The idea for this project emerged after significant modifications to the underlying database structure. I needed a convenient, modern interface for mail administration, but couldn't find any suitable existing projects. Building this from scratch allowed me to implement unique features and workflows simply not found in other alternatives.
							</p>
						</div>

						<div class="flex flex-wrap items-center justify-center gap-3 w-full mt-4">
							<a href="https://github.com/byMaker" target="_blank" rel="noopener noreferrer" class="btn border-none bg-amogus-blue hover:bg-amogus-blue/90 text-white rounded-full px-6 font-bold shadow-sm flex items-center gap-2">
								<GithubLogo size={20} weight="fill" /> {t('btn.github')}
							</a>
							<button onclick={() => showLicense = true} class="btn btn-ghost hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full px-6 font-bold flex items-center gap-2 border border-slate-200">
								<FileText size={20} weight="fill" /> {t('btn.license')}
							</button>
						</div>
					</div>
				{/if}
			</div>


			<!-- Airmail decorative bottom border -->
			<div class="h-3 w-full" style="background: repeating-linear-gradient(45deg, #0284c7 0px, #0284c7 15px, transparent 15px, transparent 30px, #e11d48 30px, #e11d48 45px, transparent 45px, transparent 60px);"></div>
		</div>
	</div>

	<!-- Modal License -->
	{#if showLicense}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm transition-opacity flex items-center justify-center p-4 md:p-8" onclick={() => showLicense = false}>
			<div class="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onclick={(e) => e.stopPropagation()}>
				<div class="flex justify-between items-center p-6 md:p-8 border-b border-slate-100 bg-slate-50 shrink-0">
					<div>
						<div class="font-sans text-xl md:text-2xl font-black text-amogus-dark">GNU AFFERO GENERAL PUBLIC LICENSE</div>
						<div class="text-slate-500 font-mono text-sm mt-1">Version 3, 19 November 2007</div>
					</div>
					<button onclick={() => showLicense = false} class="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-3 rounded-full transition-colors self-start shrink-0 -mt-2 -mr-2">
						<X size={24} weight="bold" />
					</button>
				</div>
				<div class="p-6 md:p-8 overflow-y-auto flex-1 font-mono text-xs md:text-sm text-slate-600 whitespace-pre-wrap leading-relaxed bg-white">
					{licenseText}
				</div>
			</div>
		</div>
	{/if}
{/if}
